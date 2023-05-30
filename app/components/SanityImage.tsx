import type { PortableTextComponentProps } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/asset-utils";
import { getImageDimensions } from "@sanity/asset-utils";

import { buildImage } from "~/sanity/image";

type SanityImageAssetWithAlt = SanityImageSource & { alt?: string };

export function SanityImage(props: PortableTextComponentProps<SanityImageAssetWithAlt>) {
	const { value, isInline } = props;
	const { width, height } = getImageDimensions(value);
  const imageUrl = buildImage(value).width(isInline ? 100 : 800).url();

	return (
		<img
			className="not-prose h-auto w-full"
			src={imageUrl}
			alt={value.alt || ""}
			loading="lazy"
			style={{
				// Display alongside text if image appears inside a block text span
				display: isInline ? "inline-block" : "block",
				// Avoid jumping around with aspect-ratio CSS property
				aspectRatio: width / height,
			}}
		/>
	);
}
