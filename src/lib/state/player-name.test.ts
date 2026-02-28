import { describe, expect, it } from 'vitest';
import { resolveDisplayName } from './player-name';

describe('resolveDisplayName', () => {
	it('returns trimmed player name when provided', () => {
		expect(resolveDisplayName('  Alice  ', new Date('2026-03-07T10:30:00+08:00'))).toBe('Alice');
	});

	it('returns timestamped guest name when empty', () => {
		expect(resolveDisplayName('', new Date('2026-03-07T10:30:00+08:00'))).toBe('Guest 10:30');
	});
});
