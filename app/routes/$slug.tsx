import type {
	ActionFunction,
	LinksFunction,
	LoaderArgs,
	V2_MetaFunction as MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { PreviewWrapper } from "~/components/PreviewWrapper";
import { Record } from "~/components/Record";
import { getPreviewToken } from "~/lib/sessions";
import { matcheRootHomeData } from "~/lib/useRootLoaderData";
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "~/routes/resource.og";
import { writeClient } from "~/sanity/client";
import { recordDetailsQuery, likeRecord, dislikeRecord } from "~/sanity/queries/record";
import styles from "~/styles/app.css";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: styles }];
};

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
	const home = matcheRootHomeData(matches);
	const title = [data?.record?.title, home?.siteTitle].filter(Boolean).join(" | ");
	const ogImageUrl = data?.ogImageUrl ?? '';

	return [
		{ title },
		{ property: "twitter:card", content: "summary_large_image" },
		{ property: "twitter:title", content: title },
		{ property: "og:title", content: title },
		{ property: "og:image:width", content: String(OG_IMAGE_WIDTH) },
		{ property: "og:image:height", content: String(OG_IMAGE_HEIGHT) },
		{ property: "og:image", content: ogImageUrl },
	];
};

// Perform a `like` or `dislike` mutation on a `record` document
export const action: ActionFunction = async ({ request }) => {
	if (request.method !== "POST") {
		throw new Response("Method not allowed", { status: 405 });
	}

	const { token, projectId } = writeClient.config();

	if (!token) {
		throw new Response(`Setup "SANITY_WRITE_TOKEN" with a token with "Editor" permissions to your environment variables. Create one at https://sanity.io/manage/project/${projectId}/api#tokens`, { status: 401 });
	}

	const body = await request.formData();
	const id = String(body.get("id"));
	const action = String(body.get("action"));

	if (id) {
		switch (action) {
			case "LIKE":
				return await likeRecord(id);
			case "DISLIKE":
				return await dislikeRecord(id);
			default:
				return json({ message: "Invalid action" }, 400);
		}
	}

	return json({ message: "Bad request" }, 400);
};

// Load the `record` document with this slug
export const loader = async ({ params, request }: LoaderArgs) => {
	const { preview } = await getPreviewToken(request);

	const record = await recordDetailsQuery.fetch(params.slug!)

	if (!record) {
		throw new Response("Not found", { status: 404 });
	}

	// Create social share image url
	const { origin } = new URL(request.url);

	const ogImageUrl = `${origin}/resource/og?id=${record._id}`;

	return json({
		record,
		ogImageUrl,
		query: preview ? recordDetailsQuery.query : null,
		params: preview ? params : null,
	});
};

export default function RecordPage() {
	const { record, query, params } = useLoaderData<typeof loader>();

	return (
		<PreviewWrapper
			data={record}
			render={Record}
			query={query}
			params={params}
		/>
	);
}
