import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import AttractScreen from './AttractScreen.svelte';

describe('AttractScreen', () => {
	it('frames the game as a quick way to discover RC4Entre', () => {
		render(AttractScreen, {
			onStart: () => {},
			entriesByMode: {
				hybrid: [],
				'quiz-only': []
			},
			leaderboardStatus: {
				backend: 'local-fallback',
				healthy: true,
				message: 'Local fallback mode'
			}
		});

		expect(
			screen.getByText(/get a quick feel for the builder energy behind RC4Entre/i)
		).toBeInTheDocument();
		expect(
			screen.getByText(/A fast way to discover the people, ideas, and startup vibe around RC4Entre/i)
		).toBeInTheDocument();
		expect(
			screen.getByText(/RC4Entre is where curious builders meet ideas, teammates, and startup energy/i)
		).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Play in 2 minutes →' })).toBeInTheDocument();
	});
});
