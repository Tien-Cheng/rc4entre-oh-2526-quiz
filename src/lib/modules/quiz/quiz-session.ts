import { quizQuestions } from '$lib/config/quiz-questions';
import { computeQuizScore, computeSpeedBonus } from '$lib/state/scoring';
import type { QuizQuestion, QuizResult } from '$lib/types/game';

interface QuizSessionOptions {
	questionLimit: number;
	secondsPerQuestion: number;
	questions?: QuizQuestion[];
}

function shuffleQuestionOptions(question: QuizQuestion): QuizQuestion {
	const entries = question.options.map((option, index) => ({
		option,
		isAnswer: index === question.answerIndex
	}));

	for (let i = entries.length - 1; i > 0; i -= 1) {
		const swapIndex = Math.floor(Math.random() * (i + 1));
		[entries[i], entries[swapIndex]] = [entries[swapIndex], entries[i]];
	}

	return {
		...question,
		options: entries.map((entry) => entry.option),
		answerIndex: entries.findIndex((entry) => entry.isAnswer)
	};
}

export function createQuizSession(options: QuizSessionOptions) {
	const questions = (options.questions ?? quizQuestions)
		.slice(0, options.questionLimit)
		.map(shuffleQuestionOptions);
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
				speedBonus: computeSpeedBonus(secondsRemainingTotal)
			};
		}
	};
}
