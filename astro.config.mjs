import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';
import youtube from './src/markdown/youtube.js';


// https://astro.build/config
export default defineConfig({

	site: 'https://recepty.ozzyczech.cz',
	markdown: {
		remarkPlugins: [youtube]
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
				{label: 'Obědy', autogenerate: {directory: 'Obědy'}, collapsed: true},
				{label: 'Polévky', autogenerate: {directory: 'Polévky'}, collapsed: true},
				{label: 'Přílohy', collapsed: false, autogenerate: {directory: 'Příloh'}},
				{label: 'Pečení', collapsed: false, autogenerate: {directory: 'Pečení', collapsed: true}},
				{label: 'Pomazánky', autogenerate: {directory: 'Pomazánky'}, collapsed: true},
				{label: 'Vánoce', autogenerate: {directory: 'Vánoce'}, collapsed: true},
				{label: 'Zavařování', autogenerate: {directory: 'Zavařování'}, collapsed: true},
			],
		}),
	],
});