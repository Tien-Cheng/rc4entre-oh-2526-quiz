# RC4Entre Open House Quiz Game Implementation Plan

> **Execution note:** Implement this plan task-by-task with explicit review checkpoints between tasks.

**Goal:** Build a polished, laptop/tablet-first RC4Entre game app with host-only mode controls, independently runnable Quiz and Pitch modules, and static deployment to GitHub Pages.

**Architecture:** Use a single-route SvelteKit app with modular feature boundaries: `quiz`, `pitch`, `flow`, and `leaderboard`. Keep game content in editable config files, drive UI from a typed flow store, and compose modules based on host-selected mode/order (`quiz-only`, `pitch-only`, `hybrid`). Deploy as static files using `@sveltejs/adapter-static` with GitHub Pages base path and fallback page.

**Tech Stack:** SvelteKit (TypeScript), Tailwind CSS + DaisyUI, Vitest + Testing Library, GitHub Actions, GitHub Pages.

---

## Skills to apply during execution

- `@test-driven-development` for each behavior change.
- `@systematic-debugging` if any test or UI behavior fails unexpectedly.
- `@verification-before-completion` before claiming tasks complete.

---

### Task 1: Scaffold SvelteKit project baseline

**Files:**
- Create: project scaffolding via Svelte CLI (`src/*`, `package.json`, `svelte.config.js`, `vite.config.ts`, etc.)
- Modify: `README.md`

**Step 1: Create baseline app with required tooling**

Run: `npx sv create .`
Choose:
- Template: `minimal`
- Type checking: `TypeScript`
- Add-ons: `Vitest`, `ESLint`, `Prettier`
- Package manager: `npm`
Expected: SvelteKit scaffold files generated in current repo.

**Step 2: Install dependencies**

Run: `npm install`
Expected: `node_modules` installed with no fatal errors.

**Step 3: Verify fresh scaffold**

Run: `npm run test:unit`
Expected: test command exits successfully (default scaffold tests pass or no tests yet).

**Step 4: Verify app boots**

Run: `npm run dev -- --host`
Expected: app serves locally without runtime errors.

**Step 5: Commit**

```bash
git add .
git commit -m "chore: scaffold sveltekit baseline with testing and linting"
```

---

### Task 2: Configure static build and GitHub Pages compatibility

**Files:**
- Modify: `svelte.config.js`
- Create: `src/routes/+layout.ts`
- Modify: `package.json`
- Create: `src/lib/config/base-path.ts`
- Test: `src/lib/config/base-path.test.ts`

**Step 1: Write failing test for base path resolution helper**

```ts
import { describe, expect, it } from 'vitest';
import { resolveBasePath } from './base-path';

describe('resolveBasePath', () => {
  it('returns empty base in dev mode', () => {
    expect(resolveBasePath({ dev: true, repo: 'rc4entre-oh-2526-quiz' })).toBe('');
  });

  it('returns repo path in production mode', () => {
    expect(resolveBasePath({ dev: false, repo: 'rc4entre-oh-2526-quiz' })).toBe('/rc4entre-oh-2526-quiz');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:unit -- src/lib/config/base-path.test.ts`
Expected: FAIL because `resolveBasePath` does not exist yet.

**Step 3: Implement helper and wire config**

```ts
// src/lib/config/base-path.ts
export function resolveBasePath(input: { dev: boolean; repo: string }): string {
  return input.dev ? '' : `/${input.repo}`;
}
```

- In `svelte.config.js`: use `adapter-static` with `fallback: '404.html'` and set `kit.paths.base` for non-dev builds.
- In `src/routes/+layout.ts`: `export const prerender = true;`
- In `package.json`: add scripts `build`, `preview`, and optional `check` command if missing.

**Step 4: Run verification**

Run: `npm run test:unit -- src/lib/config/base-path.test.ts && npm run build`
Expected: test passes and static build succeeds.

**Step 5: Commit**

```bash
git add svelte.config.js src/routes/+layout.ts src/lib/config/base-path.ts src/lib/config/base-path.test.ts package.json
git commit -m "build: configure static adapter and github pages base path"
```

---

### Task 3: Install DaisyUI and establish branded theme foundation

**Files:**
- Modify: `vite.config.ts`
- Modify: `src/app.css`
- Create: `src/lib/styles/brand.css`
- Modify: `src/routes/+layout.svelte`
- Test: `src/lib/styles/brand-theme.test.ts`

**Step 1: Write failing test for brand token export**

