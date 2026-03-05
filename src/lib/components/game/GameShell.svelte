<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import HostPanel from '$lib/components/host/HostPanel.svelte';
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
	let leaderboardEntriesByMode = $state<Record<GameMode, LeaderboardEntry[]>>({
		hybrid: [],
		'quiz-only': [],
		'pitch-only': []
	});

	let mode = $state<GameMode>(defaultFlowConfig.mode);
	let order = $state<HybridOrder>(defaultFlowConfig.order);
	let pitchBonus = $state(10);

	let flow = createGameFlow({ mode: defaultFlowConfig.mode, order: defaultFlowConfig.order });
	let leaderboard = createLeaderboardService('rc4entre-leaderboard-v1', { storage: null });

	function refreshLeaderboard() {
		leaderboardEntriesByMode = {
			hybrid: leaderboard.list('hybrid').slice(0, 5),
			'quiz-only': leaderboard.list('quiz-only').slice(0, 5),
			'pitch-only': leaderboard.list('pitch-only').slice(0, 5)
		};
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
	<AttractScreen onStart={openPlayerIntro} entriesByMode={leaderboardEntriesByMode} />
{:else if phase === 'player-intro'}
	<div class="mx-auto flex min-h-dvh w-full max-w-3xl items-center px-5 py-8">
		<div class="glow-card w-full rounded-3xl p-7" style="animation: fadeInUp 300ms ease both;">
			<p class="label-cap">Player Setup</p>
			<h2 class="mt-1 font-['Kanit'] text-4xl font-extrabold md:text-5xl">Ready to pitch<br />your future?</h2>
			<label class="mt-6 block">
				<span class="mb-2 block text-sm font-medium opacity-80">Your name (optional)</span>
				<input
					type="text"
					class="w-full rounded-xl px-4 py-3 text-base transition-all duration-200 name-input"
					style="
						background: var(--surface-2);
						border: 1px solid var(--border-soft);
						color: var(--ink);
						outline: none;
						font-family: inherit;
					"
					bind:value={playerName}
					maxlength="24"
					placeholder="Your name"
				/>
			</label>
			<div class="mt-6 flex flex-wrap gap-3">
				<button class="btn brand-btn rounded-xl px-8" onclick={startRound}>Start Round →</button>
				<button
					class="rounded-xl px-6 py-2 text-sm font-semibold back-btn"
					style="background: var(--surface-2); border: 1px solid var(--border-soft); color: var(--ink);"
					onclick={() => (phase = 'attract')}
				>← Back</button>
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
