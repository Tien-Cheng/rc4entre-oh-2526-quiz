import adapter from '@sveltejs/adapter-static';

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'rc4entre-oh-2526-quiz';
const isUserPagesRepo = repo.toLowerCase().endsWith('.github.io');
const isGitHubPagesFallbackBuild = process.env.DEPLOY_TARGET === 'github-pages';
const base = isGitHubPagesFallbackBuild ? (isUserPagesRepo ? '' : `/${repo}`) : '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base
		}
	}
};

export default config;
