import type { QuizQuestion } from '$lib/types/game';

export const quizQuestions: QuizQuestion[] = [
	{
		id: 'startup-definition',
		prompt: 'What best describes a startup?',
		options: [
			'A company designed to scale quickly around a new or better solution',
			'Any company with fewer than 30 employees',
			'A business that only sells online',
			'A company that has already raised VC money'
		],
		answerIndex: 0,
		explanation:
			'Startups are built for rapid growth, usually by solving a problem in a novel way.',
		category: 'startup'
	},
	{
		id: 'startup-vs-sme',
		prompt: 'What is a common difference between a startup and a regular SME?',
		options: [
			'Startups usually aim for exponential growth while SMEs prioritize steady profitability',
			'SMEs cannot use technology while startups can',
			'Startups must be incorporated overseas',
			'SMEs are always funded by VC'
		],
		answerIndex: 0,
		explanation:
			'Startups optimize for fast scaling and often accept higher early risk than traditional SMEs.',
		category: 'startup'
	},
	{
		id: 'valley-of-death',
		prompt: "What is the startup 'Valley of Death'?",
		options: [
			'The phase where costs are high and revenue is still too low to sustain operations',
			'A legal dispute between co-founders',
			'A product launch event that failed',
			'The period after an IPO lock-up'
		],
		answerIndex: 0,
		explanation:
			'Many early ventures fail when cash burn outpaces traction before product-market fit is reached.',
		category: 'startup'
	},
	{
		id: 'vc-meaning',
		prompt: 'VC stands for what, and what do they do?',
		options: [
			'Venture Capital; they invest pooled funds into high-growth startups',
			'Value Creation; they manage startup payroll',
			'Virtual Commerce; they run e-commerce storefronts',
			'Verified Credit; they issue personal loans to founders'
		],
		answerIndex: 0,
		explanation:
			'VC funds deploy investor capital into startups with the goal of outsized returns.',
		category: 'funding'
	},
	{
		id: 'vc-return',
		prompt: 'If a VC invests in your company, what do they usually receive?',
		options: ['Equity ownership', 'Guaranteed monthly interest', 'A board seat only', 'Full control of hiring'],
		answerIndex: 0,
		explanation: 'Most VC deals exchange capital for equity, not fixed-interest repayment.',
		category: 'funding'
	},
	{
		id: 'first-funding-source',
		prompt: 'What is typically the first startup funding source?',
		options: ['Founder savings (bootstrapping)', 'Series B institutional fund', 'Government IPO grant', 'Corporate debt'],
		answerIndex: 0,
		explanation: 'Many teams start by bootstrapping before taking external investment.',
		category: 'funding'
	},
	{
		id: 'tam-meaning',
		prompt: 'What does TAM represent?',
		options: [
			'Total Addressable Market',
			'Time to Acquisition Milestone',
			'Targeted Annual Margin',
			'Total Available Monetization'
		],
		answerIndex: 0,
		explanation: 'TAM estimates total revenue opportunity if you captured 100% of the relevant market.',
		category: 'market'
	},
	{
		id: 'beachhead-market',
		prompt: 'What is a beachhead market?',
		options: [
			'A focused first customer segment used to prove product fit before expansion',
			'Your lowest-margin market segment',
			'A temporary discount campaign for early users',
			'A market where only premium users buy'
		],
		answerIndex: 0,
		explanation:
			'A beachhead strategy narrows focus early, improving execution and learning speed.',
		category: 'market'
	},
	{
		id: 'moat-definition',
		prompt: 'In business, a MOAT is:',
		options: [
			'A durable competitive advantage that is hard to copy',
			'A legal requirement before fundraising',
			'A hiring plan for rapid scaling',
			'A temporary ad campaign strategy'
		],
		answerIndex: 0,
		explanation:
			'Examples include brand strength, network effects, proprietary technology, and distribution advantages.',
		category: 'market'
	},
	{
		id: 'pilot-scale',
		prompt: "'Pilot -> Scale' means:",
		options: [
			'Test in a small segment first, then expand after validation',
			'Launch globally at full scale on day one',
			'Raise funding before building any product',
			'Prioritize branding before customer interviews'
		],
		answerIndex: 0,
		explanation: 'Pilot-first reduces risk and gives evidence before investing in broad expansion.',
		category: 'market'
	},
	{
		id: 'airbnb-origin',
		prompt: 'Which famous startup began with air mattresses in an apartment?',
		options: ['Airbnb', 'Stripe', 'Dropbox', 'Shopify'],
		answerIndex: 0,
		explanation: 'Airbnb started as an air-bed rental idea and scaled into a global platform.',
		category: 'bonus'
	},
	{
		id: 'pie-slice',
		prompt: 'True or False: A bigger slice of a tiny pie is always better than a smaller slice of a huge pie.',
		options: ['False', 'True', 'Depends only on title', 'Always true after Series A'],
		answerIndex: 0,
		explanation:
			'A smaller percentage in a much larger company can create far greater absolute value.',
		category: 'bonus'
	}
];
