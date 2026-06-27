export type Project = {
  id: string;
  title: string;
  description: string;
  // Headline metric shown as an accent on the card (downloads, DAU, "Latest").
  // GitHub stars render automatically from the live count, so put non-star
  // impact here. Leave undefined to let stars speak for themselves.
  impact?: string;
  liveLink?: string;
  githubLink?: string;
};

// Ordered by what to lead with: the first six surface on the home page.
export const projects: Project[] = [
  {
    id: 'bettershot',
    title: 'BetterShot',
    description: 'Capture, annotate, and polish screenshots natively on macOS; the open-source CleanShot X alternative.',
    impact: '12k+ downloads',
    liveLink: 'https://www.bettershot.site',
    githubLink: 'https://github.com/KartikLabhshetwar/better-shot',
  },
  {
    id: 'screenshot-studio',
    title: 'Screenshot Studio',
    description: 'Turn raw screenshots into share-ready visuals in the browser: backgrounds, padding, and export, with no signup or watermarks.',
    impact: '10k+ monthly users',
    liveLink: 'https://screenshot-studio.com',
    githubLink: 'https://github.com/KartikLabhshetwar/screenshot-studio',
  },
  {
    id: 'zoomies',
    title: 'Zoomies',
    description: 'Watch your live CPU load sprint across the macOS menu bar as a running animal: a tiny, native SwiftUI system monitor.',
    impact: 'Latest',
    githubLink: 'https://github.com/KartikLabhshetwar/zoomies',
  },
  {
    id: 'oneurl',
    title: 'OneURL',
    description: 'Put every link on one shareable profile page; the open-source, self-hostable Linktree alternative.',
    liveLink: 'https://www.oneurl.live',
    githubLink: 'https://github.com/KartikLabhshetwar/oneurl',
  },
  {
    id: 'lazycommit',
    title: 'Lazy Commit',
    description: 'Generate your git commit messages with AI straight from the CLI, so you never hand-write one again.',
    impact: '195k+ downloads',
    liveLink: 'https://www.npmjs.com/package/lazycommitt',
    githubLink: 'https://github.com/KartikLabhshetwar/lazycommit',
  },
  {
    id: 'mind-mentor',
    title: 'Mind Mentor AI',
    description: 'Study and prep for exams with an AI tutor that adapts explanations to how you learn.',
    liveLink: 'https://mind-mentor.ink',
    githubLink: 'https://github.com/KartikLabhshetwar/mind-mentor',
  },
  {
    id: 'foliox',
    title: 'FolioX',
    description: 'Generate a polished developer portfolio from your GitHub profile in seconds with AI.',
    liveLink: 'https://foliox.site',
    githubLink: 'https://github.com/KartikLabhshetwar/foliox',
  },
  {
    id: 'doable',
    title: 'Doable',
    description: 'Plan and ship work faster with an AI-assisted task manager built for teams.',
    liveLink: 'https://doable.kartikk.tech',
    githubLink: 'https://github.com/KartikLabhshetwar/doable',
  },
  {
    id: 'mercurius',
    title: 'Mercurius',
    description: 'Chat in self-destructing rooms that vanish after 10 minutes, anonymous and private by default.',
    liveLink: 'https://mercurius.kartikk.tech',
    githubLink: 'https://github.com/KartikLabhshetwar/Mercurius',
  },
  {
    id: 'quotick',
    title: 'Quotick',
    description: 'Auto-convert quotes to backticks the moment you type a template literal in VS Code.',
    liveLink: 'https://quotick.kartikk.tech',
    githubLink: 'https://github.com/KartikLabhshetwar/quotick',
  },
  {
    id: 'linkpreview',
    title: 'Link Preview',
    description: 'Preview how a link unfurls on X, Slack, Discord, LinkedIn, and WhatsApp before you post it.',
    liveLink: 'https://linkpreview.kartikk.tech',
    githubLink: 'https://github.com/KartikLabhshetwar/linkpreview',
  },
  {
    id: 'readmelingo',
    title: 'ReadMeLingo',
    description: "Translate any repo's README and docs into 40+ languages from the CLI, powered by Lingo.dev.",
    liveLink: 'https://read-me-lingo.kartikk.tech',
    githubLink: 'https://github.com/KartikLabhshetwar/ReadMeLingo',
  },
  {
    id: 'fleethq',
    title: 'FleetHQ',
    description: 'Plan drone missions and monitor fleets in real time with analytics and role-based access.',
    liveLink: 'https://fleethq.kartikk.tech',
    githubLink: 'https://github.com/KartikLabhshetwar/FleetHQ',
  },
  {
    id: 'rebatr',
    title: 'Rebatr',
    description: 'Pit 100+ AI models against each other in live debates, scored on logic, evidence, and persuasion.',
    liveLink: 'https://rebatr.kartikk.tech',
    githubLink: 'https://github.com/KartikLabhshetwar/rebatr',
  },
  {
    id: 'donezo',
    title: 'Donezo',
    description: 'Get an AI-written weekly review of your work, delivered straight to your inbox.',
    liveLink: 'https://donezo-theta.vercel.app/',
    githubLink: 'https://github.com/UmangAgarwal257/Donezo',
  },
  {
    id: 'overwhelm',
    title: 'Overwhelm Breaker',
    description: 'Break overwhelming projects into small tasks and focused work sessions with AI.',
    liveLink: 'https://overwhelm-breaker.kartikk.tech',
    githubLink: 'https://github.com/KartikLabhshetwar/overwhelm-breaker',
  },
  {
    id: 'satya-check',
    title: 'SatyaCheck',
    description: 'Fact-check claims right in your browser with AI to spot and stop misinformation.',
    liveLink: 'https://satya-check.vercel.app/',
    githubLink: 'https://github.com/21prnv/SatyaCheck',
  },
  {
    id: 'gocache',
    title: 'Gocache',
    description: 'Learn how Redis works under the hood by building a fast in-memory cache in Go.',
    githubLink: 'https://github.com/KartikLabhshetwar/Gocache',
  },
  {
    id: 'learnx',
    title: 'LearnX',
    description: 'Connect educators and learners on a full course marketplace, from enrollment to delivery.',
    liveLink: 'https://learnx-frontend.onrender.com/',
    githubLink: 'https://github.com/KartikLabhshetwar/LearnX',
  },
];
