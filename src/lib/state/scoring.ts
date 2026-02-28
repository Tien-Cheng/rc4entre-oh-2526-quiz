export interface QuizScoreInput {
	correctAnswers: number;
	questionCount: number;
	secondsRemainingTotal: number;
}

export function computeQuizScore(input: QuizScoreInput): number {
	if (input.questionCount <= 0) {
		return 0;
	}

	const accuracyScore = Math.round((input.correctAnswers / input.questionCount) * 80);
	const speedBonus = Math.min(20, Math.floor(input.secondsRemainingTotal * 0.9));
	return Math.max(0, Math.min(100, accuracyScore + speedBonus));
}

export function combineScore(input: { quizScore?: number; pitchScore?: number }): number {
	return (input.quizScore ?? 0) + (input.pitchScore ?? 0);
}
