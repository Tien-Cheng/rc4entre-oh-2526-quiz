import { describe, expect, it } from 'vitest';
import { createGameFlow } from './game-flow';

describe('game flow transitions', () => {
	it('supports quiz-only path', () => {
		const flow = createGameFlow({ mode: 'quiz-only', order: 'quiz-first' });
		flow.start();
		expect(flow.currentPhase()).toBe('quiz');
		flow.completeModule('quiz', { score: 80 });
		expect(flow.currentPhase()).toBe('results');
	});

	it('supports pitch-only path', () => {
		const flow = createGameFlow({ mode: 'pitch-only', order: 'quiz-first' });
		flow.start();
		expect(flow.currentPhase()).toBe('pitch');
	});

	it('supports hybrid pitch-first path', () => {
		const flow = createGameFlow({ mode: 'hybrid', order: 'pitch-first' });
		flow.start();
		expect(flow.currentPhase()).toBe('pitch');
		flow.completeModule('pitch', { score: 40 });
		expect(flow.currentPhase()).toBe('quiz');
		flow.completeModule('quiz', { score: 60 });
		expect(flow.currentPhase()).toBe('results');
	});
});
