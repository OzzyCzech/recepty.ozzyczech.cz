module.exports = {
	content: [
		'./recepty/**/*.{html,js}',
		'./public/**/*.html',
	],
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		container: {center: true, padding: '1rem'},
		extend: {
			screens: {
				'print': {'raw': 'print'},
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
};