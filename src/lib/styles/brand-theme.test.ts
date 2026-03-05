import { describe, expect, it } from 'vitest';
import { BRAND_COLORS } from './brand-theme';

describe('BRAND_COLORS', () => {
	it('includes all approved logo-derived colors', () => {
		expect(BRAND_COLORS).toMatchObject({
			bg: '#04162B',
			teal: '#00A9A0',
			blue: '#0A7CCB',
			amber: '#F6BE2D',
			coral: '#F35A3A'
		});
	});
});
