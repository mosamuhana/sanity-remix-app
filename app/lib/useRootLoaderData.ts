import type { SerializeFrom } from "@remix-run/node";
import { useRouteLoaderData, type RouteMatch } from "@remix-run/react";

import type { RootLoaderData } from "~/root";

export function useRootLoaderData() {
	const data = useRouteLoaderData(`root`) as SerializeFrom<RootLoaderData>;
	return data;
}

export const matcheRootData = (matches: RouteMatch[]) => {
	const rootRouteMatch = matches.find(match => match.id === 'root');
	return rootRouteMatch?.data as SerializeFrom<RootLoaderData> | undefined;
};

//export const matcheRootHomeData = (matches: RouteMatch[]) => matcheRootData(matches)?.home ?? undefined;

export const matcheRootHomeData = (matches: RouteMatch[]) => {
	const home = matcheRootData(matches)?.home;
	if (!home) return undefined;
	return {
		title: home.title,
		siteTitle: home.siteTitle,
	}
}
