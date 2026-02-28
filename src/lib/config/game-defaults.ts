import type { FlowConfig } from '$lib/types/game';

export const defaultFlowConfig: FlowConfig = {
	mode: 'hybrid',
	order: 'quiz-first',
	questionLimit: 8,
	secondsPerQuestion: 20,
	pitchPrepSeconds: 30
};
