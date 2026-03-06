import { fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import QuizRunner from './QuizRunner.svelte';

describe('QuizRunner', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.spyOn(Math, 'random').mockReturnValue(0);
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it('waits for the configured feedback delay before moving to the next question', async () => {
		render(QuizRunner, {
			questionLimit: 2,
			secondsPerQuestion: 12,
			answerFeedbackMs: 1500,
			onComplete: vi.fn()
		});

		expect(screen.getByText(/Quiz · Question 1 \/ 2/i)).toBeInTheDocument();

		const optionButtons = screen.getAllByRole('button');
		await fireEvent.click(optionButtons[0]);
		await vi.advanceTimersByTimeAsync(1499);

		expect(screen.getByText(/Quiz · Question 1 \/ 2/i)).toBeInTheDocument();

		await vi.advanceTimersByTimeAsync(1);

		expect(screen.getByText(/Quiz · Question 2 \/ 2/i)).toBeInTheDocument();
	});

	it('keeps correctness feedback aligned after option shuffling', async () => {
		render(QuizRunner, {
			questionLimit: 1,
			secondsPerQuestion: 12,
			answerFeedbackMs: 1500,
			onComplete: vi.fn()
		});

		const optionButtons = screen.getAllByRole('button');
		await fireEvent.click(optionButtons[0]);

		expect(screen.getByText(/Explanation/i)).toBeInTheDocument();
		expect(optionButtons[0].className).toContain('answer-btn-wrong');
		expect(optionButtons[3].className).toContain('answer-btn-correct');
	});
});
