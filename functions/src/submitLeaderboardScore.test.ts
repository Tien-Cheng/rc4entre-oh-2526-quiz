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
				score: 101
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

	it('sanitizes breakdown to expected shape and bounds', () => {
		const sanitized = leaderboardValidation.sanitizeBreakdown({
			quiz: {
				correctCount: 8,
				questionCount: 10,
				score: 90,
				speedBonus: 12,
				extra: 'ignore'
			},
			nope: { nested: true }
		});

		expect(sanitized).toEqual({
			quiz: {
				correctCount: 8,
				questionCount: 10,
				score: 90,
				speedBonus: 12
			}
		});
	});

	it('drops invalid breakdown payloads', () => {
		const sanitized = leaderboardValidation.sanitizeBreakdown({
			quiz: { correctCount: 1, questionCount: 'x', score: 999, speedBonus: 2 }
		});
		expect(sanitized).toBeNull();
	});

	it('rejects pitch-only mode', () => {
		expect(() =>
			leaderboardValidation.validatePayload({
				mode: 'pitch-only',
				score: 10
			})
		).toThrowError(/Invalid mode/i);
	});
});
