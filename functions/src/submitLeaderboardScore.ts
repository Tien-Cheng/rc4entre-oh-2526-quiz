import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

const SCORE_MIN = 0;
const SCORE_MAX = 220;
const validModes = new Set(['hybrid', 'quiz-only', 'pitch-only']);

interface Payload {
	name?: unknown;
	mode?: unknown;
	score?: unknown;
	breakdown?: unknown;
	sourceVersion?: unknown;
	sessionId?: unknown;
}

function sanitizeName(input: unknown): string {
	const raw = typeof input === 'string' ? input.trim() : '';
	const compact = raw.replace(/\s+/g, ' ');
	const clipped = compact.slice(0, 24);
	return clipped.length > 0 ? clipped : 'Guest Player';
}

function validatePayload(payload: Payload) {
	if (!validModes.has(String(payload.mode))) {
		throw new HttpsError('invalid-argument', 'Invalid mode');
	}

	if (!Number.isInteger(payload.score)) {
		throw new HttpsError('invalid-argument', 'Score must be an integer');
	}

	if ((payload.score as number) < SCORE_MIN || (payload.score as number) > SCORE_MAX) {
		throw new HttpsError('invalid-argument', 'Score out of allowed range');
	}
}

export const submitLeaderboardScore = onCall(
	{
		enforceAppCheck: true,
		invoker: 'public'
	},
	async (request) => {
	const payload = (request.data ?? {}) as Payload;
	if (!request.app) {
		throw new HttpsError('failed-precondition', 'App Check token is required');
	}
	validatePayload(payload);

	const entry = {
		name: sanitizeName(payload.name),
		mode: payload.mode as 'hybrid' | 'quiz-only' | 'pitch-only',
		score: payload.score as number,
		timestamp: Date.now(),
		breakdown: payload.breakdown ?? null,
		sourceVersion:
			typeof payload.sourceVersion === 'string' && payload.sourceVersion.length > 0
				? payload.sourceVersion.slice(0, 64)
				: 'web-client',
		sessionId:
			typeof payload.sessionId === 'string' && payload.sessionId.length > 0
				? payload.sessionId.slice(0, 64)
				: null
	};

	await getFirestore().collection('leaderboard_entries').add(entry);
	return { ok: true };
	}
);

export const leaderboardValidation = {
	sanitizeName,
	validatePayload
};
