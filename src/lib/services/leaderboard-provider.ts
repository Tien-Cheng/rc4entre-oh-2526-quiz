import { browser } from '$app/environment';
import { leaderboardDefaults } from '$lib/config/leaderboard';
import { leaderboardClientConfig } from '$lib/config/firebase';
import type {
	GameMode,
	LeaderboardEntry,
	LeaderboardStatus,
	LeaderboardSubmitInput
} from '$lib/types/game';
import { createFirebaseLeaderboardClient, type FirebaseLeaderboardClient } from './firebase-leaderboard';
import { createLeaderboardService, type LocalLeaderboardService } from './leaderboard';

export interface LeaderboardProvider {
	submit(entry: LeaderboardSubmitInput): Promise<void>;
	subscribeByMode(
		mode: GameMode,
		limit: number,
		onUpdate: (entries: LeaderboardEntry[]) => void
	): () => void;
	getStatus(): LeaderboardStatus;
	clearLocalFallback(): void;
}

interface ProviderOptions {
	localService?: LocalLeaderboardService;
	cloudClient?: FirebaseLeaderboardClient;
	mode?: 'cloud' | 'local';
}

function defaultStatus(mode: 'cloud' | 'local', cloudReady: boolean): LeaderboardStatus {
	if (mode === 'local' || !cloudReady) {
		return { backend: 'local-fallback', healthy: true, message: 'Local fallback mode' };
	}
	return { backend: 'cloud', healthy: true, message: 'Realtime sync active' };
}

function fallbackEntries(
	localService: LocalLeaderboardService,
	mode: GameMode,
	limit: number
): LeaderboardEntry[] {
	return localService.list(mode).slice(0, limit);
}

export function createLeaderboardProvider(options: ProviderOptions = {}): LeaderboardProvider {
	const featureMode = options.mode ?? leaderboardClientConfig.mode;
	const localService =
		options.localService ??
		createLeaderboardService(leaderboardDefaults.storageKey, {
			storage: browser ? localStorage : null,
			maxEntries: leaderboardDefaults.maxEntries
		});
	const cloudClient = options.cloudClient ?? createFirebaseLeaderboardClient();
	let status = defaultStatus(featureMode, browser && cloudClient.isConfigured());

	function useLocalFallback(message: string, healthy: boolean) {
		status = { backend: 'local-fallback', healthy, message };
	}

	return {
		async submit(entry: LeaderboardSubmitInput) {
			if (featureMode === 'local' || !browser || status.backend === 'local-fallback') {
				localService.add({ ...entry, timestamp: Date.now() });
				return;
			}

			try {
				await cloudClient.submit(entry);
				status = { backend: 'cloud', healthy: true, message: 'Realtime sync active' };
			} catch {
				localService.add({ ...entry, timestamp: Date.now() });
				useLocalFallback('Sync error. Saving scores locally.', false);
			}
		},
		subscribeByMode(mode, limit, onUpdate) {
			const localPush = () => onUpdate(fallbackEntries(localService, mode, limit));

			if (featureMode === 'local' || !browser) {
				localPush();
				return () => {};
			}

			if (!cloudClient.isConfigured()) {
				useLocalFallback('Firebase not configured. Using local fallback.', true);
				localPush();
				return () => {};
			}

			try {
				return cloudClient.subscribeByMode(
					mode,
					limit,
					(entries) => {
						status = { backend: 'cloud', healthy: true, message: 'Realtime sync active' };
						onUpdate(entries);
					},
					() => {
						useLocalFallback('Sync error. Showing local fallback.', false);
						localPush();
					}
				);
			} catch {
				useLocalFallback('Cloud listener unavailable. Using local fallback.', false);
				localPush();
				return () => {};
			}
		},
		getStatus() {
			return status;
		},
		clearLocalFallback() {
			localService.clear();
			if (status.backend === 'local-fallback') {
				status = { ...status, message: 'Local fallback cleared' };
			}
		}
	};
}
