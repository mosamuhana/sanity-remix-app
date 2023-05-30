import { Link } from "@remix-run/react";

import { PreviewWrapper } from "~/components/PreviewWrapper";
import { useRootLoaderData } from "~/lib/useRootLoaderData";

type Props = {
	siteTitle?: string | null;
};

export function Logo(props: Props) {
	const { query: homeQuery, params: homeParams } = useRootLoaderData();

	const { siteTitle } = props;

	if (siteTitle && typeof document !== 'undefined') {
		console.info(`Create and publish "home" document in Sanity Studio at ${window.origin}/studio/desk/home`);
	}

	return (
		<p className="text-lg font-bold tracking-tighter text-black dark:text-white lg:text-2xl">
			<PreviewWrapper
				data={{ siteTitle }}
				render={({ siteTitle }) => (
					<Link to="/">{siteTitle ?? `Sanity Remix`}</Link>
				)}
				query={homeQuery}
				params={homeParams}
			/>
		</p>
	);
}
