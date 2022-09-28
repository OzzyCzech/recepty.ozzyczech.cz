#!/usr/bin/env node --experimental-modules

import {dirname, relative, join} from 'node:path';
import {allPages, copyFile, getPages, readFile, writeFile} from '@sphido/core';
import {getHashtags, hashtags} from '@sphido/hashtags';
import slugify from '@sindresorhus/slugify';
import {marked} from 'marked';
import {globby} from 'globby';

const domain = new URL(process.env.NODE_ENV || 'production' === 'development' ? 'http://localhost:5000/' : 'https://recepty.ozzyczech.cz/');

// renderer(
// 	{
// 		table: (header, body) => `<table class="table table-bordered table-striped bg-white m-1">${header}${body}</table>`,
//
// 		image: (href, title, text) => {
// 			const className = new URL(href, domain).hash.slice(1).replace(/_/g, ' ');
// 			return `<div class=" ${className ? className : 'd-flex justify-content-center my-1'}"><figure class="figure text-center w-75">
// 			<img src="${href}" class="figure-img img-fluid rounded" title="${title ? title : ''}" alt="${text ? text : ''}"/>
// 			<figcaption class="figure-caption text-center">${text}</figcaption></figure></div>`;
// 		},
//
// 		link: (href, title, text) => {
// 			if (href.includes(domain.hostname)) {
// 				return `<a href="${href}" title="${title ? title : ''}">${text}</a>`;
// 			}
//
// 			return `<a href="${href}" title="${title ? title : ''}" target="_blank">${text}</a>`;
// 		},
// 	},
// );

const html = (page) => `<!DOCTYPE html>
<html lang="cs" dir="ltr">
<head>
	<meta charset="UTF-8">
	<link rel="shortcut icon" href="/favicon.svg"/>
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<script src="/search.js" type="module"></script>
	<link rel="stylesheet" href="/style.css"/>
	<title>${page.title}</title>	
</head>
<body>
		<div class="container">
			<main>
				<article class="prose dark:prose-invert lg:prose-lg mx-auto my-8">${page.content}</article>
			</main>
		</div>
		<ninja-keys></ninja-keys>
		<div class="text-center m-8 print:hidden">
			<button class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Search ⌘+K</button>
		</div>
</body>
</html>`;

const pages = await getPages({path: 'recepty'},
	(page) => {
		page.slug = slugify(page.name) + '.html';
		page.dir = dirname(page.path);
	});

let search = [];
for (const page of allPages(pages)) {
	page.content = await readFile(page.path);
	//page.tags = getHashtags(page.content);
	page.content = marked(page.content);
	page.title = page.content.match(/(?<=<h[12][^>]*?>)([^<>]+?)(?=<\/h[12]>)/i)?.pop();

	page.output = join('public', relative('recepty', page.dir), page.slug);
	await writeFile(page.output, html(page))

	search.push({id: slugify(page.name), title: page.title, url: join('/', relative('recepty', page.dir), page.slug)});
}

// search data
await writeFile('public/pages.json', JSON.stringify(search, null, 2));

const files = await globby(['recepty/**/*.*', '!**/*.{md,html}', 'recepty/404.html']);

for await (const file of files) {
	await copyFile(file, file.replace(/^\w+/, 'public'));
}