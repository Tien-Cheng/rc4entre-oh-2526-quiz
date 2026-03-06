<script lang="ts">
	import { onDestroy } from 'svelte';
	import { pitchPools } from '$lib/config/pitch-pools';
	import { selectPitchPrompt } from '$lib/modules/pitch/spin';
	import { computePitchScore } from '$lib/state/scoring';
	import type { PitchResult } from '$lib/types/game';

	let {
		prepSeconds,
		hostBonus,
		onComplete = (_result: PitchResult) => {}
	}: {
		prepSeconds: number;
		hostBonus: number;
		onComplete?: (result: PitchResult) => void;
	} = $props();

	const initialPrepSeconds = prepSeconds;
	let prompt = $state<{ product: string; audience: string } | null>(null);
	let phase = $state<'idle' | 'prep' | 'review'>('idle');
	let remainingSeconds = $state(initialPrepSeconds);
	let timer: ReturnType<typeof setInterval> | null = null;

	function stopTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	function beginPitchRound() {
		prompt = selectPitchPrompt(pitchPools);
		remainingSeconds = initialPrepSeconds;
		phase = 'prep';
		stopTimer();

		timer = setInterval(() => {
			remainingSeconds = Math.max(0, remainingSeconds - 1);
			if (remainingSeconds === 0) {
				phase = 'review';
				stopTimer();
			}
		}, 1000);
	}

	function completePitch() {
		if (!prompt) {
			return;
		}

		phase = 'review';
		stopTimer();

		const pitchScore = computePitchScore({
			secondsRemaining: remainingSeconds,
			prepSeconds: initialPrepSeconds,
			hostBonus
		});

		onComplete({
			product: prompt.product,
			audience: prompt.audience,
			...pitchScore
		});
	}

	onDestroy(() => {
		stopTimer();
	});
</script>

<div class="mx-auto flex min-h-dvh w-full max-w-5xl items-center px-5 py-7">
	<div class="glow-card w-full rounded-3xl p-6 md:p-8" style="animation: fadeInUp 300ms ease both;">
		<p class="label-cap">Pitch Challenge</p>
		<h2 class="mt-1 font-['Kanit'] text-4xl font-extrabold">Spin and Sell</h2>
		<p class="mt-2 text-sm opacity-80">You get one random product and one random audience. Sell it like a founder.</p>

		{#if phase === 'idle'}
			<div class="mt-8 grid place-items-center gap-6">
				<!-- Spinning wheel ring -->
				<div class="relative grid place-items-center">
					<div
						class="pitch-wheel-ring h-52 w-52 rounded-full"
						style="background: conic-gradient(from 0deg, rgb(0 169 160 / 75%), rgb(10 124 203 / 75%), rgb(243 90 58 / 75%), rgb(246 190 45 / 75%), rgb(0 169 160 / 75%));"
					>
					</div>
					<!-- Inner circle sits on top -->
					<div
						class="absolute grid h-40 w-40 place-items-center rounded-full"
						style="background: var(--brand-bg);"
					>
						<p class="font-['Kanit'] text-2xl font-extrabold tracking-widest text-[var(--brand-teal)]">SPIN</p>
					</div>
				</div>
				<button class="btn brand-btn btn-lg rounded-xl px-10" onclick={beginPitchRound}>
					Generate Prompt →
				</button>
			</div>
		{:else}
			<!-- Product + audience cards -->
			<div class="mt-6 grid gap-4 md:grid-cols-2">
				<div
					class="rounded-2xl p-5"
					style="background: var(--surface-2); border-left: 3px solid var(--brand-teal); animation: fadeInUp 300ms 60ms ease both; opacity: 0;"
				>
					<p class="label-cap">Product</p>
					<p class="mt-2 text-xl font-bold">{prompt?.product}</p>
				</div>
				<div
					class="rounded-2xl p-5"
					style="background: var(--surface-2); border-left: 3px solid var(--brand-blue); animation: fadeInUp 300ms 160ms ease both; opacity: 0;"
				>
					<p class="label-cap">Audience</p>
					<p class="mt-2 text-xl font-bold">{prompt?.audience}</p>
				</div>
			</div>

			<!-- Timer + actions bar -->
			<div
				class="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5"
				style="background: var(--surface-2); border: 1px solid var(--border-soft); animation: fadeInUp 300ms 220ms ease both; opacity: 0;"
			>
				<div>
					<p class="label-cap">Prep timer</p>
					<p
						class="font-['Kanit'] text-5xl font-extrabold tabular-nums transition-colors duration-500"
						style="
							color: {remainingSeconds <= 5 ? 'var(--brand-coral)' : remainingSeconds <= 10 ? 'var(--brand-amber)' : 'var(--ink)'};
							{remainingSeconds <= 5 ? 'animation: pulseGlow 900ms ease infinite;' : ''}
						"
					>{remainingSeconds}s</p>
				</div>
				<div class="flex flex-wrap items-center gap-3">
					<span
						class="rounded-full px-3 py-1 text-sm font-semibold"
						style="background: rgb(10 124 203 / 20%); color: var(--brand-blue); border: 1px solid rgb(10 124 203 / 30%);"
					>Host-awarded bonus +{hostBonus}</span>
					<button class="btn brand-btn rounded-xl px-6" onclick={completePitch}>
						{phase === 'prep' ? 'Start Pitch Now →' : 'Complete Pitch ✓'}
					</button>
				</div>
			</div>

			<div
				class="mt-4 rounded-2xl p-5 text-sm"
				style="background: var(--surface-2); border: 1px solid var(--border-soft); animation: fadeInUp 300ms 280ms ease both; opacity: 0;"
			>
				<p class="label-cap">How pitch scoring works</p>
				<p class="mt-2 opacity-85">Final pitch score = 50 base points + up to 20 time bonus + the host-awarded bonus.</p>
				<p class="mt-2 opacity-70">Time bonus depends on how many prep seconds are left when the pitch starts.</p>
			</div>
		{/if}
	</div>
</div>
