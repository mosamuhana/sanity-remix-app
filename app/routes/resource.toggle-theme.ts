import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { themeCookie } from "~/lib/theme.cookie";

export const action: ActionFunction = async ({ request }) => {
	const theme = await themeCookie.parse(request);
	const themePreference = theme === `dark` ? `light` : `dark`;

	return json(
		{ themePreference },
		{
			headers: {
				"Set-Cookie": await themeCookie.serialize(themePreference),
			},
		},
	);
};

export const loader: LoaderFunction = () => redirect("/", { status: 404 });
