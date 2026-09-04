export type Project = {
  id: string;
  title: string;
  kind: string;
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
    kind: 'macOS',
    description: 'Capture, annotate, and polish screenshots in a native macOS app. An open-source CleanShot X alternative.',
    impact: '15k+ downloads',
    liveLink: 'https://www.bettershot.site',
    githubLink: 'https://github.com/KartikLabhshetwar/better-shot',
  },
  {
    id: 'screenshot-studio',
    title: 'Screenshot Studio',
    kind: 'web',
    description: 'Turn raw screenshots into share-ready visuals with polished backgrounds, precise spacing, and instant export. No account or watermark.',
    impact: '20k+ monthly users',
    liveLink: 'https://screenshot-studio.com',
    githubLink: 'https://github.com/KartikLabhshetwar/screenshot-studio',
  },
  {
    id: 'zoomies',
    title: 'Zoomies',
    kind: 'macOS',
    description: 'See live CPU load as a tiny animal sprinting across your macOS menu bar. Native, playful, and lightweight.',
    impact: 'Latest',
    githubLink: 'https://github.com/KartikLabhshetwar/zoomies',
  },
  {
    id: 'oneurl',
    title: 'OneURL',
    kind: 'web',
    description: 'Put every link on one fast, shareable profile. Open source and self-hostable.',
    impact: '900+ signups',
    liveLink: 'https://www.oneurl.live',
    githubLink: 'https://github.com/KartikLabhshetwar/oneurl',
  },
  {
    id: 'lazycommit',
    title: 'Lazy Commit',
    kind: 'package',
    description: 'Write clear Git commit messages from the CLI with AI, based on the changes you actually made.',
    impact: '195k+ downloads',
    liveLink: 'https://www.npmjs.com/package/lazycommitt',
    githubLink: 'https://github.com/KartikLabhshetwar/lazycommit',
  },
  {
    id: 'mind-mentor',
    title: 'Mind Mentor AI',
    kind: 'web',
    description: 'Study with an AI tutor that adapts each explanation to what you know and where you are stuck.',
    impact: '1000+ signups',
    liveLink: 'https://mind-mentor.ink',
    githubLink: 'https://github.com/KartikLabhshetwar/mind-mentor',
  },
  {
    id: 'foliox',
    title: 'FolioX',
    kind: 'web',
    description: 'Turn a GitHub profile into a polished developer portfolio in seconds.',
    liveLink: 'https://foliox.site',
    githubLink: 'https://github.com/KartikLabhshetwar/foliox',
  },
  {
    id: 'doable',
    title: 'Doable',
    kind: 'web',
    description: 'Turn a prompt into organized team tasks, then plan, assign, and ship the work.',
    liveLink: 'https://doable.kartikk.tech',
    githubLink: 'https://github.com/KartikLabhshetwar/doable',
  },
  {
    id: 'mercurius',
    title: 'Mercurius',
    kind: 'web',
    description: 'Start an anonymous chat room that disappears after 10 minutes. No account and no history.',
    liveLink: 'https://mercurius.kartikk.tech',
    githubLink: 'https://github.com/KartikLabhshetwar/Mercurius',
  },
  {
    id: 'quotick',
    title: 'Quotick',
    kind: 'extension',
    description: 'Convert quotes to backticks the moment you type a template literal in VS Code.',
    impact: '1000+ downloads',
    liveLink: 'https://quotick.kartikk.tech',
    githubLink: 'https://github.com/KartikLabhshetwar/quotick',
  },
  {
    id: 'linkpreview',
    title: 'Link Preview',
    kind: 'web',
    description: 'See how a link will look on X, Slack, Discord, LinkedIn, and WhatsApp before you share it.',
    liveLink: 'https://linkpreview.kartikk.tech',
    githubLink: 'https://github.com/KartikLabhshetwar/linkpreview',
  },
  {
    id: 'readmelingo',
    title: 'ReadMeLingo',
    kind: 'CLI',
    description: "Translate a repository's README and docs into more than 40 languages from the CLI.",
    liveLink: 'https://read-me-lingo.kartikk.tech',
    githubLink: 'https://github.com/KartikLabhshetwar/ReadMeLingo',
  },
  {
    id: 'fleethq',
    title: 'FleetHQ',
    kind: 'web',
    description: 'Plan drone missions, monitor fleets in real time, and control access across a team.',
    liveLink: 'https://fleethq.kartikk.tech',
    githubLink: 'https://github.com/KartikLabhshetwar/FleetHQ',
  },
  {
    id: 'rebatr',
    title: 'Rebatr',
    kind: 'web',
    description: 'Put more than 100 AI models into live debates and compare their logic, evidence, and persuasion.',
    liveLink: 'https://rebatr.kartikk.tech',
    githubLink: 'https://github.com/KartikLabhshetwar/rebatr',
  },
  {
    id: 'donezo',
    title: 'Donezo',
    kind: 'web',
    description: 'Turn a week of completed work into a concise review delivered to your inbox.',
    liveLink: 'https://donezo-theta.vercel.app/',
    githubLink: 'https://github.com/UmangAgarwal257/Donezo',
  },
  {
    id: 'overwhelm',
    title: 'Overwhelm Breaker',
    kind: 'web',
    description: 'Turn an overwhelming project into small tasks and focused work sessions.',
    liveLink: 'https://overwhelm-breaker.kartikk.tech',
    githubLink: 'https://github.com/KartikLabhshetwar/overwhelm-breaker',
  },
  {
    id: 'satya-check',
    title: 'SatyaCheck',
    kind: 'web',
    description: 'Check claims in your browser and trace the evidence before you share them.',
    liveLink: 'https://satya-check.vercel.app/',
    githubLink: 'https://github.com/21prnv/SatyaCheck',
  },
  {
    id: 'gocache',
    title: 'Gocache',
    kind: 'Go',
    description: 'A fast in-memory cache in Go, built to understand how Redis works under the hood.',
    githubLink: 'https://github.com/KartikLabhshetwar/Gocache',
  },
  {
    id: 'learnx',
    title: 'LearnX',
    kind: 'web',
    description: 'A course marketplace that connects educators and learners from enrollment through delivery.',
    liveLink: 'https://learnx-frontend.onrender.com/',
    githubLink: 'https://github.com/KartikLabhshetwar/LearnX',
  },
];
