import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { previewClient } from "~/sanity/client";
import { validateRecordSlug } from "~/sanity/queries/record";
import { getSecret, SECRET_ID } from "~/sanity/structure/getSecret";
import { commitSession, destroySession, getSession } from "~/lib/sessions";

const PREVIEW_TYPES = [`record`, `home`];

const unauthorized = (msg: string) => new Response(msg, { status: 401 });

// A `POST` request to this route will exit preview mode
export const action: ActionFunction = async ({ request }) => {
	if (request.method !== "POST") {
		return json({ message: "Method not allowed" }, 405);
	}

	return redirect("/", {
		headers: {
			"Set-Cookie": await destroySession(request),
		},
	});
};

// A `GET` request to this route will enter preview mode
// It will check if the "token" document in the dataset
// Is the same as the one passed in the query string
// If so, it will write the Viewer Token to the session
export const loader = async ({ request }: LoaderArgs) => {
	const { token, projectId } = previewClient.config();

	if (!token) {
		return unauthorized(`Setup "SANITY_READ_TOKEN" with a token with "Viewer" permissions to your environment variables. Create one at https://sanity.io/manage/project/${projectId}/api#tokens`);
	}

	const requestUrl = new URL(request.url);

	// Check the URL has a valid type
	const type = requestUrl.searchParams.get("type");

	if (!type) {
		return unauthorized("No document type in preview URL");
	}

	if (!PREVIEW_TYPES.includes(type)) {
		return unauthorized("Invalid document type for preview");
	}

	// Check the URL has a ?secret param
	const secret = requestUrl.searchParams.get("secret");

	if (!secret) {
		return unauthorized("No secret in URL");
	}

	// Check the secret is valid
	const validSecret = await getSecret(previewClient, SECRET_ID, false);

	if (validSecret !== secret) {
		return unauthorized("Invalid secret");
	}

	let validSlug = `/`;

	// Records have slugs, home page does not
	if (type === `record`) {
		// Check the URL has a valid ?slug param)
		const slug = requestUrl.searchParams.get("slug");

		if (!slug) {
			return unauthorized("No slug in preview URL");
		}

		// Confirm the passed-in slug actually exists
		const recordSlug = await validateRecordSlug(slug);

		if (!recordSlug) {
			return unauthorized("Invalid slug");
		}

		validSlug = `/${recordSlug}`;
	}

	// Write viewer token to session so that every route can authenticate by it
	const session = await getSession(request);

	session.set(`token`, token);

	return redirect(validSlug, {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
};
