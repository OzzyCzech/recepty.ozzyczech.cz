import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content'
import { OGImageRoute } from 'astro-og-canvas'

type OGImageOptions = Awaited<ReturnType<Parameters<typeof OGImageRoute>[0]['getImageOptions']>>;

const allPages = await getCollection('docs')
const pages = Object.fromEntries(
	allPages.map(
		({filePath, id, data, slug}) =>
			[filePath, {data, slug, id}] as [string, Pick<CollectionEntry<'docs'>, 'id' | 'data' | 'slug'>]
	)
);

// @see https://github.com/withastro/docs/blob/main/src/pages/open-graph/%5B...path%5D.ts
export const {getStaticPaths, GET} = OGImageRoute({
	param: 'path',
	pages: pages,
	getSlug(_, page: (typeof pages)[string]) {
		return page.slug + '.webp';
	},
	getImageOptions: async (_, {data}: (typeof pages)[string]): Promise<OGImageOptions> => {
		return {
			format: 'WEBP',
			title: data.title || "Naše recepty",
			quality: 95,
			logo: {path: './src/pages/og/og-logo.png', size: [300]},
			description: data.description || "Naše rodinné recepty",
			bgGradient: [[24, 24, 27], [17, 11, 25]],
			border: {color: [17, 113, 254], side: "inline-start", width: 16},
			padding: 70,
			font: {
				title: {
					families: ['Inter'],
					lineHeight: 1,
					weight: 'SemiBold',
					color: [255, 255, 255],
					size: 72,
				},
				description: {
					families: ['Inter'],
					lineHeight: 1.5,
					weight: 'Normal',
					color: [191, 193, 201],
					size: 42,
				},
			},
			fonts: [
				'./src/pages/og/Inter-Regular.woff2',
				'./src/pages/og/Inter-SemiBold.woff2',
			]
		}
	},
})