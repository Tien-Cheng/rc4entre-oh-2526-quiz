import { render, screen } from '@testing-library/svelte';
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
});
