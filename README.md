# AGI / Vector

An immersive, source-aware interface for exploring the development of artificial intelligence, monitoring current frontier signals, and testing transparent AGI forecast scenarios.

The experience uses a scroll-driven Three.js corridor inspired by the spatial rhythm of luminous future-city environments: the camera advances through historical nodes, reaches a live monitoring layer, and ends in an adjustable forecast lab.

## What is included

- Scroll-snap 3D timeline with cursor parallax, milestone gates, responsive layouts, keyboard navigation, and reduced-motion support
- A 28-node chronology spanning Turing's 1950 imitation game, symbolic AI, early robotics, expert systems, deep learning, foundation models, scientific AI, reasoning systems, live frontier monitoring, and the forecast envelope
- `VECTOR-01`, a server-side signal agent that reads official OpenAI, Google, and arXiv feeds, classifies each item, and assigns a transparent relevance score
- Interactive scenario model with explicit capability, efficiency, and reliability assumptions
- Primary-source links, accessible focus states, mobile controls, and an original social preview image
- Cloudflare-compatible vinext output and Sites deployment metadata

## Project structure

```text
app/
  api/signals/route.ts             Live feed ingestion and signal scoring
  components/ForecastPanel.tsx     Interactive forecast assumptions
  components/IntelligenceCorridor.tsx  Three.js scene and camera path
  lib/milestones.ts                Historical timeline data and references
  globals.css                      Visual system, motion, and responsive layouts
  page.tsx                         Experience shell and timeline orchestration
public/og.png                      Social preview card
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

The production build is emitted to `dist/` with a Cloudflare Worker-compatible entry point.

## Live signal agent

`GET /api/signals` runs a bounded sweep across:

- OpenAI News RSS
- Google Blog RSS
- arXiv `cs.AI` Atom API

The agent cleans and normalizes each feed item, classifies it as capability, autonomy, science, or safety, and calculates a simple indicator score. Requests fail independently, so one unavailable source does not take the entire feed offline.

For higher-volume production monitoring, the same adapters can be moved behind a Cloudflare Cron Trigger, Queue, and D1 history table without changing the interface contract.

## Forecast model

The forecast lab is deliberately a scenario model, not a promise of an AGI arrival date. It starts from a baseline window and shifts the midpoint and uncertainty envelope based on three visible assumptions:

- capability velocity
- compute efficiency
- autonomous reliability

The model is deterministic, inspectable, and intentionally conservative about confidence.

## Deployment

The repository is configured for the Cloudflare runtime through vinext and the Cloudflare Vite plugin. `.openai/hosting.json` is managed by Sites for production publishing. The same `npm run build` output can be connected to a Cloudflare Pages/Workers pipeline that supports the generated Worker entry point.

## Responsible use

Frontier signals are automated leads, not verified scientific conclusions. Source quality, duplicated announcements, benchmark gaming, and feed outages can all affect the monitor. Forecast output should be used to compare assumptions—not to make safety-critical, financial, or policy decisions.
