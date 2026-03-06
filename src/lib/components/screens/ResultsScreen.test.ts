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

	it('renders the pitch score breakdown', async () => {
		render(ResultsScreen, {
			name: 'Alex',
			mode: 'pitch-only',
			finalScore: 67,
			pitchBaseScore: 50,
			pitchTimeBonus: 10,
			pitchHostBonus: 7,
			pitchScore: 67
		});

		await vi.advanceTimersByTimeAsync(1200);

		expect(screen.getByText(/Pitch Score/i)).toBeInTheDocument();
		expect(screen.getByText(/50 base \+ 10 time \+ 7 host bonus/i)).toBeInTheDocument();
	});
});
