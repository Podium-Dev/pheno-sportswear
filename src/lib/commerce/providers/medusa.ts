import type { MedusaCommerceConfig } from "@/lib/commerce/types";
import {
  normalizeRemoteProducts,
  type RemoteCommerceProduct,
  type RemoteCommerceVariant,
} from "@/lib/commerce/normalize";

type MedusaOption = {
  value?: string | null;
  name?: string | null;
  option?: { title?: string | null } | null;
};

type MedusaPrice = {
  amount?: number | null;
  currency_code?: string | null;
};

type MedusaCalculatedPrice = {
  calculated_amount?: number | null;
  currency_code?: string | null;
};

type MedusaVariant = {
  id: string;
  title?: string | null;
  options?: MedusaOption[] | null;
  prices?: MedusaPrice[] | null;
  calculated_price?: MedusaCalculatedPrice | null;
  available_quantity?: number | null;
  inventory_quantity?: number | null;
  manage_inventory?: boolean | null;
  allow_backorder?: boolean | null;
  purchasable?: boolean | null;
};

type MedusaImage = { url?: string | null } | string;

type MedusaProduct = {
  id: string;
  handle?: string | null;
  title?: string | null;
  description?: string | null;
  thumbnail?: string | null;
  images?: MedusaImage[] | null;
  variants?: MedusaVariant[] | null;
  type?: { name?: string | null; value?: string | null } | null;
};

type MedusaProductsResponse = {
  products?: MedusaProduct[];
  count?: number;
  offset?: number;
  limit?: number;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function imageUrl(image: MedusaImage) {
  return typeof image === "string" ? image : image.url || "";
}

function readOption(variant: MedusaVariant, pattern: RegExp) {
  return variant.options?.find((option) =>
    pattern.test(option.option?.title || option.name || ""),
  )?.value || undefined;
}

function titleValue(variant: MedusaVariant, pattern: RegExp) {
  return variant.title
    ?.split(/[\\/|,]+/)
    .map((part) => part.trim())
    .find((part) => pattern.test(part));
}

function priceFromVariant(variant: MedusaVariant) {
  const calculated = variant.calculated_price;
  if (typeof calculated?.calculated_amount === "number") {
    return calculated.calculated_amount / 100;
  }

  const amount = variant.prices?.[0]?.amount;
  return typeof amount === "number" ? amount / 100 : undefined;
}

function currencyFromVariant(variant: MedusaVariant) {
  return variant.calculated_price?.currency_code || variant.prices?.[0]?.currency_code || undefined;
}

function isVariantAvailable(variant: MedusaVariant) {
  if (typeof variant.purchasable === "boolean") return variant.purchasable;
  if (variant.allow_backorder) return true;
  if (typeof variant.available_quantity === "number") return variant.available_quantity > 0;
  if (typeof variant.inventory_quantity === "number") return variant.inventory_quantity > 0;
  if (variant.manage_inventory === false) return true;
  return true;
}

function mapMedusaProduct(product: MedusaProduct): RemoteCommerceProduct {
  const variants: RemoteCommerceVariant[] = (product.variants || []).map((variant) => ({
    id: variant.id,
    size: readOption(variant, /size/i) || titleValue(variant, /^(XS|S|M|L|XL|2XL)$/i),
    colour: readOption(variant, /colou?r/i) || titleValue(variant, /^(black|white)$/i),
    available: isVariantAvailable(variant),
    price: priceFromVariant(variant),
    currencyCode: currencyFromVariant(variant),
  }));
  const firstVariant = variants[0];
  const images = [
    product.thumbnail || "",
    ...(product.images || []).map(imageUrl),
  ];

  return {
    id: product.id,
    slug: product.handle || slugify(product.title || product.id),
    name: product.title || product.handle || "PHENO product",
    description: product.description || undefined,
    category: product.type?.name || product.type?.value || undefined,
    price: firstVariant?.price,
    currencyCode: firstVariant?.currencyCode,
    images: Array.from(new Set(images.filter(Boolean))),
    variants,
  };
}

export async function fetchMedusaProducts(config: MedusaCommerceConfig) {
  const products: RemoteCommerceProduct[] = [];
  const limit = 100;
  let offset = 0;

  do {
    const url = new URL("/store/products", `${config.backendUrl}/`);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));
    if (config.regionId) url.searchParams.set("region_id", config.regionId);

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "x-publishable-api-key": config.publishableKey,
      },
      next: { revalidate: 300, tags: ["commerce-products"] },
    });

    if (!response.ok) {
      throw new Error(`Medusa Store API request failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as MedusaProductsResponse;
    const page = payload.products || [];
    products.push(...page.map(mapMedusaProduct));
    offset += page.length;

    if (!page.length || page.length < limit || (typeof payload.count === "number" && offset >= payload.count)) {
      break;
    }
  } while (true);

  return normalizeRemoteProducts(products);
}
