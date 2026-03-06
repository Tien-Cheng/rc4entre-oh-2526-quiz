<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { base } from '$app/paths';
	import LeaderboardCard from '$lib/components/leaderboard/LeaderboardCard.svelte';
	import type { GameMode, LeaderboardEntry, LeaderboardStatus } from '$lib/types/game';

	let {
		onStart = () => {},
		entriesByMode = {
			hybrid: [],
			'quiz-only': []
		} as Record<GameMode, LeaderboardEntry[]>,
		leaderboardStatus = {
			backend: 'local-fallback',
			healthy: true,
			message: 'Local fallback mode'
		} as LeaderboardStatus
	}: {
		onStart?: () => void;
		entriesByMode?: Record<GameMode, LeaderboardEntry[]>;
		leaderboardStatus?: LeaderboardStatus;
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
	<section class="glow-card relative overflow-hidden rounded-3xl p-6 md:p-8" style="animation: fadeInUp 350ms ease both;">
		<!-- Decorative blobs -->
		<div
			class="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full"
			style="background: radial-gradient(circle, rgb(246 190 45 / 40%), transparent 65%);"
		></div>
		<div
			class="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full"
			style="background: radial-gradient(circle, rgb(0 169 160 / 30%), transparent 65%);"
		></div>

		<img src={`${base}/assets/rc4-entre-logo.png`} alt="RC4Entre logo" class="relative mb-5 h-12 w-auto" />
		<p class="label-cap relative mb-2 text-[var(--brand-amber)]">RC4 Open House 2026</p>
		<h1
			class="relative font-['Kanit'] text-5xl font-extrabold leading-[1.05] md:text-7xl"
			style="animation: fadeInUp 400ms 80ms ease both;"
		>Startup Sprint<br />Arena</h1>

		<!-- Teal accent bar + description -->
		<div class="relative mt-4 flex gap-4">
			<div class="mt-1 h-auto w-[3px] flex-shrink-0 rounded-full" style="background: linear-gradient(to bottom, var(--brand-teal), transparent);"></div>
			<p class="text-base/7 opacity-85 md:text-lg">
				Answer rapid-fire startup questions, then try a random pitch challenge. Quiz score decides the leaderboard.
			</p>
		</div>

		<!-- Startup fact card with crossfade -->
		<div class="relative mt-6 rounded-2xl border p-4" style="border-color: var(--border-soft); background: var(--surface-2);">
			<p class="label-cap">Startup fact</p>
			{#key factIndex}
				<p class="fact-text mt-2 text-base font-semibold text-[var(--brand-amber)]">{startupFacts[factIndex]}</p>
			{/key}
		</div>

		<div class="relative mt-7 flex flex-wrap gap-3">
			<button class="btn brand-btn btn-lg rounded-xl px-9" onclick={() => onStart()}>
				Play in 2 minutes →
			</button>
		</div>
	</section>

	<section class="space-y-4" style="animation: fadeInUp 350ms 120ms ease both;">
		<LeaderboardCard {entriesByMode} status={leaderboardStatus} />
		<div class="glow-card rounded-2xl p-5">
			<p class="label-cap mb-3">How to play</p>
			<ol class="space-y-3">
				{#each ['Enter your name and start your round.', 'Finish the quiz, then take on the pitch challenge in hybrid mode.', 'Top quiz score earns RC4Entre bragging rights and prizes.'] as step, i}
					<li class="flex items-start gap-3 text-sm opacity-90">
						<span
							class="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full text-[10px] font-bold"
							style="background: var(--brand-teal); color: #003330;"
						>{i + 1}</span>
						{step}
					</li>
				{/each}
			</ol>
		</div>
	</section>
</div>
