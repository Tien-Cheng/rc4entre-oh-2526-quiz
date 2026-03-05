# RC4Entre Open House 2026 Quiz Game

Interactive laptop/tablet-first game for RC4 Entrepreneurship Open House.

## Stack

- SvelteKit
- Tailwind CSS + DaisyUI
- Static deployment on GitHub Pages (GitHub Actions)

## Features

- Hybrid gameplay with host-only control of:
  - `Hybrid` (Quiz + Pitch)
  - `Quiz Only`
  - `Pitch Only`
  - Hybrid order (`Quiz -> Pitch` or `Pitch -> Quiz`)
- Quiz module with timer and instant explanations
- Pitch challenge module with randomized product + audience
- Local device leaderboard (persisted in browser storage)
- Branded UI using RC4Entre logo palette

## Local development

```bash
npm install
npm run dev -- --open
```

## Quality checks

```bash
npm run lint
npm run test:unit
npm run build
```

## Host controls

- Press `H` to open/close the host panel.
- From host panel:
  - Set mode and order
  - Adjust pitch bonus
  - Start next player
  - Reset current round
  - Clear leaderboard

## Deploy to GitHub Pages

1. Push to `main`.
2. In GitHub repo settings, set Pages source to `GitHub Actions`.
3. Workflow `Deploy to GitHub Pages` will build and deploy the `build/` output.

## Notes

- `paths.base` is configured for project pages repositories (e.g. `/<repo-name>`).
- `404.html` fallback is generated for static hosting compatibility.
