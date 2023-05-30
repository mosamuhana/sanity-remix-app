import type {
	LinksFunction,
	LoaderArgs,
	V2_MetaFunction as MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useLocation,
} from "@remix-run/react";

import { ExitPreview } from "~/components/ExitPreview";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { themeCookie } from "~/lib/theme.cookie";
import { getBodyClassNames } from "~/lib/getBodyClassNames";
import { getPreviewToken } from "~/lib/sessions";
import { homeQuery } from "~/sanity/queries/home";

export type RootLoaderData = typeof loader;

export const meta: MetaFunction<RootLoaderData> = () => {
	return [
		//{ title: "New Remix App" },
	];
};

export const links: LinksFunction = () => {
	return [
		{
			rel: "preconnect",
			href: "https://cdn.sanity.io",
		},
		{
			rel: "preconnect",
			href: "https://fonts.gstatic.com",
			crossOrigin: "anonymous",
		},
		{
			rel: "preconnect",
			href: "https://fonts.googleapis.com",
			crossOrigin: "anonymous",
		},
		{
			href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;700&family=Inter:wght@500;700;800&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap",
			rel: "stylesheet",
		},
	];
}

export const loader = async ({ request }: LoaderArgs) => {
	const { token, preview } = await getPreviewToken(request);
	const themePreference = await themeCookie.parse(request);

	// Sanity content throughout the site
	const home = await homeQuery.fetch(preview);

	return json({
		home,
		preview,
		query: preview ? homeQuery.query : token,
		params: preview ? {} : null,
		// Note: This makes the token available to the client if they have an active session
		// This is useful to show live preview to unauthenticated users
		// If you would rather not, replace token with `null` and it will rely on your Studio auth
		token: preview ? token : null,
		themePreference,
		ENV: {
			SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
			SANITY_DATASET: process.env.SANITY_DATASET,
			SANITY_API_VERSION: process.env.SANITY_API_VERSION,
		},
	});
};

export default function App() {
	const { ENV, themePreference, home, preview } = useLoaderData<RootLoaderData>();

	const { pathname } = useLocation();
	const isStudioRoute = pathname.startsWith("/studio");
	const bodyClassNames = getBodyClassNames(themePreference);

	return (
		<html lang="en">
			<head>
				<Meta />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<link rel="icon" href="https://fav.farm/🔥" />
				<Links />
				{isStudioRoute && typeof document === "undefined" ? "__STYLES__" : null}
			</head>
			<body className={bodyClassNames}>
				{isStudioRoute
					? (<Outlet />)
					: (
						<>
							<Header siteTitle={home?.siteTitle} />
							<div className="container mx-auto p-4 lg:p-12">
								<Outlet />
							</div>
							<Footer />
						</>
				)}
				{preview ? <ExitPreview /> : null}
				<ScrollRestoration />
				<script dangerouslySetInnerHTML={{ __html: `window.ENV = ${JSON.stringify(ENV)}` }} />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
