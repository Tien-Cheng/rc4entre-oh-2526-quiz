import type { GameMode, GamePhase, HybridOrder } from '$lib/types/game';

interface FlowOptions {
	mode: GameMode;
	order: HybridOrder;
}

function initialPhase(options: FlowOptions): GamePhase {
	if (options.mode === 'quiz-only') {
		return 'quiz';
	}

	if (options.mode === 'pitch-only') {
		return 'pitch';
	}

	return options.order === 'pitch-first' ? 'pitch' : 'quiz';
}

export function createGameFlow(options: FlowOptions) {
	let phase: GamePhase = 'attract';

	return {
		start() {
			phase = initialPhase(options);
		},
		currentPhase() {
			return phase;
		},
		completeModule(module: 'quiz' | 'pitch') {
			if (options.mode === 'quiz-only' || options.mode === 'pitch-only') {
				phase = 'results';
				return;
			}

			if (options.order === 'quiz-first') {
				phase = module === 'quiz' ? 'pitch' : 'results';
				return;
			}

			phase = module === 'pitch' ? 'quiz' : 'results';
		},
		reset() {
			phase = 'attract';
		}
	};
}
