import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function renderAgentFeed() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("agent-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const originalFetch = globalThis.fetch;
  const rss = `<?xml version="1.0"?><rss><channel><item>
    <title>Autonomous reasoning agent reaches new benchmark</title>
    <link>https://example.com/frontier-agent</link>
    <pubDate>Fri, 25 Jul 2026 18:00:00 GMT</pubDate>
    <description>Agent tool use, planning, evaluation, and safety.</description>
  </item></channel></rss>`;
  const atom = `<?xml version="1.0"?><feed><entry>
    <title>Generalist robot planning with world models</title>
    <link href="https://example.com/robot-world-model" />
    <published>2026-07-25T18:05:00Z</published>
    <summary>Robot science benchmark and multimodal planning.</summary>
  </entry></feed>`;

  try {
    globalThis.fetch = async (input) => {
      const url = String(input instanceof Request ? input.url : input);
      return new Response(url.includes("arxiv") ? atom : rss, {
        headers: { "content-type": "application/xml" },
      });
    };
    return await worker.fetch(
      new Request("http://localhost/api/signals"),
      {
        ASSETS: {
          fetch: async () => new Response("Not found", { status: 404 }),
        },
      },
      {
        waitUntil() {},
        passThroughOnException() {},
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("server-renders the AGI Vector experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /AGI \/ VECTOR/i);
  assert.match(html, /Map the distance to/i);
  assert.match(html, /28 NODES/i);
  assert.match(html, /Perceptron/i);
  assert.match(html, /AlphaFold 3/i);
  assert.match(html, /Agent platforms/i);
  assert.match(html, /FORECAST PRESSURE/i);
  assert.match(html, /VECTOR-01 EVIDENCE/i);
  assert.match(html, /Forecast lab/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("runs the VECTOR-01 fallback sweep with forecast evidence", async () => {
  const response = await renderAgentFeed();
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.agent, "VECTOR-01");
  assert.equal(payload.mode, "ephemeral");
  assert.ok(payload.signals.length >= 2);
  assert.ok(payload.forecast.evidenceCount >= 2);
  assert.match(payload.forecast.rationale, /signals lead/i);
});

test("removes the disposable starter preview", async () => {
  await assert.rejects(access(new URL("../app/_sites-preview/", import.meta.url)));
});
