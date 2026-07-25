export type Milestone = {
  id: string;
  year: string;
  era: string;
  title: string;
  shortTitle: string;
  summary: string;
  detail: string;
  status: "historical" | "observed" | "forecast";
  railAnchor?: boolean;
  metrics: Array<{ label: string; value: string }>;
  sources: Array<{ label: string; href: string }>;
};

export const milestones: Milestone[] = [
  {
    id: "turing-test",
    year: "1950",
    era: "FOUNDATIONS",
    title: "Intelligence becomes a machine question.",
    shortTitle: "Turing test",
    summary:
      "Alan Turing reframes machine intelligence as an observable conversation rather than a metaphysical definition.",
    detail:
      "Computing Machinery and Intelligence introduced the imitation game and a pragmatic standard: judge a machine by what it can do, not by whether it resembles a biological mind.",
    status: "historical",
    railAnchor: true,
    metrics: [
      { label: "Signal", value: "Machine intelligence" },
      { label: "Mode", value: "Behavioral test" },
    ],
    sources: [
      {
        label: "Turing, 1950",
        href: "https://academic.oup.com/mind/article/LIX/236/433/986238",
      },
    ],
  },
  {
    id: "dartmouth",
    year: "1956",
    era: "FOUNDATIONS",
    title: "A field declares its ambition.",
    shortTitle: "Dartmouth",
    summary:
      "The Dartmouth workshop gives artificial intelligence a name and a research agenda.",
    detail:
      "The founding proposal framed intelligence as something that could be described precisely enough for a machine to simulate. That wager still defines the frontier.",
    status: "historical",
    railAnchor: true,
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
    id: "perceptron",
    year: "1958",
    era: "EARLY LEARNING",
    title: "A machine learns its own boundary.",
    shortTitle: "Perceptron",
    summary:
      "Frank Rosenblatt demonstrates a trainable neural classifier implemented on dedicated hardware.",
    detail:
      "The perceptron made learning from examples tangible. Its limits were real, but so was the core idea that weights could be adjusted from data rather than programmed by hand.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Trainable weights" },
      { label: "Mode", value: "Neural" },
    ],
    sources: [
      {
        label: "Perceptron paper",
        href: "https://psycnet.apa.org/record/1959-09865-001",
      },
    ],
  },
  {
    id: "eliza",
    year: "1966",
    era: "LANGUAGE",
    title: "Conversation creates an illusion of understanding.",
    shortTitle: "ELIZA",
    summary:
      "Joseph Weizenbaum's ELIZA shows how quickly people project intelligence onto patterned dialogue.",
    detail:
      "ELIZA used rules rather than semantic understanding, yet its social impact anticipated a recurring lesson: the experience of intelligence can arrive before the underlying capability.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Human response" },
      { label: "Mode", value: "Pattern matching" },
    ],
    sources: [
      {
        label: "ELIZA paper",
        href: "https://dl.acm.org/doi/10.1145/365153.365168",
      },
    ],
  },
  {
    id: "shakey",
    year: "1969",
    era: "ROBOTICS",
    title: "Reasoning enters the physical world.",
    shortTitle: "Shakey",
    summary:
      "SRI's Shakey links perception, planning, and action in one mobile robotic system.",
    detail:
      "Shakey turned abstract planning into embodied behavior. The system was slow and constrained, but its perception-plan-act loop remains central to modern robotics.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Embodiment" },
      { label: "Mode", value: "Planning" },
    ],
    sources: [
      {
        label: "SRI Shakey archive",
        href: "https://www.sri.com/hoi/shakey-the-robot/",
      },
    ],
  },
  {
    id: "expert-systems",
    year: "1980",
    era: "KNOWLEDGE",
    title: "Expertise becomes deployable software.",
    shortTitle: "Expert systems",
    summary:
      "Rule-based systems such as XCON move AI from laboratories into high-value commercial decisions.",
    detail:
      "Expert systems proved that narrow, encoded knowledge could produce economic value. They also exposed the cost of brittle rules and the knowledge-engineering bottleneck.",
    status: "historical",
    railAnchor: true,
    metrics: [
      { label: "Signal", value: "Commercial value" },
      { label: "Mode", value: "Rules" },
    ],
    sources: [
      {
        label: "XCON retrospective",
        href: "https://aaai.org/papers/0021-aimag02-01-mcdermott/",
      },
    ],
  },
  {
    id: "backprop",
    year: "1986",
    era: "LEARNING",
    title: "Credit flows backward through the network.",
    shortTitle: "Backpropagation",
    summary:
      "Backpropagation makes multilayer neural networks practical to train on internal representations.",
    detail:
      "By efficiently assigning error across layers, backpropagation supplied the optimization engine behind the later deep-learning wave.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Deep credit" },
      { label: "Mode", value: "Gradient learning" },
    ],
    sources: [
      {
        label: "Nature paper",
        href: "https://www.nature.com/articles/323533a0",
      },
    ],
  },
  {
    id: "deep-blue",
    year: "1997",
    era: "SEARCH",
    title: "Machine search defeats a world champion.",
    shortTitle: "Deep Blue",
    summary:
      "IBM Deep Blue defeats Garry Kasparov in a regulation chess match.",
    detail:
      "Deep Blue combined specialized hardware, search, evaluation, and expert knowledge. It was narrow, but it made machine superiority in a prestigious cognitive domain undeniable.",
    status: "historical",
    railAnchor: true,
    metrics: [
      { label: "Signal", value: "Superhuman play" },
      { label: "Mode", value: "Search" },
    ],
    sources: [
      {
        label: "IBM Deep Blue",
        href: "https://www.ibm.com/history/deep-blue",
      },
    ],
  },
  {
    id: "lenet",
    year: "1998",
    era: "VISION",
    title: "Neural vision reads the real world.",
    shortTitle: "LeNet",
    summary:
      "Convolutional networks learn to recognize handwritten digits in operational systems.",
    detail:
      "LeNet demonstrated an end-to-end recipe for visual recognition: local receptive fields, shared weights, pooling, and gradient-based training.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Deployed vision" },
      { label: "Mode", value: "Convolution" },
    ],
    sources: [
      {
        label: "LeNet paper",
        href: "http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf",
      },
    ],
  },
  {
    id: "deep-belief",
    year: "2006",
    era: "DEEP LEARNING",
    title: "Depth becomes trainable again.",
    shortTitle: "Deep learning revival",
    summary:
      "Layer-wise pretraining renews interest in deep neural networks and learned hierarchical features.",
    detail:
      "The deep-belief-network result was not the final recipe, but it helped reopen a research path that data, accelerators, and better optimization would soon transform.",
    status: "historical",
    railAnchor: true,
    metrics: [
      { label: "Signal", value: "Representation depth" },
      { label: "Mode", value: "Pretraining" },
    ],
    sources: [
      {
        label: "Deep belief nets",
        href: "https://www.cs.toronto.edu/~hinton/absps/fastnc.pdf",
      },
    ],
  },
  {
    id: "imagenet",
    year: "2009",
    era: "DATA",
    title: "The field gets a shared visual world.",
    shortTitle: "ImageNet",
    summary:
      "ImageNet assembles a large labeled image corpus that turns visual progress into a measurable race.",
    detail:
      "A common dataset and competition aligned research effort around scale and generalization, creating the launchpad for the 2012 deep-learning breakthrough.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Data scale" },
      { label: "Mode", value: "Benchmark" },
    ],
    sources: [
      {
        label: "ImageNet paper",
        href: "https://ieeexplore.ieee.org/document/5206848",
      },
    ],
  },
  {
    id: "alexnet",
    year: "2012",
    era: "DEEP LEARNING",
    title: "Perception crosses a threshold.",
    shortTitle: "AlexNet",
    summary:
      "Deep convolutional networks reset ImageNet and shift the field toward learned representations.",
    detail:
      "Data, GPUs, and backpropagation combine into a repeatable recipe. Progress begins to look less handcrafted and more scalable.",
    status: "historical",
    railAnchor: true,
    metrics: [
      { label: "Signal", value: "Representation" },
      { label: "Mode", value: "GPU training" },
    ],
    sources: [
      {
        label: "AlexNet paper",
        href: "https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks",
      },
    ],
  },
  {
    id: "word2vec",
    year: "2013",
    era: "LANGUAGE",
    title: "Meaning gains a geometry.",
    shortTitle: "word2vec",
    summary:
      "Distributed word vectors reveal that semantic relationships can emerge as directions in learned space.",
    detail:
      "word2vec made representation learning for language efficient and vivid. Concepts became coordinates that downstream systems could compare and compose.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Semantic space" },
      { label: "Mode", value: "Embeddings" },
    ],
    sources: [
      {
        label: "word2vec paper",
        href: "https://arxiv.org/abs/1301.3781",
      },
    ],
  },
  {
    id: "gans",
    year: "2014",
    era: "GENERATION",
    title: "Networks learn by competing.",
    shortTitle: "GANs",
    summary:
      "Generative adversarial networks turn synthesis into a game between a generator and a discriminator.",
    detail:
      "GANs produced a rapid jump in realistic image generation and established generative modeling as a central branch of modern AI.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Synthesis" },
      { label: "Mode", value: "Adversarial" },
    ],
    sources: [
      {
        label: "GAN paper",
        href: "https://arxiv.org/abs/1406.2661",
      },
    ],
  },
  {
    id: "alphago",
    year: "2016",
    era: "REINFORCEMENT",
    title: "Intuition and search converge.",
    shortTitle: "AlphaGo",
    summary:
      "AlphaGo defeats Lee Sedol by combining deep networks, reinforcement learning, and tree search.",
    detail:
      "The victory showed that learned intuition could guide search through spaces once considered too vast for brute force, producing strategies that surprised elite human players.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Strategic novelty" },
      { label: "Mode", value: "RL + search" },
    ],
    sources: [
      {
        label: "AlphaGo paper",
        href: "https://www.nature.com/articles/nature16961",
      },
    ],
  },
  {
    id: "transformer",
    year: "2017",
    era: "ATTENTION",
    title: "Sequence becomes parallel.",
    shortTitle: "Transformer",
    summary:
      "The Transformer replaces recurrence with attention and unlocks a new scaling path for general-purpose models.",
    detail:
      "A clean architectural shift makes larger language systems easier to train and adapt. The pattern spreads into vision, biology, robotics, and multimodal systems.",
    status: "historical",
    railAnchor: true,
    metrics: [
      { label: "Signal", value: "Transfer" },
      { label: "Mode", value: "Attention" },
    ],
    sources: [
      {
        label: "Transformer paper",
        href: "https://arxiv.org/abs/1706.03762",
      },
    ],
  },
  {
    id: "bert",
    year: "2018",
    era: "PRETRAINING",
    title: "One model transfers across language tasks.",
    shortTitle: "BERT",
    summary:
      "Bidirectional pretraining produces a reusable language representation that can be fine-tuned broadly.",
    detail:
      "BERT normalized the pretrain-then-adapt workflow and accelerated the move away from separate architectures for every language task.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Broad transfer" },
      { label: "Mode", value: "Fine-tuning" },
    ],
    sources: [
      {
        label: "BERT paper",
        href: "https://arxiv.org/abs/1810.04805",
      },
    ],
  },
  {
    id: "gpt3",
    year: "2020",
    era: "SCALE",
    title: "Capability begins to emerge in context.",
    shortTitle: "GPT-3",
    summary:
      "A 175-billion-parameter language model performs new tasks from instructions and examples without weight updates.",
    detail:
      "GPT-3 made scale itself a visible research variable. Few-shot behavior suggested that one sufficiently broad model could absorb many tasks behind a language interface.",
    status: "historical",
    railAnchor: true,
    metrics: [
      { label: "Signal", value: "In-context learning" },
      { label: "Mode", value: "Few-shot" },
    ],
    sources: [
      {
        label: "GPT-3 paper",
        href: "https://arxiv.org/abs/2005.14165",
      },
    ],
  },
  {
    id: "alphafold2",
    year: "2020",
    era: "SCIENCE",
    title: "AI cracks a grand scientific challenge.",
    shortTitle: "AlphaFold 2",
    summary:
      "AlphaFold 2 reaches near-experimental accuracy on many protein-structure predictions.",
    detail:
      "The result shifted attention from benchmark performance to scientific utility, showing that learned systems could unlock progress in a domain with enormous downstream value.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Scientific utility" },
      { label: "Mode", value: "Structure prediction" },
    ],
    sources: [
      {
        label: "AlphaFold 2 paper",
        href: "https://www.nature.com/articles/s41586-021-03819-2",
      },
    ],
  },
  {
    id: "clip",
    year: "2021",
    era: "MULTIMODAL",
    title: "Images and language share a map.",
    shortTitle: "CLIP",
    summary:
      "Contrastive pretraining aligns visual concepts with natural-language descriptions at web scale.",
    detail:
      "CLIP made open-ended visual recognition possible through text and supplied a powerful semantic guide for the coming wave of image generators.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Cross-modal transfer" },
      { label: "Mode", value: "Contrastive" },
    ],
    sources: [
      {
        label: "CLIP research",
        href: "https://openai.com/index/clip/",
      },
    ],
  },
  {
    id: "latent-diffusion",
    year: "2022",
    era: "GENERATION",
    title: "Text becomes a visual instrument.",
    shortTitle: "Latent diffusion",
    summary:
      "Latent diffusion makes high-quality text-to-image generation efficient enough for broad creative use.",
    detail:
      "Operating in a compressed latent space lowered the cost of image synthesis and helped push generative AI from research demos into widely used creative systems.",
    status: "historical",
    railAnchor: true,
    metrics: [
      { label: "Signal", value: "Creative adoption" },
      { label: "Mode", value: "Diffusion" },
    ],
    sources: [
      {
        label: "Latent diffusion paper",
        href: "https://arxiv.org/abs/2112.10752",
      },
    ],
  },
  {
    id: "chatgpt",
    year: "2022",
    era: "INTERFACE",
    title: "Language becomes the interface.",
    shortTitle: "ChatGPT",
    summary:
      "A conversationally aligned foundation model moves advanced generative capability into everyday workflows.",
    detail:
      "ChatGPT compressed a complex model stack into an immediately legible interaction. Natural language became a general control layer for knowledge work.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Mass adoption" },
      { label: "Mode", value: "Dialogue" },
    ],
    sources: [
      {
        label: "ChatGPT release",
        href: "https://openai.com/index/chatgpt/",
      },
    ],
  },
  {
    id: "gpt4",
    year: "2023",
    era: "MULTIMODAL",
    title: "A general model sees and reasons.",
    shortTitle: "GPT-4",
    summary:
      "GPT-4 combines text and image input with stronger performance across professional and academic evaluations.",
    detail:
      "The system strengthened the case for broad foundation models as general-purpose cognitive infrastructure while also making evaluation and safety more central.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Broad competence" },
      { label: "Mode", value: "Multimodal" },
    ],
    sources: [
      {
        label: "GPT-4 report",
        href: "https://arxiv.org/abs/2303.08774",
      },
    ],
  },
  {
    id: "alphafold3",
    year: "2024",
    era: "SCIENCE",
    title: "Biological interaction becomes predictable.",
    shortTitle: "AlphaFold 3",
    summary:
      "AlphaFold 3 models joint structures involving proteins, DNA, RNA, ligands, and other biomolecules.",
    detail:
      "The system extended structure prediction from individual proteins toward the interactions that drive cellular mechanisms and drug discovery.",
    status: "historical",
    railAnchor: true,
    metrics: [
      { label: "Signal", value: "Molecular interaction" },
      { label: "Mode", value: "Scientific model" },
    ],
    sources: [
      {
        label: "AlphaFold 3 paper",
        href: "https://www.nature.com/articles/s41586-024-07487-w",
      },
    ],
  },
  {
    id: "reasoning-models",
    year: "2024",
    era: "REASONING",
    title: "Inference becomes a compute dimension.",
    shortTitle: "Reasoning models",
    summary:
      "OpenAI o1 demonstrates that models can improve difficult answers by spending more computation reasoning before responding.",
    detail:
      "The release made test-time reasoning a visible scaling axis alongside data, parameters, and training compute, especially for mathematics, science, and code.",
    status: "historical",
    metrics: [
      { label: "Signal", value: "Deliberation" },
      { label: "Mode", value: "Test-time compute" },
    ],
    sources: [
      {
        label: "Learning to reason",
        href: "https://openai.com/index/learning-to-reason-with-llms/",
      },
    ],
  },
  {
    id: "agent-platforms",
    year: "2025",
    era: "AGENTS",
    title: "Models gain an operating layer.",
    shortTitle: "Agent platforms",
    summary:
      "New agent platforms combine reasoning models with tools, search, computer use, orchestration, and traces.",
    detail:
      "The frontier shifts from generating an answer to completing a verifiable workflow. Reliability, permissions, memory, and observability become first-class capability constraints.",
    status: "historical",
    railAnchor: true,
    metrics: [
      { label: "Signal", value: "Task completion" },
      { label: "Mode", value: "Tool orchestration" },
    ],
    sources: [
      {
        label: "OpenAI agent tools",
        href: "https://openai.com/index/new-tools-for-building-agents/",
      },
    ],
  },
  {
    id: "frontier",
    year: "NOW",
    era: "LIVE FRONTIER",
    title: "The frontier is moving in real time.",
    shortTitle: "Frontier monitor",
    summary:
      "VECTOR-01 continuously scans research and lab feeds for capability, autonomy, science, and safety signals.",
    detail:
      "No single benchmark defines the current phase. The useful signal is the convergence of reasoning, multimodal grounding, tool use, memory, and reliable action in real environments.",
    status: "observed",
    railAnchor: true,
    metrics: [
      { label: "Signal", value: "Convergence" },
      { label: "Mode", value: "Continuous sweep" },
    ],
    sources: [
      { label: "OpenAI news", href: "https://openai.com/news/" },
      {
        label: "Google AI",
        href: "https://blog.google/innovation-and-ai/technology/ai/",
      },
      {
        label: "arXiv cs.AI",
        href: "https://arxiv.org/list/cs.AI/recent",
      },
    ],
  },
  {
    id: "forecast",
    year: "2029-38",
    era: "SCENARIO",
    title: "The next phase is a range, not a date.",
    shortTitle: "Forecast envelope",
    summary:
      "Explore how capability velocity, compute efficiency, and autonomous reliability move the scenario window.",
    detail:
      "This interface exposes the assumptions behind its estimate. It is a transparent scenario model, not a claim that AGI can be predicted from a single curve.",
    status: "forecast",
    railAnchor: true,
    metrics: [
      { label: "Signal", value: "Convergence" },
      { label: "Mode", value: "Uncertain" },
    ],
    sources: [],
  },
];
