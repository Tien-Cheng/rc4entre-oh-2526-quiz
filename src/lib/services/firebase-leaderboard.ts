import { initializeApp, type FirebaseApp, type FirebaseOptions, getApps } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import {
	getFirestore,
	collection,
	limit as limitTo,
	onSnapshot,
	orderBy,
	query,
	where,
	type Firestore
} from 'firebase/firestore';
import { getFunctions, httpsCallable, type Functions } from 'firebase/functions';
import { firebaseWebConfig, leaderboardClientConfig } from '$lib/config/firebase';
import type { GameMode, LeaderboardEntry, LeaderboardSubmitInput } from '$lib/types/game';

interface FirebaseLeaderboardDeps {
	createFirestore: (config: FirebaseOptions) => Firestore;
	createFunctions: (config: FirebaseOptions) => Functions;
	submitCallable: (functions: Functions) => (entry: LeaderboardSubmitInput) => Promise<void>;
}

export interface FirebaseLeaderboardClient {
	isConfigured(): boolean;
	submit(entry: LeaderboardSubmitInput): Promise<void>;
	subscribeByMode(
		mode: GameMode,
		maxItems: number,
		onUpdate: (entries: LeaderboardEntry[]) => void,
		onError: (error: Error) => void
	): () => void;
}

function isConfigured(config: FirebaseOptions): boolean {
	return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

let appCheckInitialized = false;

function ensureAppCheck(app: FirebaseApp) {
	if (appCheckInitialized || typeof window === 'undefined') {
		return;
	}

	if (!leaderboardClientConfig.appCheckSiteKey) {
		console.warn('Firebase App Check site key missing; callable writes may be rejected.');
		return;
	}

	initializeAppCheck(app, {
		provider: new ReCaptchaEnterpriseProvider(leaderboardClientConfig.appCheckSiteKey),
		isTokenAutoRefreshEnabled: true
	});
	appCheckInitialized = true;
}

function defaultDeps(): FirebaseLeaderboardDeps {
	return {
		createFirestore(config: FirebaseOptions) {
			const app = getApps().length > 0 ? getApps()[0] : initializeApp(config);
			ensureAppCheck(app);
			return getFirestore(app);
		},
		createFunctions(config: FirebaseOptions) {
			const app = getApps().length > 0 ? getApps()[0] : initializeApp(config);
			ensureAppCheck(app);
			return getFunctions(app);
		},
		submitCallable(functions: Functions) {
			const submit = httpsCallable(functions, 'submitLeaderboardScore');
			return async (entry: LeaderboardSubmitInput) => {
				await submit({
					name: entry.name,
					mode: entry.mode,
					score: entry.score,
					breakdown: entry.breakdown,
					sourceVersion: leaderboardClientConfig.sourceVersion
				});
			};
		}
	};
}

function mapSnapshotEntry(value: unknown): LeaderboardEntry | null {
	if (!value || typeof value !== 'object') {
		return null;
	}
	const row = value as Record<string, unknown>;
	if (
		typeof row.name !== 'string' ||
		(row.mode !== 'hybrid' && row.mode !== 'quiz-only') ||
		typeof row.score !== 'number' ||
		typeof row.timestamp !== 'number'
	) {
		return null;
	}

	return {
		name: row.name,
		mode: row.mode,
		score: row.score,
		timestamp: row.timestamp,
		breakdown: row.breakdown as LeaderboardEntry['breakdown']
	};
}

export function createFirebaseLeaderboardClient(
	deps: Partial<FirebaseLeaderboardDeps> = {}
): FirebaseLeaderboardClient {
	const config = firebaseWebConfig;
	const impl = { ...defaultDeps(), ...deps };
	let firestore: Firestore | null = null;
	let functions: Functions | null = null;

	function ensureFirestore(): Firestore {
		if (!isConfigured(config)) {
			throw new Error('Firebase leaderboard is not configured');
		}
		if (!firestore) {
			firestore = impl.createFirestore(config);
		}
		return firestore;
	}

	function ensureFunctions(): Functions {
		if (!isConfigured(config)) {
			throw new Error('Firebase leaderboard is not configured');
		}
		if (!functions) {
			functions = impl.createFunctions(config);
		}
		return functions;
	}

	return {
		isConfigured: () => isConfigured(config),
		async submit(entry) {
			const callable = impl.submitCallable(ensureFunctions());
			await callable(entry);
		},
		subscribeByMode(mode, maxItems, onUpdate, onError) {
			const db = ensureFirestore();
			const q = query(
				collection(db, 'leaderboard_entries'),
				where('mode', '==', mode),
				orderBy('score', 'desc'),
				orderBy('timestamp', 'desc'),
				limitTo(maxItems)
			);

			return onSnapshot(
				q,
				(snapshot) => {
					const entries = snapshot.docs
						.map((doc) => mapSnapshotEntry(doc.data()))
						.filter((entry): entry is LeaderboardEntry => entry !== null);
					onUpdate(entries);
				},
				(error) => onError(error)
			);
		}
	};
}
