import {NinjaKeys} from 'https://esm.run/ninja-keys';
import pages from './pages.json' assert {type: 'json'};

const ninja = document.querySelector('ninja-keys');

const data = [];

ninja.data = pages.map(
	(page) => {
		return {
			id: page.id,
			title: (page.title || page.id),
			url: page.url,

			handler: (page) => {
				window.location.href = page.url
			},
		}
	},
);

const button = document.querySelector('button');
button.addEventListener('click', () => {
	ninja.open();
});