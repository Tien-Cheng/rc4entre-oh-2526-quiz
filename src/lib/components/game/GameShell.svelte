<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import HostPanel from '$lib/components/host/HostPanel.svelte';
	import HostToggle from '$lib/components/host/HostToggle.svelte';
	import AttractScreen from '$lib/components/screens/AttractScreen.svelte';
	import ResultsScreen from '$lib/components/screens/ResultsScreen.svelte';
	import { defaultFlowConfig } from '$lib/config/game-defaults';
	import QuizRunner from '$lib/modules/quiz/QuizRunner.svelte';
	import PitchRunner from '$lib/modules/pitch/PitchRunner.svelte';
	import { createLeaderboardService } from '$lib/services/leaderboard';
	import { createGameFlow } from '$lib/state/game-flow';
	import { resolveDisplayName } from '$lib/state/player-name';
	import { combineScore } from '$lib/state/scoring';
	import type { GameMode, GamePhase, HybridOrder, LeaderboardEntry, ModuleCompletion } from '$lib/types/game';

	let hostOpen = $state(false);
	let soundEnabled = $state(true);
	let phase = $state<GamePhase>('attract');
	let playerName = $state('');
	let displayName = $state('Guest Player');
	let finalScore = $state(0);
	let completion = $state<ModuleCompletion>({});
	let leaderboardEntries = $state<LeaderboardEntry[]>([]);

	let mode = $state<GameMode>(defaultFlowConfig.mode);
	let order = $state<HybridOrder>(defaultFlowConfig.order);
	let pitchBonus = $state(10);

	let flow = createGameFlow({ mode: defaultFlowConfig.mode, order: defaultFlowConfig.order });
	let leaderboard = createLeaderboardService('rc4entre-leaderboard-v1', { storage: null });

	function refreshLeaderboard() {
		leaderboardEntries = leaderboard.list().slice(0, 8);
	}

	function openPlayerIntro() {
		completion = {};
		playerName = '';
		displayName = 'Guest Player';
		phase = 'player-intro';
	}

	function startRound() {
		completion = {};
		displayName = resolveDisplayName(playerName);
		flow = createGameFlow({ mode, order });
		flow.start();
		phase = flow.currentPhase();
	}

	function computeAndStoreFinalScore() {
		finalScore = combineScore({
			quizScore: completion.quiz?.score,
			pitchScore: completion.pitch?.score
		});

		leaderboard.add({
			name: displayName,
			mode,
			score: finalScore,
			timestamp: Date.now(),
			breakdown: completion
		});
		refreshLeaderboard();
	}

	function onQuizComplete(result: NonNullable<ModuleCompletion['quiz']>) {
		completion = { ...completion, quiz: result };
		flow.completeModule('quiz');
		phase = flow.currentPhase();
		if (phase === 'results') {
			computeAndStoreFinalScore();
		}
	}

	function onPitchComplete(result: NonNullable<ModuleCompletion['pitch']>) {
		completion = { ...completion, pitch: result };
		flow.completeModule('pitch');
		phase = flow.currentPhase();
		if (phase === 'results') {
			computeAndStoreFinalScore();
		}
	}

	function resetCurrentRound() {
		flow.reset();
		phase = 'attract';
		completion = {};
	}

	function clearLeaderboard() {
		leaderboard.clear();
		refreshLeaderboard();
	}

	function toggleHost() {
		hostOpen = !hostOpen;
	}

	onMount(() => {
		leaderboard = createLeaderboardService('rc4entre-leaderboard-v1');
		refreshLeaderboard();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key.toLowerCase() === 'h') {
				event.preventDefault();
				toggleHost();
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	});

	onDestroy(() => {
		hostOpen = false;
	});
</script>

<HostToggle onToggle={toggleHost} />
<HostPanel
	open={hostOpen}
	{mode}
	{order}
	{pitchBonus}
	{soundEnabled}
	onModeChange={(nextMode: GameMode) => (mode = nextMode)}
	onOrderChange={(nextOrder: HybridOrder) => (order = nextOrder)}
	onPitchBonusChange={(nextBonus: number) => (pitchBonus = nextBonus)}
	onSoundToggle={() => (soundEnabled = !soundEnabled)}
	onClearLeaderboard={clearLeaderboard}
	onResetRound={resetCurrentRound}
	onStart={() => {
		hostOpen = false;
		openPlayerIntro();
	}}
	onClose={() => (hostOpen = false)}
/>

{#if phase === 'attract'}
	<AttractScreen onStart={openPlayerIntro} onOpenHost={() => (hostOpen = true)} entries={leaderboardEntries} />
{:else if phase === 'player-intro'}
	<div class="mx-auto flex min-h-dvh w-full max-w-3xl items-center px-5 py-8">
		<div class="glow-card w-full rounded-3xl p-7">
			<p class="text-xs uppercase tracking-[0.2em] opacity-70">Player Setup</p>
			<h2 class="mt-1 font-['Kanit'] text-4xl font-extrabold">Ready to pitch your future?</h2>
			<label class="mt-5 block">
				<span class="mb-2 block text-sm opacity-80">Name (optional)</span>
				<input
					type="text"
					class="input input-bordered w-full rounded-xl bg-white/5"
					bind:value={playerName}
					maxlength="24"
					placeholder="Your name"
				/>
			</label>
			<div class="mt-6 flex flex-wrap gap-3">
				<button class="btn brand-btn rounded-xl px-8" onclick={startRound}>Start Round</button>
				<button class="btn btn-outline rounded-xl" onclick={() => (phase = 'attract')}>Back</button>
			</div>
		</div>
	</div>
{:else if phase === 'quiz'}
	<QuizRunner
		questionLimit={defaultFlowConfig.questionLimit}
		secondsPerQuestion={defaultFlowConfig.secondsPerQuestion}
		onComplete={onQuizComplete}
	/>
{:else if phase === 'pitch'}
	<PitchRunner prepSeconds={defaultFlowConfig.pitchPrepSeconds} hostBonus={pitchBonus} onComplete={onPitchComplete} />
	{:else if phase === 'results'}
		<ResultsScreen
			name={displayName}
			{mode}
			{finalScore}
			quizScore={completion.quiz?.score}
			pitchScore={completion.pitch?.score}
			onNextPlayer={() => {
				phase = 'attract';
				displayName = 'Guest Player';
				completion = {};
			}}
		/>
	{/if}
