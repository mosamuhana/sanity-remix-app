import type { SanityDocument } from "sanity";

export function resolveOGUrl(doc: SanityDocument) {
	// Studio is a client-side only app so window should be available
	if (typeof window === "undefined") return "";

	const url = new URL("/resource/og", window.origin);

  url.searchParams.set("id", doc._id);

  return url.toString();
}
