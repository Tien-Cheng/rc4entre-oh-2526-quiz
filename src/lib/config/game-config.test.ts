import { describe, expect, it } from 'vitest';
import { defaultFlowConfig } from './game-defaults';
import { pitchPools } from './pitch-pools';
import { quizQuestions } from './quiz-questions';

describe('game config', () => {
	it('has at least 8 quiz questions', () => {
		expect(quizQuestions.length).toBeGreaterThanOrEqual(8);
	});

	it('ensures each quiz question has exactly 4 options', () => {
		quizQuestions.forEach((question) => {
			expect(question.options).toHaveLength(4);
		});
	});

	it('has non-empty pitch product and audience pools', () => {
		expect(pitchPools.products.length).toBeGreaterThan(0);
		expect(pitchPools.audiences.length).toBeGreaterThan(0);
	});

	it('uses a relaxed quiz timer for open-house players', () => {
		expect(defaultFlowConfig.secondsPerQuestion).toBe(20);
	});
});