```ts
import { describe, expect, it } from 'vitest';
import { BRAND_COLORS } from './brand-theme';

describe('BRAND_COLORS', () => {
  it('includes all approved logo-derived colors', () => {
    expect(BRAND_COLORS).toMatchObject({
      bg: '#04162B',
      teal: '#00A9A0',
      blue: '#0A7CCB',
      amber: '#F6BE2D',
      coral: '#F35A3A'
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test:unit -- src/lib/styles/brand-theme.test.ts`
Expected: FAIL because `brand-theme` module does not exist yet.

**Step 3: Install and configure Tailwind + DaisyUI**

Run: `npm install tailwindcss@latest @tailwindcss/vite@latest daisyui@latest`

Implement:
- `vite.config.ts`: add Tailwind Vite plugin.
- `src/app.css`: include:

```css
@import 'tailwindcss';
@plugin 'daisyui';
```

- Add branded CSS variables/classes in `brand.css` and import via `app.css`.
- In `+layout.svelte`, set top-level container with dark stage theme class.

**Step 4: Run verification**

Run: `npm run test:unit -- src/lib/styles/brand-theme.test.ts && npm run check`
Expected: brand token test passes and type/lint checks pass.

**Step 5: Commit**

```bash
git add vite.config.ts src/app.css src/lib/styles/brand.css src/lib/styles/brand-theme.ts src/lib/styles/brand-theme.test.ts src/routes/+layout.svelte package.json
git commit -m "feat: add daisyui and rc4entre branded theme foundation"
```

---

### Task 4: Define game domain models and editable content config

**Files:**
- Create: `src/lib/types/game.ts`
- Create: `src/lib/config/quiz-questions.ts`
- Create: `src/lib/config/pitch-pools.ts`
- Create: `src/lib/config/game-defaults.ts`
- Test: `src/lib/config/game-config.test.ts`

**Step 1: Write failing tests for config validity**

```ts
import { describe, expect, it } from 'vitest';
import { quizQuestions } from './quiz-questions';
import { pitchPools } from './pitch-pools';

describe('game config', () => {
  it('has at least 8 quiz questions', () => {
    expect(quizQuestions.length).toBeGreaterThanOrEqual(8);
  });

  it('ensures each quiz question has exactly 4 options', () => {
    quizQuestions.forEach((q) => expect(q.options).toHaveLength(4));
  });

  it('has non-empty pitch product and audience pools', () => {
    expect(pitchPools.products.length).toBeGreaterThan(0);
    expect(pitchPools.audiences.length).toBeGreaterThan(0);
  });
});
```

**Step 2: Run test to verify failure**

Run: `npm run test:unit -- src/lib/config/game-config.test.ts`
Expected: FAIL due to missing config modules.

**Step 3: Implement typed config files**

- Add TypeScript interfaces/types for questions, pitch prompts, flow mode/order.
- Populate initial entrepreneurship questions from proposal doc.
- Add pitch pool values (products + target audiences) for random generation.

**Step 4: Run verification**

Run: `npm run test:unit -- src/lib/config/game-config.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/types/game.ts src/lib/config/quiz-questions.ts src/lib/config/pitch-pools.ts src/lib/config/game-defaults.ts src/lib/config/game-config.test.ts
git commit -m "feat: add typed game config for quiz and pitch modules"
```

---

### Task 5: Build flow/state engine for mode-based composition

**Files:**
- Create: `src/lib/state/game-flow.ts`
- Create: `src/lib/state/scoring.ts`
- Test: `src/lib/state/game-flow.test.ts`
- Test: `src/lib/state/scoring.test.ts`

**Step 1: Write failing tests for state transitions**

```ts
import { describe, expect, it } from 'vitest';
import { createGameFlow } from './game-flow';

describe('game flow transitions', () => {
  it('supports quiz-only path', () => {
    const flow = createGameFlow({ mode: 'quiz-only' });
    flow.start();
    flow.completeModule('quiz', { score: 80 });
    expect(flow.currentPhase()).toBe('results');
  });

  it('supports hybrid pitch-first path', () => {
    const flow = createGameFlow({ mode: 'hybrid', order: 'pitch-first' });
    flow.start();
    expect(flow.currentPhase()).toBe('pitch');
  });
});
```

**Step 2: Run tests to verify failure**

Run: `npm run test:unit -- src/lib/state/game-flow.test.ts src/lib/state/scoring.test.ts`
Expected: FAIL because flow/scoring modules are not implemented.

**Step 3: Implement minimal flow + scoring logic**

- `createGameFlow` with explicit phase transitions.
- Scoring helpers for quiz speed bonus, pitch bonus, and combined score.

**Step 4: Run verification**

