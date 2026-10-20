### Feature

**You own the design. Plan, review, verify.** Delegate implementation. Stay in the lead.

1. `how` over the affected subsystem.
2. `architect` for parallel design exploration.
3. Write the throughput checkpoint as four todo items. A dimension that genuinely does not apply (single file, no fan-out) keeps its item with `n/a: <reason>` rather than being dropped:
   - **Blocking first steps.** Gates run before fan-out.
   - **Independent workstreams.** Disjoint files, services, or layers parallelize. Shared writes serialize.
   - **Shared mutable state.** Default to splitting the target (the **separate-before-serializing-shared-state** principle skill). Serialize only for real invariants.
   - **Smallest safe decomposition.** If one worker is best, name why.
4. Delegate code-writing to a subagent using your configured feature model (default in poteto-mode's Models section) with a specific scope (file paths, named data shape and its organizing structure per **principle-model-the-domain**, a state machine over scattered booleans, a table/registry over branching, a typed model over repeated shape assumptions, chosen before the delegate writes logic, and success criteria). Pick each subagent's reasoning level for the job, per the Subagents section. When the implementation admits multiple valid shapes (error handling, abstraction layer, test structure), delegate via the **arena** skill instead so the runners surface the alternatives and the cross-judge guards the pick. Mandatory: no skip-with-reason escape, and Laziness Protocol does not override it (the gain is review separation, not lines saved). A subagent forbidden to spawn satisfies this by owning the diff directly with the same review separation. No "standing by" reply that waits on a nested agent. **Give every file-writing delegate its own worktree** (spawn it with `isolation: "worktree"`, or hand it an exclusive branch), and do not write files or run a suite in a worktree a delegate still holds. On Claude Code, `isolation: "worktree"` branches from the remote default branch unless the `worktree.baseRef` setting is `"head"`. When the delegate builds on commits the default branch lacks, commit them, create its worktree with `git worktree add <path> -b <delegate-branch> HEAD`, and name that base commit in the brief. Fencing a file in the brief's prose is not a lock (**principle-separate-before-serializing-shared-state**). Comments per **Comments**. Surgical edits, re-ground against the source for upstream-derived files. Port shared-primitive improvements to all consumers and verify each. Commit liberally.
5. Verify on the matching surface. "Inconclusive" or wrong-surface is not a pass. Flag it.
6. Rebase into small, ordered commits. Stack follow-ups.
   Use the **sequence-verifiable-units** principle skill, building, verifying, and committing each small unit before the next.
7. If the design is contested, `interrogate` before shipping.
8. Run **Opening a PR**.

Code-coupled work (one feature, one migration) goes to a single owner with the checkpoint inline. That owner fans out internally after the blocking phase. Parent-level fan-out is for slices that produce independent artifacts (audits, cross-subsystem investigations, competing experiments). Rewrite the checkpoint at phase boundaries. Spawn a fresh owner rather than chaining interrupts.

**Reply:** what you built, what you chose and why, the throughput checkpoint, open decisions. Tables for design alternatives.

## Task checkpoint
- Blocking first steps: inspected Base, PageHeader, BlogCard, ProjectList and all callers. Complete.
- Independent workstreams: one isolated implementation owner; root verifies the real browser.
- Shared mutable state: delegate owns /tmp/portfolio-shader-cards; root ports only completed diff.
- Smallest safe decomposition: one owner for coupled styling, dependency and shader lifecycle.
- Model the Domain: decorative element owns one optional ShaderMount; project and blog data stay unchanged.
- Architecture comparison: React island adds hydration for decoration; Astro custom element uses vanilla library and native cleanup. Choose custom element.
- Palette: existing paper #fbfbfa, ink #191918, dark #111113, muted #232326, signal #1265ff; lilac confined to artwork. Geist for body/display, existing monospace for utilities.
- Layout: small homepage artwork above introduction; layered writing cards and project panels preserve narrow page and full-card links.
- Verify: desktop/mobile, light/dark, navigation return, reduced motion/static fallback, check, tests and build.
- Commits/PR/deploy: skip, user requested workspace UI change.

## Completion
- Implemented and independently reviewed source; no blocking findings.
- Verified real WebGL program, advancing frame, stop speed 0, reduced-motion speed 0, disposal/re-entry.
- Browser checks passed writing/projects at 390px and 1280px; theme colors and focus outlines verified.
- pnpm test passed 69 tests. pnpm build passed. Final pnpm check passed with 0 errors after concurrent typing updates.
- Preserved concurrent dock, experience and React typing changes.
- No PR, deployment or commits requested.

## User correction
- Remove shader component, lifecycle script, tests and package. Complete.
- Restore writing lists with no card backgrounds across homepage, blog index and related posts. Complete.
- Cards scoped exclusively to ProjectList with full-width title, screenshot and description. Complete.
- Replace shader art with static ordered-dither header accents using a small SVG mask. Complete.
- Verify routes at mobile/desktop in both themes; check no canvas and only Projects has project cards. In progress.

- Revision verification complete: 66 tests, zero check diagnostics, production build passed.
- Browser verified 23 aligned cards at 390/1280px in both themes. Homepage, blog index and article related links have no card wrappers. No canvases remain.
- Screenshot previews use object-cover to fill the consistent frame for source assets with varying ratios.
