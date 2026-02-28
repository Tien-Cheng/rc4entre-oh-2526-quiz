<script lang="ts">
	import type { GameMode, HybridOrder } from '$lib/types/game';

	let {
		mode,
		order,
		pitchBonus,
		onModeChange = (_mode: GameMode) => {},
		onOrderChange = (_order: HybridOrder) => {},
		onPitchBonusChange = (_bonus: number) => {},
		onStart = () => {}
	}: {
		mode: GameMode;
		order: HybridOrder;
		pitchBonus: number;
		onModeChange?: (mode: GameMode) => void;
		onOrderChange?: (order: HybridOrder) => void;
		onPitchBonusChange?: (bonus: number) => void;
		onStart?: () => void;
	} = $props();
</script>

<div class="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
	<div>
		<p class="text-xs uppercase tracking-[0.2em] opacity-70">Mode</p>
		<div class="mt-2 grid grid-cols-3 gap-2">
			<button class="btn btn-sm rounded-xl {mode === 'hybrid' ? 'btn-info' : 'btn-outline'}" onclick={() => onModeChange('hybrid')}>Hybrid</button>
			<button class="btn btn-sm rounded-xl {mode === 'quiz-only' ? 'btn-info' : 'btn-outline'}" onclick={() => onModeChange('quiz-only')}>Quiz Only</button>
			<button class="btn btn-sm rounded-xl {mode === 'pitch-only' ? 'btn-info' : 'btn-outline'}" onclick={() => onModeChange('pitch-only')}>Pitch Only</button>
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

	<div>
		<div class="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] opacity-70">
			<span>Pitch bonus</span>
			<span class="font-semibold normal-case">+{pitchBonus}</span>
		</div>
		<input
			type="range"
			min="0"
			max="30"
			step="1"
			class="range range-info range-sm"
			value={pitchBonus}
			oninput={(event) => onPitchBonusChange(Number((event.currentTarget as HTMLInputElement).value))}
		/>
	</div>

	<button class="btn brand-btn w-full rounded-xl" onclick={onStart}>Start Next Player</button>
</div>
