import { describe, expect, it } from 'vitest';
import { createQuizSession } from './quiz-session';

describe('quiz session', () => {
	it('advances and computes score at completion', () => {
		const session = createQuizSession({ questionLimit: 2, secondsPerQuestion: 10 });
		session.answerCurrent(0, 8);
		session.answerCurrent(0, 6);
		expect(session.isComplete()).toBe(true);
		const result = session.result();
		expect(result.questionCount).toBe(2);
		expect(result.score).toBeGreaterThan(0);
	});
});
