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

	it('renders only hybrid and quiz-only sections', () => {
		render(LeaderboardCard, {
			entriesByMode: {
				hybrid: [{ name: 'Hybrid Hero', mode: 'hybrid', score: 88, timestamp: 1 }],
				'quiz-only': [{ name: 'Quiz Ace', mode: 'quiz-only', score: 91, timestamp: 2 }]
			}
		});

		expect(screen.getByText('Hybrid')).toBeInTheDocument();
		expect(screen.getByText('Quiz Only')).toBeInTheDocument();
		expect(screen.queryByText('Pitch Only')).not.toBeInTheDocument();
	});
});
