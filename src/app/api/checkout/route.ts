import { NextResponse } from "next/server";
import { getCartProvider, getCommerceConfig } from "@/lib/commerce/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CHECKOUT_CART_FIELDS = [
  "*items",
  "*items.product",
  "*items.variant",
  "*shipping_methods",
  "*payment_collection",
  "*payment_collection.payment_sessions",
].join(",");

const SAFE_ID = /^[A-Za-z0-9_-]{1,160}$/;
const SAFE_COUNTRY = /^[a-z]{2}$/i;

type CheckoutBody = {
  action?: "details" | "shipping" | "payment" | "complete";
  cart_id?: unknown;
  email?: unknown;
  shipping_address?: unknown;
  billing_address?: unknown;
  option_id?: unknown;
  provider_id?: unknown;
};

class CheckoutRouteError extends Error {
  status: number;
  publicMessage: string;

  constructor(status: number, publicMessage: string) {
    super(publicMessage);
    this.status = status;
    this.publicMessage = publicMessage;
  }
}

function ensureCheckoutConfig() {
  if (process.env.CHECKOUT_ENABLED?.trim().toLowerCase() !== "true") {
    throw new CheckoutRouteError(404, "Checkout is not enabled in this environment.");
  }

  if (getCartProvider() !== "medusa") {
    throw new CheckoutRouteError(404, "Medusa checkout is disabled.");
  }

  const config = getCommerceConfig();
  if (config.provider !== "medusa" || !config.regionId) {
    throw new CheckoutRouteError(503, "Medusa checkout is not configured.");
  }

  return config;
}

function safeId(value: unknown, label: string) {
  if (typeof value !== "string" || !SAFE_ID.test(value)) {
    throw new CheckoutRouteError(400, label + " is invalid.");
  }
  return value;
}

function requiredText(value: unknown, label: string, maxLength: number) {
  if (typeof value !== "string") {
    throw new CheckoutRouteError(400, label + " is required.");
  }
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) {
    throw new CheckoutRouteError(400, label + " is invalid.");
  }
  return normalized;
}

function optionalText(value: unknown, label: string, maxLength: number) {
  if (value === undefined || value === null || value === "") return undefined;
  return requiredText(value, label, maxLength);
}

function parseAddress(value: unknown, label: string) {
  if (!value || typeof value !== "object") {
    throw new CheckoutRouteError(400, label + " is required.");
  }
  const address = value as Record<string, unknown>;
  const countryCode = requiredText(
    address.countryCode,
    label + " country",
    2,
  ).toLowerCase();
  if (!SAFE_COUNTRY.test(countryCode)) {
    throw new CheckoutRouteError(400, label + " country is invalid.");
  }

  const result: Record<string, string> = {
    first_name: requiredText(address.firstName, label + " first name", 80),
    last_name: requiredText(address.lastName, label + " last name", 80),
    address_1: requiredText(address.address1, label + " address", 160),
    city: requiredText(address.city, label + " city", 100),
    country_code: countryCode,
    postal_code: requiredText(address.postalCode, label + " postcode", 24),
  };
  const address2 = optionalText(address.address2, label + " address line 2", 160);
  const province = optionalText(address.province, label + " county", 100);
  const phone = optionalText(address.phone, label + " phone", 40);
  if (address2) result.address_2 = address2;
  if (province) result.province = province;
  if (phone) result.phone = phone;
  return result;
}

async function requestMedusa<T>(
  pathname: string,
  config: ReturnType<typeof getCommerceConfig>,
  init: RequestInit = {},
) {
  if (config.provider !== "medusa") {
    throw new CheckoutRouteError(503, "Medusa checkout is not configured.");
  }

  const response = await fetch(new URL(pathname, config.backendUrl + "/"), {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
      "x-publishable-api-key": config.publishableKey,
      ...(init.headers || {}),
    },
  });
  const payload = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    throw new CheckoutRouteError(
      response.status >= 400 && response.status < 500 ? response.status : 502,
      "Medusa checkout request failed.",
    );
  }
  if (!payload || typeof payload !== "object") {
    throw new CheckoutRouteError(502, "Medusa returned an empty checkout response.");
  }
  return payload as T;
}

async function retrieveCart(cartId: string, config: ReturnType<typeof getCommerceConfig>) {
  const params = new URLSearchParams({ fields: CHECKOUT_CART_FIELDS });
  return requestMedusa<Record<string, unknown>>(
    "/store/carts/" + encodeURIComponent(cartId) + "?" + params.toString(),
    config,
    { method: "GET" },
  );
}

function cartFrom(payload: Record<string, unknown>) {
  if (!payload.cart || typeof payload.cart !== "object") {
    throw new CheckoutRouteError(502, "Medusa returned no cart.");
  }
  return payload.cart;
}

function responseForError(error: unknown) {
  if (error instanceof CheckoutRouteError) {
    return NextResponse.json(
      { error: error.publicMessage },
      { status: error.status },
    );
  }
  return NextResponse.json(
    { error: "Checkout request could not be completed." },
    { status: 500 },
  );
}

export async function GET(request: Request) {
  try {
    const config = ensureCheckoutConfig();
    const search = new URL(request.url).searchParams;
    const resource = search.get("resource") || "cart";
    const cartId = safeId(search.get("cart_id"), "Cart ID");

    if (resource === "shipping-options") {
      const params = new URLSearchParams({ cart_id: cartId });
      return NextResponse.json(
        await requestMedusa<Record<string, unknown>>(
          "/store/shipping-options?" + params.toString(),
          config,
          { method: "GET" },
        ),
      );
    }

    if (resource === "payment-providers") {
      const params = new URLSearchParams({ region_id: config.regionId as string });
      return NextResponse.json(
        await requestMedusa<Record<string, unknown>>(
          "/store/payment-providers?" + params.toString(),
          config,
          { method: "GET" },
        ),
      );
    }

    if (resource !== "cart") {
      throw new CheckoutRouteError(400, "Checkout resource is invalid.");
    }

    return NextResponse.json(await retrieveCart(cartId, config));
  } catch (error) {
    return responseForError(error);
  }
}

