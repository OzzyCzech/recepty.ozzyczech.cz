import {defineConfig} from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Moje recepty',
      tableOfContents: false,
      pagination: false,
      customCss: [
        './src/styles.css',
      ],
      editLink: {
        baseUrl: 'https://github.com/OzzyCzech/recepty.ozzyczech.cz/edit/master/',
      },
      social: {
        github: 'https://github.com/OzzyCzech/recepty.ozzyczech.cz',
      },
      sidebar: [
        {label: 'Domů', link: '/'},
        {label: 'Obědy', autogenerate: {directory: 'obedy'}, collapsed: true},
        {label: 'Polévky', autogenerate: {directory: 'polevky'}, collapsed: true},
        {label: 'Přílohy', autogenerate: {directory: 'prilohy'}, collapsed: true},
        {
          label: 'Pečení',
          items: [
            {label: 'Muffiny', autogenerate: {directory: 'peceni/muffiny'}, collapsed: true},
            {label: 'Bábovky', autogenerate: {directory: 'peceni/babovky'}, collapsed: true},
            {label: 'Buchty', autogenerate: {directory: 'peceni/buchty'}, collapsed: true},
            {label: 'Ostatní', autogenerate: {directory: 'peceni/ostatni'}, collapsed: true},
          ]
        },
        {label: 'Pomazánky', autogenerate: {directory: 'pomazanky'}, collapsed: true},
        {label: 'Vánoce', autogenerate: {directory: 'vanoce'}, collapsed: true},
        {label: 'Zavařování', autogenerate: {directory: 'zavarovani'}, collapsed: true},
      ],
    }),
  ],
});