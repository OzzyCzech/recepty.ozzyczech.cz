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
"index.md": {
	id: "index.md";
  slug: "index";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"obedy/Bolonska.md": {
	id: "obedy/Bolonska.md";
  slug: "obedy/bolonska";
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
"obedy/Quesadillas.md": {
	id: "obedy/Quesadillas.md";
  slug: "obedy/quesadillas";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"obedy/Svickova na smetane.md": {
	id: "obedy/Svickova na smetane.md";
  slug: "obedy/svickova-na-smetane";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/babovky/Babovka s jablky.md": {
	id: "peceni/babovky/Babovka s jablky.md";
  slug: "peceni/babovky/babovka-s-jablky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/babovky/Bananova babovka.md": {
	id: "peceni/babovky/Bananova babovka.md";
  slug: "peceni/babovky/bananova-babovka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/babovky/Rychla babovka.md": {
	id: "peceni/babovky/Rychla babovka.md";
  slug: "peceni/babovky/rychla-babovka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Bananovy chleba.md": {
	id: "peceni/buchty/Bananovy chleba.md";
  slug: "peceni/buchty/bananovy-chleba";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Bramborova buchta.md": {
	id: "peceni/buchty/Bramborova buchta.md";
  slug: "peceni/buchty/bramborova-buchta";
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
"peceni/buchty/Frgale.md": {
	id: "peceni/buchty/Frgale.md";
  slug: "peceni/buchty/frgale";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Honzovy buchty.md": {
	id: "peceni/buchty/Honzovy buchty.md";
  slug: "peceni/buchty/honzovy-buchty";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Jablkovy kolac.md": {
	id: "peceni/buchty/Jablkovy kolac.md";
  slug: "peceni/buchty/jablkovy-kolac";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Kynuty jahodovy kolac.md": {
	id: "peceni/buchty/Kynuty jahodovy kolac.md";
  slug: "peceni/buchty/kynuty-jahodovy-kolac";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Ořechova buchta.md": {
	id: "peceni/buchty/Ořechova buchta.md";
  slug: "peceni/buchty/ořechova-buchta";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Pernik na plech.md": {
	id: "peceni/buchty/Pernik na plech.md";
  slug: "peceni/buchty/pernik-na-plech";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Rychly pernik s jablky.md": {
	id: "peceni/buchty/Rychly pernik s jablky.md";
  slug: "peceni/buchty/rychly-pernik-s-jablky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Svestkova kynuta buchtu.md": {
	id: "peceni/buchty/Svestkova kynuta buchtu.md";
  slug: "peceni/buchty/svestkova-kynuta-buchtu";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Sypana hrnkova buchta.md": {
	id: "peceni/buchty/Sypana hrnkova buchta.md";
  slug: "peceni/buchty/sypana-hrnkova-buchta";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/buchty/Tvarohove rezy.md": {
	id: "peceni/buchty/Tvarohove rezy.md";
  slug: "peceni/buchty/tvarohove-rezy";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/muffiny/Bananove mufiny.md": {
	id: "peceni/muffiny/Bananove mufiny.md";
  slug: "peceni/muffiny/bananove-mufiny";
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
"peceni/muffiny/Pernikové muffuny.md": {
	id: "peceni/muffiny/Pernikové muffuny.md";
  slug: "peceni/muffiny/pernikové-muffuny";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/ostatni/Buchticky.md": {
	id: "peceni/ostatni/Buchticky.md";
  slug: "peceni/ostatni/buchticky";
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
"peceni/ostatni/Kringel.md": {
	id: "peceni/ostatni/Kringel.md";
  slug: "peceni/ostatni/kringel";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/ostatni/Kvetakova buchta.md": {
	id: "peceni/ostatni/Kvetakova buchta.md";
  slug: "peceni/ostatni/kvetakova-buchta";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"peceni/ostatni/Ovesné susenky.md": {
	id: "peceni/ostatni/Ovesné susenky.md";
  slug: "peceni/ostatni/ovesné-susenky";
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
"peceni/ostatni/Syrové tycinky.md": {
	id: "peceni/ostatni/Syrové tycinky.md";
  slug: "peceni/ostatni/syrové-tycinky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"polevky/Borsc.md": {
	id: "polevky/Borsc.md";
  slug: "polevky/borsc";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"polevky/Brouckovka.md": {
	id: "polevky/Brouckovka.md";
  slug: "polevky/brouckovka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"polevky/Dynovy krem.md": {
	id: "polevky/Dynovy krem.md";
  slug: "polevky/dynovy-krem";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"pomazanky/Paprikova pomazanka.md": {
	id: "pomazanky/Paprikova pomazanka.md";
  slug: "pomazanky/paprikova-pomazanka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"pomazanky/Salamova pomazanka.md": {
	id: "pomazanky/Salamova pomazanka.md";
  slug: "pomazanky/salamova-pomazanka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"pomazanky/Tunakova pomazanka.md": {
	id: "pomazanky/Tunakova pomazanka.md";
  slug: "pomazanky/tunakova-pomazanka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"pomazanky/Vajickova pomazanka.md": {
	id: "pomazanky/Vajickova pomazanka.md";
  slug: "pomazanky/vajickova-pomazanka";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"prilohy/Bramborové knedliky.md": {
	id: "prilohy/Bramborové knedliky.md";
  slug: "prilohy/bramborové-knedliky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"prilohy/Kynute knedliky.md": {
	id: "prilohy/Kynute knedliky.md";
  slug: "prilohy/kynute-knedliky";
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
"vanoce/Linecke.md": {
	id: "vanoce/Linecke.md";
  slug: "vanoce/linecke";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"vanoce/Medovnikové koule.md": {
	id: "vanoce/Medovnikové koule.md";
  slug: "vanoce/medovnikové-koule";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"vanoce/Pernicky.md": {
	id: "vanoce/Pernicky.md";
  slug: "vanoce/pernicky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"vanoce/Rumove koule.md": {
	id: "vanoce/Rumove koule.md";
  slug: "vanoce/rumove-koule";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"vanoce/Spadlové pernicky.md": {
	id: "vanoce/Spadlové pernicky.md";
  slug: "vanoce/spadlové-pernicky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"vanoce/Vajecnak.md": {
	id: "vanoce/Vajecnak.md";
  slug: "vanoce/vajecnak";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"vanoce/Vanilkove rohlicky.md": {
	id: "vanoce/Vanilkove rohlicky.md";
  slug: "vanoce/vanilkove-rohlicky";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"zavarovani/Nakladany hermelin.md": {
	id: "zavarovani/Nakladany hermelin.md";
  slug: "zavarovani/nakladany-hermelin";
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">
} & { render(): Render[".md"] };
"zavarovani/Okurky.md": {
	id: "zavarovani/Okurky.md";
  slug: "zavarovani/okurky";
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