Run: `npm run test:unit -- src/lib/state/game-flow.test.ts src/lib/state/scoring.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/state/game-flow.ts src/lib/state/scoring.ts src/lib/state/game-flow.test.ts src/lib/state/scoring.test.ts
git commit -m "feat: implement mode-aware game flow and scoring engine"
```

---

### Task 6: Implement leaderboard persistence service

**Files:**
- Create: `src/lib/services/leaderboard.ts`
- Test: `src/lib/services/leaderboard.test.ts`

**Step 1: Write failing tests for storage behavior**

```ts
import { describe, expect, it } from 'vitest';
import { createLeaderboardService } from './leaderboard';

describe('leaderboard service', () => {
  it('stores and sorts scores descending within mode', () => {
    const service = createLeaderboardService('rc4entre-leaderboard');
    service.add({ name: 'A', mode: 'quiz-only', score: 70, timestamp: 1 });
    service.add({ name: 'B', mode: 'quiz-only', score: 90, timestamp: 2 });
    expect(service.list('quiz-only')[0].name).toBe('B');
  });

  it('falls back to in-memory storage when localStorage is unavailable', () => {
    const service = createLeaderboardService('rc4entre-leaderboard', { storage: null });
    service.add({ name: 'C', mode: 'pitch-only', score: 50, timestamp: 3 });
    expect(service.list('pitch-only')).toHaveLength(1);
  });
});
```

**Step 2: Run test to verify failure**

Run: `npm run test:unit -- src/lib/services/leaderboard.test.ts`
Expected: FAIL because service does not exist.

**Step 3: Implement leaderboard service**

- Storage adapter with safe parse/stringify.
- Mode filtering and max-entry truncation.
- Reset/clear API for host controls.

**Step 4: Run verification**

Run: `npm run test:unit -- src/lib/services/leaderboard.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/services/leaderboard.ts src/lib/services/leaderboard.test.ts
git commit -m "feat: add resilient leaderboard persistence service"
```

---

### Task 7: Build host-only launcher and control panel

**Files:**
- Create: `src/lib/components/host/HostLauncher.svelte`
- Create: `src/lib/components/host/HostPanel.svelte`
- Create: `src/lib/components/host/HostToggle.svelte`
- Test: `src/lib/components/host/HostLauncher.test.ts`
- Test: `src/lib/components/host/HostPanel.test.ts`

**Step 1: Write failing component tests**

```ts
import { render, screen } from '@testing-library/svelte';
import HostLauncher from './HostLauncher.svelte';

test('shows host-only mode options', () => {
  render(HostLauncher);
  expect(screen.getByRole('button', { name: /hybrid/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /quiz only/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /pitch only/i })).toBeInTheDocument();
});
```

**Step 2: Run tests to verify failure**

Run: `npm run test:unit -- src/lib/components/host/HostLauncher.test.ts src/lib/components/host/HostPanel.test.ts`
Expected: FAIL because components are missing.

**Step 3: Implement host controls**

- Large mode/order buttons.
- Hidden panel trigger (`H` key and corner button fallback).
- Controls for reset, leaderboard clear, sound toggle, pitch bonus.

**Step 4: Run verification**

Run: `npm run test:unit -- src/lib/components/host/HostLauncher.test.ts src/lib/components/host/HostPanel.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/components/host/HostLauncher.svelte src/lib/components/host/HostPanel.svelte src/lib/components/host/HostToggle.svelte src/lib/components/host/HostLauncher.test.ts src/lib/components/host/HostPanel.test.ts
git commit -m "feat: add host-only launcher and control panel"
```

---

### Task 8: Implement quiz module UI and behavior

**Files:**
- Create: `src/lib/modules/quiz/QuizRunner.svelte`
- Create: `src/lib/modules/quiz/quiz-session.ts`
- Create: `src/lib/modules/quiz/QuestionCard.svelte`
- Test: `src/lib/modules/quiz/quiz-session.test.ts`
- Test: `src/lib/modules/quiz/QuizRunner.test.ts`

**Step 1: Write failing tests for quiz session logic**

```ts
import { describe, expect, it } from 'vitest';
import { createQuizSession } from './quiz-session';

describe('quiz session', () => {
  it('advances to next question and accumulates score', () => {
    const session = createQuizSession({ questionLimit: 2, secondsPerQuestion: 10 });
    session.answerCurrent(0, 8);
    session.answerCurrent(1, 6);
    expect(session.isComplete()).toBe(true);
    expect(session.result().score).toBeGreaterThan(0);
  });
});
```

