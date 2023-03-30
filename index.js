#!/usr/bin/env node --experimental-modules

import {dirname, join, relative} from 'node:path';
import {allPages, copyFile, getPages, readFile, writeFile} from '@sphido/core';
import slugify from '@sindresorhus/slugify';
import {marked} from 'marked';
import {globby} from 'globby';
import html from './html.js';

const domain = new URL(process.env.NODE_ENV || 'production' === 'development' ? 'http://localhost:5000/' : 'https://recepty.ozzyczech.cz/');

const pages = await getPages({path: 'recepty'},
	(page) => {
		page.slug = slugify(page.name) + '.html';
		page.dir = dirname(page.path);
	});

let search = [];

for (const page of allPages(pages)) {
	page.content = await readFile(page.path);
	page.content = marked(page.content);
	page.title = page.content.match(/(?<=<h[12][^>]*?>)([^<>]+?)(?=<\/h[12]>)/i)?.pop() || 'Recepty';
	page.output = join('public', relative('recepty', page.dir), page.slug);
	await writeFile(page.output, html(page))
	search.push({title: page.title, url: join('/', relative('recepty', page.dir), page.slug)});
}

// search data
await writeFile('public/pages.json', JSON.stringify(search, null, 2));
const files = await globby(['recepty/**/*.*', '!**/*.{md,html}', 'recepty/404.html']);

for await (const file of files) {
	await copyFile(file, file.replace(/^\w+/, 'public'));
}