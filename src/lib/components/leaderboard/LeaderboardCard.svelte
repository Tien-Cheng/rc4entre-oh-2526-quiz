<script lang="ts">
	import type { GameMode, LeaderboardEntry, LeaderboardStatus } from '$lib/types/game';

	type EntriesByMode = Record<GameMode, LeaderboardEntry[]>;

	let {
		entriesByMode = {
			hybrid: [],
			'quiz-only': []
		} as EntriesByMode,
		status = {
			backend: 'local-fallback',
			healthy: true,
			message: 'Local fallback mode'
		} as LeaderboardStatus
	}: {
		entriesByMode?: EntriesByMode;
		status?: LeaderboardStatus;
	} = $props();

	const medals = ['🥇', '🥈', '🥉'];
	const statusStyles = 'background: rgb(246 190 45 / 16%); color: var(--brand-amber);';
	const entries = $derived.by(() =>
		Object.values(entriesByMode)
			.flat()
			.slice()
			.sort((a, b) => b.score - a.score || b.timestamp - a.timestamp)
	);

	const showStatusChip = $derived.by(() => status.backend !== 'cloud' || !status.healthy);
	const statusLabel = 'Local fallback';

	const statusHint = $derived.by(() =>
		status.healthy ? status.message ?? 'Leaderboard connected' : status.message ?? 'Sync error'
	);
</script>

<div class="glow-card rounded-2xl p-5">
	<div class="mb-4 flex items-center justify-between">
		<h3 class="font-['Kanit'] text-lg font-extrabold tracking-wide">Leaderboard</h3>
		{#if showStatusChip}
			<span
				class="rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider"
				style="{statusStyles} border: 1px solid rgb(255 255 255 / 10%);"
				title={statusHint}
			>{statusLabel}</span>
		{/if}
	</div>

	{#if entries.length === 0}
		<p class="text-sm opacity-60">No players yet. Be the first to set the bar.</p>
	{:else}
		<div class="surface-card p-3">
			<div class="mb-2 flex items-center justify-between">
				<p class="label-cap">Quiz Scores</p>
				<span class="text-[10px] opacity-50">{entries.length} entries</span>
			</div>
			<div class="space-y-1">
				{#each entries as entry, idx}
					<div
						class="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors"
						style="{idx === 0 ? 'background: rgb(0 169 160 / 10%); border: 1px solid rgb(0 169 160 / 20%);' : 'background: rgb(255 255 255 / 4%);'}"
					>
						<div class="flex items-center gap-2">
							{#if idx < 3}
								<span class="text-sm leading-none">{medals[idx]}</span>
							{:else}
								<span class="w-5 text-center text-xs opacity-50">#{idx + 1}</span>
							{/if}
							<span class="font-semibold">{entry.name}</span>
						</div>
						<span class="font-bold tabular-nums text-[var(--brand-amber)]">{entry.score}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
