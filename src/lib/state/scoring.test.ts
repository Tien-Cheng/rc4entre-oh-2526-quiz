import { describe, expect, it } from 'vitest';
import { combineScore, computeQuizScore } from './scoring';

describe('scoring', () => {
	it('computes quiz score using correctness and speed bonus', () => {
		const score = computeQuizScore({
			correctAnswers: 5,
			questionCount: 8,
			secondsRemainingTotal: 20
		});

		expect(score).toBe(68);
	});

	it('combines quiz and pitch scores for hybrid mode', () => {
		expect(combineScore({ quizScore: 68, pitchScore: 22 })).toBe(90);
	});
});
