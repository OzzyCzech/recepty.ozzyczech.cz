import { visit } from 'unist-util-visit';

export default function youtube() {

	return tree => {
		visit(tree, 'link', (node) => {

			// Auto embed YouTube videos
			if (URL.canParse(node.url)) {
				const video = new URL(node.url);

				let id = null;
				if (video.hostname.endsWith('youtube.com')) {
					id = video.searchParams.get('v');
				} else if (video.hostname.endsWith('youtu.be')) {
					id = video.pathname.slice(1);
				}

				if (id) {
					node.type = 'html';
					node.value = `<iframe src="https://www.youtube.com/embed/${id}?rel=0&controls=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="aspect-ratio: 16 / 9; width: 100%; border: 0"></iframe>`;
				}
			}
		});
	};
}