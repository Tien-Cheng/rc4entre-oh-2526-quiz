import { describe, expect, it } from 'vitest';
import { resolveBasePath } from './base-path';

describe('resolveBasePath', () => {
	it('returns empty base in dev mode', () => {
		expect(resolveBasePath({ dev: true, repo: 'rc4entre-oh-2526-quiz' })).toBe('');
	});

	it('returns repo path in production mode', () => {
		expect(resolveBasePath({ dev: false, repo: 'rc4entre-oh-2526-quiz' })).toBe('/rc4entre-oh-2526-quiz');
	});

	it('returns empty base for user pages repository', () => {
		expect(resolveBasePath({ dev: false, repo: 'tiencheng.github.io' })).toBe('');
	});
});
