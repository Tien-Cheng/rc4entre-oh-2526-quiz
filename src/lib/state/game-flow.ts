import type { GameMode, GamePhase, HybridOrder, ModuleCompletion } from '$lib/types/game';

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
	const completion: ModuleCompletion = {};

	return {
		start() {
			phase = initialPhase(options);
		},
		currentPhase() {
			return phase;
		},
		completeModule(module: 'quiz' | 'pitch', payload: { score: number }) {
			if (module === 'quiz') {
				completion.quiz = {
					correctCount: 0,
					questionCount: 0,
					score: payload.score,
					speedBonus: 0
				};
			} else {
				completion.pitch = {
					product: '',
					audience: '',
					score: payload.score,
					hostBonus: 0
				};
			}

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
		result() {
			return completion;
		},
		reset() {
			phase = 'attract';
			delete completion.quiz;
			delete completion.pitch;
		}
	};
}
