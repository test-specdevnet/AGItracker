export type SignalCategory =
  | "CAPABILITY"
  | "AUTONOMY"
  | "SCIENCE"
  | "SAFETY";

export type SignalChange = "NEW" | "UPDATED" | "STEADY";

export type FrontierSignal = {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  score: number;
  category: SignalCategory;
  change: SignalChange;
};

export type ForecastPressure = {
  direction: "accelerating" | "stable" | "decelerating";
  shiftYears: number;
  confidenceModifier: number;
  evidenceCount: number;
  newSignals: number;
  updatedSignals: number;
  vector: Record<SignalCategory, number>;
  rationale: string;
  updatedAt: string;
};

export type AgentFeed = {
  agent: "VECTOR-01";
  status: "online" | "degraded";
  mode: "persistent" | "ephemeral";
  trigger: "scheduled" | "request" | "fallback";
  generatedAt: string;
  nextSweepAt: string;
  sources: Array<{ name: string; url: string }>;
  forecast: ForecastPressure;
  signals: FrontierSignal[];
};
