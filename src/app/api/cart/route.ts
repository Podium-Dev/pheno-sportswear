import { NextResponse } from "next/server";
import { getCartProvider, getCommerceConfig } from "@/lib/commerce/config";

export const dynamic = "force-dynamic";

const CART_FIELDS =
  "*items, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total";
const SAFE_ID = /^[A-Za-z0-9_-]{1,160}$/;

type CartBody = {
  action?: "create" | "add";
  cart_id?: unknown;
  variant_id?: unknown;
  line_id?: unknown;
  quantity?: unknown;
};

class CartRouteError extends Error {
  status: number;
  publicMessage: string;

  constructor(status: number, publicMessage: string) {
    super(publicMessage);
    this.status = status;
    this.publicMessage = publicMessage;
  }
}

function ensureMedusaCartConfig() {
  if (getCartProvider() !== "medusa") {
    throw new CartRouteError(404, "Medusa cart integration is disabled.");
  }

  const config = getCommerceConfig();
  if (config.provider !== "medusa") {
    throw new CartRouteError(503, "Medusa cart integration is unavailable.");
  }

  if (!config.regionId) {
    throw new CartRouteError(503, "Medusa cart region is not configured.");
  }

  return config;
}

function safeId(value: unknown, label: string) {
  if (typeof value !== "string" || !SAFE_ID.test(value)) {
    throw new CartRouteError(400, label + " is invalid.");
  }
  return value;
}

function safeQuantity(value: unknown) {
  const quantity = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
    throw new CartRouteError(400, "Quantity is invalid.");
  }
  return quantity;
}

async function requestMedusa<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const config = ensureMedusaCartConfig();
  const response = await fetch(new URL(path, config.backendUrl + "/"), {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-publishable-api-key": config.publishableKey,
      ...(init.headers || {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as T | null;
  if (!response.ok) {
    throw new CartRouteError(
      response.status >= 400 && response.status < 500 ? response.status : 502,
      "Medusa cart request failed.",
    );
  }

  if (!payload) {
    throw new CartRouteError(502, "Medusa returned an empty cart response.");
  }

  return payload;
}

async function retrieveCart(cartId: string) {
  return requestMedusa<{ cart?: unknown }>(
    "/store/carts/" + encodeURIComponent(cartId) +
      "?fields=" + encodeURIComponent(CART_FIELDS),
    { method: "GET" },
  );
}

function responseForError(error: unknown) {
  if (error instanceof CartRouteError) {
    return NextResponse.json(
      { error: error.publicMessage },
      { status: error.status },
    );
  }

  return NextResponse.json(
    { error: "Cart request could not be completed." },
    { status: 500 },
  );
}

export async function GET(request: Request) {
  try {
    ensureMedusaCartConfig();
    const cartId = safeId(
      new URL(request.url).searchParams.get("cart_id"),
      "Cart ID",
    );
    return NextResponse.json(await retrieveCart(cartId));
  } catch (error) {
    return responseForError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as CartBody | null;
    const config = ensureMedusaCartConfig();

    if (body?.action === "create") {
      return NextResponse.json(
        await requestMedusa<{ cart?: unknown }>("/store/carts", {
          method: "POST",
          body: JSON.stringify({ region_id: config.regionId }),
        }),
      );
    }

    if (body?.action === "add") {
      const cartId = safeId(body.cart_id, "Cart ID");
      const variantId = safeId(body.variant_id, "Variant ID");
      const quantity = safeQuantity(body.quantity);
      await requestMedusa("/store/carts/" + encodeURIComponent(cartId) + "/line-items", {
        method: "POST",
        body: JSON.stringify({ variant_id: variantId, quantity }),
      });
      return NextResponse.json(await retrieveCart(cartId));
    }

    throw new CartRouteError(400, "Cart action is invalid.");
  } catch (error) {
    return responseForError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    ensureMedusaCartConfig();
    const body = (await request.json().catch(() => null)) as CartBody | null;
    const cartId = safeId(body?.cart_id, "Cart ID");
    const lineId = safeId(body?.line_id, "Line ID");
    const quantity = safeQuantity(body?.quantity);
    await requestMedusa(
      "/store/carts/" + encodeURIComponent(cartId) +
        "/line-items/" + encodeURIComponent(lineId),
      {
        method: "POST",
        body: JSON.stringify({ quantity }),
      },
    );
    return NextResponse.json(await retrieveCart(cartId));
  } catch (error) {
    return responseForError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    ensureMedusaCartConfig();
    const body = (await request.json().catch(() => null)) as CartBody | null;
    const cartId = safeId(body?.cart_id, "Cart ID");
    const lineId = safeId(body?.line_id, "Line ID");
    await requestMedusa(
      "/store/carts/" + encodeURIComponent(cartId) +
        "/line-items/" + encodeURIComponent(lineId),
      { method: "DELETE" },
    );
    return NextResponse.json(await retrieveCart(cartId));
  } catch (error) {
    return responseForError(error);
  }
}
