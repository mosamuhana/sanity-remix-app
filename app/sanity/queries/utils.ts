import groq from "groq";

// updated within the hour, if it's older it'll create a new secret or return null
export const secretQuery = (ttl: number) =>
	groq`*[_id == $id && dateTime(_updatedAt) > dateTime(now()) - ${ttl}][0].secret`;
