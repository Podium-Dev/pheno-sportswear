import type { Product } from "@/data/products";

const legacyProductSlugAliases: Record<string, string> = {
  "pheno-type-1-t-shirt": "pheno-type-1-t-shirt-black",
  "pheno-type-1-tank": "pheno-type-1-tank-black",
};

export function findCatalogProduct(products: Product[], slug: string) {
  const resolvedSlug = legacyProductSlugAliases[slug] ?? slug;
  const baseSlug = slug.replace(/-(?:black|white)$/i, "");
  return (
    products.find((product) => product.slug === resolvedSlug) ??
    products.find((product) => product.slug === slug) ??
    products.find((product) => product.slug === baseSlug) ??
    products.find((product) => product.slug.startsWith(`${slug}-`))
  );
}

export function getProductsForCollection(products: Product[], collection: string) {
  if (collection === "all" || collection === "type-1") {
    return products;
  }

  if (collection === "tops") {
    return products.filter((product) =>
      ["t-shirts", "tanks", "hoodies"].includes(product.category),
    );
  }

  if (collection === "bottoms") {
    return products.filter((product) =>
      ["shorts", "joggers"].includes(product.category),
    );
  }

  return products.filter((product) => product.category === collection);
}

export function searchCatalogProducts(products: Product[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return products.filter((product) =>
    [
      product.name,
      product.category,
      product.collection,
      product.description,
      product.construction,
      ...product.features,
      ...product.colours,
      ...product.performanceFeatures.flatMap((feature) => [feature.title, feature.description]),
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}
