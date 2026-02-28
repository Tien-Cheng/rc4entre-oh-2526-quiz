import { describe, expect, it } from 'vitest';
import { combineScore, computeQuizScore, computeSpeedBonus, effectiveRankScore, rankLabelFromScore } from './scoring';

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

	it('shares speed bonus helper across score calculations', () => {
		expect(computeSpeedBonus(20)).toBe(18);
		expect(computeSpeedBonus(999)).toBe(20);
	});

	it('normalizes hybrid rank score to 0-100 style scale', () => {
		expect(effectiveRankScore({ mode: 'hybrid', finalScore: 170, quizScore: 80, pitchScore: 90 })).toBe(85);
	});

	it('maps rank labels from effective score thresholds', () => {
		expect(rankLabelFromScore(98)).toBe('VC Charmer');
		expect(rankLabelFromScore(78)).toBe('Market Hunter');
		expect(rankLabelFromScore(60)).toBe('Idea Spark');
		expect(rankLabelFromScore(30)).toBe('First-Time Founder');
	});
});
