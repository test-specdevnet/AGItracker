import type {
  AgentFeed,
  ForecastPressure,
  FrontierSignal,
  SignalCategory,
} from "./agent-types";

type FeedSource = {
  name: string;
  url: string;
  format: "rss" | "atom";
};

type SweepTrigger = AgentFeed["trigger"];

type StoredSignal = FrontierSignal & {
  id: string;
  fingerprint: string;
};

const SWEEP_INTERVAL_MS = 30 * 60 * 1000;
const schemaInitializers = new WeakMap<object, Promise<void>>();

export const vectorSources: FeedSource[] = [
  {
    name: "OpenAI",
    url: "https://openai.com/news/rss.xml",
    format: "rss",
  },
  {
    name: "Google AI",
    url: "https://blog.google/feed/",
    format: "rss",
  },
  {
    name: "arXiv Frontier",
    url: "https://export.arxiv.org/api/query?search_query=cat%3Acs.AI%20OR%20cat%3Acs.CL%20OR%20cat%3Acs.LG%20OR%20cat%3Acs.RO&sortBy=submittedDate&sortOrder=descending&max_results=20",
    format: "atom",
  },
];

export async function ensureAgentSchema(db: D1Database) {
  const key = db as unknown as object;
  const existing = schemaInitializers.get(key);
  if (existing) return existing;

  const initializer = db
    .batch([
      db.prepare(
        `CREATE TABLE IF NOT EXISTS agent_sweeps (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          trigger TEXT NOT NULL,
          status TEXT NOT NULL,
          started_at TEXT NOT NULL,
          completed_at TEXT NOT NULL,
          source_count INTEGER NOT NULL,
          signal_count INTEGER NOT NULL,
          new_count INTEGER NOT NULL,
          updated_count INTEGER NOT NULL,
          shift_years REAL NOT NULL,
          confidence_modifier INTEGER NOT NULL,
          direction TEXT NOT NULL,
          pressure_json TEXT NOT NULL,
          rationale TEXT NOT NULL
        )`,
      ),
      db.prepare(
        "CREATE INDEX IF NOT EXISTS agent_sweeps_completed_idx ON agent_sweeps (completed_at)",
      ),
      db.prepare(
        `CREATE TABLE IF NOT EXISTS frontier_signals (
          id TEXT PRIMARY KEY NOT NULL,
          fingerprint TEXT NOT NULL,
          title TEXT NOT NULL,
          source TEXT NOT NULL,
          url TEXT NOT NULL,
          published_at TEXT NOT NULL,
          score INTEGER NOT NULL,
          category TEXT NOT NULL,
          change_state TEXT DEFAULT 'NEW' NOT NULL,
          first_seen_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
          last_seen_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
        )`,
      ),
      db.prepare(
        "CREATE INDEX IF NOT EXISTS frontier_signals_published_idx ON frontier_signals (published_at)",
      ),
      db.prepare(
        "CREATE INDEX IF NOT EXISTS frontier_signals_category_idx ON frontier_signals (category)",
      ),
    ])
    .then(() => undefined)
    .catch((error) => {
      schemaInitializers.delete(key);
      throw error;
    });

  schemaInitializers.set(key, initializer);
  return initializer;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function cleanXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function matchText(block: string, tag: string) {
  const match = block.match(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"),
  );
  return cleanXml(match?.[1] ?? "");
}

function getLink(block: string) {
  const attributeLink = block.match(
    /<link[^>]+href=["']([^"']+)["'][^>]*>/i,
  )?.[1];
  const textLink = matchText(block, "link");
  const value = attributeLink || textLink;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : "";
  } catch {
    return "";
  }
}

function classify(text: string): SignalCategory {
  if (/safety|alignment|risk|evaluation|robust|red.team/i.test(text)) {
    return "SAFETY";
  }
  if (/agent|tool use|autonom|reasoning|planning|computer use/i.test(text)) {
    return "AUTONOMY";
  }
  if (/science|biology|protein|medicine|robot|material|molecule/i.test(text)) {
    return "SCIENCE";
  }
  return "CAPABILITY";
}

function scoreSignal(text: string) {
  const indicators = [
    /agent|autonom|tool use|computer use/i,
    /reasoning|planning|long.horizon/i,
    /multimodal|world model|generalist/i,
    /benchmark|state.of.the.art|outperform/i,
    /robot|science|discovery|protein/i,
    /safety|alignment|evaluation|robust/i,
  ];
  return Math.min(
    98,
    50 +
      indicators.reduce(
        (score, pattern) => score + (pattern.test(text) ? 8 : 0),
        0,
      ),
  );
}

