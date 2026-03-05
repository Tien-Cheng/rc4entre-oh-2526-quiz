export function resolveDisplayName(playerName: string, now: Date = new Date()): string {
	const trimmed = playerName.trim();
	if (trimmed.length > 0) {
		return trimmed;
	}

	const fallbackTime = now.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});
	return `Guest ${fallbackTime}`;
}
