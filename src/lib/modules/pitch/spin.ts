interface PromptPools {
	products: string[];
	audiences: string[];
}

export function selectPitchPrompt(pools: PromptPools, rng: () => number = Math.random) {
	const productIndex = Math.floor(rng() * pools.products.length);
	const audienceIndex = Math.floor(rng() * pools.audiences.length);

	return {
		product: pools.products[productIndex],
		audience: pools.audiences[audienceIndex]
	};
}
