import type { SanityImageObjectStub } from "@sanity/asset-utils";

import { buildImage } from "~/sanity/image";

type Props = {
	title?: string | null;
	image?: SanityImageObjectStub | null;
};

export function RecordCover({ title, image }: Props) {
	const imageUrl = !image ? null : buildImage(image).size(800, 800).url();

	return (
		<div className="aspect-square bg-gray-50">
			{imageUrl ? (
				<img
					className="h-auto w-full object-cover shadow-black transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-cyan-200"
					src={imageUrl}
					alt={String(title) ?? ``}
					loading="lazy"
				/>
			) : (
				<div className="flex aspect-square w-full items-center justify-center bg-gray-100 text-gray-500">
					{title ?? `Missing Record art`}
				</div>
			)}
		</div>
	);
}
