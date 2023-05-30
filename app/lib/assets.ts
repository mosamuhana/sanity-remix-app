const fonts = {
  Inter: 'Inter-ExtraBold.otf',
};

export type FontName = keyof typeof fonts;


export const getAssetUrl = (baseUrl: string, filePath: string) => new URL(`${filePath}`, baseUrl);

export const fetchAsset = (baseUrl: string, filePath: string) => fetch(getAssetUrl(baseUrl, filePath));

export const fetchAssetAsText = (baseUrl: string, filePath: string) =>
  fetchAsset(baseUrl, filePath).then(res => res.text());


export const fetchAssetAsArrayBuffer = (baseUrl: string, filePath: string) =>
	fetchAsset(baseUrl, filePath).then(res => res.arrayBuffer());

// Load the font from the "public" directory
export async function fetchFontAsset(baseUrl: string, fontName: FontName) {
  const fontFile = fonts[fontName];
  if (!fontFile) throw new Error(`Invalid font name '${fontName}', must be one of ${Object.keys(fonts).join(', ')}`);
  const fontPath = `fonts/${fontFile}`;
	return fetchAssetAsArrayBuffer(baseUrl, fontPath);
}
