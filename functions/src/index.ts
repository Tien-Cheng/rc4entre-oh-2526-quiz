import { initializeApp } from 'firebase-admin/app';
import { submitLeaderboardScore } from './submitLeaderboardScore.js';

initializeApp();

export { submitLeaderboardScore };
