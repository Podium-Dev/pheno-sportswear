import type { ShopifyCommerceConfig } from "@/lib/commerce/types";
import {
  normalizeRemoteProducts,
  type RemoteCommerceProduct,
} from "@/lib/commerce/normalize";

type ShopifyImage = {
  url?: string | null;
};

type ShopifySelectedOption = {
  name?: string | null;
  value?: string | null;
};

type ShopifyVariant = {
  id: string;
  title?: string | null;
  availableForSale: boolean;
  price?: {
    amount?: string | null;
    currencyCode?: string | null;
  } | null;
  selectedOptions?: ShopifySelectedOption[] | null;
  image?: ShopifyImage | null;
};

type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description?: string | null;
  productType?: string | null;
  featuredImage?: ShopifyImage | null;
  images?: { nodes?: ShopifyImage[] | null } | null;
  priceRange?: {
    minVariantPrice?: {
      amount?: string | null;
      currencyCode?: string | null;
    } | null;
  } | null;
  variants?: { nodes?: ShopifyVariant[] | null } | null;
};

type ShopifyProductsPage = {
  products: {
    nodes: ShopifyProduct[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor?: string | null;
    };
  };
};

type ShopifyResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string | null }>;
};

const shopifyProductsQuery = `#graphql
  query Products($first: Int!, $after: String, $country: CountryCode!) @inContext(country: $country) {
    products(first: $first, after: $after) {
      nodes {
        id
        handle
        title
        description
        productType
        featuredImage { url }
        images(first: 50) { nodes { url } }
        priceRange { minVariantPrice { amount currencyCode } }
        variants(first: 100) {
          nodes {
            id
            title
            availableForSale
            price { amount currencyCode }
            selectedOptions { name value }
            image { url }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

function optionValue(variant: ShopifyVariant, pattern: RegExp) {
  return variant.selectedOptions?.find((option) => pattern.test(option.name || ""))?.value || undefined;
}

function titleValue(variant: ShopifyVariant, pattern: RegExp) {
  return variant.title
    ?.split(/[\\/|,]+/)
    .map((part) => part.trim())
    .find((part) => pattern.test(part));
}

function parsePrice(amount: string | null | undefined) {
  const value = Number.parseFloat(amount || "");
  return Number.isFinite(value) ? value : undefined;
}

async function shopifyRequest<T>(
  config: ShopifyCommerceConfig,
  variables: Record<string, unknown>,
) {
  const response = await fetch(`${config.storeDomain}/api/${config.apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": config.storefrontAccessToken,
    },
    body: JSON.stringify({ query: shopifyProductsQuery, variables }),
    next: { revalidate: 300, tags: ["commerce-products"] },
  });
  const payload = (await response.json()) as ShopifyResponse<T>;
  const errorMessage = payload.errors?.map((error) => error.message).filter(Boolean).join("; ");

  if (!response.ok || errorMessage || !payload.data) {
    throw new Error(errorMessage || `Shopify Storefront API request failed with status ${response.status}.`);
  }

  return payload.data;
}

function mapShopifyProduct(product: ShopifyProduct): RemoteCommerceProduct {
  const variants = product.variants?.nodes || [];
  const priceRange = product.priceRange?.minVariantPrice;
  const images = [
    product.featuredImage?.url || "",
    ...(product.images?.nodes || []).map((image) => image.url || ""),
  ];

  return {
    id: product.id,
    slug: product.handle,
    name: product.title,
    description: product.description || undefined,
    category: product.productType || undefined,
    price: parsePrice(priceRange?.amount),
    currencyCode: priceRange?.currencyCode || undefined,
    images: Array.from(new Set(images.filter(Boolean))),
    variants: variants.map((variant) => ({
      id: variant.id,
      size: optionValue(variant, /size/i) || titleValue(variant, /^(XS|S|M|L|XL|2XL)$/i),
      colour: optionValue(variant, /colou?r/i) || titleValue(variant, /^(black|white)$/i),
      available: variant.availableForSale,
      price: parsePrice(variant.price?.amount),
      currencyCode: variant.price?.currencyCode || priceRange?.currencyCode || undefined,
      image: variant.image?.url || undefined,
    })),
  };
}

export async function fetchShopifyProducts(config: ShopifyCommerceConfig) {
  const products: RemoteCommerceProduct[] = [];
  let after: string | null = null;

  do {
    const data: ShopifyProductsPage = await shopifyRequest<ShopifyProductsPage>(config, {
      first: 100,
      after,
      country: config.countryCode,
    });
    products.push(...data.products.nodes.map(mapShopifyProduct));
    after = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor || null : null;
  } while (after);

  return normalizeRemoteProducts(products);
}
