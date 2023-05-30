import { Resvg } from "@resvg/resvg-js";
import satori, { type SatoriOptions } from "satori";

import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "~/routes/resource.og";
import { buildImage } from "~/sanity/image";
import { type SanityDocumentWithArtist } from "~/sanity/queries/record";
import { fetchFontAsset } from "~/lib/assets";

export async function generatePngFromDocument(doc: SanityDocumentWithArtist, origin: string) {
	const { title, artist, image } = doc;
	const imageUrl = !image ? null : buildImage(image).size(800, 800).url()
	const fontSansData = await fetchFontAsset(origin, 'Inter');

	const options: SatoriOptions = {
		width: OG_IMAGE_WIDTH,
		height: OG_IMAGE_HEIGHT,
		fonts: [
			{
				name: "Inter",
				data: fontSansData,
				style: "normal",
			},
		],
	};

	// Create the SVG with satori
	const svg = await satori(
		<div
			style={{
				width: options.width,
				height: options.height,
				background: "linear-gradient( 135deg, black 10%, #444 100%)",
				color: "white",
				fontFamily: "Inter",
				letterSpacing: "-0.05em",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				lineHeight: 1,
			}}
		>
			<div
				style={{
					width: imageUrl ? options.width - 500 : options.width,
					display: "flex",
					flexDirection: "column",
					padding: 50,
					gap: 25,
				}}
			>
				<div style={{ fontSize: 100 }}>{title}</div>
				{artist?.title ? (
					<div style={{ fontSize: 40 }}>{artist.title}</div>
				) : null}
			</div>
			{imageUrl ? (
				<div
					style={{
						width: 500,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<img alt="" src={imageUrl} width="500" height="500" />
				</div>
			) : null}
		</div>,
		options,
	);

	// Convert to PNG with resvg
	const resvg = new Resvg(svg);

  return resvg.render().asPng();
}
