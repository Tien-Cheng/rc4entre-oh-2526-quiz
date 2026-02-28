<script lang="ts">
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
		if (finalScore >= 95) return 'VC Charmer';
		if (finalScore >= 75) return 'Market Hunter';
		if (finalScore >= 55) return 'Idea Spark';
		return 'First-Time Founder';
	});
</script>

<div class="mx-auto flex min-h-dvh max-w-4xl items-center px-5 py-8">
	<div class="glow-card w-full rounded-3xl p-7 md:p-10">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div>
				<p class="text-xs uppercase tracking-[0.2em] opacity-70">Round Complete</p>
				<h2 class="font-['Kanit'] text-4xl font-extrabold">{name}</h2>
			</div>
			<div class="text-right">
				<p class="text-xs uppercase tracking-[0.2em] opacity-70">Final Score</p>
				<p class="font-['Kanit'] text-5xl font-extrabold text-[var(--brand-amber)]">{finalScore}</p>
			</div>
		</div>

		<div class="mt-4 flex flex-wrap gap-3">
			<span class="badge badge-lg border-0 bg-[var(--brand-blue)] text-white">{rank}</span>
			<span class="badge badge-lg badge-outline uppercase">{mode}</span>
		</div>

		<div class="mt-6 grid gap-3 md:grid-cols-2">
			<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
				<p class="text-sm uppercase tracking-[0.2em] opacity-70">Quiz Score</p>
				<p class="mt-1 text-3xl font-bold">{quizScore ?? '-'}</p>
			</div>
			<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
				<p class="text-sm uppercase tracking-[0.2em] opacity-70">Pitch Score</p>
				<p class="mt-1 text-3xl font-bold">{pitchScore ?? '-'}</p>
			</div>
		</div>

		<div class="mt-7 rounded-2xl border border-[var(--brand-teal)]/50 bg-[var(--brand-teal)]/10 p-4">
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
