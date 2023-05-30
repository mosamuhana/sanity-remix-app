
const { theme } = require("@sanity/demo/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme,
	plugins: [require("@tailwindcss/typography")],
};
