import type { EntryContext } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import { PassThrough } from "stream";
import { ServerStyleSheet } from "styled-components";

const ABORT_DELAY = 5000;

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
) {
  //console.log('[entry.server]', request.url);
	return new Promise((resolve, reject) => {
		let didError = false;
		const isStudioRoute = new URL(request.url).pathname.startsWith(`/studio`);
    const remixServer = (<RemixServer context={remixContext} url={request.url} />);

		// We're only using Styled Components in the /studio route
		// Couldn't find any docs on renderToPipeableStream + Styled Components
		if (isStudioRoute) {
			const sheet = new ServerStyleSheet();
			let markup = renderToString(
				sheet.collectStyles(remixServer),
			);

			const styles = sheet.getStyleTags();
			markup = markup.replace("__STYLES__", styles);

			responseHeaders.set("Content-Type", "text/html");

			return resolve(
				new Response("<!DOCTYPE html>" + markup, {
					status: responseStatusCode,
					headers: responseHeaders,
				}),
			);
		}

		const { pipe, abort } = renderToPipeableStream(
			remixServer,
			{
				onShellReady: () => {
					const body = new PassThrough();

					responseHeaders.set("Content-Type", "text/html");

					resolve(
						new Response(body, {
							headers: responseHeaders,
							status: didError ? 500 : responseStatusCode,
						}),
					);

					pipe(body);
				},
				onShellError: (err) => {
					reject(err);
				},
				onError: (error) => {
					didError = true;

					console.error(error);
				},
			},
		);

		setTimeout(abort, ABORT_DELAY);
	});
}
