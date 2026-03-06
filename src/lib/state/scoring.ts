export interface QuizScoreInput {
	correctAnswers: number;
	questionCount: number;
	secondsRemainingTotal: number;
}

export function computeSpeedBonus(secondsRemainingTotal: number): number {
	return Math.max(0, Math.min(20, Math.floor(secondsRemainingTotal * 0.9)));
}

export function computeQuizScore(input: QuizScoreInput): number {
	if (input.questionCount <= 0) {
		return 0;
	}

	const accuracyScore = Math.round((input.correctAnswers / input.questionCount) * 80);
	const speedBonus = computeSpeedBonus(input.secondsRemainingTotal);
	return Math.max(0, Math.min(100, accuracyScore + speedBonus));
}

export function rankLabelFromScore(score: number): string {
	if (score >= 95) return 'VC Charmer';
	if (score >= 75) return 'Market Hunter';
	if (score >= 55) return 'Idea Spark';
	return 'First-Time Founder';
}
