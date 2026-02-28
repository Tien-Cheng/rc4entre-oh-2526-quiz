<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { base } from '$app/paths';
	import LeaderboardCard from '$lib/components/leaderboard/LeaderboardCard.svelte';
	import type { GameMode, LeaderboardEntry } from '$lib/types/game';

	let {
		onStart = () => {},
		entriesByMode = {
			hybrid: [],
			'quiz-only': [],
			'pitch-only': []
		} as Record<GameMode, LeaderboardEntry[]>
	}: {
		onStart?: () => void;
		entriesByMode?: Record<GameMode, LeaderboardEntry[]>;
	} = $props();

	const startupFacts = [
		'Airbnb started by renting air mattresses to conference visitors.',
		'Grab began as MyTeksi and scaled across Southeast Asia.',
		'Great startups often start with one narrow beachhead market.',
		'Pitch clarity beats buzzwords in early-stage fundraising.'
	];

	let factIndex = $state(0);
	let factInterval: ReturnType<typeof setInterval> | null = null;

	onMount(() => {
		factInterval = setInterval(() => {
			factIndex = (factIndex + 1) % startupFacts.length;
		}, 3600);
	});

	onDestroy(() => {
		if (factInterval) {
			clearInterval(factInterval);
		}
	});
</script>

<div class="mx-auto grid min-h-dvh max-w-6xl grid-cols-1 gap-6 px-5 py-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
	<section class="glow-card relative overflow-hidden rounded-3xl p-6 md:p-8">
		<div class="ambient-ring -right-20 -top-20"></div>
		<img src={`${base}/assets/rc4-entre-logo.png`} alt="RC4Entre logo" class="mb-5 h-24 w-auto" />
		<p class="mb-3 eyebrow text-[var(--brand-amber)]">RC4 Open House 2026</p>
		<h1 class="hero-title">
			<span class="hero-gradient">Startup</span><br />
			Sprint Arena
		</h1>
		<p class="mt-3 max-w-xl text-base/7 opacity-90 md:text-lg">
			Answer rapid-fire startup questions, then pitch a random product to a wild audience. Finish in 2
			minutes and climb the board.
		</p>
		<div class="mt-5 flex flex-wrap gap-2">
			<span class="metric-pill">8 Questions</span>
			<span class="metric-pill">Pitch Finale</span>
			<span class="metric-pill">Top Scores</span>
		</div>

		<div class="soft-panel mt-6 rounded-2xl p-4">
			<p class="eyebrow">Startup fact</p>
			<p class="mt-2 text-lg font-semibold text-[var(--brand-amber)]">{startupFacts[factIndex]}</p>
		</div>

		<div class="mt-7 flex flex-wrap gap-3">
			<button class="btn brand-btn btn-lg rounded-xl px-8" onclick={() => onStart()}>Play in 2 minutes</button>
			<span class="inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-4 text-xs uppercase tracking-[0.2em] text-[var(--ink-dim)]">
				Host opens controls with H
			</span>
		</div>
	</section>

	<section class="space-y-5">
		<LeaderboardCard {entriesByMode} />
		<div class="glow-card rounded-2xl p-4">
			<p class="eyebrow">How to play</p>
			<ol class="mt-3 list-decimal space-y-1 pl-4 text-sm opacity-90">
				<li>Enter your name and start your round.</li>
				<li>Finish quiz and/or pitch depending on host mode.</li>
				<li>Top score earns RC4Entre bragging rights and prizes.</li>
			</ol>
		</div>
	</section>
</div>
