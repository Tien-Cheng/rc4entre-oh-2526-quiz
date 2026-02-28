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
	pitchPrepSeconds: number;
}

export interface LeaderboardEntry {
	name: string;
	mode: GameMode;
	score: number;
	timestamp: number;
	breakdown?: ModuleCompletion;
}