function parseFeed(xml: string, source: FeedSource): FrontierSignal[] {
  const blockExpression =
    source.format === "atom"
      ? /<entry\b[\s\S]*?<\/entry>/gi
      : /<item\b[\s\S]*?<\/item>/gi;
  const blocks = xml.match(blockExpression) ?? [];

  return blocks.slice(0, 20).flatMap((block) => {
    const title = matchText(block, "title");
    const url = getLink(block);
    const published =
      matchText(block, "published") ||
      matchText(block, "updated") ||
      matchText(block, "pubDate");
    const summary =
      matchText(block, "summary") ||
      matchText(block, "description") ||
      matchText(block, "content");
    if (!title || !url) return [];
    const combined = `${title} ${summary}`;
    return [
      {
        title,
        source: source.name,
        url,
        publishedAt: published || new Date().toISOString(),
        score: scoreSignal(combined),
        category: classify(combined),
        change: "STEADY" as const,
      },
    ];
  });
}

async function fetchFeed(source: FeedSource) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(source.url, {
      headers: {
        Accept: "application/atom+xml, application/rss+xml, text/xml",
        "User-Agent":
          "AGI-Vector/1.0 (+https://github.com/test-specdevnet/AGItracker)",
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`${source.name} returned ${response.status}`);
    }
    return parseFeed(await response.text(), source);
  } finally {
    clearTimeout(timeout);
  }
}

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function calculateForecast(
  signals: FrontierSignal[],
  completedAt: string,
): ForecastPressure {
  const categories: SignalCategory[] = [
    "CAPABILITY",
    "AUTONOMY",
    "SCIENCE",
    "SAFETY",
  ];
  const vector = Object.fromEntries(
    categories.map((category) => {
      const matching = signals.filter((signal) => signal.category === category);
      const average = matching.length
        ? Math.round(
            matching.reduce((sum, signal) => sum + signal.score, 0) /
              matching.length,
          )
        : 0;
      return [category, average];
    }),
  ) as Record<SignalCategory, number>;
  const newSignals = signals.filter((signal) => signal.change === "NEW").length;
  const updatedSignals = signals.filter(
    (signal) => signal.change === "UPDATED",
  ).length;
  const novelty = signals.length
    ? (newSignals + updatedSignals * 0.5) / signals.length
    : 0;
  const forwardPressure =
    vector.CAPABILITY * 0.34 +
    vector.AUTONOMY * 0.42 +
    vector.SCIENCE * 0.16 -
    vector.SAFETY * 0.08;
  const shiftYears = Number(
    clamp(-(forwardPressure / 100) * (0.85 + novelty), -2.5, 0.25).toFixed(1),
  );
  const direction =
    shiftYears <= -0.8
      ? "accelerating"
      : shiftYears >= 0.15
        ? "decelerating"
        : "stable";
  const confidenceModifier = clamp(
    Math.round(signals.length / 4 + (newSignals + updatedSignals) / 3),
    0,
    7,
  );
  const ranked = [...categories].sort((a, b) => vector[b] - vector[a]);
  const leading = ranked[0].toLowerCase();

  return {
    direction,
    shiftYears,
    confidenceModifier,
    evidenceCount: signals.length,
    newSignals,
    updatedSignals,
    vector,
    rationale: `${leading} signals lead the current evidence set; the model applies a bounded ${Math.abs(shiftYears).toFixed(1)}-year scenario adjustment.`,
    updatedAt: completedAt,
  };
}