async function parseBody(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    throw new CheckoutRouteError(400, "Checkout request body is invalid.");
  }
  return body as CheckoutBody;
}

export async function POST(request: Request) {
  try {
    const config = ensureCheckoutConfig();
    const body = await parseBody(request);
    const action = body.action;

    if (action === "details") {
      const cartId = safeId(body.cart_id, "Cart ID");
      const email = requiredText(body.email, "Email", 254).toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new CheckoutRouteError(400, "Email is invalid.");
      }
      const shippingAddress = parseAddress(body.shipping_address, "Shipping address");
      const billingAddress = parseAddress(body.billing_address, "Billing address");
      await requestMedusa(
        "/store/carts/" + encodeURIComponent(cartId),
        config,
        {
          method: "POST",
          body: JSON.stringify({
            email,
            shipping_address: shippingAddress,
            billing_address: billingAddress,
          }),
        },
      );
      return NextResponse.json(await retrieveCart(cartId, config));
    }

    if (action === "shipping") {
      const cartId = safeId(body.cart_id, "Cart ID");
      const optionId = safeId(body.option_id, "Shipping option ID");
      await requestMedusa(
        "/store/carts/" + encodeURIComponent(cartId) + "/shipping-methods",
        config,
        {
          method: "POST",
          body: JSON.stringify({ option_id: optionId, data: {} }),
        },
      );
      return NextResponse.json(await retrieveCart(cartId, config));
    }

    if (action === "payment") {
      const cartId = safeId(body.cart_id, "Cart ID");
      const providerId = safeId(
        body.provider_id ||
          process.env.CHECKOUT_DEVELOPMENT_PAYMENT_PROVIDER_ID ||
          "pp_system_default",
        "Payment provider ID",
      );
      const current = await retrieveCart(cartId, config);
      const currentCart = cartFrom(current);
      const currentCollection =
        currentCart.payment_collection &&
        typeof currentCart.payment_collection === "object"
          ? (currentCart.payment_collection as Record<string, unknown>)
          : {};
      let collectionId =
        typeof currentCollection.id === "string"
          ? currentCollection.id
          : undefined;
      const currentSessions = Array.isArray(currentCollection.payment_sessions)
        ? currentCollection.payment_sessions
        : [];
      const existingSession = currentSessions.some((session) => {
        const item = session && typeof session === "object" ? session as Record<string, unknown> : {};
        return item.provider_id === providerId && item.status !== "error";
      });

      if (!collectionId) {
        const created = await requestMedusa<Record<string, unknown>>(
          "/store/payment-collections",
          config,
          {
            method: "POST",
            body: JSON.stringify({ cart_id: cartId }),
          },
        );
        const collection = created.payment_collection;
        if (!collection || typeof collection !== "object") {
          throw new CheckoutRouteError(502, "Medusa returned no payment collection.");
        }
        collectionId = typeof (collection as Record<string, unknown>).id === "string"
          ? String((collection as Record<string, unknown>).id)
          : undefined;
      }

      if (!collectionId) {
        throw new CheckoutRouteError(502, "Medusa payment collection has no ID.");
      }

      if (!existingSession) {
        await requestMedusa(
          "/store/payment-collections/" +
            encodeURIComponent(collectionId) +
            "/payment-sessions",
          config,
          {
            method: "POST",
            body: JSON.stringify({ provider_id: providerId, data: {} }),
          },
        );
      }

      return NextResponse.json(await retrieveCart(cartId, config));
    }

    if (action === "complete") {
      const cartId = safeId(body.cart_id, "Cart ID");
      const result = await requestMedusa<Record<string, unknown>>(
        "/store/carts/" + encodeURIComponent(cartId) + "/complete",
        config,
        { method: "POST" },
      );
      if (result.type !== "order" || !result.order || typeof result.order !== "object") {
        throw new CheckoutRouteError(409, "Medusa did not complete the cart.");
      }
      const sourceOrder = result.order as Record<string, unknown>;
      const rawItems = Array.isArray(sourceOrder.items) ? sourceOrder.items : [];
      const items = rawItems.map((value, index) => {
        const item = value && typeof value === "object" ? value as Record<string, unknown> : {};
        return {
          id: typeof item.id === "string" ? item.id : "item-" + String(index + 1),
          title: typeof item.title === "string" ? item.title : "PHENO product",
          quantity: typeof item.quantity === "number" ? item.quantity : Number(item.quantity) || 0,
          unit_price: item.unit_price,
          total: item.total,
          variant_id: typeof item.variant_id === "string" ? item.variant_id : undefined,
        };
      });
      return NextResponse.json({
        type: "order",
        order: {
          id: typeof sourceOrder.id === "string" ? sourceOrder.id : "",
          display_id: typeof sourceOrder.display_id === "number" ? sourceOrder.display_id : undefined,
          email: typeof sourceOrder.email === "string" ? sourceOrder.email : undefined,
          currency_code: sourceOrder.currency_code,
          subtotal: sourceOrder.subtotal,
          total: sourceOrder.total,
          shipping_total: sourceOrder.shipping_total,
          tax_total: sourceOrder.tax_total,
          items,
        },
      });
    }

    throw new CheckoutRouteError(400, "Checkout action is invalid.");
  } catch (error) {
    return responseForError(error);
  }
}
