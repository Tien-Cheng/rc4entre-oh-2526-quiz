<script lang="ts">
	import { effectiveRankScore, rankLabelFromScore } from '$lib/state/scoring';
	import type { GameMode } from '$lib/types/game';

	let {
		name,
		mode,
		finalScore,
		quizScore,
		pitchScore,
		onNextPlayer = () => {}
	}: {
		name: string;
		mode: GameMode;
		finalScore: number;
		quizScore?: number;
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
</script>

<div class="mx-auto flex min-h-dvh max-w-4xl items-center px-5 py-8">
	<div class="glow-card w-full rounded-3xl p-7 md:p-10">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div>
				<p class="eyebrow">Round Complete</p>
				<h2 class="font-['Kanit'] text-4xl font-extrabold">{name}</h2>
			</div>
			<div class="text-right">
				<p class="eyebrow">Final Score</p>
				<p class="hero-gradient font-['Kanit'] text-5xl font-extrabold">{finalScore}</p>
			</div>
		</div>

		<div class="mt-4 flex flex-wrap gap-3">
			<span class="metric-pill border-[var(--brand-blue)]/60 bg-[var(--brand-blue)]/30 text-white">{rank}</span>
			<span class="metric-pill uppercase">{mode}</span>
		</div>

		<div class="mt-6 grid gap-3 md:grid-cols-2">
			<div class="soft-panel rounded-2xl p-4">
				<p class="eyebrow">Quiz Score</p>
				<p class="mt-1 text-3xl font-bold">{quizScore ?? '-'}</p>
			</div>
			<div class="soft-panel rounded-2xl p-4">
				<p class="eyebrow">Pitch Score</p>
				<p class="mt-1 text-3xl font-bold">{pitchScore ?? '-'}</p>
			</div>
		</div>

		<div class="soft-panel mt-7 rounded-2xl border-[var(--brand-teal)]/60 bg-[var(--brand-teal)]/16 p-4">
			<p class="text-sm font-semibold">Join RC4Entre</p>
			<p class="mt-1 text-sm opacity-90">
				Ask our booth team about startup competitions, grants, and community projects.
			</p>
		</div>

		<button class="btn brand-btn mt-7 w-full rounded-xl text-base md:w-auto" onclick={onNextPlayer}>
			Next Player
		</button>
	</div>
</div>
