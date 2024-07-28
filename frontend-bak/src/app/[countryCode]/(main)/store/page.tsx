import type { Metadata } from "next";

import type { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import StoreTemplate from "@modules/store/templates";

export const metadata: Metadata = {
	title: "Store",
	description: "Explore all of our products.",
};

type Params = {
	searchParams: {
		sortBy?: SortOptions;
		page?: string;
	};
	params: {
		countryCode: string;
	};
};

export default async function StorePage({ searchParams, params }: Params) {
	const { sortBy, page } = searchParams;

	return (
		<StoreTemplate
			sortBy={sortBy}
			page={page}
			countryCode={params.countryCode}
		/>
	);
}
