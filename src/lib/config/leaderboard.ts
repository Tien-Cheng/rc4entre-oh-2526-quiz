export const leaderboardDefaults = {
	storageKey: 'rc4entre-leaderboard-v1',
	maxEntries: 20,
	attractEntries: 5,
	minScore: 0,
	maxScore: 220
} as const;

export const leaderboardModes = ['hybrid', 'quiz-only', 'pitch-only'] as const;
