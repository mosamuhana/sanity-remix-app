import { type } from "arktype";

import { createCookie } from "@remix-run/node";

const COOKIE_NAME = 'themePreference';

const arkTheme = type("'light' | 'dark'");

export type Theme = typeof arkTheme.infer;

const _cookie = createCookie(COOKIE_NAME, { path: "/" });

const parse = async (request: Request): Promise<Theme | undefined> => {
	const cookieHeader = request.headers.get("Cookie");
	const cookieRaw = await _cookie.parse(cookieHeader);
	const cookie = (cookieRaw || {}) as { themePreference?: Theme; };
  const { data, problems } = arkTheme(cookie.themePreference);
  if (problems) return undefined;
	return data;
};

const serialize = async (themePreference: Theme) => {
  return await _cookie.serialize({ themePreference })
}

export const themeCookie = {
  get name() { return COOKIE_NAME; },
  parse,
  serialize
};
