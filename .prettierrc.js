/** @type {import('prettier').Config} */
module.exports = {
  plugins: [require('prettier-plugin-tailwindcss')],
  tailwindConfig: './tailwind.config.js',
  tailwindFunctions: ['clsx'],

  semi: true,
  //printWidth: 100,
  bracketSpacing: true,
  singleQuote: false,
  trailingComma: 'all',
  jsxSingleQuote: false,
  singleAttributePerLine: true, // default: false
  bracketSameLine: false,
  htmlWhitespaceSensitivity: 'css', // @default 'css'
  endOfLine: 'lf',
  tabWidth: 2,
  useTabs: true,  // default: false
};
