<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import HostPanel from '$lib/components/host/HostPanel.svelte';
	import AttractScreen from '$lib/components/screens/AttractScreen.svelte';
	import ResultsScreen from '$lib/components/screens/ResultsScreen.svelte';
	import { defaultFlowConfig } from '$lib/config/game-defaults';
	import QuizRunner from '$lib/modules/quiz/QuizRunner.svelte';
	import PitchRunner from '$lib/modules/pitch/PitchRunner.svelte';
	import { leaderboardDefaults, leaderboardModes } from '$lib/config/leaderboard';
	import {
		createLeaderboardProvider,
		type LeaderboardProvider
	} from '$lib/services/leaderboard-provider';
	import { createGameFlow } from '$lib/state/game-flow';
	import { resolveDisplayName } from '$lib/state/player-name';
	import { combineScore } from '$lib/state/scoring';
	import type {
		GameMode,
		GamePhase,
		HybridOrder,
		LeaderboardEntry,
		LeaderboardStatus,
		ModuleCompletion
	} from '$lib/types/game';

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
	let leaderboardStatus = $state<LeaderboardStatus>({
		backend: 'local-fallback',
		healthy: true,
		message: 'Local fallback mode'
	});

	let mode = $state<GameMode>(defaultFlowConfig.mode);
	let order = $state<HybridOrder>(defaultFlowConfig.order);
	let pitchBonus = $state(10);

	let flow = createGameFlow({ mode: defaultFlowConfig.mode, order: defaultFlowConfig.order });
	let leaderboardProvider: LeaderboardProvider | null = null;
	let leaderboardSubscriptions: Array<() => void> = [];

	function ensureLeaderboardProvider() {
		if (leaderboardProvider) {
			return leaderboardProvider;
		}
		leaderboardProvider = createLeaderboardProvider();
		leaderboardStatus = leaderboardProvider.getStatus();
		return leaderboardProvider;
	}

	function stopLeaderboardStreams() {
		for (const unsubscribe of leaderboardSubscriptions) {
			unsubscribe();
		}
		leaderboardSubscriptions = [];
	}

	function startLeaderboardStreams() {
		stopLeaderboardStreams();
		const provider = ensureLeaderboardProvider();
		leaderboardSubscriptions = leaderboardModes.map((entryMode) =>
			provider.subscribeByMode(entryMode, leaderboardDefaults.attractEntries, (entries) => {
				leaderboardEntriesByMode = {
					...leaderboardEntriesByMode,
					[entryMode]: entries.slice(0, leaderboardDefaults.attractEntries)
				};
				leaderboardStatus = provider.getStatus();
			})
		);
		leaderboardStatus = provider.getStatus();
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

	async function computeAndStoreFinalScore() {
		finalScore = combineScore({
			quizScore: completion.quiz?.score,
			pitchScore: completion.pitch?.score
		});

		const provider = ensureLeaderboardProvider();
		await provider.submit({
			name: displayName,
			mode,
			score: finalScore,
			breakdown: completion
		});
		leaderboardStatus = provider.getStatus();
		if (leaderboardStatus.backend === 'local-fallback') {
			startLeaderboardStreams();
		}
	}

	function onQuizComplete(result: NonNullable<ModuleCompletion['quiz']>) {
		completion = { ...completion, quiz: result };
		flow.completeModule('quiz');
		phase = flow.currentPhase();
		if (phase === 'results') {
			void computeAndStoreFinalScore();
		}
	}

	function onPitchComplete(result: NonNullable<ModuleCompletion['pitch']>) {
		completion = { ...completion, pitch: result };
		flow.completeModule('pitch');
		phase = flow.currentPhase();
		if (phase === 'results') {
			void computeAndStoreFinalScore();
		}
	}

	function resetCurrentRound() {
		flow.reset();
		phase = 'attract';
		completion = {};
	}

	function clearLeaderboard() {
		const provider = ensureLeaderboardProvider();
		provider.clearLocalFallback();
		leaderboardStatus = provider.getStatus();
		startLeaderboardStreams();
	}

	function toggleHost() {
		hostOpen = !hostOpen;
	}

	function isTypingTarget(target: EventTarget | null): boolean {
		const element = target instanceof HTMLElement ? target : null;
		if (!element) {
			return false;
		}

		if (element.isContentEditable) {
			return true;
		}

		return element.closest('input, textarea, select, [contenteditable="true"]') !== null;
	}

	onMount(() => {
		startLeaderboardStreams();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.metaKey || event.ctrlKey || event.altKey) {
				return;
			}
			if (event.shiftKey && event.key.toLowerCase() === 'h') {
				event.preventDefault();
				toggleHost();
				return;
			}
			if (isTypingTarget(event.target)) {
				return;
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	});

	onDestroy(() => {
		stopLeaderboardStreams();
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
	<AttractScreen
		onStart={openPlayerIntro}
		entriesByMode={leaderboardEntriesByMode}
		leaderboardStatus={leaderboardStatus}
	/>
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
		answerFeedbackMs={defaultFlowConfig.answerFeedbackMs}
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
			pitchBaseScore={completion.pitch?.baseScore}
			pitchTimeBonus={completion.pitch?.timeBonus}
			pitchHostBonus={completion.pitch?.hostBonus}
			pitchScore={completion.pitch?.score}
			onNextPlayer={() => {
				phase = 'attract';
				displayName = 'Guest Player';
				completion = {};
			}}
		/>
	{/if}
