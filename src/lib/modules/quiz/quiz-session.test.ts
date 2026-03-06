import { afterEach, describe, expect, it, vi } from 'vitest';
import { createQuizSession } from './quiz-session';
import type { QuizQuestion } from '$lib/types/game';

describe('quiz session', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('advances and computes score at completion', () => {
		const session = createQuizSession({ questionLimit: 2, secondsPerQuestion: 10 });
		session.answerCurrent(0, 8);
		session.answerCurrent(0, 6);
		expect(session.isComplete()).toBe(true);
		const result = session.result();
		expect(result.questionCount).toBe(2);
		expect(result.score).toBeGreaterThan(0);
	});

	it('shuffles options but keeps the same answers and correct mapping', () => {
		vi.spyOn(Math, 'random').mockReturnValue(0);
		const questions: QuizQuestion[] = [
			{
				id: 'q1',
				prompt: 'Pick the founder tool',
				options: ['Correct', 'Second', 'Third', 'Fourth'],
				answerIndex: 0,
				explanation: 'Because it is the correct option.',
				category: 'startup'
			}
		];

		const session = createQuizSession({ questionLimit: 1, secondsPerQuestion: 10, questions });
		const current = session.currentQuestion();

		expect(current?.options).toEqual(['Second', 'Third', 'Fourth', 'Correct']);
		expect([...((current?.options ?? []).slice().sort())]).toEqual(['Correct', 'Fourth', 'Second', 'Third']);
		expect(current?.answerIndex).toBe(3);
	});

	it('can produce different option orders across sessions', () => {
		const questions: QuizQuestion[] = [
			{
				id: 'q1',
				prompt: 'Pick the founder tool',
				options: ['Correct', 'Second', 'Third', 'Fourth'],
				answerIndex: 0,
				explanation: 'Because it is the correct option.',
				category: 'startup'
			}
		];

		vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValue(0.99);
		const first = createQuizSession({ questionLimit: 1, secondsPerQuestion: 10, questions })
			.currentQuestion()
			?.options.join('|');

		vi.restoreAllMocks();
		vi.spyOn(Math, 'random').mockReturnValue(0.99);
		const second = createQuizSession({ questionLimit: 1, secondsPerQuestion: 10, questions })
			.currentQuestion()
			?.options.join('|');

		expect(first).not.toBe(second);
	});
});
