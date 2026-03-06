import { describe, expect, it } from 'vitest';
import { computeQuizScore, computeSpeedBonus, rankLabelFromScore } from './scoring';

describe('scoring', () => {
	it('computes quiz score using correctness and speed bonus', () => {
		const score = computeQuizScore({
			correctAnswers: 5,
			questionCount: 8,
			secondsRemainingTotal: 20
		});

		expect(score).toBe(68);
	});

	it('shares speed bonus helper across score calculations', () => {
		expect(computeSpeedBonus(20)).toBe(18);
		expect(computeSpeedBonus(999)).toBe(20);
	});

	it('maps rank labels from effective score thresholds', () => {
		expect(rankLabelFromScore(98)).toBe('VC Charmer');
		expect(rankLabelFromScore(78)).toBe('Market Hunter');
		expect(rankLabelFromScore(60)).toBe('Idea Spark');
		expect(rankLabelFromScore(30)).toBe('First-Time Founder');
	});
});
