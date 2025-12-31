import { Project } from '@/types/project'

export const projects: Project[] = [
  {
    id: 'neo-clouds',
    title: "Neo Clouds - GPU-Native AI Compute Platform",
    description: "Designed and implemented a GPU-native cloud platform for AI workloads with Kubernetes-based GPU scheduling and VM-level isolation.",
    longDescription: "Built Kubernetes-based GPU scheduling, VM-level isolation, and resource-aware orchestration for secure multi-tenant execution\n\nIncreased effective GPU utilization by 35-40% via dynamic allocation and queue-aware scheduling\n\nStress-tested platform with dozens of concurrent GPU jobs while maintaining predictable latency and stability\n\nImplemented enterprise-grade security and isolation for multi-tenant GPU compute workloads",
    liveLink: "https://neoclouds.io/",
    githubLink: "https://github.com/Shivam909058/neo-clouds",
    video: 'neo-clouds',
    image: '/images/neoclouds.png',
    tweetUrl: "",
    tags: [
      "Kubernetes",
      "GPU Scheduling",
      "Python",
      "Docker",
      "VM Isolation",
      "AI Compute",
      "Cloud Infrastructure"
    ],
  },
  {
    id: 'yoom',
    title: "Yoom - AI Meeting Assistant",
    description: "Built a full video conferencing platform with continuous conversation capture and AI-powered meeting summaries.",
    longDescription: "Automatically generates post-meeting summaries, bullet points, and action items within 5-10 seconds of meeting completion\n\nConverts entire meeting conversations into a persistent RAG-based conversational memory\n\nEnables contextual Q&A with sub-2s response latency over 60+ minute meetings\n\nHandles long-context retrieval under constrained compute and memory limits with efficient chunking and embedding strategies",
    liveLink: "https://yoom-ai.vercel.app/",
    githubLink: "https://github.com/Shivam909058/yoom",
    video: 'yoom',
    image: '/images/yoom.png',
    tweetUrl: "",
    tags: [
      "Next.js",
      "WebRTC",
      "RAG",
      "LLM",
      "Vector Database",
      "Real-time AI",
      "TypeScript"
    ],
  },
  {
    id: 'agno',
    title: "AGNO - Modular AI Agent Platform",
    description: "Built a RAG-powered agent creation platform using the AGNO codebase as a live knowledge base.",
    longDescription: "Uses GitHub repositories and documentation as a live knowledge base for semantic search and reasoning\n\nEnables users to create complex single and multi-agent systems purely through natural language\n\nNo configuration files or code required - supports agent composition, chaining, and coordinated workflows\n\nProvides reliable responses through advanced RAG techniques and intelligent query routing",
    liveLink: "https://agno-platform.vercel.app/",
    githubLink: "https://github.com/Shivam909058/agno",
    video: 'agno',
    image: '/images/agno.png',
    tweetUrl: "",
    tags: [
      "Multi-Agent Systems",
      "RAG",
      "LangChain",
      "Python",
      "NLP",
      "Agent Orchestration",
      "AI Platform"
    ],
  },
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id)
}

export const getAllProjects = (): Project[] => {
  return projects
}
