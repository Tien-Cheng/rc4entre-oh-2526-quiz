export function resolveBasePath(input: { dev: boolean; repo: string }): string {
	if (input.dev) {
		return '';
	}

	const normalizedRepo = input.repo.toLowerCase();
	if (normalizedRepo.endsWith('.github.io')) {
		return '';
	}

	return `/${input.repo}`;
}
