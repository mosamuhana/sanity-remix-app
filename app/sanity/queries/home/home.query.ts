import groq from "groq";
import { type } from "arktype";

import { getClient } from "~/sanity/client";

const arkHome = type({
  "title?": "string | null",
  "siteTitle?": "string | null",
});

// Hover to infer...
export type HomeDocument = typeof arkHome.infer;


const createQuery = () => groq`*[_id == "home"][0]{title, siteTitle}`;

let _query: string | undefined;

const query = () => _query ??= createQuery();

async function fetch(preview: boolean): Promise<HomeDocument | null> {
  const result = await getClient(preview).fetch(query());
  const { data, problems } = arkHome(result);
  if (problems) return null;
  return data;
}

export const homeQuery = {
  get query() { return query(); },
  fetch
};
