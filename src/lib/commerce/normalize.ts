import {
  products as editorialProducts,
  SIZE_OPTIONS,
  type Colour,
  type Product,
  type ProductCategory,
  type Size,
} from "@/data/products";

export type RemoteCommerceVariant = {
  id: string;
  size?: string;
  colour?: string;
  available: boolean;
  price?: number;
  currencyCode?: string;
  image?: string;
};

export type RemoteCommerceProduct = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  currencyCode?: string;
  images: string[];
  variants: RemoteCommerceVariant[];
};

const fallbackImage = "/images/pheno-logo.png";

function normalizeValue(value: string | undefined) {
  return value?.trim().toLowerCase() || "";
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function slugPart(value: string) {
  return slugify(value) || "variant";
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function findLocalProducts(slug: string) {
  return editorialProducts.filter(
    (product) => product.slug === slug || product.slug.startsWith(`${slug}-`),
  );
}

function matchKnownSize(value: string | undefined, fallback?: Size) {
  const normalized = normalizeValue(value);
  return SIZE_OPTIONS.find((size) => size.toLowerCase() === normalized) ?? fallback;
}

function matchKnownColour(value: string | undefined, fallback?: Colour) {
  return value?.trim() || fallback || "Black";
}

function categoryFromProduct(product: RemoteCommerceProduct, fallback?: ProductCategory): ProductCategory {
  const text = [product.category, product.name, product.slug].filter(Boolean).join(" ").toLowerCase();
  if (text.includes("hoodie")) return "hoodies";
  if (text.includes("jogger")) return "joggers";
  if (text.includes("short")) return "shorts";
  if (text.includes("tank")) return "tanks";
  if (text.includes("tee") || text.includes("t-shirt") || text.includes("shirt")) return "t-shirts";
  return fallback || "t-shirts";
}

function buildFallbackProduct(
  product: RemoteCommerceProduct,
  category: ProductCategory,
  images: string[],
  colours: Colour[],
  sizes: Size[],
  variants: Product["variants"],
  price: number,
  localProduct?: Product,
): Product {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name || localProduct?.name || "PHENO product",
    collection: "type-1",
    category,
    price,
    currencyCode: product.currencyCode || localProduct?.currencyCode || "GBP",
    description: product.description || localProduct?.description || "Performance sportswear built for the work ahead.",
    construction: localProduct?.construction || "Technical performance construction.",
    features: localProduct?.features || [],
    performanceFeatures: localProduct?.performanceFeatures || [],
    performanceFeaturesByColour: localProduct?.performanceFeaturesByColour,
    engineeredDetails: localProduct?.engineeredDetails,
    images,
    colourImages: { [colours[0] || "Black"]: images[0] || fallbackImage },
    galleryImagesByColour: { [colours[0] || "Black"]: images },
    colours,
    sizes,
    variants,
    relatedProductSlugs: localProduct?.relatedProductSlugs || [],
    completeTheLookSlugs: localProduct?.completeTheLookSlugs || [],
  };
}

export function normalizeRemoteProducts(remoteProducts: RemoteCommerceProduct[]): Product[] {
  return remoteProducts.flatMap((remoteProduct) => {
    const remoteSlug = remoteProduct.slug || slugify(remoteProduct.name);
    const localProducts = findLocalProducts(remoteSlug);
    const localFallback = localProducts[0];
    const fallbackColour = localFallback?.colours[0] || "Black";
    const fallbackVariant = localFallback?.variants[0];
    const remoteVariants = remoteProduct.variants.length
      ? remoteProduct.variants
      : [{
          id: remoteProduct.id,
          size: fallbackVariant?.size || SIZE_OPTIONS[0],
          colour: fallbackColour,
          available: true,
          price: remoteProduct.price,
          currencyCode: remoteProduct.currencyCode,
        } satisfies RemoteCommerceVariant];

    const variantGroups = new Map<string, RemoteCommerceVariant[]>();
    remoteVariants.forEach((variant) => {
      const colour = matchKnownColour(variant.colour, fallbackColour);
      const key = normalizeValue(colour);
      const group = variantGroups.get(key) || [];
      group.push({ ...variant, colour });
      variantGroups.set(key, group);
    });

    const splitByColour = variantGroups.size > 1;

    return Array.from(variantGroups.values()).map((group) => {
      const colour = matchKnownColour(group[0]?.colour, fallbackColour) as Colour;
      const localProduct =
        localProducts.find((product) => product.colours.some((item) => normalizeValue(item) === normalizeValue(colour))) ||
        localFallback;
      const remoteImages = unique([
        ...group.map((variant) => variant.image || ""),
        ...remoteProduct.images,
      ]);
      const productImages = remoteImages.length
        ? remoteImages
        : localProduct?.images?.length
          ? localProduct.images
          : [fallbackImage];
      const variants = group.map((variant, index) => ({
        id: variant.id || `${remoteProduct.id}-${slugPart(colour)}-${index + 1}`,
        size: matchKnownSize(variant.size, localProduct?.sizes[index] || SIZE_OPTIONS[index % SIZE_OPTIONS.length]) as Size,
        colour,
        available: variant.available,
      }));
      const sizes = unique(variants.map((variant) => variant.size)) as Size[];
      const productSlug = splitByColour
        ? localProduct?.slug || `${remoteSlug}-${slugPart(colour)}`
        : remoteSlug || localProduct?.slug || `${remoteProduct.id}`;
      const price =
        group.find((variant) => typeof variant.price === "number")?.price ??
        remoteProduct.price ??
        localProduct?.price ??
        0;
      const normalizedProduct = buildFallbackProduct(
        { ...remoteProduct, slug: productSlug },
        categoryFromProduct(remoteProduct, localProduct?.category),
        productImages,
        [colour],
        sizes.length ? sizes : localProduct?.sizes || [...SIZE_OPTIONS],
        variants,
        price,
        localProduct,
      );

      return {
        ...normalizedProduct,
        id: splitByColour ? `${remoteProduct.id}-${slugPart(colour)}` : remoteProduct.id,
        name: remoteProduct.name || localProduct?.name || normalizedProduct.name,
        colourImages: { [colour]: productImages[0] },
        galleryImagesByColour: { [colour]: productImages },
      };
    });
  });
}
