import { fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const submitMock = vi.fn(async () => {});

vi.mock('$lib/services/leaderboard-provider', () => {
	return {
		createLeaderboardProvider: () => ({
			submit: submitMock,
			subscribeByMode: (mode: 'hybrid' | 'quiz-only', _limit: number, onUpdate: (entries: unknown[]) => void) => {
				if (mode === 'hybrid') {
					onUpdate([{ name: 'Cloud Champ', mode: 'hybrid', score: 123, timestamp: 10 }]);
				} else {
					onUpdate([]);
				}
				return () => {};
			},
			getStatus: () => ({ backend: 'cloud', healthy: true, message: 'Realtime sync active' }),
			clearLocalFallback: () => {}
		})
	};
});

import GameShell from './GameShell.svelte';

describe('GameShell', () => {
	beforeEach(() => {
		submitMock.mockClear();
	});

	afterEach(() => {
		if (vi.isFakeTimers()) {
			vi.runOnlyPendingTimers();
			vi.useRealTimers();
		}
	});

	it('renders cloud leaderboard entries from provider subscriptions', async () => {
		render(GameShell);
		expect(await screen.findByText('Cloud Champ')).toBeInTheDocument();
	});

	it('opens the host panel with Shift-H', async () => {
		render(GameShell);

		await fireEvent.keyDown(window, { key: 'H', shiftKey: true });

		expect(await screen.findByRole('dialog', { name: 'Host panel' })).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Pitch Only' })).not.toBeInTheDocument();
		expect(screen.queryByText(/Host pitch bonus/i)).not.toBeInTheDocument();
	});

	it('opens the host panel with Shift-H while the player name input is focused', async () => {
		render(GameShell);

		await fireEvent.click(screen.getByRole('button', { name: 'Play in 2 minutes →' }));
		const nameInput = await screen.findByRole('textbox', { name: 'Your name (optional)' });
		nameInput.focus();

		await fireEvent.keyDown(nameInput, { key: 'H', shiftKey: true });

		expect(await screen.findByRole('dialog', { name: 'Host panel' })).toBeInTheDocument();
	});

	it('submits hybrid leaderboard entries using quiz score only', async () => {
		vi.useFakeTimers();
		render(GameShell);

		await fireEvent.keyDown(window, { key: 'H', shiftKey: true });
		await fireEvent.click(screen.getByRole('button', { name: 'Start Next Player' }));
		await fireEvent.click(screen.getByRole('button', { name: 'Start Round →' }));

		await vi.advanceTimersByTimeAsync(8 * (12_000 + 1_500));
		await Promise.resolve();
		await fireEvent.click(screen.getByRole('button', { name: 'Generate Prompt →' }));
		await fireEvent.click(screen.getByRole('button', { name: 'Start Pitch Now →' }));
		await Promise.resolve();

		expect(submitMock).toHaveBeenCalledWith(
			expect.objectContaining({
				mode: 'hybrid',
				score: 0,
				breakdown: {
					quiz: expect.objectContaining({
						score: 0
					})
				}
			})
		);
	}, 10000);
});
