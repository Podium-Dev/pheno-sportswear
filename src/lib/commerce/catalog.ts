import { cache } from "react";
import { products as localProducts, type Product } from "@/data/products";
import { getCommerceConfig } from "@/lib/commerce/config";
import { findCatalogProduct } from "@/lib/commerce/catalog-utils";
import { fetchMedusaProducts } from "@/lib/commerce/providers/medusa";
import { fetchShopifyProducts } from "@/lib/commerce/providers/shopify";

/**
 * The local catalogue is the editorial fallback. Remote commerce providers
 * supply product identity, pricing, images, variants, and availability, then
 * the normalizer merges the PHENO-specific editorial content onto that shape.
 */
export const getCatalogProducts = cache(async (): Promise<Product[]> => {
  const config = getCommerceConfig();

  if (config.provider === "local") {
    return localProducts;
  }

  const products = config.provider === "shopify"
    ? await fetchShopifyProducts(config)
    : await fetchMedusaProducts(config);

  if (!products.length) {
    throw new Error(`${config.provider} returned no published products.`);
  }

  return products;
});

export const getCatalogProductBySlug = cache(async (slug: string) => {
  const products = await getCatalogProducts();
  return findCatalogProduct(products, slug);
});
