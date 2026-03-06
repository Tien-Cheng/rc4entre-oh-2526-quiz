import { describe, expect, it } from 'vitest';
import { createLeaderboardService } from './leaderboard';

describe('leaderboard service', () => {
	it('stores and sorts scores descending within mode', () => {
		const service = createLeaderboardService('rc4entre-leaderboard', { storage: null });
		service.add({ name: 'A', mode: 'quiz-only', score: 70, timestamp: 1 });
		service.add({ name: 'B', mode: 'quiz-only', score: 90, timestamp: 2 });
		expect(service.list('quiz-only')[0].name).toBe('B');
	});

	it('uses timestamp as tie-breaker for equal scores', () => {
		const service = createLeaderboardService('rc4entre-leaderboard', { storage: null });
		service.add({ name: 'Older', mode: 'hybrid', score: 88, timestamp: 1 });
		service.add({ name: 'Newer', mode: 'hybrid', score: 88, timestamp: 2 });
		expect(service.list('hybrid').map((entry) => entry.name)).toEqual(['Newer', 'Older']);
	});

	it('falls back to in-memory storage when localStorage is unavailable', () => {
		const service = createLeaderboardService('rc4entre-leaderboard', { storage: null });
		service.add({ name: 'C', mode: 'quiz-only', score: 50, timestamp: 3 });
		expect(service.list('quiz-only')).toHaveLength(1);
	});
});
