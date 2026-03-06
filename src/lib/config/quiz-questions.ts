import type { QuizQuestion } from '$lib/types/game';

export const quizQuestions: QuizQuestion[] = [
	{
		id: 'startup-definition',
		prompt: 'What makes a startup different?',
		options: [
			'It is built to grow fast around a new solution',
			'It is any small business with under 30 staff',
			'It only sells through apps or websites',
			'It has already raised venture capital'
		],
		answerIndex: 0,
		explanation: 'A startup is designed to scale fast, not just stay small and steady.',
		category: 'startup'
	},
	{
		id: 'founder-first-step',
		prompt: 'A founder has an idea. What should happen first?',
		options: [
			'Talk to potential users and test the problem',
			'Rent a bigger office to look established',
			'Hire a full sales team immediately',
			'Spend the budget on a launch party'
		],
		answerIndex: 0,
		explanation: 'Good startups learn from real users early before spending heavily on scale.',
		category: 'startup'
	},
	{
		id: 'valley-of-death',
		prompt: "What is the startup 'Valley of Death'?",
		options: [
			'When cash is running out before the business is sustainable',
			'When co-founders argue over job titles',
			'When a launch event gets low turnout',
			'When investors sell after an IPO'
		],
		answerIndex: 0,
		explanation: 'Many startups fail in this gap between early spending and reliable revenue.',
		category: 'startup'
	},
	{
		id: 'startup-vs-sme',
		prompt: 'What do startups usually chase more than SMEs?',
		options: [
			'Fast, scalable growth',
			'Stable demand with predictable margins',
			'Lower risk and slower change',
			'Guaranteed profit in year one'
		],
		answerIndex: 0,
		explanation: 'Startups usually optimize for rapid growth, while SMEs often optimize for stability.',
		category: 'startup'
	},
	{
		id: 'vc-meaning',
		prompt: 'What does VC do?',
		options: [
			'Invests in high-growth startups for equity',
			'Runs payroll and HR for startups',
			'Builds online stores for founders',
			'Gives personal loans with monthly interest'
		],
		answerIndex: 0,
		explanation: 'VC means venture capital: investors backing startups in exchange for ownership.',
		category: 'funding'
	},
	{
		id: 'vc-return',
		prompt: 'If a VC invests, what do they usually get?',
		options: ['Equity', 'Fixed monthly interest', 'Control of all hiring', 'A guaranteed profit share'],
		answerIndex: 0,
		explanation: 'VC money usually buys ownership, not a guaranteed repayment like a loan.',
		category: 'funding'
	},
	{
		id: 'first-funding-source',
		prompt: 'Where does startup money often come from first?',
		options: ['Founder savings', 'A Series B fund', 'An IPO grant', 'Bank debt at scale'],
		answerIndex: 0,
		explanation: 'Many teams bootstrap first before outside investors join the story.',
		category: 'funding'
	},
	{
		id: 'vc-myth',
		prompt: 'True or False: Every good startup needs VC money.',
		options: ['False', 'True', 'Only after hiring 50 people', 'Only if it has an app'],
		answerIndex: 0,
		explanation: 'Some startups need VC, but plenty grow through revenue, grants, or bootstrapping.',
		category: 'funding'
	},
	{
		id: 'tam-meaning',
		prompt: 'What is TAM?',
		options: [
			'Your full possible market',
			'Your target ad message',
			'Your team and advisors map',
			'Your total annual margin'
		],
		answerIndex: 0,
		explanation: 'TAM is the biggest market you could serve if everything went right.',
		category: 'market'
	},
	{
		id: 'beachhead-market',
		prompt: 'What is a beachhead market?',
		options: [
			'Your first focused customer segment',
			'Your cheapest customer segment',
			'Your first discount campaign',
			'Your premium-only market'
		],
		answerIndex: 0,
		explanation: 'Winning one narrow segment first makes expansion easier later.',
		category: 'market'
	},
	{
		id: 'moat-definition',
		prompt: 'What is a moat in business?',
		options: [
			'An advantage competitors struggle to copy',
			'A rule for raising investment',
			'A fast hiring plan',
			'A short-term ad strategy'
		],
		answerIndex: 0,
		explanation: 'A moat could be brand, network effects, tech, or distribution that others cannot copy easily.',
		category: 'market'
	},
	{
		id: 'pilot-scale',
		prompt: "What does 'pilot, then scale' mean?",
		options: [
			'Test small before expanding',
			'Launch everywhere on day one',
			'Raise first, build later',
			'Brand first, users later'
		],
		answerIndex: 0,
		explanation: 'Small tests help founders learn before spending big on growth.',
		category: 'market'
	},
	{
		id: 'users-no-revenue',
		prompt: 'A startup has users but little revenue. What matters most next?',
		options: [
			'Learn why users stay and what they will pay for',
			'Order company hoodies for the whole team',
			'Open offices in three countries',
			'Raise prices without asking anyone'
		],
		answerIndex: 0,
		explanation: 'The next step is understanding retention and value, not pretending scale has arrived.',
		category: 'market'
	},
	{
		id: 'airbnb-origin',
		prompt: 'Which startup began with air mattresses in an apartment?',
		options: ['Airbnb', 'Stripe', 'Dropbox', 'Shopify'],
		answerIndex: 0,
		explanation: 'Airbnb started with a scrappy test, which is classic startup behavior.',
		category: 'bonus'
	},
	{
		id: 'shopify-origin',
		prompt: 'Which company started because its founders wanted to sell snowboards online?',
		options: ['Shopify', 'Slack', 'Zoom', 'Canva'],
		answerIndex: 0,
		explanation: 'Shopify began as a store for snowboards before becoming a platform for merchants everywhere.',
		category: 'bonus'
	},
	{
		id: 'pie-slice',
		prompt: 'True or False: A bigger slice of a tiny pie is always better.',
		options: ['False', 'True', 'Depends only on title', 'Always true after Series A'],
		answerIndex: 0,
		explanation: 'A smaller share of something huge can beat a big share of something tiny.',
		category: 'bonus'
	},
	{
		id: 'customer-signal',
		prompt: 'Which signal is strongest that a startup solves a real problem?',
		options: [
			'Users come back and recommend it',
			'The logo looks expensive',
			'The pitch deck has 40 slides',
			'The founder uses startup buzzwords'
		],
		answerIndex: 0,
		explanation: 'Retention and word of mouth are stronger signals than polish alone.',
		category: 'bonus'
	}
];
