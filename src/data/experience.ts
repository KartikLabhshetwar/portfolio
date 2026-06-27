import type { ExperienceItemType } from '../components/work-experience';

export const experience: ExperienceItemType[] = [
  {
    id: 'mem0',
    companyName: 'Mem0',
    companyLogo: '/logos/mem0.png',
    companyWebsite: 'https://mem0.ai',
    isCurrentEmployer: true,
    positions: [
      {
        id: 'mem0-mts',
        title: 'Member of Technical Staff',
        employmentType: 'Full-time',
        employmentPeriod: { start: '04.2026' },
        description: `- Merged 83 PRs (+55K/−21K lines across 656 files) — spanning the Python & TypeScript SDKs, vector stores, self-hosted server, editor plugins, CLI, and docs.
- Patched a critical Remote Code Execution vulnerability (unsafe pickle deserialization) in the FAISS vector store, closing a long-open security issue.
- Hardened the self-hosted server — enforced admin-role auth on /configure and /reset (403 for non-admins), upgraded to PostgreSQL 17 + pgvector 0.8.2, and shipped a migration guide.
- Fixed inverted search ranking across 11 vector-store backends — normalized raw distances to a consistent similarity contract so Memory.search() returns the most relevant memories, not the least.
- Cut multi-second search latency by re-architecting entity-boost search from 16 serial embedding round-trips to a single batched, parallel call — across both the Python and TypeScript SDKs.
- Resolved an enterprise-reported /search 502 and implemented the full pgvector filter operator set (gt/lt/in/contains/AND/OR/NOT/wildcard) in both SDKs, where they were previously silent no-ops.
- Built and shipped the Mem0 editor-memory plugin (v0.2.1 → v0.2.6+): onboarding wizard, per-project/session memory scoping, and intelligent auto-triggering (pre-fetch on errors/resume, dedup, file-context injection).
- Built and shipped four editor integrations end-to-end — Pi Agent (agent tool, 8 commands, 8 skills, and auto-capture), OpenCode and Antigravity (full hook parity with Claude Code), and a rebuilt OpenClaw plugin with OAuth login.
- Instrumented end-to-end PostHog telemetry with per-editor attribution, giving the team its first real usage data.
- Built CLI import/event commands, restructured the monorepo (plugins consolidated under integrations/), and led the v3 API docs migration — authoring SECURITY.md, integration guides (Google ADK, ChatDev, Hermes), and coordinated SDK releases (Python 2.0.x, TS 3.0.x).`,
      },
      {
        id: 'mem0-intern',
        title: 'Software Engineering Intern',
        employmentType: 'Internship',
        employmentPeriod: { start: '03.2026', end: '04.2026' },
        description: `- Contributed across the full stack — SDKs, docs, CI, and community — for Mem0's open-source memory layer for AI agents.
- Authored 43 PRs (95% merge rate), 39 commits, 15K+ lines across 169 files — Python SDK, TypeScript SDK, docs, and CI.
- Triaged the issue backlog from 400+ to under 100 (same for open PRs): categorized, closed stale items, linked duplicates, routed actionable work to the right contributors.
- Fixed a critical data-loss bug where delete_all(user_id=...) destroyed the entire vector collection instead of filtered records — affecting all self-hosted users.
- Built TypeScript SDK test infrastructure from scratch — 474 unit tests across 26 suites + 29 live integration tests against the real Mem0 API, CI pipelines for Node 20 & 22.
- Resolved 18 bugs across the stack: MongoDB metadata loss, Ollama URL misconfig, Gemini safety-filter crashes, LLMReranker silent fallback, tsup peer-dep bundling.
- Reviewed 47 community PRs with detailed line-level feedback — guided MiniMax LLM, Apache AGE graph store, and REST server auth to merge-ready quality.
- Drove community engagement — 34 external contributors, 57 PRs in 3 weeks, 72 issues resolved repo-wide.
- Patched CVE-2026-0994 (protobuf, CVSS 8.2 HIGH), updated deprecated Google embedding models, and migrated Ollama to current API endpoints.`,
      },
    ],
  },
  {
    id: 'turboml',
    companyName: 'Turbo ML',
    companyLogo: '/logos/turboml.png',
    positions: [
      {
        id: 'turboml-ai',
        title: 'Software Engineering Intern (AI)',
        employmentType: 'Internship',
        employmentPeriod: { start: '04.2025', end: '07.2025' },
        description: `- Shipped multi-select preferences, browser-based video recording, and API integrations (WhatsApp/email reminders), with autosave and real-time scraping on Next.js, Supabase, and Cloudflare Workers.
- Implemented a reminder system using Redis Sorted Sets and a custom daemon for time-based task execution under 24-hour constraints.
- Integrated Swiggy (food delivery/dine-out) and Blinkit (grocery), keeping Google for general recommendations and giving users choice.
- Designed WhatsApp Business API commands (/help, /reset, /new) with runtime-configurable bot initialization via env vars.
- Added Azure Blob Storage for file handling + message-reaction management, and chunked WhatsApp outputs over 4096 characters for compliance.`,
      },
    ],
  },
];
