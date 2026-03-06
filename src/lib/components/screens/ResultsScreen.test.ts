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

	it('uses a booth-team handoff CTA and avoids trial-class messaging', async () => {
		render(ResultsScreen, {
			name: 'Alex',
			mode: 'quiz-only',
			finalScore: 78,
			quizScore: 78
		});

		await vi.advanceTimersByTimeAsync(1200);

		expect(screen.getByText(/Talk to the RC4Entre booth team/i)).toBeInTheDocument();
		expect(screen.getByText(/builder community/i)).toBeInTheDocument();
		expect(screen.getByText(/startup events, pitches, and entrepreneurial experiences/i)).toBeInTheDocument();
		expect(screen.queryByText(/trial class/i)).not.toBeInTheDocument();
	});
});
