import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

const SCORE_MIN = 0;
const SCORE_MAX = 100;
const validModes = new Set(['hybrid', 'quiz-only']);

interface Payload {
	name?: unknown;
	mode?: unknown;
	score?: unknown;
	breakdown?: unknown;
	sourceVersion?: unknown;
	sessionId?: unknown;
}

interface SanitizedBreakdown {
	quiz?: {
		correctCount: number;
		questionCount: number;
		score: number;
		speedBonus: number;
	};
}

function sanitizeName(input: unknown): string {
	const raw = typeof input === 'string' ? input.trim() : '';
	const compact = raw.replace(/\s+/g, ' ');
	const clipped = compact.slice(0, 24);
	return clipped.length > 0 ? clipped : 'Guest Player';
}

function boundedInt(value: unknown, min: number, max: number): number | null {
	if (!Number.isInteger(value)) {
		return null;
	}
	const parsed = value as number;
	if (parsed < min || parsed > max) {
		return null;
	}
	return parsed;
}

function sanitizeBreakdown(input: unknown): SanitizedBreakdown | null {
	if (!input || typeof input !== 'object') {
		return null;
	}

	const raw = input as Record<string, unknown>;
	const result: SanitizedBreakdown = {};

	if (raw.quiz && typeof raw.quiz === 'object') {
		const quiz = raw.quiz as Record<string, unknown>;
		const correctCount = boundedInt(quiz.correctCount, 0, 100);
		const questionCount = boundedInt(quiz.questionCount, 0, 100);
		const score = boundedInt(quiz.score, 0, 200);
		const speedBonus = boundedInt(quiz.speedBonus, 0, 100);
		if (correctCount !== null && questionCount !== null && score !== null && speedBonus !== null) {
			result.quiz = { correctCount, questionCount, score, speedBonus };
		}
	}

	return result.quiz ? result : null;
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
		mode: payload.mode as 'hybrid' | 'quiz-only',
		score: payload.score as number,
		timestamp: Date.now(),
		breakdown: sanitizeBreakdown(payload.breakdown),
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
	validatePayload,
	sanitizeBreakdown
};
