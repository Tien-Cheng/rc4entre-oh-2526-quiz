<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { createQuizSession } from '$lib/modules/quiz/quiz-session';
	import type { QuizResult } from '$lib/types/game';

	const FEEDBACK_REVIEW_MS = 2200;

	let {
		questionLimit,
		secondsPerQuestion,
		onComplete = (_result: QuizResult) => {}
	}: {
		questionLimit: number;
		secondsPerQuestion: number;
		onComplete?: (result: QuizResult) => void;
	} = $props();

	const session = createQuizSession({ questionLimit, secondsPerQuestion });
	let currentQuestion = $state(session.currentQuestion());
	let currentQuestionNumber = $state(session.questionIndex() + 1);
	let remainingSeconds = $state(secondsPerQuestion);
	let selectedIndex = $state<number | null>(null);
	let isLocked = $state(false);
	let timer: ReturnType<typeof setInterval> | null = null;
	let feedbackTimer: ReturnType<typeof setTimeout> | null = null;
	let feedback = $state<{
		tone: 'correct' | 'wrong' | 'timeout';
		headline: string;
		note: string;
	} | null>(null);

	function clearTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	function clearFeedbackTimer() {
		if (feedbackTimer) {
			clearTimeout(feedbackTimer);
			feedbackTimer = null;
		}
	}

	function startTimer() {
		clearTimer();
		remainingSeconds = secondsPerQuestion;
		timer = setInterval(() => {
			remainingSeconds = Math.max(0, remainingSeconds - 1);
			if (remainingSeconds === 0) {
				handleAnswer(-1);
			}
		}, 1000);
	}

	function moveNext() {
		if (session.isComplete()) {
			onComplete(session.result());
			return;
		}

		currentQuestion = session.currentQuestion();
		currentQuestionNumber = session.questionIndex() + 1;
		selectedIndex = null;
		isLocked = false;
		feedback = null;
		startTimer();
	}

	function resolveFeedback(answerIndex: number, answerIndexExpected: number) {
		if (answerIndex < 0) {
			return {
				tone: 'timeout' as const,
				headline: "Time's up!",
				note: 'No worries, we will reveal the answer and move on.'
			};
		}

		if (answerIndex === answerIndexExpected) {
			return {
				tone: 'correct' as const,
				headline: 'Correct!',
				note: 'Nice call. Keep the momentum going.'
			};
		}

		return {
			tone: 'wrong' as const,
			headline: 'Not quite.',
			note: 'Quick reset, the explanation below will help for the next one.'
		};
	}

	function handleAnswer(answerIndex: number) {
		if (!currentQuestion || isLocked) {
			return;
		}

		isLocked = true;
		selectedIndex = answerIndex >= 0 ? answerIndex : null;
		feedback = resolveFeedback(answerIndex, currentQuestion.answerIndex);
		clearTimer();
		session.answerCurrent(answerIndex, remainingSeconds);
		clearFeedbackTimer();

		feedbackTimer = setTimeout(() => {
			moveNext();
		}, FEEDBACK_REVIEW_MS);
	}

	onMount(() => {
		startTimer();
	});

	onDestroy(() => {
		clearTimer();
		clearFeedbackTimer();
	});
</script>

{#if currentQuestion}
	<div class="mx-auto flex min-h-dvh w-full max-w-5xl items-center px-5 py-7">
		<div class="glow-card w-full rounded-3xl p-6 md:p-8">
			<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
				<p class="eyebrow">
					Quiz · Question {currentQuestionNumber} / {questionLimit}
				</p>
				<p class="metric-pill">Time {remainingSeconds}s</p>
			</div>

			<div class="timer-track mb-5" role="presentation" aria-hidden="true">
				<div
					class="timer-fill"
					style={`width: ${Math.max(0, (remainingSeconds / secondsPerQuestion) * 100)}%`}
				></div>
			</div>

			<h2 class="font-['Kanit'] text-3xl font-bold leading-tight md:text-4xl">{currentQuestion.prompt}</h2>

			<div class="mt-5 grid gap-3 md:grid-cols-2">
				{#each currentQuestion.options as option, idx}
					<button
						class={`quiz-option ${
							isLocked && idx === currentQuestion.answerIndex
								? 'correct'
								: isLocked && selectedIndex === idx && selectedIndex !== currentQuestion.answerIndex
									? 'wrong'
									: ''
						}`}
						onclick={() => handleAnswer(idx)}
						disabled={isLocked}
					>
						{option}
					</button>
				{/each}
			</div>

			{#if isLocked}
				{#if feedback}
					<div
						role="status"
						aria-live="polite"
						class={`mt-4 rounded-2xl border px-4 py-3 ${
							feedback.tone === 'correct'
								? 'border-emerald-300/40 bg-emerald-200/15'
								: feedback.tone === 'wrong'
									? 'border-rose-300/40 bg-rose-200/10'
									: 'border-amber-300/50 bg-amber-200/15'
						} feedback-panel`}
					>
						<p class="eyebrow">Answer feedback</p>
						<p class="mt-1 font-['Kanit'] text-2xl font-extrabold">{feedback.headline}</p>
						<p class="mt-1 text-sm opacity-90">{feedback.note}</p>
					</div>
				{/if}
				<p class="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm opacity-90">
					{currentQuestion.explanation}
				</p>
			{/if}
		</div>
	</div>
{/if}
