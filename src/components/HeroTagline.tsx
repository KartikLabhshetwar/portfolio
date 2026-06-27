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
        interval={2.6}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        variants={{
          initial: { opacity: 0, y: 8, filter: 'blur(2px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          exit: { opacity: 0, y: -8, filter: 'blur(2px)' },
        }}
      >
        {phrases.map((p) => (
          <span key={p}>{p}</span>
        ))}
      </TextFlip>
    </span>
  );
}
