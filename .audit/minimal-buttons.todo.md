# Minimal buttons

- [x] Pin the behavior contract first. Read-only how inspection and newsletter browser baseline captured theme semantics and subscription URL.
- [x] Name the structure the code is missing per principle-model-the-domain. Native button attributes and one shared style string; no new interaction state.
- [x] Name the target shape. MinimalButton for actual controls, shared classes for the Astro subscription anchor.
- [x] Subtract before you add. Keep existing handlers; remove the installed span wrapper around block content.
- [x] Move in small behavior-preserving steps, each keeping the pin green.
- [x] Prove behavior is unchanged on the real artifact.
- [x] Confirm the change is worth keeping.
- [x] Rebase into small ordered commits. skip: preserve the user's dirty checkout; no commit or PR requested.

## Throughput checkpoint

- Blocking first steps. Install and inventory finished; theme and subscription baseline observed.
- Independent workstreams. Read-only contract inspection separate from one implementation owner.
- Shared mutable state. Implementation isolated in /tmp/portfolio-minimal-buttons; only parent integrates into user's checkout.
- Smallest safe decomposition. One owner for six closely coupled components and their shared styles.

Validation: 50 tests pass; pnpm check reports zero errors/warnings/hints; pnpm build succeeds. Production preview browser checks pass at 1280px and 390px for theme mouse/keyboard behavior, persistence, navigation, reduced motion, shared gradient, 44px targets, Substack URL, overflow, and page/network errors. Dev optimizer cache instability avoided by checking the built artifact. Unused React sidebar/experience components covered through type checks and shared Radix SSR composition test, not an interactive browser fixture.
