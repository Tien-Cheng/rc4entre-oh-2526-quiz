<script lang="ts">
	import { onMount } from 'svelte';
	import { effectiveRankScore, rankLabelFromScore } from '$lib/state/scoring';
	import type { GameMode } from '$lib/types/game';

	let {
		name,
		mode,
		finalScore,
		quizScore,
		pitchBaseScore,
		pitchTimeBonus,
		pitchHostBonus,
		pitchScore,
		onNextPlayer = () => {}
	}: {
		name: string;
		mode: GameMode;
		finalScore: number;
		quizScore?: number;
		pitchBaseScore?: number;
		pitchTimeBonus?: number;
		pitchHostBonus?: number;
		pitchScore?: number;
		onNextPlayer?: () => void;
	} = $props();

	const rank = $derived.by(() => {
		return rankLabelFromScore(
			effectiveRankScore({
				mode,
				finalScore,
				quizScore,
				pitchScore
			})
		);
	});

	// Count-up animation
	let displayScore = $state(0);
	let displayQuiz = $state(0);
	let displayPitch = $state(0);

	function countUp(setter: (v: number) => void, target: number, delay = 0): () => void {
		if (!target) return () => {};

		let timeoutId: ReturnType<typeof setTimeout> | null = null;
		let intervalId: ReturnType<typeof setInterval> | null = null;

		timeoutId = setTimeout(() => {
			const duration = 700;
			const steps = 40;
			const interval = duration / steps;
			let step = 0;
			intervalId = setInterval(() => {
				step++;
				setter(Math.round((step / steps) * target));
				if (step >= steps && intervalId !== null) {
					clearInterval(intervalId);
				}
			}, interval);
		}, delay);

		return () => {
			if (timeoutId !== null) {
				clearTimeout(timeoutId);
			}
			if (intervalId !== null) {
				clearInterval(intervalId);
			}
		};
	}

	onMount(() => {
		const disposers: Array<() => void> = [];

		disposers.push(countUp((v) => (displayScore = v), finalScore, 100));
		disposers.push(countUp((v) => (displayQuiz = v), quizScore ?? 0, 300));
		disposers.push(countUp((v) => (displayPitch = v), pitchScore ?? 0, 500));

		return () => {
			for (const dispose of disposers) {
				dispose();
			}
		};
	});

	const modeBadgeStyle = $derived.by(() => {
		if (mode === 'hybrid') return 'background: var(--brand-teal); color: #003330;';
		if (mode === 'quiz-only') return 'background: var(--brand-blue); color: #fff;';
		return 'background: var(--brand-coral); color: #2a0a00;';
	});
</script>

<div class="mx-auto flex min-h-dvh max-w-4xl items-center px-5 py-8">
	<div class="glow-card w-full rounded-3xl p-7 md:p-10" style="animation: fadeInUp 350ms ease both;">
		<!-- Top row: name + score -->
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<p class="label-cap">Round Complete</p>
				<h2 class="mt-1 font-['Kanit'] text-4xl font-extrabold leading-tight md:text-5xl">{name}</h2>
			</div>
			<div class="text-right">
				<p class="label-cap">Final Score</p>
				<p
					class="font-['Kanit'] font-extrabold tabular-nums text-[var(--brand-amber)]"
					style="font-size: clamp(3.5rem, 8vw, 5.5rem); line-height: 1; animation: scoreReveal 500ms 150ms ease both; opacity: 0;"
				>{displayScore}</p>
			</div>
		</div>

		<!-- Rank + mode pills -->
		<div class="mt-4 flex flex-wrap gap-2">
			<span
				class="rounded-full px-4 py-1 text-sm font-bold"
				style="background: var(--brand-blue); color: #fff;"
			>{rank}</span>
			<span
				class="rounded-full px-4 py-1 text-sm font-bold uppercase tracking-wider"
				style={modeBadgeStyle}
			>{mode}</span>
		</div>

		<!-- Score breakdown -->
		<div class="mt-6 grid gap-3 md:grid-cols-2">
			{#if quizScore !== undefined}
				<div
					class="rounded-2xl p-5"
					style="background: var(--surface-2); border-left: 3px solid var(--brand-teal); animation: fadeInUp 300ms 350ms ease both; opacity: 0;"
				>
					<p class="label-cap">Quiz Score</p>
					<p class="mt-2 font-['Kanit'] text-4xl font-extrabold">{displayQuiz}</p>
				</div>
			{/if}
			{#if pitchScore !== undefined}
				<div
					class="rounded-2xl p-5"
					style="background: var(--surface-2); border-left: 3px solid var(--brand-amber); animation: fadeInUp 300ms 500ms ease both; opacity: 0;"
				>
					<p class="label-cap">Pitch Score</p>
					<p class="mt-2 font-['Kanit'] text-4xl font-extrabold text-[var(--brand-amber)]">{displayPitch}</p>
					{#if pitchBaseScore !== undefined && pitchTimeBonus !== undefined && pitchHostBonus !== undefined}
						<p class="mt-2 text-sm opacity-80">
							{pitchBaseScore} base + {pitchTimeBonus} time + {pitchHostBonus} host bonus
						</p>
					{/if}
				</div>
			{/if}
			{#if quizScore === undefined && pitchScore === undefined}
				<!-- fallback for quiz-only or pitch-only with one score slot -->
				<div
					class="rounded-2xl p-5"
					style="background: var(--surface-2); border-left: 3px solid var(--brand-teal);"
				>
					<p class="label-cap">Score</p>
					<p class="mt-2 font-['Kanit'] text-4xl font-extrabold">{displayScore}</p>
				</div>
			{/if}
		</div>

		<!-- CTA box -->
		<div
			class="mt-7 rounded-2xl border p-5"
			style="border-color: rgb(0 169 160 / 45%); background: rgb(0 169 160 / 8%); animation: borderPulse 2.5s ease infinite;"
		>
			<p class="text-sm font-bold">Join RC4Entre →</p>
			<p class="mt-1 text-sm opacity-85">
				Ask our booth team about startup competitions, grants, and community projects.
			</p>
		</div>

		<button class="btn brand-btn mt-7 rounded-xl px-8 text-base" onclick={onNextPlayer}>
			Next Player →
		</button>
	</div>
</div>
