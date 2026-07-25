# AGI / Vector

An immersive, source-aware interface for exploring the development of artificial intelligence, monitoring current frontier signals, and testing transparent AGI forecast scenarios.

The experience uses a scroll-driven Three.js corridor inspired by the spatial rhythm of luminous future-city environments: the camera advances through historical nodes, reaches a live monitoring layer, and ends in an adjustable forecast lab.

## What is included

- Scroll-snap 3D timeline with cursor parallax, milestone gates, responsive layouts, keyboard navigation, and reduced-motion support
- A 28-node chronology spanning Turing's 1950 imitation game, symbolic AI, early robotics, expert systems, deep learning, foundation models, scientific AI, reasoning systems, live frontier monitoring, and the forecast envelope
- `VECTOR-01`, a persistent monitoring agent that reads official OpenAI, Google, and arXiv feeds, detects new or changed evidence, and retains an auditable sweep history in Cloudflare D1
- A scheduled 30-minute Worker sweep with request-triggered catch-up when a cached snapshot becomes stale
- A genuine Cloudflare Pages build with a static application shell and a Pages Function for the live signal API
- An agent-calibrated scenario model that combines live evidence pressure with explicit capability, efficiency, and reliability assumptions
- Primary-source links, accessible focus states, mobile controls, and an original social preview image
- Cloudflare-compatible vinext output and Sites deployment metadata

## Project structure

```text
app/
  api/signals/route.ts             Live feed ingestion and signal scoring
  lib/vector-agent.ts              Collection, change detection, persistence, and forecast pressure
  lib/agent-types.ts               Shared agent response contract
  components/ForecastPanel.tsx     Interactive forecast assumptions
  components/IntelligenceCorridor.tsx  Three.js scene and camera path
  lib/milestones.ts                Historical timeline data and references
  globals.css                      Visual system, motion, and responsive layouts
  page.tsx                         Experience shell and timeline orchestration
public/og.png                      Social preview card
db/schema.ts                       D1 signal and sweep history schema
drizzle/                           Generated production migration
worker/index.ts                    HTTP and scheduled Worker handlers
functions/api/signals.ts           Cloudflare Pages Function for the live agent
scripts/build-pages.mjs            Static Pages output generator
```

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validate and build

```bash
npm run lint
npm run build
node --test tests/rendered-html.test.mjs
```

The production build emits:

- `dist/` for the full Cloudflare Worker/Sites runtime
- `pages-dist/` for Cloudflare Pages

## Live signal agent

`VECTOR-01` runs on a 30-minute schedule and performs a request-time catch-up
when the latest persistent snapshot is stale. Each sweep covers:

- OpenAI News RSS
- Google Blog RSS
- arXiv `cs.AI`, `cs.CL`, `cs.LG`, and `cs.RO` Atom API

The agent cleans and normalizes each item, classifies it as capability,
autonomy, science, or safety, calculates a transparent indicator score, and
fingerprints the result. D1 preserves first-seen and last-seen timestamps,
change state, and every forecast sweep. Requests fail independently, so one
unavailable source does not take the monitor offline.

The forecast pressure is deterministic and bounded. It can move the displayed
scenario window, but every adjustment remains tied to visible evidence counts,
category pressure, and a stored rationale.

## Forecast model

The forecast lab is deliberately a scenario model, not a promise of an AGI arrival date. It starts from a baseline window and shifts the midpoint and uncertainty envelope based on three visible assumptions:

- capability velocity
- compute efficiency
- autonomous reliability

The model is deterministic, inspectable, and intentionally conservative about confidence.

## Cloudflare Pages deployment

The repository now has a dedicated Pages output and Pages Function. Configure
the `agitracker` Pages project with:

```text
Build command: npm run build
Build output directory: pages-dist
Root directory: /
Node.js version: 22
```

Bind a D1 database to the Pages project with the variable name `DB` to retain
signal and forecast history. The Function initializes its required tables and
indexes automatically. Without the binding, VECTOR-01 still runs in ephemeral
mode so the site and live feed remain available.

For a direct non-interactive deployment:

```bash
npx wrangler pages deploy pages-dist --project-name agitracker
```

Cloudflare Pages does not provide cron triggers. The existing Worker entry point
keeps the scheduled 30-minute sweep available; the Pages Function performs the
same stale-snapshot catch-up whenever `/api/signals` is requested.

`.openai/hosting.json` remains available for the separate Sites deployment and
does not affect the Cloudflare Pages output.

## Responsible use

Frontier signals are automated leads, not verified scientific conclusions. Source quality, duplicated announcements, benchmark gaming, and feed outages can all affect the monitor. Forecast output should be used to compare assumptions—not to make safety-critical, financial, or policy decisions.
