import { fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import QuizRunner from './QuizRunner.svelte';

describe('QuizRunner', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
	});

	it('updates the question progress label after answering', async () => {
		render(QuizRunner, {
			questionLimit: 2,
			secondsPerQuestion: 12,
			onComplete: vi.fn()
		});

		expect(screen.getByText(/Quiz · Question 1 \/ 2/i)).toBeInTheDocument();

		const optionButtons = screen.getAllByRole('button');
		await fireEvent.click(optionButtons[0]);
		await vi.advanceTimersByTimeAsync(1800);

		expect(screen.getByText(/Quiz · Question 1 \/ 2/i)).toBeInTheDocument();

		await vi.advanceTimersByTimeAsync(401);

		expect(screen.getByText(/Quiz · Question 2 \/ 2/i)).toBeInTheDocument();
	});

	it('shows positive feedback when the player selects the correct answer', async () => {
		render(QuizRunner, {
			questionLimit: 1,
			secondsPerQuestion: 12,
			onComplete: vi.fn()
		});

		const optionButtons = screen.getAllByRole('button');
		await fireEvent.click(optionButtons[0]);

		expect(screen.getByText('Correct!')).toBeInTheDocument();
	});

	it('shows corrective feedback when the player selects a wrong answer', async () => {
		render(QuizRunner, {
			questionLimit: 1,
			secondsPerQuestion: 12,
			onComplete: vi.fn()
		});

		const optionButtons = screen.getAllByRole('button');
		await fireEvent.click(optionButtons[1]);

		expect(screen.getByText('Not quite.')).toBeInTheDocument();
	});

	it("shows timeout feedback when the player runs out of time", async () => {
		render(QuizRunner, {
			questionLimit: 1,
			secondsPerQuestion: 1,
			onComplete: vi.fn()
		});

		await vi.advanceTimersByTimeAsync(1000);

		expect(screen.getByText("Time's up!")).toBeInTheDocument();
	});
});
