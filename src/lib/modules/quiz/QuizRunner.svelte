<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { createQuizSession } from '$lib/modules/quiz/quiz-session';
	import type { QuizResult } from '$lib/types/game';

	let {
		questionLimit,
		secondsPerQuestion,
		answerFeedbackMs,
		onComplete = (_result: QuizResult) => {}
	}: {
		questionLimit: number;
		secondsPerQuestion: number;
		answerFeedbackMs: number;
		onComplete?: (result: QuizResult) => void;
	} = $props();

	const initialQuestionLimit = questionLimit;
	const initialSecondsPerQuestion = secondsPerQuestion;
	const session = createQuizSession({
		questionLimit: initialQuestionLimit,
		secondsPerQuestion: initialSecondsPerQuestion
	});
	let currentQuestion = $state(session.currentQuestion());
	let currentQuestionNumber = $state(session.questionIndex() + 1);
	let remainingSeconds = $state(initialSecondsPerQuestion);
	let selectedIndex = $state<number | null>(null);
	let isLocked = $state(false);
	let timer: ReturnType<typeof setInterval> | null = null;

	function clearTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	function startTimer() {
		clearTimer();
		remainingSeconds = initialSecondsPerQuestion;
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
		startTimer();
	}

	function handleAnswer(answerIndex: number) {
		if (!currentQuestion || isLocked) {
			return;
		}

		isLocked = true;
		selectedIndex = answerIndex;
		clearTimer();
		session.answerCurrent(answerIndex, remainingSeconds);

		setTimeout(() => {
			moveNext();
		}, answerFeedbackMs);
	}

	onMount(() => {
		startTimer();
	});

	onDestroy(() => {
		clearTimer();
	});
</script>

{#if currentQuestion}
	<div class="mx-auto flex min-h-dvh w-full max-w-5xl items-center px-5 py-7">
		<div class="glow-card w-full rounded-3xl p-6 md:p-8" style="animation: fadeInUp 300ms ease both;">
			<!-- Header row -->
			<div class="mb-3 flex flex-wrap items-center justify-between gap-3">
				<p class="label-cap">Quiz · Question {currentQuestionNumber} / {questionLimit}</p>
				<div
					class="rounded-full px-3 py-1 text-sm font-bold tabular-nums transition-colors duration-500"
					style="
						background: {remainingSeconds <= 5 ? 'rgb(243 90 58 / 18%)' : remainingSeconds <= 8 ? 'rgb(246 190 45 / 18%)' : 'rgb(255 255 255 / 8%)'};
						color: {remainingSeconds <= 5 ? 'var(--brand-coral)' : remainingSeconds <= 8 ? 'var(--brand-amber)' : 'var(--ink)'};
						{remainingSeconds <= 5 ? 'animation: pulseGlow 900ms ease infinite;' : ''}
					"
				>{remainingSeconds}s</div>
			</div>

			<!-- Custom progress bar -->
			<div class="timer-bar-track mb-5">
				<div
					class="timer-bar-fill"
					style="
						width: {(remainingSeconds / initialSecondsPerQuestion) * 100}%;
						background: {remainingSeconds <= 4
							? 'var(--brand-coral)'
							: remainingSeconds <= 8
								? 'linear-gradient(90deg, var(--brand-amber), var(--brand-coral))'
								: 'linear-gradient(90deg, var(--brand-teal), var(--brand-amber))'};
					"
				></div>
			</div>

			<!-- Question -->
			{#key currentQuestionNumber}
				<h2
					class="font-['Kanit'] text-4xl font-extrabold leading-tight md:text-5xl"
					style="animation: fadeInUp 280ms ease both;"
				>{currentQuestion.prompt}</h2>
			{/key}

			<!-- Answer grid -->
			<div class="mt-6 grid gap-3 md:grid-cols-2">
				{#each currentQuestion.options as option, idx}
					{@const label = ['A', 'B', 'C', 'D'][idx]}
					{@const isCorrect = isLocked && idx === currentQuestion.answerIndex}
					{@const isWrong = isLocked && selectedIndex === idx && idx !== currentQuestion.answerIndex}
					<button
						class="answer-btn {isCorrect ? 'answer-btn-correct' : isWrong ? 'answer-btn-wrong' : ''}"
						onclick={() => handleAnswer(idx)}
						disabled={isLocked}
					>
						<span class="answer-btn-label">{label}</span>
						<span class="text-sm md:text-base">{option}</span>
					</button>
				{/each}
			</div>

			<!-- Explanation -->
			{#if isLocked}
				<div
					class="surface-card accent-left-teal mt-4 px-4 py-3 text-sm"
					style="animation: fadeSlideIn 300ms ease both;"
				>
					<span class="label-cap block mb-1">Explanation</span>
					{currentQuestion.explanation}
				</div>
			{/if}
		</div>
	</div>
{/if}
