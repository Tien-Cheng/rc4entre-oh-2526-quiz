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
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4"
		role="button"
		tabindex="0"
		aria-label="Close host panel overlay"
		onclick={onClose}
		onkeydown={(event) => {
			if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				onClose();
			}
		}}
	>
		<div
			class="glow-card w-full max-w-xl rounded-3xl p-5"
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-label="Host panel"
			onclick={(event) => event.stopPropagation()}
			onkeydown={(event) => event.stopPropagation()}
		>
			<div class="mb-4 flex items-center justify-between">
				<h2 class="font-['Kanit'] text-2xl font-bold">Host Control</h2>
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
