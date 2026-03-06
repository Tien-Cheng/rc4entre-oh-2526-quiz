export type GameMode = 'hybrid' | 'quiz-only' | 'pitch-only';

export type HybridOrder = 'quiz-first' | 'pitch-first';

export type GamePhase =
	| 'attract'
	| 'host-launcher'
	| 'player-intro'
	| 'quiz'
	| 'pitch'
	| 'results';

export type QuizCategory = 'startup' | 'funding' | 'market' | 'bonus';

export interface QuizQuestion {
	id: string;
	prompt: string;
	options: string[];
	answerIndex: number;
	explanation: string;
	category: QuizCategory;
}

export interface PitchPools {
	products: string[];
	audiences: string[];
}

export interface QuizResult {
	correctCount: number;
	questionCount: number;
	score: number;
	speedBonus: number;
}

export interface PitchResult {
	product: string;
	audience: string;
	baseScore: number;
	timeBonus: number;
	secondsRemaining: number;
	score: number;
	hostBonus: number;
}

export interface ModuleCompletion {
	quiz?: QuizResult;
	pitch?: PitchResult;
}

export interface FlowConfig {
	mode: GameMode;
	order: HybridOrder;
	questionLimit: number;
	secondsPerQuestion: number;
	answerFeedbackMs: number;
	pitchPrepSeconds: number;
}

export interface LeaderboardEntry {
	name: string;
	mode: GameMode;
	score: number;
	timestamp: number;
	breakdown?: ModuleCompletion;
}

export type LeaderboardBackend = 'cloud' | 'local-fallback';

export interface LeaderboardStatus {
	backend: LeaderboardBackend;
	healthy: boolean;
	message?: string;
}

export interface LeaderboardSubmitInput {
	name: string;
	mode: GameMode;
	score: number;
	breakdown?: ModuleCompletion;
}

export interface LeaderboardReadOptions {
	mode?: GameMode;
	limit?: number;
}
