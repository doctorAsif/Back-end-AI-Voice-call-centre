<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<p align="center">
	<a href="https://github.com/doctorAsif/AI-Voice-Agent-Architecture/actions/workflows/ci.yml"><img src="https://github.com/doctorAsif/AI-Voice-Agent-Architecture/actions/workflows/ci.yml/badge.svg" alt="CI Status" /></a>
</p>

## Overview

Interactive visualization of a production-grade AI Voice Agent call flow. The interface simulates how audio, text, and control signals move through seven core subsystems: Phone System → STT → Conductor → Brain (LLM) ↔ Memory (APIs/Data) → TTS → Caller (and optional Human Escalation).

Use the Simulate Call Flow button to animate the chronological progression. Click any component card to view product management tasks and implementation challenges.

## Architecture Components

1. Phone System: Ingress/Egress of real-time audio streams.
2. Speech-to-Text (Ears): Low-latency transcription.
3. AI Brain: Intent understanding + response planning.
4. Memory (Data/APIs): External knowledge & transactional context.
5. Text-to-Speech (Voice): Natural prosody + low latency.
6. Conductor: Orchestrates async pipeline, state, error paths.
7. Human Backup: Escalation safety net & context handoff.

## Technology Stack

- React 19 + TypeScript (strict mode)
- Vite 6 (dev & build tooling)
- Tailwind (via CDN for simplicity; can be swapped for local build)
- Vitest + Testing Library (unit/component tests)

## Getting Started

Prerequisites: Node.js 18+ (LTS recommended)

Clone & Install:
```
npm install
```

Environment Variables:
Create a `.env.local` (not committed) if you intend to use API features later:
```
GEMINI_API_KEY=your_key_here
```
The key is injected at build time via `vite.config.ts` using `loadEnv`.

Run Dev Server:
```
npm run dev
```

Type Check Only:
```
npm run typecheck
```

Production Build:
```
npm run build
```
Then preview:
```
npm run preview
```

## Available Scripts

| Script | Purpose |
| ------ | ------- |
| dev | Start Vite dev server |
| build | Production bundle |
| preview | Preview built bundle |
| typecheck | Run TypeScript diagnostics |
| test | Run Vitest in CI (no watch) |
| test:ui | Interactive watch mode |
| lint | Run ESLint over src |

## Testing

Vitest + React Testing Library are configured (JSDOM). Add tests under `__tests__` or alongside components (`Component.test.tsx`). Example (to be added):
```tsx
import { render, screen } from '@testing-library/react';
import ComponentCard from '../components/ComponentCard';
// ...
```

Generate coverage:
```
npm run test -- --coverage
```

Coverage thresholds enforced (build fails if below):
- Lines / Statements: 70%
- Functions: 60%
- Branches: 50%

Increase over time as the test surface grows.

## Code Quality & Conventions

- Strict TypeScript for safer refactors
- No implicit any / consistent casing enforced
- Prefer pure presentational components with clear prop types
- Timers in simulation are cleaned up on unmount to prevent leaks

## Extending the Simulation

Ideas:
- Add WebSocket layer to simulate streaming partial transcripts
- Introduce latency indicators per component
- Visualize parallel API fan-out in Memory stage
- Add error injection mode (e.g., STT timeout) with recovery paths

## Security Notes

Never expose real API keys in client bundles. For production, proxy sensitive calls via a backend and supply ephemeral tokens to the browser.

## Deployment

Any static host will work (Vercel, Netlify, Cloudflare Pages):
```
npm run build
# deploy contents of dist/
```

### Vercel
`vercel.json` configured. Import repo → framework detection (or pick "Other") → build command `npm run build`, output `dist`.

### Netlify
`netlify.toml` included. Set build command `npm run build`, publish directory `dist`. Redirects handle SPA routing.

### Bundle Analysis
Generate bundle visual report:
```
npm run analyze
open dist/stats.html
```

Use to identify opportunities for code splitting or dependency trimming.

## Automated Releases

Semantic Release automates versioning + changelog based on commit messages.

Commit format (Conventional Commits):
```
feat: add new component
fix: correct simulation timing
docs: update architecture section
chore: tooling or build change
refactor: code change w/o behavior impact
test: add/modify tests only
perf: performance improvement
```

Breaking changes:
```
feat!: overhaul simulation engine
chore(deps)!: upgrade major framework version
```

Release flow:
1. Merge PR into `main` with proper commit messages.
2. `release.yml` workflow runs semantic-release.
3. New git tag, GitHub Release, changelog update (`CHANGELOG.md`).

Manual trigger: Actions → Release → Run workflow.

Local dry run (preview next semantic-release version without publishing):
```
export GITHUB_TOKEN=your_personal_token_with_repo_scope
npm run release -- --dry-run
```
If you omit the token locally you'll see the expected `ENOGHTOKEN` error; in CI the ephemeral `GITHUB_TOKEN` is provided automatically.

## End-to-End Testing (Playwright)

Run locally:
```
npm run e2e
```
Headed / UI mode:
```
npm run e2e:ui
```
CI workflow: `.github/workflows/e2e.yml` executes on PRs.

Artifacts: Playwright report uploaded when failing (and on demand).

## Visual Regression Testing

Playwright visual snapshots are configured in `e2e/visual.spec.ts`.

Baselines directory: `e2e/visual.spec.ts-snapshots/`

Workflow:
1. Make intentional UI change.
2. Update snapshots: `npm run e2e -- --update-snapshots`
3. Review diffs via Playwright HTML report (auto on failure or `npx playwright show-report`).
4. Commit updated PNGs (e.g., `feat(ui): adjust component spacing`).

Tune tolerance per assertion if needed:
```ts
await expect(page).toHaveScreenshot('home-chromium.png', { maxDiffPixelRatio: 0.01 });
```
By default any pixel delta fails to catch subtle regressions.

## Lighthouse CI

Config: `lighthouserc.json` with performance/accessibility thresholds.

Run locally (headless):
```
npm run lighthouse
```
CI workflow: `.github/workflows/lighthouse.yml` (warns but does not block merge unless you enforce).

Key thresholds:
- Performance >= 0.85 (error below)
- LCP <= 3000ms (error above)
- CLS <= 0.1

Tune thresholds as optimization progresses.

## Release & QA Tips

- Keep commits granular for clear changelog entries.
- Raise coverage thresholds gradually (track trend per release).
- Use analyzer before introducing large libraries.
- Visual regression already enforced; update baselines only with intentional UI changes.

## License

MIT (add a LICENSE file if distribution is intended).

---
Maintainer: @doctorAsif

> Note: Version v0.1.0 has been tagged as the initial pre-1.0 baseline. Subsequent conventional commits will drive automated semantic version bumps.
# Back-end-AI-Voice-call-centre
