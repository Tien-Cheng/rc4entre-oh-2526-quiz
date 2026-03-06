import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import LeaderboardCard from './LeaderboardCard.svelte';

describe('LeaderboardCard', () => {
	it('shows local fallback status label', () => {
		render(LeaderboardCard, {
			entriesByMode: { hybrid: [], 'quiz-only': [], 'pitch-only': [] },
			status: { backend: 'local-fallback', healthy: false, message: 'Sync error' }
		});

		expect(screen.getByText('Local fallback')).toBeInTheDocument();
	});
});
