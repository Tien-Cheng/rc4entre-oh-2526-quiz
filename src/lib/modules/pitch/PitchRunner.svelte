<script lang="ts">
	import { onDestroy } from 'svelte';
	import { pitchPools } from '$lib/config/pitch-pools';
	import { selectPitchPrompt } from '$lib/modules/pitch/spin';
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

	let prompt = $state<{ product: string; audience: string } | null>(null);
	let phase = $state<'idle' | 'prep' | 'review'>('idle');
	let remainingSeconds = $state(prepSeconds);
	let timer: ReturnType<typeof setInterval> | null = null;

	function stopTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	function beginPitchRound() {
		prompt = selectPitchPrompt(pitchPools);
		remainingSeconds = prepSeconds;
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

		const timeBonus = Math.round((remainingSeconds / prepSeconds) * 20);
		onComplete({
			product: prompt.product,
			audience: prompt.audience,
			hostBonus,
			score: 50 + timeBonus + hostBonus
		});
	}

	onDestroy(() => {
		stopTimer();
	});
</script>

<div class="mx-auto flex min-h-dvh w-full max-w-5xl items-center px-5 py-7">
	<div class="glow-card w-full rounded-3xl p-6 md:p-8">
		<p class="eyebrow">Pitch Challenge</p>
		<h2 class="mt-1 font-['Kanit'] text-4xl font-extrabold">Spin and Sell</h2>
		<p class="mt-2 text-sm opacity-85">You get one random product and one random audience. Sell it like a founder.</p>

		{#if phase === 'idle'}
			<div class="mt-7 grid place-items-center gap-6">
				<div
					class="grid h-52 w-52 place-items-center rounded-full border border-white/20 text-center"
					style="background: conic-gradient(from 180deg, rgb(0 169 160 / 70%), rgb(10 124 203 / 70%), rgb(243 90 58 / 70%), rgb(246 190 45 / 70%), rgb(0 169 160 / 70%));"
				>
					<div class="grid h-40 w-40 place-items-center rounded-full bg-[var(--brand-bg)]">
						<p class="font-['Kanit'] text-2xl font-bold">SPIN</p>
					</div>
				</div>
				<button class="btn brand-btn btn-lg rounded-xl" onclick={beginPitchRound}>Generate Prompt</button>
			</div>
		{:else}
			<div class="mt-5 grid gap-4 md:grid-cols-2">
				<div class="soft-panel rounded-2xl p-4">
					<p class="eyebrow">Product</p>
					<p class="mt-2 text-xl font-bold">{prompt?.product}</p>
				</div>
				<div class="soft-panel rounded-2xl p-4">
					<p class="eyebrow">Audience</p>
					<p class="mt-2 text-xl font-bold">{prompt?.audience}</p>
				</div>
			</div>

			<div class="soft-panel mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
				<div>
					<p class="eyebrow">Prep timer</p>
					<p class="font-['Kanit'] text-4xl font-extrabold text-[var(--brand-amber)]">{remainingSeconds}s</p>
				</div>
				<div class="space-x-2">
					<span class="metric-pill border-[var(--brand-blue)]/60 bg-[var(--brand-blue)]/30 text-white">Host bonus +{hostBonus}</span>
					<button class="btn brand-btn rounded-xl" onclick={completePitch}>
						{phase === 'prep' ? 'Start Pitch Now' : 'Complete Pitch'}
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
