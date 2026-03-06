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

function shuffleQuestions<T>(items: T[]): T[] {
	const shuffled = [...items];

	for (let i = shuffled.length - 1; i > 0; i -= 1) {
		const swapIndex = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]];
	}

	return shuffled;
}

function selectQuestions(questions: QuizQuestion[], questionLimit: number): QuizQuestion[] {
	if (questionLimit >= questions.length) {
		return shuffleQuestions(questions);
	}

	const byCategory = new Map<string, QuizQuestion[]>();
	for (const question of questions) {
		const bucket = byCategory.get(question.category) ?? [];
		bucket.push(question);
		byCategory.set(question.category, bucket);
	}

	for (const [category, bucket] of byCategory.entries()) {
		byCategory.set(category, shuffleQuestions(bucket));
	}

	const selected: QuizQuestion[] = [];
	const categories = shuffleQuestions([...byCategory.keys()]);

	while (selected.length < questionLimit) {
		let addedThisPass = false;

		for (const category of categories) {
			const bucket = byCategory.get(category);
			const nextQuestion = bucket?.shift();

			if (!nextQuestion) {
				continue;
			}

			selected.push(nextQuestion);
			addedThisPass = true;

			if (selected.length >= questionLimit) {
				break;
			}
		}

		if (!addedThisPass) {
			break;
		}
	}

	return selected;
}

export function createQuizSession(options: QuizSessionOptions) {
	const questions = selectQuestions(options.questions ?? quizQuestions, options.questionLimit).map(
		shuffleQuestionOptions
	);
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