async function persistSweep(
  db: D1Database,
  signals: FrontierSignal[],
  trigger: SweepTrigger,
  startedAt: string,
) {
  const completedAt = new Date().toISOString();
  const stored: StoredSignal[] = [];
  const writes: D1PreparedStatement[] = [];

  for (const signal of signals) {
    const id = await digest(signal.url);
    const fingerprint = await digest(
      `${signal.title}|${signal.publishedAt}|${signal.score}|${signal.category}`,
    );
    const previous = await db
      .prepare("SELECT fingerprint FROM frontier_signals WHERE id = ?")
      .bind(id)
      .first<{ fingerprint: string }>();
    const change =
      !previous
        ? "NEW"
        : previous.fingerprint !== fingerprint
          ? "UPDATED"
          : "STEADY";

    stored.push({ ...signal, id, fingerprint, change });
    writes.push(
      db
        .prepare(
          `INSERT INTO frontier_signals (
            id, fingerprint, title, source, url, published_at, score, category,
            change_state, first_seen_at, last_seen_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            fingerprint = excluded.fingerprint,
            title = excluded.title,
            source = excluded.source,
            url = excluded.url,
            published_at = excluded.published_at,
            score = excluded.score,
            category = excluded.category,
            change_state = excluded.change_state,
            last_seen_at = excluded.last_seen_at`,
        )
        .bind(
          id,
          fingerprint,
          signal.title,
          signal.source,
          signal.url,
          signal.publishedAt,
          signal.score,
          signal.category,
          change,
          completedAt,
          completedAt,
        ),
    );
  }

  if (writes.length) await db.batch(writes);
  const normalized = stored.map((signal) => ({
    title: signal.title,
    source: signal.source,
    url: signal.url,
    publishedAt: signal.publishedAt,
    score: signal.score,
    category: signal.category,
    change: signal.change,
  }));
  const forecast = calculateForecast(normalized, completedAt);

  await db
    .prepare(
      `INSERT INTO agent_sweeps (
        trigger, status, started_at, completed_at, source_count, signal_count,
        new_count, updated_count, shift_years, confidence_modifier, direction,
        pressure_json, rationale
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      trigger,
      normalized.length ? "online" : "degraded",
      startedAt,
      completedAt,
      vectorSources.length,
      normalized.length,
      forecast.newSignals,
      forecast.updatedSignals,
      forecast.shiftYears,
      forecast.confidenceModifier,
      forecast.direction,
      JSON.stringify(forecast.vector),
      forecast.rationale,
    )
    .run();

  return { signals: normalized, forecast, completedAt };
}

export async function loadAgentSnapshot(
  db: D1Database,
): Promise<AgentFeed | null> {
  await ensureAgentSchema(db);
  const sweep = await db
    .prepare(
      `SELECT trigger, status, completed_at, new_count, updated_count,
        shift_years, confidence_modifier, direction, pressure_json, rationale
      FROM agent_sweeps
      ORDER BY id DESC
      LIMIT 1`,
    )
    .first<{
      trigger: SweepTrigger;
      status: AgentFeed["status"];
      completed_at: string;
      new_count: number;
      updated_count: number;
      shift_years: number;
      confidence_modifier: number;
      direction: ForecastPressure["direction"];
      pressure_json: string;
      rationale: string;
    }>();
  if (!sweep) return null;

  const rows = await db
    .prepare(
      `SELECT title, source, url, published_at, score, category, change_state
      FROM frontier_signals
      ORDER BY published_at DESC, score DESC
      LIMIT 12`,
    )
    .all<{
      title: string;
      source: string;
      url: string;
      published_at: string;
      score: number;
      category: SignalCategory;
      change_state: FrontierSignal["change"];
    }>();
  const signals = rows.results.map((row) => ({
    title: row.title,
    source: row.source,
    url: row.url,
    publishedAt: row.published_at,
    score: row.score,
    category: row.category,
    change: row.change_state,
  }));
  const vector = JSON.parse(sweep.pressure_json) as Record<
    SignalCategory,
    number
  >;
  const nextSweepAt = new Date(
    Date.parse(sweep.completed_at) + SWEEP_INTERVAL_MS,
  ).toISOString();

  return {
    agent: "VECTOR-01",
    status: sweep.status,
    mode: "persistent",
    trigger: sweep.trigger,
    generatedAt: sweep.completed_at,
    nextSweepAt,
    sources: vectorSources.map(({ name, url }) => ({ name, url })),
    forecast: {
      direction: sweep.direction,
      shiftYears: sweep.shift_years,
      confidenceModifier: sweep.confidence_modifier,
      evidenceCount: signals.length,
      newSignals: sweep.new_count,
      updatedSignals: sweep.updated_count,
      vector,
      rationale: sweep.rationale,
      updatedAt: sweep.completed_at,
    },
    signals,
  };
}

export function snapshotIsFresh(snapshot: AgentFeed) {
  return Date.parse(snapshot.nextSweepAt) > Date.now();
}

export async function runVectorAgent({
  db,
  trigger = "request",
}: {
  db?: D1Database;
  trigger?: SweepTrigger;
} = {}): Promise<AgentFeed> {
  const startedAt = new Date().toISOString();
  const settled = await Promise.allSettled(vectorSources.map(fetchFeed));
  const signals = settled
    .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    .filter(
      (signal, index, all) =>
        all.findIndex((candidate) => candidate.url === signal.url) === index,
    )
    .sort((a, b) => {
      const dateDelta = Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
      return Number.isFinite(dateDelta) && dateDelta !== 0
        ? dateDelta
        : b.score - a.score;
    })
    .slice(0, 20);

  if (db) {
    await ensureAgentSchema(db);
    const persisted = await persistSweep(db, signals, trigger, startedAt);
    return {
      agent: "VECTOR-01",
      status: signals.length ? "online" : "degraded",
      mode: "persistent",
      trigger,
      generatedAt: persisted.completedAt,
      nextSweepAt: new Date(
        Date.parse(persisted.completedAt) + SWEEP_INTERVAL_MS,
      ).toISOString(),
      sources: vectorSources.map(({ name, url }) => ({ name, url })),
      forecast: persisted.forecast,
      signals: persisted.signals,
    };
  }

  const completedAt = new Date().toISOString();
  const fallbackSignals = signals.map((signal) => ({
    ...signal,
    change: "NEW" as const,
  }));
  return {
    agent: "VECTOR-01",
    status: signals.length ? "online" : "degraded",
    mode: "ephemeral",
    trigger: "fallback",
    generatedAt: completedAt,
    nextSweepAt: new Date(
      Date.parse(completedAt) + SWEEP_INTERVAL_MS,
    ).toISOString(),
    sources: vectorSources.map(({ name, url }) => ({ name, url })),
    forecast: calculateForecast(fallbackSignals, completedAt),
    signals: fallbackSignals,
  };
}
