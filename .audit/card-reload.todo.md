# Card reload fix

- [x] Reproduce it yourself on the matching surface via the driver skill.
- [x] Binary-search the cause. Direct load uses stale virtual component CSS; client navigation uses current inline CSS.
- [x] Plan the fix. Delegate implementation to a subagent with a specific scope.
- [x] Verify on the same surface. The original repro now passes.
- [ ] Stage the commits so the failing repro lands before the fix in git history.
  skip: Workspace fix requested; no commits requested. Retain browser assertion evidence locally.
- [ ] Run Opening a PR.
  skip: Workspace fix requested; no PR requested.

Scope: ProjectList presentation only. Projects data, page caller, links and accessible names retain their shape. No config, exports or fixture changes needed.
Checkpoint: reproduce first; one isolated implementation owner; root verifies in the shared preview. No shared writes.

Verification: before direct-load assertion failed with actual 8px, expected 20px. After fix all 23 cards match on direct load, Home-to-Projects navigation and reload at 390px and 1280px in light and dark mode. Transparent description background, no horizontal overflow. Shared preview disconnected during desktop resize; completed matrix with installed Chrome through Playwright. All 50 unit tests and production build passed.
Fix Root Causes principle: remove separately cached component CSS and obsolete selectors; reuse existing Tailwind utilities. No project data model change required.
