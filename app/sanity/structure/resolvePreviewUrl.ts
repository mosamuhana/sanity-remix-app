import type { SanityClient, SanityDocument, Slug } from "sanity";

import { getSecret, SECRET_ID } from "~/sanity/structure/getSecret";

export type SanityDocumentWithSlug = SanityDocument & { slug: Slug };

export async function resolvePreviewUrl(doc: SanityDocumentWithSlug, client: SanityClient) {
	// Studio is a client-side only app so window should be available
	if (typeof window === "undefined") return "";

	const url = new URL("/resource/preview", window.origin);

	url.searchParams.set("type", doc._type);

	if (doc?.slug?.current) {
		url.searchParams.set("slug", doc.slug.current);
	}

	const secret = await getSecret(client, SECRET_ID, true);

	if (secret) {
		url.searchParams.set("secret", secret);
	}

	return url.toString();
}
