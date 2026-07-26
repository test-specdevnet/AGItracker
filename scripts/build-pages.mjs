import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const outputDirectory = new URL("../pages-dist/", import.meta.url);
const clientDirectory = new URL("../dist/client/", import.meta.url);
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
const workerDeployRedirect = new URL(
  "../.wrangler/deploy/config.json",
  import.meta.url,
);

workerUrl.searchParams.set("pages-build", Date.now().toString());

const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request("https://agitracker.pages.dev/", {
    headers: {
      accept: "text/html",
      host: "agitracker.pages.dev",
      "x-forwarded-host": "agitracker.pages.dev",
      "x-forwarded-proto": "https",
    },
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

if (!response.ok) {
  throw new Error(
    `Unable to render the Cloudflare Pages shell: ${response.status}`,
  );
}

const html = await response.text();
if (!html.includes("AGI / VECTOR") || !html.includes("28 NODES")) {
  throw new Error("The rendered Pages shell is missing expected timeline content.");
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(clientDirectory, outputDirectory, { recursive: true });
await writeFile(new URL("index.html", outputDirectory), html);
await writeFile(
  new URL("_routes.json", outputDirectory),
  `${JSON.stringify(
    {
      version: 1,
      include: ["/api/*"],
      exclude: [],
    },
    null,
    2,
  )}\n`,
);
await rm(workerDeployRedirect, { force: true });

console.log("Cloudflare Pages output written to pages-dist/");
