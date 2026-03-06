<script lang="ts">
	import { onMount } from 'svelte';
	import { rankLabelFromScore } from '$lib/state/scoring';
	import type { GameMode } from '$lib/types/game';

	let {
		name,
		mode,
		finalScore,
		quizScore,
		onNextPlayer = () => {}
	}: {
		name: string;
		mode: GameMode;
		finalScore: number;
		quizScore?: number;
		onNextPlayer?: () => void;
	} = $props();

	const rank = $derived(rankLabelFromScore(finalScore));

	const identityLine = $derived.by(() => {
		if (finalScore >= 90) return 'You think like a venture scout who spots opportunities fast.';
		if (finalScore >= 75) return 'You bring the energy of a builder who can turn ideas into action.';
		if (finalScore >= 55) return 'You have the instincts of a problem-finder who asks the right questions.';
		return 'You already have the curiosity that makes startup communities fun to explore.';
	});

	// Count-up animation
	let displayScore = $state(0);
	let displayQuiz = $state(0);

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

		return () => {
			for (const dispose of disposers) {
				dispose();
			}
		};
	});

	const modeBadgeStyle = $derived.by(() => {
		if (mode === 'hybrid') return 'background: var(--brand-teal); color: #003330;';
		return 'background: var(--brand-blue); color: #fff;';
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
					class="score-big"
					style="animation: scoreReveal 500ms 150ms ease both; opacity: 0;"
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

		<p class="mt-4 max-w-2xl text-base/7 opacity-90 md:text-lg">{identityLine}</p>

		<!-- Score breakdown -->
		<div class="mt-6 grid gap-3">
			{#if quizScore !== undefined}
				<div
					class="surface-card accent-left-teal rounded-2xl p-5"
					style="animation: fadeSlideIn 300ms 350ms ease both; opacity: 0;"
				>
					<p class="label-cap">Quiz Score</p>
					<p class="mt-2 font-['Kanit'] text-4xl font-extrabold">{displayQuiz}</p>
				</div>
			{/if}
			{#if quizScore === undefined}
				<!-- fallback if no explicit quiz breakdown is available -->
				<div
					class="surface-card accent-left-teal rounded-2xl p-5"
				>
					<p class="label-cap">Score</p>
					<p class="mt-2 font-['Kanit'] text-4xl font-extrabold">{displayScore}</p>
				</div>
			{/if}
		</div>

		<!-- CTA box -->
		<div
			class="mt-7 rounded-2xl border p-5"
			style="border-color: rgb(0 169 160 / 35%); background: rgb(0 169 160 / 6%); box-shadow: 0 0 20px rgb(0 169 160 / 10%);"
		>
			<p class="text-sm font-bold">Talk to the RC4Entre booth team →</p>
			<p class="mt-1 text-sm opacity-85">
				Ask us what RC4Entre actually does and how students get involved in the builder community.
			</p>
			<div class="mt-4 grid gap-2 text-sm opacity-85 md:grid-cols-3">
				<p>Meet people who like building ideas into real projects.</p>
				<p>Hear about startup events, pitches, and entrepreneurial experiences.</p>
				<p>Follow up at the booth and find more info there.</p>
			</div>
		</div>

		<button class="btn brand-btn mt-7 rounded-xl px-8 text-base" onclick={onNextPlayer}>
			Next Player →
		</button>
	</div>
</div>
