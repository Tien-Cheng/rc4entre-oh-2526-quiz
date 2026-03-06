<script lang="ts">
	import type { GameMode, HybridOrder } from '$lib/types/game';

	let {
		mode,
		order,
		onModeChange = (_mode: GameMode) => {},
		onOrderChange = (_order: HybridOrder) => {},
		onStart = () => {}
	}: {
		mode: GameMode;
		order: HybridOrder;
		onModeChange?: (mode: GameMode) => void;
		onOrderChange?: (order: HybridOrder) => void;
		onStart?: () => void;
	} = $props();
</script>

<div class="surface-card space-y-4 rounded-2xl p-4">
	<div>
		<p class="text-xs uppercase tracking-[0.2em] opacity-70">Mode</p>
		<div class="mt-2 grid grid-cols-2 gap-2">
			<button class="btn btn-sm rounded-xl {mode === 'hybrid' ? 'btn-info' : 'btn-outline'}" onclick={() => onModeChange('hybrid')}>Hybrid</button>
			<button class="btn btn-sm rounded-xl {mode === 'quiz-only' ? 'btn-info' : 'btn-outline'}" onclick={() => onModeChange('quiz-only')}>Quiz Only</button>
		</div>
	</div>

	{#if mode === 'hybrid'}
		<div>
			<p class="text-xs uppercase tracking-[0.2em] opacity-70">Hybrid Order</p>
			<div class="mt-2 grid grid-cols-2 gap-2">
				<button class="btn btn-sm rounded-xl {order === 'quiz-first' ? 'btn-secondary' : 'btn-outline'}" onclick={() => onOrderChange('quiz-first')}>Quiz -> Pitch</button>
				<button class="btn btn-sm rounded-xl {order === 'pitch-first' ? 'btn-secondary' : 'btn-outline'}" onclick={() => onOrderChange('pitch-first')}>Pitch -> Quiz</button>
			</div>
		</div>
	{/if}

	<button class="btn brand-btn w-full rounded-xl" onclick={onStart}>Start Next Player</button>
</div>
