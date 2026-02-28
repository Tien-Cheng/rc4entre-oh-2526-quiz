<script lang="ts">
	import HostLauncher from '$lib/components/host/HostLauncher.svelte';
	import type { GameMode, HybridOrder } from '$lib/types/game';

	let {
		open,
		mode,
		order,
		pitchBonus,
		soundEnabled,
		onModeChange = (_mode: GameMode) => {},
		onOrderChange = (_order: HybridOrder) => {},
		onPitchBonusChange = (_bonus: number) => {},
		onSoundToggle = () => {},
		onClearLeaderboard = () => {},
		onResetRound = () => {},
		onStart = () => {},
		onClose = () => {}
	}: {
		open: boolean;
		mode: GameMode;
		order: HybridOrder;
		pitchBonus: number;
		soundEnabled: boolean;
		onModeChange?: (mode: GameMode) => void;
		onOrderChange?: (order: HybridOrder) => void;
		onPitchBonusChange?: (bonus: number) => void;
		onSoundToggle?: () => void;
		onClearLeaderboard?: () => void;
		onResetRound?: () => void;
		onStart?: () => void;
		onClose?: () => void;
	} = $props();

function handleWindowKeydown(event: KeyboardEvent) {
	if (open && event.key === 'Escape') {
		event.preventDefault();
		onClose();
	}
}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

{#if open}
	<div class="fixed inset-0 z-50 grid place-items-center p-4" role="presentation">
		<button
			type="button"
			aria-label="Close host panel overlay"
			class="absolute inset-0 bg-black/55"
			onclick={onClose}
		></button>
		<div
			class="glow-card relative z-10 w-full max-w-xl rounded-3xl p-5"
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-label="Host panel"
		>
			<div class="mb-4 flex items-center justify-between">
				<div>
					<p class="eyebrow">Operator Console</p>
					<h2 class="font-['Kanit'] text-2xl font-bold">Host Control</h2>
				</div>
				<button class="btn btn-sm btn-ghost" onclick={onClose}>Close</button>
			</div>

			<HostLauncher
				{mode}
				{order}
				{pitchBonus}
				{onModeChange}
				{onOrderChange}
				{onPitchBonusChange}
				{onStart}
			/>

			<div class="mt-4 grid grid-cols-1 gap-2 md:grid-cols-3">
				<button class="btn btn-outline rounded-xl" onclick={onSoundToggle}>
					Sound: {soundEnabled ? 'On' : 'Off'}
				</button>
				<button class="btn btn-outline rounded-xl" onclick={onResetRound}>Reset Current</button>
				<button class="btn btn-outline btn-error rounded-xl" onclick={onClearLeaderboard}>Clear Board</button>
			</div>
		</div>
	</div>
{/if}
