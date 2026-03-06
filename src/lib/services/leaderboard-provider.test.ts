import { describe, expect, it, vi } from 'vitest';
import type { LeaderboardEntry, LeaderboardSubmitInput } from '$lib/types/game';
import { createLeaderboardProvider } from './leaderboard-provider';

function createLocalStub() {
	const entries: LeaderboardEntry[] = [];
	return {
		entries,
		service: {
			add(entry: LeaderboardEntry) {
				entries.push(entry);
			},
			list(mode?: LeaderboardEntry['mode']) {
				const data = mode ? entries.filter((entry) => entry.mode === mode) : entries;
				return data
					.slice()
					.sort((a, b) => b.score - a.score || b.timestamp - a.timestamp);
			},
			clear() {
				entries.length = 0;
			}
		}
	};
}

function sampleEntry(mode: LeaderboardSubmitInput['mode'] = 'hybrid'): LeaderboardSubmitInput {
	return {
		name: 'Player',
		mode,
		score: 80
	};
}

describe('leaderboard provider', () => {
	it('chooses cloud and streams live entries when healthy', () => {
		const local = createLocalStub();
		const unsubscribe = vi.fn();
		const provider = createLeaderboardProvider({
			mode: 'cloud',
			localService: local.service,
			cloudClient: {
				isConfigured: () => true,
				submit: vi.fn(async () => {}),
				subscribeByMode: (_mode, _limit, onUpdate) => {
					onUpdate([{ name: 'Cloud', mode: 'hybrid', score: 120, timestamp: 10 }]);
					return unsubscribe;
				}
			}
		});

		let latest: LeaderboardEntry[] = [];
		const stop = provider.subscribeByMode('hybrid', 5, (entries) => {
			latest = entries;
		});

		expect(latest[0]?.name).toBe('Cloud');
		expect(provider.getStatus().backend).toBe('cloud');
		stop();
		expect(unsubscribe).toHaveBeenCalledOnce();
	});

	it('falls back to local entries when cloud listener throws', () => {
		const local = createLocalStub();
		local.service.add({ name: 'Local', mode: 'quiz-only', score: 90, timestamp: 5 });
		const provider = createLeaderboardProvider({
			mode: 'cloud',
			localService: local.service,
			cloudClient: {
				isConfigured: () => true,
				submit: vi.fn(async () => {}),
				subscribeByMode: () => {
					throw new Error('boom');
				}
			}
		});

		let latest: LeaderboardEntry[] = [];
		provider.subscribeByMode('quiz-only', 5, (entries) => {
			latest = entries;
		});

		expect(latest[0]?.name).toBe('Local');
		expect(provider.getStatus().backend).toBe('local-fallback');
	});

	it('does not persist into local fallback when cloud submit succeeds', async () => {
		const local = createLocalStub();
		const provider = createLeaderboardProvider({
			mode: 'cloud',
			localService: local.service,
			cloudClient: {
				isConfigured: () => true,
				submit: vi.fn(async () => {}),
				subscribeByMode: () => () => {}
			}
		});

		await provider.submit(sampleEntry('pitch-only'));
		expect(local.entries).toHaveLength(0);
		expect(provider.getStatus().backend).toBe('cloud');
	});

	it('writes to local fallback and marks sync error when cloud submit fails', async () => {
		const local = createLocalStub();
		const provider = createLeaderboardProvider({
			mode: 'cloud',
			localService: local.service,
			cloudClient: {
				isConfigured: () => true,
				submit: vi.fn(async () => {
					throw new Error('submit failed');
				}),
				subscribeByMode: () => () => {}
			}
		});

		await provider.submit(sampleEntry('hybrid'));
		expect(local.entries).toHaveLength(1);
		expect(provider.getStatus()).toMatchObject({
			backend: 'local-fallback',
			healthy: false
		});
	});

	it('keeps local fallback view when reads are healthy but writes are broken', async () => {
		const local = createLocalStub();
		const provider = createLeaderboardProvider({
			mode: 'cloud',
			localService: local.service,
			cloudClient: {
				isConfigured: () => true,
				submit: vi.fn(async () => {
					throw new Error('submit failed');
				}),
				subscribeByMode: (_mode, _limit, onUpdate) => {
					onUpdate([{ name: 'CloudOnly', mode: 'hybrid', score: 100, timestamp: 9 }]);
					return () => {};
				}
			}
		});

		await provider.submit(sampleEntry('hybrid'));
		let latest: LeaderboardEntry[] = [];
		provider.subscribeByMode('hybrid', 5, (entries) => {
			latest = entries;
		});

		expect(latest[0]?.name).toBe('Player');
		expect(provider.getStatus().backend).toBe('local-fallback');
	});

	it('clearLocalFallback only affects local storage', () => {
		const local = createLocalStub();
		local.service.add({ name: 'A', mode: 'hybrid', score: 50, timestamp: 1 });
		const provider = createLeaderboardProvider({
			mode: 'local',
			localService: local.service,
			cloudClient: {
				isConfigured: () => false,
				submit: vi.fn(async () => {}),
				subscribeByMode: () => () => {}
			}
		});

		provider.clearLocalFallback();
		expect(local.entries).toHaveLength(0);
	});
});
