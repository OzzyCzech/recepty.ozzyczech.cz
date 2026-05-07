const site = 'https://recepty.ozzyczech.cz';

export default {
	site,
	starlight: {
		title: 'Naše recepty',
		tableOfContents: false,
		pagination: false,
		customCss: ['./src/styles.css'],
		editLink: {
			baseUrl: 'https://github.com/OzzyCzech/recepty.ozzyczech.cz/edit/main/',
		},
		social: [
			{ icon: 'github', label: 'GitHub', href: 'https://github.com/OzzyCzech/recepty.ozzyczech.cz' },
		],
		sidebar: [
			{ label: 'Obědy', collapsed: true, items: [{ autogenerate: { directory: 'Obědy' } }] },
			{ label: 'Omáčky', collapsed: true, items: [{ autogenerate: { directory: 'Omáčky' } }] },
			{ label: 'Polévky', collapsed: true, items: [{ autogenerate: { directory: 'Polévky' } }] },
			{ label: 'Pečení', collapsed: false, items: [{ autogenerate: { directory: 'Pečení', collapsed: true } }] },
			{ label: 'Lívance a palačinky', collapsed: true, items: [{ autogenerate: { directory: 'Lívance a palačinky', collapsed: true } }] },
			{ label: 'Pomazánky', collapsed: true, items: [{ autogenerate: { directory: 'Pomazánky' } }] },
			{ label: 'Vánoce', collapsed: true, items: [{ autogenerate: { directory: 'Vánoce' } }] },
			{ label: 'Rychlovky', collapsed: true, items: [{ autogenerate: { directory: 'Rychlovky' } }] },
			{ label: 'Přílohy', collapsed: true, items: [{ autogenerate: { directory: 'Přílohy' } }] },
			{ label: 'Zavařování', collapsed: true, items: [{ autogenerate: { directory: 'Zavařování' } }] },
		],
	},
	og: {
		brand: 'Naše recepty',
		domain: 'recepty.ozzyczech.cz',
		accent: ['#1171fe', '#0a4fb3'],
		bgGradient: 'linear-gradient(148deg, #18181b 0%, #110b19 100%)',
		textColor: '#ffffff',
		mutedColor: '#bfc1c9',
		logo: './public/og-logo.png',
	},
};
