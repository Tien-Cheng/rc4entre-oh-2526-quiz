<script lang="ts">
	let { onToggle = () => {} }: { onToggle?: () => void } = $props();
</script>

<button
	type="button"
	class="fixed right-2 top-2 z-30 h-8 w-8 rounded-full border border-white/20 bg-black/45 text-xs opacity-40 transition hover:opacity-90"
	onclick={() => onToggle()}
	aria-label="Open host controls"
>
	H
</button>
