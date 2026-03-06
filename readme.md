# Web [recepty.ozzyczech.cz](https://recepty.ozzyczech.cz/)

## Instalace

```bash
pnpm install
```

## Postup

**Lokální vývoj**

```bash
pnpm dev
```

Stránky běží na http://localhost:4321

**Build a náhled produkce**

```bash
pnpm build
pnpm preview
```

**Deploy na GitHub Pages**

- Automaticky: push na větev `main` spustí workflow a nasadí stránky.
- Ručně: v repozitáři **Actions** → workflow **Deploy to GitHub Pages** → **Run workflow**.

## Credits

- [GitHub Pages](https://pages.github.com/) for hosting
- [Astro](https://astro.build/) for site generation
- [Starlight](https://starlight.astro.build/) for docs theme

## Inspirace

https://dadala.hyperlinx.cz/