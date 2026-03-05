<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { createQuizSession } from '$lib/modules/quiz/quiz-session';
	import type { QuizResult } from '$lib/types/game';

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

	function clearTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
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
		}, 800);
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
		<div class="glow-card w-full rounded-3xl p-6 md:p-8">
			<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
				<p class="text-xs uppercase tracking-[0.2em] opacity-70">
					Quiz · Question {currentQuestionNumber} / {questionLimit}
				</p>
				<p class="badge badge-warning badge-lg">{remainingSeconds}s</p>
			</div>

			<progress class="progress progress-warning mb-5 w-full" value={remainingSeconds} max={secondsPerQuestion}></progress>

			<h2 class="font-['Kanit'] text-3xl font-bold leading-tight md:text-4xl">{currentQuestion.prompt}</h2>

			<div class="mt-5 grid gap-3 md:grid-cols-2">
				{#each currentQuestion.options as option, idx}
					<button
						class="btn h-auto min-h-16 rounded-2xl justify-start whitespace-normal px-4 py-3 text-left text-sm md:text-base {isLocked && idx === currentQuestion.answerIndex
							? 'btn-success'
							: isLocked && selectedIndex === idx && selectedIndex !== currentQuestion.answerIndex
								? 'btn-error'
								: 'btn-outline'}"
						onclick={() => handleAnswer(idx)}
						disabled={isLocked}
					>
						{option}
					</button>
				{/each}
			</div>

			{#if isLocked}
				<p class="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm opacity-90">
					{currentQuestion.explanation}
				</p>
			{/if}
		</div>
	</div>
{/if}
