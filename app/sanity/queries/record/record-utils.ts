import groq from "groq";
import type { Image, Slug } from "sanity";
import { type SanityDocument } from "@sanity/client";
import type { SanityImageSource } from "@sanity/asset-utils";

import { writeClient, previewClient } from "~/sanity/client";

export async function likeRecord(id: string) {
	return await writeClient
		.patch(id)
		.setIfMissing({ likes: 0 })
		.inc({ likes: 1 })
		.commit()
		.then(({ likes, dislikes }) => ({
			likes: likes ?? 0,
			dislikes: dislikes ?? 0,
		}));
}

export async function dislikeRecord(id: string) {
	return await writeClient
		.patch(id)
		.setIfMissing({ dislikes: 0 })
		.inc({ dislikes: 1 })
		.commit()
		.then(({ likes, dislikes }) => ({
			likes: likes ?? 0,
			dislikes: dislikes ?? 0,
		}));
}

// Confirm the passed-in slug actually exists
export async function validateRecordSlug(slug: string) {
	const recordSlug = await previewClient.fetch(
		groq`*[_type == "record" && slug.current == $slug][0].slug.current`,
		{ slug },
	);

	if (!recordSlug) return null;

	return recordSlug as string;
}

type Artist = {
  title: string;
  slug: Slug;
  image: Image;
};

export type SanityDocumentWithArtist = SanityDocument<{
  title: string;
  image?: SanityImageSource;
  artist?: Artist;
}>;

export async function fetchRecordWithArtist(id: string): Promise<SanityDocumentWithArtist | null> {
	const query = groq`*[_id == $id][0]{ ..., artist-> }`;
  const result = await previewClient.fetch(query, { id });
  if (!result) return null;
  return result;
}
