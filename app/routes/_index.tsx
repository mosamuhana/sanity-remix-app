import type {
	LinksFunction,
	LoaderArgs,
	V2_MetaFunction as MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { PreviewWrapper } from "~/components/PreviewWrapper";
import { Records } from "~/components/Records";
import { Title } from "~/components/Title";
import { getPreviewToken } from "~/lib/sessions";
import { useRootLoaderData, matcheRootHomeData } from "~/lib/useRootLoaderData";
import { recordStubQuery, type RecordStub } from "~/sanity/queries/record";
import tailwind from "~/styles/tailwind.css";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: tailwind }];
};

export const meta: MetaFunction = ({ matches }) => {
	const home = matcheRootHomeData(matches);
	const title = [home?.title, home?.siteTitle].filter(Boolean).join(" | ");

	return [{ title }];
};

export const loader = async ({ request }: LoaderArgs) => {
	const { preview } = await getPreviewToken(request);
	const records: RecordStub[] | null = await recordStubQuery.fetch(preview);

	if (!records) {
		throw new Response("Not found", { status: 404 });
	}

	return json({
		records,
		query: preview ? recordStubQuery.query : null,
		params: preview ? {} : null,
	});
};

export default function Index() {
	const { records = [], query, params } = useLoaderData<typeof loader>();
	const { home, query: homeQuery, params: homeParams } = useRootLoaderData();

	return (
		<div className="grid grid-cols-1 gap-6 md:gap-12">
			<PreviewWrapper
				data={home}
				render={data => (data?.title ? <Title>{data.title}</Title> : null)}
				query={homeQuery}
				params={homeParams}
			/>
			<PreviewWrapper<RecordStub[]>
				data={records as RecordStub[]}
				render={data => <Records records={data ?? []} />}
				query={query}
				params={params}
			/>
		</div>
	);
}
