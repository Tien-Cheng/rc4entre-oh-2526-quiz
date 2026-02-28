import { quizQuestions } from '$lib/config/quiz-questions';
import { computeQuizScore } from '$lib/state/scoring';
import type { QuizQuestion, QuizResult } from '$lib/types/game';

interface QuizSessionOptions {
	questionLimit: number;
	secondsPerQuestion: number;
	questions?: QuizQuestion[];
}

export function createQuizSession(options: QuizSessionOptions) {
	const questions = (options.questions ?? quizQuestions).slice(0, options.questionLimit);
	let index = 0;
	let correctAnswers = 0;
	let secondsRemainingTotal = 0;

	return {
		currentQuestion() {
			return questions[index] ?? null;
		},
		questionIndex() {
			return index;
		},
		answerCurrent(answerIndex: number, secondsRemaining: number) {
			if (index >= questions.length) {
				return;
			}

			const question = questions[index];
			if (answerIndex === question.answerIndex) {
				correctAnswers += 1;
			}
			secondsRemainingTotal += Math.max(0, secondsRemaining);
			index += 1;
		},
		isComplete() {
			return index >= questions.length;
		},
		result(): QuizResult {
			const score = computeQuizScore({
				correctAnswers,
				questionCount: questions.length,
				secondsRemainingTotal
			});
			return {
				correctCount: correctAnswers,
				questionCount: questions.length,
				score,
				speedBonus: Math.max(0, Math.min(20, Math.floor(secondsRemainingTotal * 0.9)))
			};
		}
	};
}
