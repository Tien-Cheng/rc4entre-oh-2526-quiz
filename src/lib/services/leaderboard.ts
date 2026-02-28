import type { GameMode, LeaderboardEntry } from '$lib/types/game';

interface ServiceOptions {
	storage?: Storage | null;
	maxEntries?: number;
}

function parseEntries(raw: string | null): LeaderboardEntry[] {
	if (!raw) {
		return [];
	}

	try {
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed)) {
			return parsed as LeaderboardEntry[];
		}
	} catch {
		return [];
	}

	return [];
}

export function createLeaderboardService(key: string, options: ServiceOptions = {}) {
	const storage =
		Object.prototype.hasOwnProperty.call(options, 'storage')
			? (options.storage ?? null)
			: typeof localStorage === 'undefined'
				? null
				: localStorage;
	const maxEntries = options.maxEntries ?? 20;
	let memoryEntries: LeaderboardEntry[] = [];

	function readAll(): LeaderboardEntry[] {
		if (!storage) {
			return memoryEntries;
		}

		return parseEntries(storage.getItem(key));
	}

	function writeAll(entries: LeaderboardEntry[]) {
		const normalized = entries
			.slice()
			.sort((a, b) => b.score - a.score || b.timestamp - a.timestamp)
			.slice(0, maxEntries);

		if (!storage) {
			memoryEntries = normalized;
			return;
		}

		storage.setItem(key, JSON.stringify(normalized));
	}

	return {
		add(entry: LeaderboardEntry) {
			const entries = readAll();
			entries.push(entry);
			writeAll(entries);
		},
		list(mode?: GameMode) {
			const entries = readAll();
			if (!mode) {
				return entries;
			}
			return entries.filter((entry) => entry.mode === mode);
		},
		clear() {
			if (!storage) {
				memoryEntries = [];
				return;
			}
			storage.removeItem(key);
		}
	};
}
