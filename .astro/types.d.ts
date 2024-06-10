declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"docs": {
"Obědy/Boloňská omáčka.md": {
	id: "Obědy/Boloňská omáčka.md";
  slug: "obědy/boloňská-omáčka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Obědy/Kari.md": {
	id: "Obědy/Kari.md";
  slug: "obědy/kari";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Obědy/Libanonské kari.md": {
	id: "Obědy/Libanonské kari.md";
  slug: "obědy/libanonské-kari";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Obědy/Quesadillas.md": {
	id: "Obědy/Quesadillas.md";
  slug: "obědy/quesadillas";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Obědy/Svíčková na smetaně.md": {
	id: "Obědy/Svíčková na smetaně.md";
  slug: "obědy/svíčková-na-smetaně";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Buchty/Bananovy chleba.md": {
	id: "Pečení/Buchty/Bananovy chleba.md";
  slug: "pečení/buchty/bananovy-chleba";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Buchty/Bramborova buchta.md": {
	id: "Pečení/Buchty/Bramborova buchta.md";
  slug: "pečení/buchty/bramborova-buchta";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Buchty/Bublanina.md": {
	id: "Pečení/Buchty/Bublanina.md";
  slug: "pečení/buchty/bublanina";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Buchty/Citronova buchta.md": {
	id: "Pečení/Buchty/Citronova buchta.md";
  slug: "pečení/buchty/citronova-buchta";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Buchty/Drobenkovy kolac.md": {
	id: "Pečení/Buchty/Drobenkovy kolac.md";
  slug: "pečení/buchty/drobenkovy-kolac";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Buchty/Frgale.md": {
	id: "Pečení/Buchty/Frgale.md";
  slug: "pečení/buchty/frgale";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Buchty/Honzovy buchty.md": {
	id: "Pečení/Buchty/Honzovy buchty.md";
  slug: "pečení/buchty/honzovy-buchty";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Buchty/Jablkovy kolac.md": {
	id: "Pečení/Buchty/Jablkovy kolac.md";
  slug: "pečení/buchty/jablkovy-kolac";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Buchty/Kynuty jahodovy kolac.md": {
	id: "Pečení/Buchty/Kynuty jahodovy kolac.md";
  slug: "pečení/buchty/kynuty-jahodovy-kolac";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Buchty/Ořechova buchta.md": {
	id: "Pečení/Buchty/Ořechova buchta.md";
  slug: "pečení/buchty/ořechova-buchta";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Buchty/Pernik na plech.md": {
	id: "Pečení/Buchty/Pernik na plech.md";
  slug: "pečení/buchty/pernik-na-plech";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Buchty/Rychly pernik s jablky.md": {
	id: "Pečení/Buchty/Rychly pernik s jablky.md";
  slug: "pečení/buchty/rychly-pernik-s-jablky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Buchty/Svestkova kynuta buchtu.md": {
	id: "Pečení/Buchty/Svestkova kynuta buchtu.md";
  slug: "pečení/buchty/svestkova-kynuta-buchtu";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Buchty/Tvarohove rezy.md": {
	id: "Pečení/Buchty/Tvarohove rezy.md";
  slug: "pečení/buchty/tvarohove-rezy";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Bábovky/Babovka s jablky.md": {
	id: "Pečení/Bábovky/Babovka s jablky.md";
  slug: "pečení/bábovky/babovka-s-jablky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Bábovky/Bananova babovka.md": {
	id: "Pečení/Bábovky/Bananova babovka.md";
  slug: "pečení/bábovky/bananova-babovka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Bábovky/Rychla babovka.md": {
	id: "Pečení/Bábovky/Rychla babovka.md";
  slug: "pečení/bábovky/rychla-babovka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Muffiny/Bananove mufiny.md": {
	id: "Pečení/Muffiny/Bananove mufiny.md";
  slug: "pečení/muffiny/bananove-mufiny";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Muffiny/Citronove muffiny.md": {
	id: "Pečení/Muffiny/Citronove muffiny.md";
  slug: "pečení/muffiny/citronove-muffiny";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Muffiny/Jablkové muffiny.md": {
	id: "Pečení/Muffiny/Jablkové muffiny.md";
  slug: "pečení/muffiny/jablkové-muffiny";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Muffiny/Pernikové muffuny.md": {
	id: "Pečení/Muffiny/Pernikové muffuny.md";
  slug: "pečení/muffiny/pernikové-muffuny";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Ostatní/Buchticky.md": {
	id: "Pečení/Ostatní/Buchticky.md";
  slug: "pečení/ostatní/buchticky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Ostatní/Hamburgrové bulky.md": {
	id: "Pečení/Ostatní/Hamburgrové bulky.md";
  slug: "pečení/ostatní/hamburgrové-bulky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Ostatní/Kringel.md": {
	id: "Pečení/Ostatní/Kringel.md";
  slug: "pečení/ostatní/kringel";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Ostatní/Kvetakova buchta.md": {
	id: "Pečení/Ostatní/Kvetakova buchta.md";
  slug: "pečení/ostatní/kvetakova-buchta";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Ostatní/Ovesné susenky.md": {
	id: "Pečení/Ostatní/Ovesné susenky.md";
  slug: "pečení/ostatní/ovesné-susenky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Ostatní/Pizza.md": {
	id: "Pečení/Ostatní/Pizza.md";
  slug: "pečení/ostatní/pizza";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pečení/Ostatní/Syrové tycinky.md": {
	id: "Pečení/Ostatní/Syrové tycinky.md";
  slug: "pečení/ostatní/syrové-tycinky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Polévky/Borsc.md": {
	id: "Polévky/Borsc.md";
  slug: "polévky/borsc";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Polévky/Brouckovka.md": {
	id: "Polévky/Brouckovka.md";
  slug: "polévky/brouckovka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Polévky/Cockova polevka.md": {
	id: "Polévky/Cockova polevka.md";
  slug: "polévky/cockova-polevka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Polévky/Dynovy krem.md": {
	id: "Polévky/Dynovy krem.md";
  slug: "polévky/dynovy-krem";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pomazánky/Paprikova pomazanka.md": {
	id: "Pomazánky/Paprikova pomazanka.md";
  slug: "pomazánky/paprikova-pomazanka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pomazánky/Salamova pomazanka.md": {
	id: "Pomazánky/Salamova pomazanka.md";
  slug: "pomazánky/salamova-pomazanka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pomazánky/Tunakova pomazanka.md": {
	id: "Pomazánky/Tunakova pomazanka.md";
  slug: "pomazánky/tunakova-pomazanka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Pomazánky/Vajickova pomazanka.md": {
	id: "Pomazánky/Vajickova pomazanka.md";
  slug: "pomazánky/vajickova-pomazanka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Přílohy/Bramborové knedliky.md": {
	id: "Přílohy/Bramborové knedliky.md";
  slug: "přílohy/bramborové-knedliky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Přílohy/Kynute knedliky.md": {
	id: "Přílohy/Kynute knedliky.md";
  slug: "přílohy/kynute-knedliky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Vánoce/Crinkles.md": {
	id: "Vánoce/Crinkles.md";
  slug: "vánoce/crinkles";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Vánoce/Linecke.md": {
	id: "Vánoce/Linecke.md";
  slug: "vánoce/linecke";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Vánoce/Medovnikové koule.md": {
	id: "Vánoce/Medovnikové koule.md";
  slug: "vánoce/medovnikové-koule";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Vánoce/Pernicky.md": {
	id: "Vánoce/Pernicky.md";
  slug: "vánoce/pernicky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Vánoce/Rumove koule.md": {
	id: "Vánoce/Rumove koule.md";
  slug: "vánoce/rumove-koule";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Vánoce/Spadlové pernicky.md": {
	id: "Vánoce/Spadlové pernicky.md";
  slug: "vánoce/spadlové-pernicky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Vánoce/Vajecnak.md": {
	id: "Vánoce/Vajecnak.md";
  slug: "vánoce/vajecnak";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Vánoce/Vanilkove rohlicky.md": {
	id: "Vánoce/Vanilkove rohlicky.md";
  slug: "vánoce/vanilkove-rohlicky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Zavařování/Nakladany hermelin.md": {
	id: "Zavařování/Nakladany hermelin.md";
  slug: "zavařování/nakladany-hermelin";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"Zavařování/Okurky.md": {
	id: "Zavařování/Okurky.md";
  slug: "zavařování/okurky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"index.md": {
	id: "index.md";
  slug: "index";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		"i18n": {
};

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../src/content/config.js");
}
