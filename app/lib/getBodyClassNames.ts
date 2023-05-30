import { type Theme } from "~/lib/theme.cookie";

export function getBodyClassNames(themePreference?: Theme): string {
	// Use browser default if cookie is not set
	const isDarkMode =
		!themePreference && typeof document !== "undefined"
			? window.matchMedia("(prefers-color-scheme: dark)").matches
			: themePreference === `dark`;
	return [
		`transition-colors duration-1000 ease-in-out min-h-screen`,
		isDarkMode ? `dark bg-black text-white` : `bg-white text-black`,
	]
		.join(" ")
		.trim();
}
