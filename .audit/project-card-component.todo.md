# Project card component

- [x] Ground. ProjectList maps the Project registry; only projects.astro calls it. Screenshot supplies the card design.
- [x] Sketch. Caller uses <ProjectCard project={project} />; component takes the existing Project type. Alternative flat props duplicate that model, so retain one project prop.
- [x] Agree. User explicitly requested the existing card as a component used on this page.
- [x] Implement. Extract anchor markup and static Tailwind styles into ProjectCard.astro; list retains list semantics and iteration.
- [x] Verify. Type check, existing tests, build and real browser reload/navigation at mobile/desktop in both themes.
- [x] Scrap. n/a; existing Project prop fits the requested component.

Scope: ProjectCard.astro and ProjectList.astro. No registry, exports, config, fixtures, or page caller changes. Preserve external link attributes, keyboard focus and reduced-motion support.
Checkpoint: source and screenshot grounded first; one isolated implementation owner; root verifies after port; no shared writes.
Principles: Model the Domain keeps the existing Project type; Fix Root Causes retains utility styling to avoid stale scoped CSS.

User supplied a new target screenshot during verification. Updated the component to a 24px rounded outer shell with 8px padding and a 24px rounded inset description panel with 16px padding. Title uses medium weight. Theme variables supply the contrasting panel background. No fixed card dimensions or clipping.

Chrome checks passed for all 23 inset cards at 390px and 1280px in light/dark themes on direct navigation, Home-to-Projects navigation and reload. No horizontal overflow. 50 tests pass; type check has zero errors/warnings. Original extraction build passed; final inset-style build checked separately.
