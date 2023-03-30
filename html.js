const html = (strings, ...values) => String.raw({raw: strings}, ...values);

export default (page) => html`<!DOCTYPE html>
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
<cmd-dialog></cmd-dialog>
<div class="text-center m-8 print:hidden">
	<button
		class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
		Search ⌘+K
	</button>
</div>
</body>
</html>`;