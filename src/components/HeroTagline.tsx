import { motion } from 'motion/react';
import { TextFlip } from './text-flip';

const phrases = [
  'the memory layer for AI agents.',
  'open-source tooling at scale.',
  'developer tools people love.',
  'from zero.',
];

export function HeroTagline() {
  return (
    <span className="text-sm text-muted-foreground">
      Building{' '}
      <TextFlip
        as={motion.span}
        className="font-medium text-foreground"
        interval={2.8}
        transition={{ duration: 0.3 }}
      >
        {phrases.map((p) => (
          <span key={p}>{p}</span>
        ))}
      </TextFlip>
    </span>
  );
}
