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
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

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
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".mdx"] };
"obedy/Boloňská.md": {
	id: "obedy/Boloňská.md";
  slug: "obedy/boloňská";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"obedy/Kari.md": {
	id: "obedy/Kari.md";
  slug: "obedy/kari";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"obedy/Libanonské kari.md": {
	id: "obedy/Libanonské kari.md";
  slug: "obedy/libanonské-kari";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"obedy/Svíčková na smetaně.md": {
	id: "obedy/Svíčková na smetaně.md";
  slug: "obedy/svíčková-na-smetaně";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/babovky/Banánová bábovka.md": {
	id: "peceni/babovky/Banánová bábovka.md";
  slug: "peceni/babovky/banánová-bábovka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/babovky/Bábovka s jablky.md": {
	id: "peceni/babovky/Bábovka s jablky.md";
  slug: "peceni/babovky/bábovka-s-jablky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/babovky/Rychlá bábovka.md": {
	id: "peceni/babovky/Rychlá bábovka.md";
  slug: "peceni/babovky/rychlá-bábovka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Banánový chleba.md": {
	id: "peceni/buchty/Banánový chleba.md";
  slug: "peceni/buchty/banánový-chleba";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Bramborová buchta.md": {
	id: "peceni/buchty/Bramborová buchta.md";
  slug: "peceni/buchty/bramborová-buchta";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Bublanina.md": {
	id: "peceni/buchty/Bublanina.md";
  slug: "peceni/buchty/bublanina";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Citronova buchta.md": {
	id: "peceni/buchty/Citronova buchta.md";
  slug: "peceni/buchty/citronova-buchta";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Estonsky Kringel.md": {
	id: "peceni/buchty/Estonsky Kringel.md";
  slug: "peceni/buchty/estonsky-kringel";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Frgále.md": {
	id: "peceni/buchty/Frgále.md";
  slug: "peceni/buchty/frgále";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Jablkový koláč.md": {
	id: "peceni/buchty/Jablkový koláč.md";
  slug: "peceni/buchty/jablkový-koláč";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Kynuté Honzovi buchty.md": {
	id: "peceni/buchty/Kynuté Honzovi buchty.md";
  slug: "peceni/buchty/kynuté-honzovi-buchty";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Kynutý jahodový koláč.md": {
	id: "peceni/buchty/Kynutý jahodový koláč.md";
  slug: "peceni/buchty/kynutý-jahodový-koláč";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Ořechová buchta.md": {
	id: "peceni/buchty/Ořechová buchta.md";
  slug: "peceni/buchty/ořechová-buchta";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Perník na plech.md": {
	id: "peceni/buchty/Perník na plech.md";
  slug: "peceni/buchty/perník-na-plech";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Rychlý perník s jablky.md": {
	id: "peceni/buchty/Rychlý perník s jablky.md";
  slug: "peceni/buchty/rychlý-perník-s-jablky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Sypaná hrnková buchta.md": {
	id: "peceni/buchty/Sypaná hrnková buchta.md";
  slug: "peceni/buchty/sypaná-hrnková-buchta";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Tvarohové řezy.md": {
	id: "peceni/buchty/Tvarohové řezy.md";
  slug: "peceni/buchty/tvarohové-řezy";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Švestková kynutá buchtu.md": {
	id: "peceni/buchty/Švestková kynutá buchtu.md";
  slug: "peceni/buchty/švestková-kynutá-buchtu";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Švestkový koláč.md": {
	id: "peceni/buchty/Švestkový koláč.md";
  slug: "peceni/buchty/švestkový-koláč";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/muffiny/Banánové mufiny.md": {
	id: "peceni/muffiny/Banánové mufiny.md";
  slug: "peceni/muffiny/banánové-mufiny";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/muffiny/Jablkové muffiny.md": {
	id: "peceni/muffiny/Jablkové muffiny.md";
  slug: "peceni/muffiny/jablkové-muffiny";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/muffiny/Perníkové muffuny.md": {
	id: "peceni/muffiny/Perníkové muffuny.md";
  slug: "peceni/muffiny/perníkové-muffuny";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/ostatni/Buchtičky.md": {
	id: "peceni/ostatni/Buchtičky.md";
  slug: "peceni/ostatni/buchtičky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/ostatni/Buchtičky.md": {
	id: "peceni/ostatni/Buchtičky.md";
  slug: "peceni/ostatni/buchtičky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/ostatni/Hamburgrové bulky.md": {
	id: "peceni/ostatni/Hamburgrové bulky.md";
  slug: "peceni/ostatni/hamburgrové-bulky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/ostatni/Květáková buchta.md": {
	id: "peceni/ostatni/Květáková buchta.md";
  slug: "peceni/ostatni/květáková-buchta";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/ostatni/Květáková buchta.md": {
	id: "peceni/ostatni/Květáková buchta.md";
  slug: "peceni/ostatni/květáková-buchta";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/ostatni/Ovesné sušenky.md": {
	id: "peceni/ostatni/Ovesné sušenky.md";
  slug: "peceni/ostatni/ovesné-sušenky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/ostatni/Ovesné sušenky.md": {
	id: "peceni/ostatni/Ovesné sušenky.md";
  slug: "peceni/ostatni/ovesné-sušenky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/ostatni/Pizza.md": {
	id: "peceni/ostatni/Pizza.md";
  slug: "peceni/ostatni/pizza";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/ostatni/Sýrové tyčinky.md": {
	id: "peceni/ostatni/Sýrové tyčinky.md";
  slug: "peceni/ostatni/sýrové-tyčinky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/ostatni/Sýrové tyčinky.md": {
	id: "peceni/ostatni/Sýrové tyčinky.md";
  slug: "peceni/ostatni/sýrové-tyčinky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"polevky/Boršč.md": {
	id: "polevky/Boršč.md";
  slug: "polevky/boršč";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"polevky/Broučkovka.md": {
	id: "polevky/Broučkovka.md";
  slug: "polevky/broučkovka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"polevky/Broučkovka.md": {
	id: "polevky/Broučkovka.md";
  slug: "polevky/broučkovka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"pomazanky/Papriková pomazánka.md": {
	id: "pomazanky/Papriková pomazánka.md";
  slug: "pomazanky/papriková-pomazánka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"pomazanky/Salámová pomazánka.md": {
	id: "pomazanky/Salámová pomazánka.md";
  slug: "pomazanky/salámová-pomazánka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"pomazanky/Tuňáková pomazánka.md": {
	id: "pomazanky/Tuňáková pomazánka.md";
  slug: "pomazanky/tuňáková-pomazánka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"pomazanky/Vajíčková pomazánka.md": {
	id: "pomazanky/Vajíčková pomazánka.md";
  slug: "pomazanky/vajíčková-pomazánka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"prilohy/Bramborové knedlíky.md": {
	id: "prilohy/Bramborové knedlíky.md";
  slug: "prilohy/bramborové-knedlíky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"prilohy/Kynuté knedlíky.md": {
	id: "prilohy/Kynuté knedlíky.md";
  slug: "prilohy/kynuté-knedlíky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"prilohy/Kynuté knedlíky.md": {
	id: "prilohy/Kynuté knedlíky.md";
  slug: "prilohy/kynuté-knedlíky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"vanoce/Crinkles.md": {
	id: "vanoce/Crinkles.md";
  slug: "vanoce/crinkles";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"vanoce/Linecké.md": {
	id: "vanoce/Linecké.md";
  slug: "vanoce/linecké";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"vanoce/Medovníkové koule.md": {
	id: "vanoce/Medovníkové koule.md";
  slug: "vanoce/medovníkové-koule";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"vanoce/Perníčky.md": {
	id: "vanoce/Perníčky.md";
  slug: "vanoce/perníčky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"vanoce/Rumové koule.md": {
	id: "vanoce/Rumové koule.md";
  slug: "vanoce/rumové-koule";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"vanoce/Vaječňák podle Žufánka.md": {
	id: "vanoce/Vaječňák podle Žufánka.md";
  slug: "vanoce/vaječňák-podle-žufánka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"vanoce/Vanilkové rohlíčky - mandlové.md": {
	id: "vanoce/Vanilkové rohlíčky - mandlové.md";
  slug: "vanoce/vanilkové-rohlíčky---mandlové";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"vanoce/Vanilkové rohlíčky.md": {
	id: "vanoce/Vanilkové rohlíčky.md";
  slug: "vanoce/vanilkové-rohlíčky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"vanoce/Špaldové pečníčky.md": {
	id: "vanoce/Špaldové pečníčky.md";
  slug: "vanoce/špaldové-pečníčky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"zavarovani/Nakládaný hermelín.md": {
	id: "zavarovani/Nakládaný hermelín.md";
  slug: "zavarovani/nakládaný-hermelín";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"zavarovani/Okurky od Dr. Bubenče.md": {
	id: "zavarovani/Okurky od Dr. Bubenče.md";
  slug: "zavarovani/okurky-od-dr-bubenče";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"zavarovani/Okurky od Dr. Bubenče.md": {
	id: "zavarovani/Okurky od Dr. Bubenče.md";
  slug: "zavarovani/okurky-od-dr-bubenče";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
