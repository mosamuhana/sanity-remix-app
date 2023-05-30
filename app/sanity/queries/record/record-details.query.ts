import groq from "groq";
import { scope } from "arktype";

import { client } from "~/sanity/client";

const types = scope({
  record: {
    _id: "string",
    title: "string | null",
    slug: "string | null",
    likes: "number",
    dislikes: "number",
    artist: "string | null",
    "tracks?": "Track[] | null",
    "image?": "any | null",
    "content?": "any[] | null",
  },
  Track: {
    _key: "string",
    title: "string | null",
    duration: "number | null",
  },
}).compile();

export type RecordDocument = typeof types.record.infer;

const createQuery = () => groq`*[_type == "record" && slug.current == $slug][0]{
  _id,
  title,
  // GROQ can re-shape data in the request!
  "slug": slug.current,
  "artist": artist->title,
  // coalesce() returns the first value that is not null
  // so we can ensure we have at least a zero
  "likes": coalesce(likes, 0),
  "dislikes": coalesce(dislikes, 0),
  // for simplicity in this demo these are typed as "any"
  // we can make them type-safe with a little more work
  image,
  content,
  // this is how we extract values from arrays
  tracks[]{_key,title,duration}
}`;

let _query: string | undefined;

const query = () => _query ??= createQuery();

async function fetch(slug: string): Promise<RecordDocument | null> {
	const result = await client.fetch(query(), { slug });
  const { data, problems } = types.record(result);
  if (problems) return null;
  return data;
}

export const recordDetailsQuery = {
  get query() { return query(); },
  fetch,
};
