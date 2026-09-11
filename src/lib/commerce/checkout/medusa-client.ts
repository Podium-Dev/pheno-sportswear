import type { CartLine } from "@/lib/commerce/cart/types";

export const CHECKOUT_ORDER_CONFIRMATION_KEY = "pheno-order-confirmation-v1";

export type CheckoutAddress = {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  postalCode: string;
  countryCode: string;
  phone: string;
};

export type CheckoutLine = CartLine & {
  total: number;
};

export type CheckoutCart = {
  id: string;
  email?: string;
  currencyCode: string;
  lines: CheckoutLine[];
  itemSubtotal: number;
  itemTotal: number;
  taxTotal: number;
  shippingTotal: number;
  subtotal: number;
  total: number;
  paymentStatus?: string;
};

export type CheckoutShippingOption = {
  id: string;
  name: string;
  description?: string;
  amount: number;
  priceType?: string;
};

export type CheckoutPaymentProvider = {
  id: string;
  title: string;
  isEnabled?: boolean;
};

export type CheckoutPaymentInitialization = {
  cart: CheckoutCart;
  providerId: string;
  clientSecret?: string;
};

export type CheckoutOrder = {
  id: string;
  displayId?: number;
  email?: string;
  currencyCode: string;
  subtotal: number;
  total: number;
  shippingTotal: number;
  taxTotal: number;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unitPrice: number;
    total: number;
    variantId?: string;
  }>;
};

export class CheckoutRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "CheckoutRequestError";
    this.status = status;
  }
}

type ApiRecord = Record<string, unknown>;

function record(value: unknown): ApiRecord {
  return value && typeof value === "object" ? (value as ApiRecord) : {};
}

function numberValue(value: unknown) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;
  return Number.isFinite(parsed) ? parsed : 0;
}

function minorToMajor(value: unknown) {
  return numberValue(value) / 100;
}

function currencyCode(value: unknown) {
  return typeof value === "string" && /^[a-z]{3}$/i.test(value)
    ? value.toUpperCase()
    : "GBP";
}

function mapCheckoutCart(value: unknown): CheckoutCart {
  const cart = record(value);
  const currency = currencyCode(cart.currency_code);
  const rawItems = Array.isArray(cart.items) ? cart.items : [];
  const lines = rawItems.map((rawItem, index) => {
    const item = record(rawItem);
    const quantity = Math.max(0, Math.floor(numberValue(item.quantity)));
    const unitPrice = minorToMajor(item.unit_price);
    const rawTotal =
      item.total ?? item.item_total ?? numberValue(item.unit_price) * quantity;
    const product = record(item.product);
    const variant = record(item.variant);
    return {
      id: typeof item.id === "string" ? item.id : "line-" + String(index + 1),
      productId:
        typeof item.product_id === "string"
          ? item.product_id
          : typeof product.id === "string"
            ? product.id
            : undefined,
      productSlug:
        typeof item.product_handle === "string"
          ? item.product_handle
          : typeof product.handle === "string"
            ? product.handle
            : "product",
      variantId:
        typeof item.variant_id === "string"
          ? item.variant_id
          : typeof variant.id === "string"
            ? variant.id
            : "",
      name:
        typeof item.product_title === "string"
          ? item.product_title
          : typeof item.title === "string"
            ? item.title
            : "PHENO product",
      colour: typeof item.variant_title === "string" ? item.variant_title : "",
      size: "",
      price: unitPrice,
      currencyCode: currency,
      image:
        typeof item.thumbnail === "string"
          ? item.thumbnail
          : typeof product.thumbnail === "string"
            ? product.thumbnail
            : "",
      quantity,
      total: minorToMajor(rawTotal),
    } satisfies CheckoutLine;
  });

  return {
    id: typeof cart.id === "string" ? cart.id : "",
    email: typeof cart.email === "string" ? cart.email : undefined,
    currencyCode: currency,
    lines,
    itemSubtotal: minorToMajor(cart.item_subtotal),
    itemTotal: minorToMajor(cart.item_total),
    taxTotal: minorToMajor(cart.tax_total),
    shippingTotal: minorToMajor(cart.shipping_total),
    subtotal: minorToMajor(cart.subtotal),
    total: minorToMajor(cart.total),
    paymentStatus:
      typeof record(cart.payment_collection).status === "string"
        ? String(record(cart.payment_collection).status)
        : undefined,
  };
}

