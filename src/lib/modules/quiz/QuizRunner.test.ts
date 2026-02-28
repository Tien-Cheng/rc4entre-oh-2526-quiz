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
		await vi.advanceTimersByTimeAsync(801);

		expect(screen.getByText(/Quiz · Question 2 \/ 2/i)).toBeInTheDocument();
	});
});