**Step 2: Run tests to verify failure**

Run: `npm run test:unit -- src/lib/modules/quiz/quiz-session.test.ts src/lib/modules/quiz/QuizRunner.test.ts`
Expected: FAIL due to missing quiz modules.

**Step 3: Implement minimal quiz module**

- Question rendering with 4 large answer buttons.
- Countdown/progress bar.
- Immediate correctness feedback + short explanation.
- Emit standardized completion payload to flow engine.

**Step 4: Run verification**

Run: `npm run test:unit -- src/lib/modules/quiz/quiz-session.test.ts src/lib/modules/quiz/QuizRunner.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/modules/quiz/QuizRunner.svelte src/lib/modules/quiz/quiz-session.ts src/lib/modules/quiz/QuestionCard.svelte src/lib/modules/quiz/quiz-session.test.ts src/lib/modules/quiz/QuizRunner.test.ts
git commit -m "feat: implement quiz module with timer and feedback"
```

---

### Task 9: Implement pitch challenge module UI and behavior

**Files:**
- Create: `src/lib/modules/pitch/PitchRunner.svelte`
- Create: `src/lib/modules/pitch/spin.ts`
- Create: `src/lib/modules/pitch/PitchWheel.svelte`
- Test: `src/lib/modules/pitch/spin.test.ts`
- Test: `src/lib/modules/pitch/PitchRunner.test.ts`

**Step 1: Write failing tests for random prompt selection**

```ts
import { describe, expect, it } from 'vitest';
import { selectPitchPrompt } from './spin';

describe('selectPitchPrompt', () => {
  it('returns one product and one audience from pools', () => {
    const result = selectPitchPrompt({ products: ['A'], audiences: ['B'] }, () => 0);
    expect(result).toEqual({ product: 'A', audience: 'B' });
  });
});
```

**Step 2: Run tests to verify failure**

Run: `npm run test:unit -- src/lib/modules/pitch/spin.test.ts src/lib/modules/pitch/PitchRunner.test.ts`
Expected: FAIL because pitch modules are missing.

**Step 3: Implement pitch module**

- Wheel/card spin reveal for product + audience.
- 30-second prep countdown with visible urgency states.
- Host bonus input integration.
- Emit completion payload to flow engine.

**Step 4: Run verification**

Run: `npm run test:unit -- src/lib/modules/pitch/spin.test.ts src/lib/modules/pitch/PitchRunner.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/modules/pitch/PitchRunner.svelte src/lib/modules/pitch/PitchWheel.svelte src/lib/modules/pitch/spin.ts src/lib/modules/pitch/spin.test.ts src/lib/modules/pitch/PitchRunner.test.ts
git commit -m "feat: implement pitch challenge module with spin and prep timer"
```

---

### Task 10: Implement attract and results experiences

**Files:**
- Create: `src/lib/components/screens/AttractScreen.svelte`
- Create: `src/lib/components/screens/ResultsScreen.svelte`
- Create: `src/lib/components/leaderboard/LeaderboardCard.svelte`
- Test: `src/lib/components/screens/AttractScreen.test.ts`
- Test: `src/lib/components/screens/ResultsScreen.test.ts`

**Step 1: Write failing component tests**

```ts
import { render, screen } from '@testing-library/svelte';
import AttractScreen from './AttractScreen.svelte';

test('shows main CTA for booth visitors', () => {
  render(AttractScreen);
  expect(screen.getByText(/play in 2 minutes/i)).toBeInTheDocument();
});
```

**Step 2: Run tests to verify failure**

Run: `npm run test:unit -- src/lib/components/screens/AttractScreen.test.ts src/lib/components/screens/ResultsScreen.test.ts`
Expected: FAIL because screen components are missing.

**Step 3: Implement screen components**

- Attract screen with logo, CTA, rotating startup facts, and leaderboard preview.
- Results screen with mode-aware breakdown, rank badges, and join CTA block.

**Step 4: Run verification**

Run: `npm run test:unit -- src/lib/components/screens/AttractScreen.test.ts src/lib/components/screens/ResultsScreen.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/components/screens/AttractScreen.svelte src/lib/components/screens/ResultsScreen.svelte src/lib/components/leaderboard/LeaderboardCard.svelte src/lib/components/screens/AttractScreen.test.ts src/lib/components/screens/ResultsScreen.test.ts
git commit -m "feat: add attract and results screens with branding and mode-aware scoring"
```

---

### Task 11: Compose full app shell and keyboard/touch interactions

**Files:**
- Modify: `src/routes/+page.svelte`
- Create: `src/lib/components/game/GameShell.svelte`
- Test: `src/routes/page-flow.test.ts`

