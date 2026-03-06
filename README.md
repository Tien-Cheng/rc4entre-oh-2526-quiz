# RC4Entre Open House 2026 Quiz Game

Interactive laptop/tablet-first game for RC4 Entrepreneurship Open House.

## Stack

- SvelteKit
- Tailwind CSS + DaisyUI
- Firebase Hosting + Firestore + Cloud Functions

## Features

- Hybrid gameplay with host-only control of:
  - `Hybrid` (Quiz + Pitch)
  - `Quiz Only`
  - `Pitch Only`
  - Hybrid order (`Quiz -> Pitch` or `Pitch -> Quiz`)
- Quiz module with timer and instant explanations
- Pitch challenge module with randomized product + audience
- Shared live leaderboard via Firestore (with automatic local fallback)
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

Cloud function checks:

```bash
npm run functions:test
npm run functions:build
```

## Host controls

- Press `H` to open/close the host panel.
- From host panel:
  - Set mode and order
  - Adjust pitch bonus
  - Start next player
  - Reset current round
  - Clear leaderboard

## Deploy to Firebase

1. Build frontend:
   - `npm run build`
2. Deploy Firestore rules/indexes and Cloud Functions:
   - `firebase deploy --only firestore:rules,firestore:indexes`
   - `firebase deploy --only functions`
3. Deploy Hosting:
   - `firebase deploy --only hosting`

## CI/CD (GitHub Actions)

- Workflow: `.github/workflows/deploy-firebase.yml`
- Trigger: push to `main` (and manual dispatch)
- It runs lint/tests/build, then deploys Firestore rules/indexes, Cloud Functions, and Hosting.
- Required GitHub secret:
  - `FIREBASE_SERVICE_ACCOUNT_RC4ENTRE_2026_OPENHOUSE` (JSON key for a Google Cloud service account)
- PR preview workflow: `.github/workflows/firebase-hosting-pull-request.yml` (deploys preview channels via Firebase CLI).
- Emergency fallback workflow: `.github/workflows/deploy-pages-fallback.yml` (manual `workflow_dispatch` only).

## Firebase setup

- Project: `rc4entre-2026-openhouse`
- Web config is committed in [src/lib/config/firebase.ts](/Users/tiencheng/Projects/Work/rc4entre-oh-2526-quiz/src/lib/config/firebase.ts).
- Firestore writes are blocked from clients in [firestore.rules](/Users/tiencheng/Projects/Work/rc4entre-oh-2526-quiz/firestore.rules); score writes go through callable function `submitLeaderboardScore`.
- App Check is enabled for callable score submission:
  - client initializes App Check with `ReCaptchaEnterpriseProvider`
  - Cloud Function `submitLeaderboardScore` enforces App Check (`enforceAppCheck: true`)

## Event-day runbook

- Status chip shows `Cloud`: realtime shared board is healthy.
- Status chip shows `Local fallback`: device is saving and reading scores locally only.
- If `Local fallback` appears unexpectedly:
  1. Continue event flow (gameplay is unaffected).
  2. Check internet/Firebase status.
  3. Keep running; leaderboard continues locally until cloud sync is healthy again.
