import adapter from '@sveltejs/adapter-static';

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'rc4entre-oh-2526-quiz';
const isDev = process.env.NODE_ENV === 'development';
const isUserPagesRepo = repo.toLowerCase().endsWith('.github.io');
const base = isDev || isUserPagesRepo ? '' : `/${repo}`;

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
