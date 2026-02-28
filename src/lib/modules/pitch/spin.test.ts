import { describe, expect, it } from 'vitest';
import { selectPitchPrompt } from './spin';

describe('selectPitchPrompt', () => {
	it('returns one product and one audience from pools', () => {
		const result = selectPitchPrompt({ products: ['A'], audiences: ['B'] }, () => 0);
		expect(result).toEqual({ product: 'A', audience: 'B' });
	});
});
