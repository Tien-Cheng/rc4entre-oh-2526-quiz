<script lang="ts">
	import type { LeaderboardEntry } from '$lib/types/game';

	let { entries = [] as LeaderboardEntry[] } = $props();
</script>

<div class="glow-card rounded-2xl p-4">
	<div class="mb-3 flex items-center justify-between">
		<h3 class="font-['Kanit'] text-lg font-bold tracking-wide">Live Leaderboard</h3>
		<span class="badge badge-outline text-xs">Local device</span>
	</div>

	{#if entries.length === 0}
		<p class="text-sm opacity-70">No players yet. Be the first to set the bar.</p>
	{:else}
		<div class="space-y-2">
			{#each entries.slice(0, 5) as entry, idx}
				<div class="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm">
					<div class="flex items-center gap-2">
						<span class="badge badge-sm badge-neutral">#{idx + 1}</span>
						<span class="font-semibold">{entry.name}</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="badge badge-outline badge-sm uppercase">{entry.mode}</span>
						<span class="font-bold text-[var(--brand-amber)]">{entry.score}</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
