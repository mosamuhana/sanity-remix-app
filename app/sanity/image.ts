import imageUrlBuilder from "@sanity/image-url";
import { type SanityImageSource } from "@sanity/asset-utils";

import { projectDetails } from "~/sanity/projectDetails";

const { projectId, dataset } = projectDetails();

export const imageBuilder = imageUrlBuilder({ projectId, dataset });

export const buildImage = (source: SanityImageSource) => {
	return imageBuilder.image(source).fit("max").auto("format");
}