**Step 1: Write failing integration test for mode flow**

```ts
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

test('host can choose pitch-only and reach pitch module', async () => {
  render(Page);
  // simulate opening host launcher and selecting pitch-only
  expect(await screen.findByText(/pitch challenge/i)).toBeInTheDocument();
});
```

**Step 2: Run test to verify failure**

Run: `npm run test:unit -- src/routes/page-flow.test.ts`
Expected: FAIL because app shell is not fully wired.

**Step 3: Implement orchestration layer**

- Compose attract, host launcher, quiz/pitch modules, and results.
- Honor host-only mode picker and hybrid order selection.
- Add keyboard shortcut handling (`H`) without exposing controls to players.

**Step 4: Run verification**

Run: `npm run test:unit -- src/routes/page-flow.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/routes/+page.svelte src/lib/components/game/GameShell.svelte src/routes/page-flow.test.ts
git commit -m "feat: wire complete game shell with host-only mode orchestration"
```

---

### Task 12: Add accessibility and responsive refinements

**Files:**
- Modify: `src/lib/components/**/*.svelte`
- Test: `src/lib/components/accessibility.test.ts`

**Step 1: Write failing accessibility test**

```ts
import { render, screen } from '@testing-library/svelte';
import Page from '../../routes/+page.svelte';

test('interactive controls are keyboard reachable with accessible names', () => {
  render(Page);
  expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
});
```

**Step 2: Run test to verify failure**

Run: `npm run test:unit -- src/lib/components/accessibility.test.ts`
Expected: FAIL until labels/roles are finalized.

**Step 3: Implement refinements**

- Ensure touch target sizing (>=44px).
- Add ARIA labels and visible focus styles.
- Tune typography and spacing for tablet/laptop breakpoints.

**Step 4: Run verification**

Run: `npm run test:unit -- src/lib/components/accessibility.test.ts && npm run check`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/components src/lib/modules src/routes/+page.svelte
git commit -m "fix: improve accessibility and responsive ergonomics"
```

---

### Task 13: CI/CD pipeline for GitHub Pages

**Files:**
- Create: `.github/workflows/deploy-pages.yml`
- Modify: `README.md`

**Step 1: Write failing CI dry-run expectation (local check)**

Run: `npm run lint && npm run test:unit && npm run build`
Expected: if any command fails, capture failure and fix before pipeline creation.

**Step 2: Add Pages workflow**

Create workflow with jobs:
- checkout
- setup-node
- npm ci
- lint/test/build
- upload-pages-artifact (from `build/`)
- deploy-pages

Expected permissions:
- `contents: read`
- `pages: write`
- `id-token: write`

**Step 3: Verify workflow syntax**

Run: `npm run build`
Expected: build still succeeds with static output.

**Step 4: Update README deployment section**

Document:
- repo settings required (`Pages` source: GitHub Actions)
- base path behavior
- how to trigger deploy

**Step 5: Commit**

```bash
git add .github/workflows/deploy-pages.yml README.md
git commit -m "ci: add github pages deployment workflow"
```

---

### Task 14: Final verification and release readiness

**Files:**
- Modify: `README.md`
- Create: `docs/qa/open-house-checklist.md`

**Step 1: Run full verification suite**

Run:
- `npm run lint`
- `npm run test:unit`
- `npm run build`

Expected: all commands exit successfully.

**Step 2: Perform manual runbook checks**

Run: `npm run dev -- --host`
Manual checks:
- Host-only mode picker hidden from normal player flow.
- Quiz-only and Pitch-only each run independently.
- Hybrid supports both `quiz -> pitch` and `pitch -> quiz`.
- Leaderboard reset works.
- Keyboard `H` toggles host panel.
- Tablet layout remains readable and touch-friendly.

**Step 3: Document event-day operation notes**

Add `docs/qa/open-house-checklist.md` with setup, reset procedure, and contingency steps.

**Step 4: Commit**

```bash
git add README.md docs/qa/open-house-checklist.md
git commit -m "docs: add final verification and open house runbook"
```

**Step 5: Prepare for review**

Run: `git log --oneline -n 20`
Expected: clear incremental history aligned with tasks above.

---

## Notes for the implementing engineer

- Keep module contracts stable: each module must emit standardized completion payloads.
- Prefer deterministic unit tests for random behavior by injecting RNG functions.
- Do not block gameplay on optional features (e.g., localStorage fallback should degrade gracefully).
- Maintain the approved dark stage visual direction and logo-derived palette across all screens.
