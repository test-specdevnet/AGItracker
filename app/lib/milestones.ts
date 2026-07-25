export type Milestone = {
  id: string;
  year: string;
  era: string;
  title: string;
  shortTitle: string;
  summary: string;
  detail: string;
  status: "historical" | "observed" | "forecast";
  metrics: Array<{ label: string; value: string }>;
  sources: Array<{ label: string; href: string }>;
};

export const milestones: Milestone[] = [
  {
    id: "origin",
    year: "1956",
    era: "ORIGIN",
    title: "A field declares its ambition.",
    shortTitle: "Dartmouth",
    summary:
      "The Dartmouth workshop gives artificial intelligence a name and a research agenda.",
    detail:
      "The founding proposal framed intelligence as something that could be described precisely enough for a machine to simulate. That wager still defines the frontier.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Formal field" },
      { label: "Mode", value: "Symbolic" },
    ],
    sources: [
      {
        label: "Dartmouth proposal",
        href: "https://www-formal.stanford.edu/jmc/history/dartmouth/dartmouth.html",
      },
    ],
  },
  {
    id: "learning",
    year: "2012",
    era: "LEARNING",
    title: "Perception crosses a threshold.",
    shortTitle: "AlexNet",
    summary:
      "Deep convolutional networks reset the ImageNet benchmark and shift the field toward learned representations.",
    detail:
      "Data, parallel compute, and backpropagation combine into a repeatable recipe. Progress begins to look less handcrafted and more scalable.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Representation" },
      { label: "Mode", value: "Deep learning" },
    ],
    sources: [
      {
        label: "AlexNet paper",
        href: "https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks",
      },
    ],
  },
  {
    id: "attention",
    year: "2017",
    era: "ATTENTION",
    title: "Sequence becomes parallel.",
    shortTitle: "Transformer",
    summary:
      "The Transformer replaces recurrence with attention and unlocks a new scaling path for general-purpose models.",
    detail:
      "A clean architectural shift makes larger language systems easier to train and adapt. The same pattern spreads into vision, biology, robotics, and multimodal systems.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Transfer" },
      { label: "Mode", value: "Attention" },
    ],
    sources: [
      { label: "Transformer paper", href: "https://arxiv.org/abs/1706.03762" },
    ],
  },
  {
    id: "scale",
    year: "2022",
    era: "SCALE",
    title: "Language becomes an interface.",
    shortTitle: "Foundation models",
    summary:
      "Conversational foundation models move advanced generative capability into everyday workflows.",
    detail:
      "Natural language becomes a control layer for knowledge work. Capability expands through scale, instruction tuning, tools, retrieval, and human feedback.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Adoption" },
      { label: "Mode", value: "General interface" },
    ],
    sources: [
      { label: "ChatGPT research release", href: "https://openai.com/index/chatgpt/" },
    ],
  },
  {
    id: "agents",
    year: "NOW",
    era: "FRONTIER",
    title: "Models begin to operate.",
    shortTitle: "Agentic systems",
    summary:
      "The active frontier is shifting from generated answers to systems that plan, use tools, and pursue longer tasks.",
    detail:
      "The decisive signal is not a single benchmark. It is the convergence of reasoning reliability, multimodal grounding, tool use, memory, and verifiable action in real environments.",
    status: "observed",
    metrics: [
      { label: "Signal", value: "Autonomy" },
      { label: "Mode", value: "Tool-using" },
    ],
    sources: [
      { label: "OpenAI news", href: "https://openai.com/news/" },
      { label: "Google AI", href: "https://blog.google/innovation-and-ai/technology/ai/" },
      { label: "arXiv cs.AI", href: "https://arxiv.org/list/cs.AI/recent" },
    ],
  },
  {
    id: "forecast",
    year: "2029—38",
    era: "SCENARIO",
    title: "The next phase is a range, not a date.",
    shortTitle: "Forecast envelope",
    summary:
      "Explore how capability velocity, compute efficiency, and autonomous reliability move the scenario window.",
    detail:
      "This interface exposes the assumptions behind its estimate. It is a transparent scenario model—not a claim that AGI can be predicted from a single curve.",
    status: "forecast",
    metrics: [
      { label: "Signal", value: "Convergence" },
      { label: "Mode", value: "Uncertain" },
    ],
    sources: [],
  },
];