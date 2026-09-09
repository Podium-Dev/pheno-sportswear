import type { Product, ProductVariant } from "@/data/products";
import type { CartLine } from "@/lib/commerce/cart/types";

export const MEDUSA_CART_ID_STORAGE_KEY = "pheno-medusa-cart-id-v1";
export const MEDUSA_CART_MIGRATION_KEY = "pheno-medusa-cart-migration-v1";

export type MedusaCartItem = {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  thumbnail?: string | null;
  quantity: number;
  variant_id: string;
  product_id?: string | null;
  product_title?: string | null;
  product_handle?: string | null;
  variant_title?: string | null;
  variant_sku?: string | null;
  unit_price?: number | string | null;
  currency_code?: string | null;
  raw_unit_price?: { value?: number | string | null } | null;
};

export type MedusaCart = {
  id: string;
  currency_code?: string | null;
  subtotal?: number | string | null;
  item_total?: number | string | null;
  total?: number | string | null;
  items?: MedusaCartItem[] | null;
};

export type MedusaCartSnapshot = {
  id: string;
  lines: CartLine[];
  subtotal: number;
  currencyCode: string;
};

export class MedusaCartRequestError extends Error {
  status: number;

  constructor(status: number, message = "Medusa cart request failed.") {
    super(message);
    this.name = "MedusaCartRequestError";
    this.status = status;
  }
}

type MedusaCartResponse = {
  cart?: MedusaCart;
};

async function requestCart(
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  body?: Record<string, unknown>,
) {
  const response = await fetch(path, {
    method,
    headers: body
      ? { Accept: "application/json", "Content-Type": "application/json" }
      : { Accept: "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => null)) as
    | MedusaCartResponse
    | { error?: string }
    | null;

  if (!response.ok) {
    throw new MedusaCartRequestError(
      response.status,
      payload && "error" in payload && payload.error
        ? payload.error
        : undefined,
    );
  }

  if (!payload || !("cart" in payload) || !payload.cart) {
    throw new MedusaCartRequestError(502, "Cart response did not include a cart.");
  }

  return payload.cart;
}

export function createMedusaCart() {
  return requestCart("/api/cart", "POST", { action: "create" });
}

export function retrieveMedusaCart(cartId: string) {
  return requestCart(
    "/api/cart?cart_id=" + encodeURIComponent(cartId),
    "GET",
  );
}

export function addMedusaCartLine(
  cartId: string,
  variantId: string,
  quantity: number,
) {
  return requestCart("/api/cart", "POST", {
    action: "add",
    cart_id: cartId,
    variant_id: variantId,
    quantity,
  });
}

export function updateMedusaCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
) {
  return requestCart("/api/cart", "PATCH", {
    cart_id: cartId,
    line_id: lineId,
    quantity,
  });
}

export function removeMedusaCartLine(cartId: string, lineId: string) {
  return requestCart("/api/cart", "DELETE", {
    cart_id: cartId,
    line_id: lineId,
  });
}

function minorToMajor(value: unknown) {
  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;
  return Number.isFinite(numeric) ? numeric / 100 : 0;
}

function normalizeCurrency(value: unknown) {
  return typeof value === "string" && /^[a-z]{3}$/i.test(value)
    ? value.toUpperCase()
    : undefined;
}

function findCatalogVariant(
  catalogProducts: Product[],
  variantId: string,
): { product: Product; variant: ProductVariant } | undefined {
  for (const product of catalogProducts) {
    const variant = product.variants.find((item) => item.id === variantId);
    if (variant) {
      return { product, variant };
    }
  }
  return undefined;
}

export function mapMedusaCart(
  cart: MedusaCart,
  catalogProducts: Product[],
): MedusaCartSnapshot {
  const cartCurrency = normalizeCurrency(cart.currency_code) || "GBP";
  const lines = (cart.items || []).map((item) => {
    const match = findCatalogVariant(catalogProducts, item.variant_id);
    const product = match?.product;
    const variant = match?.variant;
    const productImage = product && variant
      ? product.colourImages[variant.colour] || product.images[0]
      : undefined;
    const price = item.unit_price !== null && item.unit_price !== undefined
      ? minorToMajor(item.unit_price)
      : variant?.price ?? 0;

    return {
      id: item.id,
      productId: item.product_id || product?.commerceProductId || product?.id,
      productSlug: product?.slug || item.product_handle || "product",
      variantId: item.variant_id,
      name: item.product_title || item.title || product?.name || "PHENO product",
      colour: variant?.colour || "Black",
      size: variant?.size || "Selected size",
      price,
      currencyCode:
        normalizeCurrency(item.currency_code) ||
        normalizeCurrency(variant?.currencyCode) ||
        normalizeCurrency(product?.currencyCode) ||
        cartCurrency,
      image: item.thumbnail || productImage || product?.images[0] || "",
      quantity: Math.max(0, Number(item.quantity) || 0),
    } satisfies CartLine;
  });

  const subtotalValue =
    cart.subtotal !== null && cart.subtotal !== undefined
      ? cart.subtotal
      : cart.item_total !== null && cart.item_total !== undefined
        ? cart.item_total
        : cart.total;

  return {
    id: cart.id,
    lines,
    subtotal: minorToMajor(subtotalValue),
    currencyCode: cartCurrency,
  };
}
