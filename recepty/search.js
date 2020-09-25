// https://fusejs.io/ search

document.onreadystatechange = function () {
	if (document.readyState == 'complete') {

		(async () => {
			const response = await fetch('/index.json');
			const index = await response.json();

			const fuse = new Fuse(index, {
				shouldSort: true,
				findAllMatches: true,
				threshold: 0.5,
				location: 0,
				distance: 100,
				maxPatternLength: 32,
				minMatchCharLength: 1,
				keys: [
					{name: "title", weight: 0.8},
					{name: "tags", weight: 0.6},
					{name: "content", weight: 0.3}
				]
			});

			const q = document.getElementById('q');
			const main = document.getElementsByTagName("main")[0];

			const search = (event) => {
				let results = fuse.search(q.value);
				if (q.value.length === 0 || results.length === 0) {
					main.innerHTML = '';
				} else {
					main.innerHTML = '<h1 class="h3">Search results:</h1>';
				}

				main.insertAdjacentHTML("beforeend", `<article class="list-group">` +
					results.map((page) => `<a class="list-group-item list-group-item-action bg-dark border-secondary text-white" href="${page.link}">${page.title}</a>`).join('')
					+ `</article>`);

				event.preventDefault();
			};


			['keyup', 'change'].forEach((e) => {
				q.addEventListener(e, (event) => {
					search(event)
				}, false)
			});

		})();

	}
};