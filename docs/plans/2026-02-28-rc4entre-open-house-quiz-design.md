# RC4Entre Open House 2026 Interactive Quiz Game Design

Date: 2026-02-28
Project: RC4Entre Open House 2026 booth game
Status: Approved for implementation planning

## 1) Goals and Success Criteria

### Primary goals
- Attract RC4 Open House visitors with a fast, high-energy entrepreneurship game.
- Teach startup concepts in a low-stakes, memorable way.
- Create booth moments that naturally lead into conversations about RC4Entre.

### Success criteria
- A full round can be completed in about 2-3 minutes.
- Volunteers can reset and start a new player in under 5 seconds.
- The game runs smoothly on laptop and tablet with touch-first controls.
- Staff can run quiz only, pitch only, or hybrid flow without code changes.

## 2) Audience and Context

- Audience: prospective RC4 residents and open house visitors.
- Venue constraints: booth environment, moderate noise, periodic crowds.
- Devices: laptop/tablet first; projector optional.
- Network assumptions: should work without internet once loaded.

## 3) Product Scope

### Included in MVP
- Attract screen with strong CTA and branding.
- Quiz module (6-8 startup questions per session).
- Pitch challenge module (random product + random audience prompt).
- Hybrid mode combining quiz and pitch.
- Host-only launcher and control panel.
- Local leaderboard and mode-aware score summary.
- Responsive UI for tablet landscape and laptop.

### Excluded from MVP
- User accounts and backend storage.
- Real-time multiplayer across devices.
- External analytics platform.
- Complex CMS/editor for question management.

## 4) Game Modes and Flow

### Mode options (host-only)
- Hybrid: Quiz + Pitch.
- Quiz Only.
- Pitch Only.

### Hybrid order options (host-only)
- Quiz -> Pitch (default).
- Pitch -> Quiz.

### Flow model
1. Attract Screen
2. Host Launcher (hidden/host-access)
3. Player Intro
4. Module A
5. Module B (if hybrid)
6. Results + Join CTA
7. Reset for next player

## 5) UX Design

### Attract Screen
- Full-screen, high-contrast visual anchored to RC4Entre branding.
- Main message: "Play in 2 minutes".
- Secondary content: rotating startup facts and live leaderboard highlights.
- Touch anywhere / start button for quick handoff.

### Player Intro
- Optional nickname input and one-line rules.
- Single primary CTA to begin.

### Quiz Module
- One question at a time with large option buttons.
- Visible countdown/progress bar.
- Immediate feedback: correct/incorrect state and short explanation.
- Score based on correctness and speed (lightweight formula).

### Pitch Module
- Animated spin interaction for random product + target audience.
- 30-second prep timer.
- Host awards bonus from host panel after pitch delivery.

### Results Screen
- Mode-aware result card:
  - Quiz-only: quiz score.
  - Pitch-only: pitch score.
  - Hybrid: combined score with module breakdown.
- Rank badge (e.g., Idea Spark / Market Hunter / VC Charmer).
- Join RC4Entre CTA with QR area/placeholder.

### Host Panel (host-only)
- Access via keyboard shortcut (e.g., H) or hidden corner gesture.
- Controls:
  - Select mode and order.
  - Start next player.
  - Adjust pitch bonus.
  - Clear/reset leaderboard.
  - Toggle sound cues.

## 6) Visual Design System

### Aesthetic direction
- Theme: "Startup Carnival Control Room".
- Tone: energetic, event-like, polished, and distinctive.
- Priority: avoid generic dashboard patterns.

### Branding integration from logo
Source: `assets/rc4-entre-logo.png`
- Deep navy background: `#04162B`
- Primary teal: `#00A9A0`
- Secondary blue: `#0A7CCB`
- Highlight amber: `#F6BE2D`
- Hot accent coral: `#F35A3A`

### UI usage
- Dark stage-style theme across all screens.
- High-contrast cards/buttons sized for tablet touch.
- Amber/coral used for urgency moments (timer, spin highlights).
- RC4Entre logo on attract, results, and host panel headers.

### Typography and motion
- Distinctive display font + clean body font (avoid default generic stacks).
- Focused motion: page-load reveal, decisive button feedback, spin animation.
- Keep animations purposeful and short to protect flow speed.

## 7) Technical Architecture

### Stack
- SvelteKit.
- Tailwind CSS + DaisyUI.
- Static deployment via GitHub Pages.

### Application structure (proposed)
- `src/lib/components/game/` for reusable UI components.
- `src/lib/modules/quiz/` and `src/lib/modules/pitch/` for independent game logic.
- `src/lib/config/` for editable question and pitch prompt data.
- `src/lib/state/` for game flow state and scoring.
- `src/routes/+page.svelte` as shell and route entry.

### Data model
- `quizQuestions`: array of `{ id, prompt, options, answerIndex, explanation, category }`.
- `pitchPools`: `{ products: string[], audiences: string[] }`.
- `flowConfig`: `{ mode, order, timers, scoringWeights }`.
- `leaderboardEntry`: `{ name, score, mode, timestamp, breakdown }`.

### State flow
- Single app-level store controls current phase and mode.
- Each module exposes start/complete events and standardized score payloads.
- Results composer merges payloads per mode into final score view.

## 8) Reliability and Error Handling

- Validate config data at app startup; fail gracefully to host panel fallback.
- If localStorage unavailable, run leaderboard in memory with warning banner.
- Add safe defaults for timers/mode if host config becomes invalid.
- Debounce reset/start actions to avoid accidental double-trigger.

## 9) Accessibility and Usability

- Keyboard navigation supported for all host controls.
- Minimum 44px touch targets for tablet use.
- Sufficient text contrast against dark background.
- Clear timer color transitions without relying on color alone.

## 10) Testing and Verification Strategy

- Unit tests for scoring logic and flow transitions.
- Component tests for quiz and pitch module interactions.
- Manual QA checklist for tablet/laptop resolutions and host-only controls.
- Build/deploy checks via GitHub Actions on push to main.

## 11) CI/CD and Deployment (GitHub Pages)

- Use `@sveltejs/adapter-static`.
- Configure base path for repository deployment.
- Generate SPA fallback (`404.html`) for direct route access.
- GitHub Actions workflow:
  - install deps
  - run tests/lint/build
  - upload Pages artifact
  - deploy to GitHub Pages

## 12) Open House Operations Notes

- Keep one volunteer in host panel while one engages visitors.
- Default to Hybrid (Quiz -> Pitch), switch to single mode during heavy queue periods.
- Use pitch-only mode as high-energy crowd warmer when needed.

## 13) Approved Decisions Log

- Hybrid mode supported.
- Device priority: laptop/tablet first.
- Dark stage-style theme retained across all screens.
- Logo-based palette integrated.
- Mode picker is host-only.
- Quiz and pitch must run independently and composably.

