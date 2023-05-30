import groq from "groq";
import { type, arrayOf } from "arktype";

import { deduplicateDrafts } from "~/lib/deduplicateDrafts";
import { getClient } from "~/sanity/client";

const arkRecordStub = type({
  _id: "string",
  _type: "string",
  "title": "string | null",
  "slug": "string | null",
  "artist": "string | null",
  "image": "any | null",
});

const arkRecordStubs = arrayOf(arkRecordStub);

export type RecordStub = typeof arkRecordStub.infer;

let _query: string | null = null;

const createQuery = () => groq`*[_type == "record"][0...12] | order(title asc){
  _id,
  _type,
  title,
  "slug": slug.current,
  "artist": artist->title,
  image
}`;

const query = () => _query ??= createQuery();

async function fetch(preview: boolean): Promise<RecordStub[] | null> {
  const result = await getClient(preview).fetch(query());
  //console.log(result);
  const checkResult = arkRecordStubs(result);
  if (checkResult.problems) return null;
	let records = checkResult.data;
  if (records.length && preview) {
    records = deduplicateDrafts<RecordStub>(records);
  }
	return records;
}

export const recordStubQuery = {
  get query() { return query(); },
  fetch,
};
