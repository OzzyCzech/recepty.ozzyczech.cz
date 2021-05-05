#!/usr/bin/env npx babel-node

import {join} from 'path';
import {getPages} from '@sphido/core';
import {frontmatter} from '@sphido/frontmatter';
import {emoji} from '@sphido/emoji';
import {markdown, renderer} from '@sphido/markdown';
import {meta} from '@sphido/meta';
import {copy, outputFile} from 'fs-extra';
import globby from 'globby';
import {link} from '@sphido/link';

const domain = new URL(process.env.NODE_ENV || 'production' === 'development' ? 'http://localhost:5000/' : 'https://recepty.ozzyczech.cz/');

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

const getPageHtml = (page) => `<!DOCTYPE html>
<html lang="cs" dir="ltr">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	
	<link rel="shortcut icon" href="/favicon.svg"/>

	<!-- Google Fonts -->
	<link href="//fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet"/>

	<!-- Boostrap 5 -->
	<link rel="stylesheet" href="//stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css" integrity="sha384-r4NyP46KrjDleawBgD5tp8Y7UzmLA05oM1iAEQ17CSuDqnUK2+k9luXQOfXJCJ4I" crossorigin="anonymous">
	<script src="//cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
	<script src="//stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/js/bootstrap.min.js" integrity="sha384-oesi62hOLfzrys4LxRF63OJCXdXDipiYWBnvTl9Y9/TRlw5xlKIEHpNyvvDShgf/" crossorigin="anonymous"></script>	

	<!-- Fuse.js -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/fuse.js/3.4.5/fuse.min.js"></script>

	<script src="/search.js"></script>
	<title>${page.title}</title>
	
	<style type="text/css">
	body {
		font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
		font-size: 1.1rem;
	}
	
	h1, h2, h3, h4, h5 {
		font-weight: 700;
	}
	
	a.list-group-item {
		font-size: 1.2rem;
	}
	
	img.emoji {
		height: 1em;
		width: 1em;
		margin: 0 .05em 0 .1em;
		vertical-align: -0.1em;
	}

	</style>	
</head>
<body class="bg-gray-200">
	<div class="container-fluid col-lg-4 offset-lg-4">
		<header class="my-3 d-print-none">
			<input type="search" class="form-control" id="q" placeholder="Vyhledej recept">
		</header>
		<main><article>${page.content}</article></main>
	</div>
</body>
</html>`;


(async () => {
	try {

		// 1. Get pages from directory

		const pages = await getPages(
			await globby(['recepty/**/*.{md,html}']),
			...[
				frontmatter,
				emoji,
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
			pages.filter((page) => page.ext === '.md').map(
				page => ({
					title: page.title,
					content: page.content.replace(/(<([^>]+)>)/ig, ''),
					link: page.link(domain),
					tags: [...page.tags],
				})
			)
		));


		const files = await globby(['recepty/**/*.*', '!**/*.md', '!**/index.html']);
		for await (const file of files) {
			await copy(file, file.replace(/^\w+/, 'public'));
		}

	} catch (error) {
		console.error(error);
	}
})();
