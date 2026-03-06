import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

const submitMock = vi.fn(async () => {});

vi.mock('$lib/services/leaderboard-provider', () => {
	return {
		createLeaderboardProvider: () => ({
			submit: submitMock,
			subscribeByMode: (mode: 'hybrid' | 'quiz-only' | 'pitch-only', _limit: number, onUpdate: (entries: unknown[]) => void) => {
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
	it('renders cloud leaderboard entries from provider subscriptions', async () => {
		render(GameShell);
		expect(await screen.findByText('Cloud Champ')).toBeInTheDocument();
	});

	it('opens the host panel with Shift-H', async () => {
		render(GameShell);

		await fireEvent.keyDown(window, { key: 'H', shiftKey: true });

		expect(await screen.findByRole('dialog', { name: 'Host panel' })).toBeInTheDocument();
	});

	it('opens the host panel with Shift-H while the player name input is focused', async () => {
		render(GameShell);

		await fireEvent.click(screen.getByRole('button', { name: 'Play in 2 minutes →' }));
		const nameInput = await screen.findByRole('textbox', { name: 'Your name (optional)' });
		nameInput.focus();

		await fireEvent.keyDown(nameInput, { key: 'H', shiftKey: true });

		expect(await screen.findByRole('dialog', { name: 'Host panel' })).toBeInTheDocument();
	});
});