async function requestCheckout<T>(
  path: string,
  method: "GET" | "POST",
  body?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(path, {
    method,
    headers: body
      ? { Accept: "application/json", "Content-Type": "application/json" }
      : { Accept: "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => null)) as
    | ApiRecord
    | null;
  if (!response.ok) {
    const message =
      typeof payload?.error === "string"
        ? payload.error
        : "Checkout request could not be completed.";
    throw new CheckoutRequestError(response.status, message);
  }
  return payload as T;
}

function mappedCart(payload: unknown) {
  return mapCheckoutCart(record(payload).cart);
}

export function readMedusaCartId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("pheno-medusa-cart-id-v1");
}

export function clearMedusaCartId() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("pheno-medusa-cart-id-v1");
  }
}

export function retrieveCheckoutCart(cartId: string) {
  return requestCheckout<ApiRecord>(
    "/api/checkout?resource=cart&cart_id=" + encodeURIComponent(cartId),
    "GET",
  ).then(mappedCart);
}

export function listCheckoutShippingOptions(cartId: string) {
  return requestCheckout<ApiRecord>(
    "/api/checkout?resource=shipping-options&cart_id=" +
      encodeURIComponent(cartId),
    "GET",
  ).then((payload) => {
    const options = Array.isArray(payload.shipping_options)
      ? payload.shipping_options
      : [];
    return options.map((value) => {
      const option = record(value);
      return {
        id: typeof option.id === "string" ? option.id : "",
        name: typeof option.name === "string" ? option.name : "Shipping",
        description:
          typeof option.description === "string"
            ? option.description
            : undefined,
        amount: minorToMajor(option.amount),
        priceType:
          typeof option.price_type === "string" ? option.price_type : undefined,
      } satisfies CheckoutShippingOption;
    });
  });
}

export function listCheckoutPaymentProviders() {
  return requestCheckout<ApiRecord>(
    "/api/checkout?resource=payment-providers",
    "GET",
  ).then((payload) => {
    const providers = Array.isArray(payload.payment_providers)
      ? payload.payment_providers
      : [];
    return providers.map((value) => {
      const provider = record(value);
      const id = typeof provider.id === "string" ? provider.id : "";
      return {
        id,
        title:
          typeof provider.title === "string"
            ? provider.title
            : id === "pp_system"
              ? "Development manual payment"
              : id,
        isEnabled:
          typeof provider.is_enabled === "boolean"
            ? provider.is_enabled
            : undefined,
      } satisfies CheckoutPaymentProvider;
    }).filter((provider) => provider.id);
  });
}

export function updateCheckoutDetails(
  cartId: string,
  email: string,
  shippingAddress: CheckoutAddress,
  billingAddress: CheckoutAddress,
) {
  return requestCheckout<ApiRecord>("/api/checkout", "POST", {
    action: "details",
    cart_id: cartId,
    email,
    shipping_address: shippingAddress,
    billing_address: billingAddress,
  }).then(mappedCart);
}

export function addCheckoutShippingMethod(
  cartId: string,
  optionId: string,
) {
  return requestCheckout<ApiRecord>("/api/checkout", "POST", {
    action: "shipping",
    cart_id: cartId,
    option_id: optionId,
  }).then(mappedCart);
}

export function initializeCheckoutPayment(
  cartId: string,
  providerId: string,
) {
  return requestCheckout<ApiRecord>("/api/checkout", "POST", {
    action: "payment",
    cart_id: cartId,
    provider_id: providerId,
  }).then((payload) => {
    const payment = record(payload.payment);
    return {
      cart: mappedCart(payload),
      providerId:
        typeof payment.provider_id === "string"
          ? payment.provider_id
          : providerId,
      clientSecret:
        typeof payment.client_secret === "string"
          ? payment.client_secret
          : undefined,
    } satisfies CheckoutPaymentInitialization;
  });
}

export function completeCheckout(cartId: string) {
  return requestCheckout<{ type: "order"; order: CheckoutOrder }>(
    "/api/checkout",
    "POST",
    { action: "complete", cart_id: cartId },
  );
}
