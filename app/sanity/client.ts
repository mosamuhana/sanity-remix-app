import { createClient } from "@sanity/client";
import { definePreview } from "@sanity/preview-kit";

import { projectDetails } from "~/sanity/projectDetails";

const { projectId, dataset, apiVersion } = projectDetails();

export const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true,
});

export const previewClient = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: false,
	token: process.env.SANITY_READ_TOKEN,
});

export const getClient = (previewMode = false) => previewMode ? previewClient : client;

export const writeClient = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: false,
	token: process.env.SANITY_WRITE_TOKEN,
});

export const usePreview = definePreview({ projectId, dataset });
