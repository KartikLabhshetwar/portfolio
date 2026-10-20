# Alignment fix

1. Reproduce it yourself on the matching surface via the driver skill (Non-negotiables), even when a debug or instrumentation protocol says to ask the user to reproduce. Ask the user only with a stated, specific reason the control surface cannot reach the target, and only after driving it as far as it goes. If it won't reproduce directly, synthesize the trigger, tighten conditions, or instrument until it fires.
2. Binary-search the cause. Form the candidate hypotheses, then rule them out until one survives. Seed them with `how` over the affected subsystem and the **why** skill for regression history. Each pass, take the split that cuts the most remaining problem space, get runtime evidence, eliminate. When program state is unclear, add instrumentation or logging and read it as the code runs. Don't guess. Drive a long or stubborn hunt with Claude Code's `loop` skill. Confirm the surviving *mechanism* with runtime evidence before the step-3 architect/interrogate fan-out.
3. Plan the fix. If it crosses a function boundary, `architect` first. Delegate implementation to a subagent using your configured bug-fix model (default in poteto-mode's Models section) with a specific scope.
4. Verify on the same surface. The original repro now passes. "Inconclusive" or wrong-surface is not a pass. Flag it. Unit tests show branch behavior, not bug absence.
5. Stage the commits so the failing repro lands before the fix in git history. See the **tdd** skill for the failing-test-first cadence when the bug has a cheap local test path. Skip it when the test would be expensive, integration-heavy, or unclear.
   This is the canonical **sequence-verifiable-units** principle skill, the failing test first and the fix on top.
6. Run **Opening a PR**.


Progress. Reproduced newsletter and writing layouts in T3 preview. Implementation delegated. Browser validation pending.

Step 5 skip: CSS layout only; verify real browser geometry instead of adding unit tests. Preserve existing dirty checkout without commits.
Step 6 skip: local fix requested; no PR or deployment.

Completed. Shared header grid fixes desktop center delta from 8px to 0px. Grouped newsletter content, card gap and writing list spacing applied. pnpm check passed 60 files with zero diagnostics. Browser assertions pass 12 route/viewport combinations (1280,390,320); screenshots inspected at390. T3 preview disconnected during final checks; its explicit unavailable response authorized shell Playwright fallback. Existing concurrent page copy/button edits preserved.
