<script lang="ts">
	import type { GameMode, LeaderboardEntry } from '$lib/types/game';

	type EntriesByMode = Record<GameMode, LeaderboardEntry[]>;

	let {
		entriesByMode = {
			hybrid: [],
			'quiz-only': [],
			'pitch-only': []
		} as EntriesByMode
	}: {
		entriesByMode?: EntriesByMode;
	} = $props();

	const modeSections: Array<{ mode: GameMode; label: string }> = [
		{ mode: 'hybrid', label: 'Hybrid' },
		{ mode: 'quiz-only', label: 'Quiz Only' },
		{ mode: 'pitch-only', label: 'Pitch Only' }
	];
</script>

<div class="glow-card rounded-2xl p-4">
	<div class="mb-3 flex items-center justify-between">
		<h3 class="font-['Kanit'] text-lg font-bold tracking-wide">Leaderboard By Mode</h3>
		<span class="badge badge-outline text-xs">Local device</span>
	</div>

	{#if modeSections.every(({ mode }) => entriesByMode[mode].length === 0)}
		<p class="text-sm opacity-70">No players yet. Be the first to set the bar.</p>
	{:else}
		<div class="space-y-4">
			{#each modeSections as { mode, label }}
				<div class="rounded-xl border border-white/10 bg-white/5 p-3">
					<div class="mb-2 flex items-center justify-between">
						<p class="text-xs uppercase tracking-[0.2em] opacity-70">{label}</p>
						<span class="badge badge-outline badge-xs">{entriesByMode[mode].length} entries</span>
					</div>

					{#if entriesByMode[mode].length === 0}
						<p class="text-xs opacity-60">No scores yet.</p>
					{:else}
						<div class="space-y-2">
							{#each entriesByMode[mode] as entry, idx}
								<div class="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm">
									<div class="flex items-center gap-2">
										<span class="badge badge-sm badge-neutral">#{idx + 1}</span>
										<span class="font-semibold">{entry.name}</span>
									</div>
									<span class="font-bold text-[var(--brand-amber)]">{entry.score}</span>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
