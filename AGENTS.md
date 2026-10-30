# Heischwumm

- Angular dashboard deployed at `/heischwumm/`. Preserve the base href and existing hash routes.
- Use the Node version in `.nvmrc` (via mise if needed), `npm ci`, `npx tsc -b`, `npm run lint`, `npm run format:check`, `npm test`, and `npm run build`.
- Keep unit tests deterministic and mock external transport/weather services. Browser tests run against the local app.
- Use standalone components, signals, strict TypeScript and accessible responsive layouts. Preserve source attribution and stale/error states.
- State visibility on every class member (`private`, or `public` when the template uses it) and always use braces on `if`/`else`. ESLint checks both.

## Shared release and CI rules

- Public support and security contact: `screamcode@gmail.com`. Keep in-app contact details, portal policies and App Store metadata consistent.
- `AGENTS.md` owns the rules. `CLAUDE.md` contains only: `See @AGENTS.md for monorepo documentation and guidelines.`
- Every Actions job needs a finite timeout and minimal permissions. Cancel superseded checks, but let an active production deployment finish.
- Exclude confirmed internal documentation from app builds. Documentation shipped in the product remains a build input. Scope jobs to their component and shared dependencies; unknown paths still run. Keep fixtures, migrations, dependency locks, localization and build configuration in CI scope.
- GitHub runners are for fast lint, type checks, deterministic unit tests and compilation only. Extensive browser E2E, simulator/device suites and screenshots run locally, including when agents code; do not add hosted opt-ins for them. Never run paid AI calls, live provider corpus runs, production database tests or signing/publishing as routine PR checks.
- Keep artifacts short-lived (7 days or less), and release bundles limited to tags/manual runs. Cheap lint, type checks, deterministic tests and compilation remain automatic.
- Release status lives in the Obsidian vault: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Privat/Development/ScreamXY/` (`ScreamXY.md`, `TODO.md`). If unavailable, say so. Distinguish prepared files, published pages, CI results and hardware verification.

## Local validation required for relevant changes

`npm test` and `npm run e2e` against the local app for changed user flows. Browser dependencies must be available locally; report any blocked check instead of substituting compilation.

Run the affected suites before committing and report what actually ran. Keep tests
and local scripts even when their hosted jobs are removed. Do not increase a CI
timeout to hide a hang; inspect the failure first.
