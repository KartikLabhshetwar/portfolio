import { TextFlip } from './text-flip';

// Wrapper so the rotating phrases live in React-land (Astro slots can't pass a
// React children array to TextFlip directly).
const phrases = [
  'the memory layer for AI agents',
  'editor-memory plugins',
  'open-source developer tools',
  'from zero',
];

export function HeroTagline() {
  return (
    <span className="text-sm text-zinc-500">
      Building{' '}
      <TextFlip
        as={'span' as never}
        className="font-medium text-zinc-900 dark:text-zinc-50"
        interval={2.4}
      >
        {phrases.map((p) => (
          <span key={p}>{p}</span>
        ))}
      </TextFlip>
    </span>
  );
}
