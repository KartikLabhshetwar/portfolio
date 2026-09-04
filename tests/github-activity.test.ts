import { describe, expect, it } from 'vitest';
import { toWeeks, weeksFor, type Contribution } from '../src/components/ui/github-activity';

describe('GitHub activity layout', () => {
  it('keeps responsive history in seven-day columns', () => {
    const days = Array.from({ length: 15 }, (_, index): Contribution => ({
      date: `2026-01-${String(index + 1).padStart(2, '0')}`,
      count: index,
      level: 0,
    }));
    expect(toWeeks(days).map((week) => week.length)).toEqual([7, 7, 1]);
    expect(weeksFor(12)).toBeGreaterThanOrEqual(52);
  });
});
