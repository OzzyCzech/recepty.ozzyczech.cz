#!/usr/bin/env npx babel-node

import {join} from 'path';
import {getPages} from '@sphido/core';
import frontmatter from '@sphido/frontmatter';
import twemoji from '@sphido/twemoji';
import {markdown, renderer} from '@sphido/markdown';
import meta from '@sphido/meta';
import {copy, outputFile} from 'fs-extra';
import globby from 'globby';
import getPageHtml from './src/page'
import {link} from '@sphido/link';

const domain = new URL(process.env.NODE_ENV || 'development' === 'development' ? 'http://localhost:5000/' : 'https://recepty.ozzyczech.cz/');

renderer(
	{
		table: (header, body) => `<table class="table table-bordered table-striped bg-white m-1">${header}${body}</table>`,

		image: (href, title, text) => {
			const className = new URL(href, domain).hash.slice(1).replace(/_/g, ' ');
			return `<div class=" ${className ? className : 'd-flex justify-content-center my-1'}"><figure class="figure text-center w-75">
			<img src="${href}" class="figure-img img-fluid rounded" title="${title ? title : ''}" alt="${text ? text : ''}"/>		
			<figcaption class="figure-caption text-center">${text}</figcaption></figure></div>`;
		},

		link: (href, title, text) => {
			if (href.includes(domain.hostname)) {
				return `<a href="${href}" title="${title ? title : ''}">${text}</a>`;
			}

			return `<a href="${href}" title="${title ? title : ''}" target="_blank">${text}</a>`;
		}
	}
);

(async () => {
	try {

		// 1. Get pages from directory

		const pages = await getPages(
			await globby(['recepty/**/*.{md,html}']),
			...[
				frontmatter,
				twemoji,
				markdown,
				meta,
				{link}
			]
		);

		// 2. Generate single pages...

		for await (const page of pages) {
			await outputFile(
				join(page.dir.replace('recepty', 'public'), page.slug, 'index.html'),
				getPageHtml(page, pages)
			);
		}

		// 3. generate fuse.json


		// index.json for https://fusejs.io/
		await outputFile('public/index.json', JSON.stringify(
			pages.map(
				page => ({
					title: page.title,
					content: page.content.replace(/(<([^>]+)>)/ig, ''),
					link: page.link(domain),
					tags: [...page.tags],
				})
			)
		));


		const files = await globby(['static/**/*.*', 'recepty/**/*.*', '!**/*.{md,html}']);
		for await (const file of files) {
			await copy(file, file.replace(/^\w+/, 'public'));
		}

	} catch (error) {
		console.error(error);
	}
})();
