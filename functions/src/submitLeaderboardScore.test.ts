import { describe, expect, it } from 'vitest';
import { leaderboardValidation } from './submitLeaderboardScore.js';

describe('submitLeaderboardScore validation', () => {
	it('rejects invalid mode', () => {
		expect(() =>
			leaderboardValidation.validatePayload({
				mode: 'invalid',
				score: 10
			})
		).toThrowError(/Invalid mode/i);
	});

	it('rejects score out of range', () => {
		expect(() =>
			leaderboardValidation.validatePayload({
				mode: 'hybrid',
				score: 999
			})
		).toThrowError(/out of allowed range/i);
	});

	it('accepts valid payload and sanitizes name', () => {
		expect(() =>
			leaderboardValidation.validatePayload({
				mode: 'quiz-only',
				score: 100
			})
		).not.toThrow();
		expect(leaderboardValidation.sanitizeName('   Alice     Tan   ')).toBe('Alice Tan');
	});

	it('clips oversized names', () => {
		const longName = 'abcdefghijklmnopqrstuvwxyz1234567890';
		expect(leaderboardValidation.sanitizeName(longName)).toHaveLength(24);
	});
});
