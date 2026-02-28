import { describe, expect, it } from 'vitest';
import { createLeaderboardService } from './leaderboard';

describe('leaderboard service', () => {
	it('stores and sorts scores descending within mode', () => {
		const service = createLeaderboardService('rc4entre-leaderboard', { storage: null });
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
