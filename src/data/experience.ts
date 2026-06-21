export const experience = [
  {
    company: 'Mem0',
    role: 'Member of Technical Staff',
    period: 'Apr 2026 — present',
    points: [
      'Full-time role continuing from internship, working across Python SDK, TypeScript SDK, documentation, and CI infrastructure for the universal memory layer for AI agents.',
    ],
  },
  {
    company: 'Mem0 (Intern)',
    role: 'Software Engineering Intern',
    period: 'Mar 2026 — Apr 2026',
    points: [
      'Contributed across the full stack — SDKs, docs, CI, and community — for Mem0\'s open-source memory layer for AI agents.',
      'Authored 43 PRs (95% merge rate), 39 commits, 15K+ lines across 169 files — Python SDK, TypeScript SDK, docs, and CI.',
      'Triaged issue backlog from 400+ to under 100, same for open PRs. Categorized, closed stale items, linked duplicates, routed actionable work to right contributors.',
      'Fixed a critical data-loss bug where delete_all(user_id=...) destroyed the entire vector collection instead of filtered records — affecting all self-hosted users.',
      'Built TypeScript SDK test infrastructure from scratch — 474 unit tests across 26 suites + 29 live integration tests against real Mem0 API, CI pipelines for Node 20 & 22.',
      'Resolved 18 bugs across the stack: MongoDB metadata loss, Ollama URL misconfig, Gemini safety-filter crashes, LLMReranker silent fallback, tsup peer-dep bundling.',
      'Reviewed 47 PRs from community contributors with detailed line-level feedback — guided MiniMax LLM, Apache AGE graph store, and REST server auth to merge-ready quality.',
      'Drove community engagement — 34 external contributors, 57 PRs in 3 weeks, 72 issues resolved repo-wide.',
      'Expanded docs with 3 OSS cookbook tabs, Vibecoding guide, MiroFish swarm-memory cookbook, and a full skills for mem0 (3,261 lines).',
      'Patched CVE-2026-0994 (protobuf CVSS 8.2 HIGH), updated deprecated Google embedding models, migrated Ollama to current API endpoints.',
      'Overhauled GitHub issue templates, configured stale-bot automation, added auto-labeler for 9 component types.',
    ],
  },
  {
    company: 'Turbo ML',
    role: 'Software Engineering Intern (AI)',
    period: 'April 2025 — July 2025',
    points: [
      'Developed and deployed cutting-edge solutions, including multi-select preferences, browser-based video recording, and API integrations like WhatsApp/email reminders. Optimized workflows with autosave features and real-time scraping, leveraging Next.js, Supabase, and Cloudflare workers.',
      'Implemented a reminder system using Redis Sorted Sets and a custom daemon to handle time-based task execution under 24-hour constraints.',
      'Integrated multiple APIs including Swiggy for food delivery and dine-out services, and Blinkit for grocery delivery, while retaining Google for general recommendations and providing user choice flexibility.',
      'Designed and implemented support for WhatsApp Business API commands (/help, /reset, /new), including runtime-configurable bot initialization based on environment variables.',
      'Added Azure Blob Storage integration for file handling and message reaction management in WhatsApp bot.',
      'Ensured WhatsApp message compliance by chunking outputs exceeding 4096 characters.',
    ],
  },
];
