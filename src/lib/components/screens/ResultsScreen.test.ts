import { render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ResultsScreen from './ResultsScreen.svelte';

describe('ResultsScreen', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
	});

	it('renders the quiz score and omits pitch breakdown text', async () => {
		render(ResultsScreen, {
			name: 'Alex',
			mode: 'hybrid',
			finalScore: 82,
			quizScore: 82
		});

		await vi.advanceTimersByTimeAsync(1200);

		expect(screen.getByText(/Quiz Score/i)).toBeInTheDocument();
		expect(screen.queryByText(/Pitch Score/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/host bonus/i)).not.toBeInTheDocument();
	});
});
