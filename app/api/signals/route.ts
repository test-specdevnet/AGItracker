export const revalidate = 1800;

export type FrontierSignal = {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  score: number;
  category: "CAPABILITY" | "AUTONOMY" | "SCIENCE" | "SAFETY";
};

type FeedSource = {
  name: string;
  url: string;
  format: "rss" | "atom";
};

const sources: FeedSource[] = [
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
    name: "arXiv cs.AI",
    url: "https://export.arxiv.org/api/query?search_query=cat%3Acs.AI&sortBy=submittedDate&sortOrder=descending&max_results=10",
    format: "atom",
  },
];

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
  const attributeLink = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i)?.[1];
  const textLink = matchText(block, "link");
  const value = attributeLink || textLink;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}

function classify(text: string): FrontierSignal["category"] {
  if (/safety|alignment|risk|evaluation|robust/i.test(text)) return "SAFETY";
  if (/agent|tool use|autonom|reasoning|planning/i.test(text)) return "AUTONOMY";
  if (/science|biology|protein|medicine|robot|material/i.test(text)) return "SCIENCE";
  return "CAPABILITY";
}

function scoreSignal(text: string) {
  const indicators = [
    /agent|autonom|tool use/i,
    /reasoning|planning/i,
    /multimodal|world model/i,
    /benchmark|state.of.the.art|outperform/i,
    /robot|science|discovery/i,
    /safety|alignment|evaluation/i,
  ];
  return Math.min(
    98,
    54 + indicators.reduce((score, pattern) => score + (pattern.test(text) ? 7 : 0), 0),
  );
}

function parseFeed(xml: string, source: FeedSource): FrontierSignal[] {
  const blockExpression =
    source.format === "atom"
      ? /<entry\b[\s\S]*?<\/entry>/gi
      : /<item\b[\s\S]*?<\/item>/gi;
  const blocks = xml.match(blockExpression) ?? [];

  return blocks.slice(0, 10).flatMap((block) => {
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
      },
    ];
  });
}

async function fetchFeed(source: FeedSource) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(source.url, {
      headers: {
        Accept: "application/atom+xml, application/rss+xml, text/xml",
        "User-Agent": "AGI-Vector/0.8 (+https://github.com/test-specdevnet/AGItracker)",
      },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`${source.name} returned ${response.status}`);
    return parseFeed(await response.text(), source);
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const settled = await Promise.allSettled(sources.map(fetchFeed));
  const signals = settled
    .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    .sort((a, b) => {
      const dateDelta = Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
      return Number.isFinite(dateDelta) && dateDelta !== 0 ? dateDelta : b.score - a.score;
    })
    .slice(0, 6);

  return Response.json({
    agent: "VECTOR-01",
    status: signals.length ? "online" : "degraded",
    generatedAt: new Date().toISOString(),
    sources: sources.map(({ name, url }) => ({ name, url })),
    signals,
  });
}