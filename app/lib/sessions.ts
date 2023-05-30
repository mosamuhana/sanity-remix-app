// https://remix.run/docs/en/v1/api/remix#sessions
import {
	type SessionStorage,
	type Session,
	createCookieSessionStorage,
} from '@remix-run/node';

export const sessionStorage: SessionStorage = createCookieSessionStorage({
	cookie: {
		name: "__session",
		httpOnly: true,
		maxAge: 60,
		path: "/",
		sameSite: "lax",
		secrets: [String(process.env.SANITY_PREVIEW_SECRET)],
		secure: true,
	},
});

export async function getSession(requestOrCookieHeader?: Request | string | null ): Promise<Session> {
	let cookie: string | null = null;
	if (requestOrCookieHeader) {
		if (requestOrCookieHeader instanceof Request) {
			cookie = requestOrCookieHeader.headers.get('Cookie');
		} else {
			cookie = requestOrCookieHeader;
		}
	}
	return await sessionStorage.getSession(cookie);
}

export async function commitSession(requestOrSession: Request | Session): Promise<string> {
	const session = await _getSessionFrom(requestOrSession);
	return await sessionStorage.commitSession(session);
}

export async function destroySession(requestOrSession: Request | Session): Promise<string> {
	const session = await _getSessionFrom(requestOrSession);
	return await sessionStorage.destroySession(session);
}

export async function getPreviewToken(request: Request) {
	const session = await getSession(request);
	const token = session.get("token");

	return {
		preview: !!token,
		token: token ? String(token) : null,
	};
}

async function _getSessionFrom(requestOrSession: Request | Session): Promise<Session> {
	if (requestOrSession instanceof Request) {
		return await getSession(requestOrSession);
	} else {
		return requestOrSession;
	}
}
