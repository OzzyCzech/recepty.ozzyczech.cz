import {defineConfig, passthroughImageService} from 'astro/config';
import starlight from '@astrojs/starlight';
import youtube from './src/markdown/youtube.js';


// https://astro.build/config
export default defineConfig({

	site: 'https://recepty.ozzyczech.cz',
	markdown: {
		remarkPlugins: [youtube]
	},
	image: {
		service: passthroughImageService(),
	},
	integrations: [
		starlight({
			title: 'Moje recepty',
			tableOfContents: false,
			pagination: false,
			customCss: ['./src/styles.css'],
			editLink: {
				baseUrl: 'https://github.com/OzzyCzech/recepty.ozzyczech.cz/edit/master/',
			},
			social: {
				github: 'https://github.com/OzzyCzech/recepty.ozzyczech.cz',
			},
			sidebar: [
				{label: 'Obědy', collapsed: false, autogenerate: {directory: 'Obědy', collapsed: true}},
				{label: 'Polévky', collapsed: false, autogenerate: {directory: 'Polévky'}},
				{label: 'Přílohy', collapsed: false, autogenerate: {directory: 'Příloh'}},
				{label: 'Pečení', collapsed: false, autogenerate: {directory: 'Pečení', collapsed: true}},
				{label: 'Pomazánky', collapsed: true, autogenerate: {directory: 'Pomazánky'}},
				{label: 'Vánoce', collapsed: true, autogenerate: {directory: 'Vánoce'}},
				{label: 'Zavařování', collapsed: true, autogenerate: {directory: 'Zavařování'}},
			],
		}),
	],
});