import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import LeaderboardCard from './LeaderboardCard.svelte';

describe('LeaderboardCard', () => {
	it('shows local fallback status label', () => {
		render(LeaderboardCard, {
			entriesByMode: { hybrid: [], 'quiz-only': [] },
			status: { backend: 'local-fallback', healthy: false, message: 'Sync error' }
		});

		expect(screen.getByText('Local fallback')).toBeInTheDocument();
	});

	it('merges all quiz leaderboard entries into one sorted list', () => {
		render(LeaderboardCard, {
			entriesByMode: {
				hybrid: [{ name: 'Hybrid Hero', mode: 'hybrid', score: 88, timestamp: 1 }],
				'quiz-only': [{ name: 'Quiz Ace', mode: 'quiz-only', score: 91, timestamp: 2 }]
			}
		});

		expect(screen.getByText('Leaderboard')).toBeInTheDocument();
		expect(screen.getByText('Quiz Scores')).toBeInTheDocument();
		expect(screen.getByText('2 entries')).toBeInTheDocument();
		expect(screen.queryByText('Hybrid')).not.toBeInTheDocument();
		expect(screen.queryByText('Quiz Only')).not.toBeInTheDocument();
		expect(screen.getAllByText(/Hybrid Hero|Quiz Ace/).map((node) => node.textContent)).toEqual([
			'Quiz Ace',
			'Hybrid Hero'
		]);
	});
});
