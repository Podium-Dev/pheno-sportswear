import { NextResponse } from "next/server";

type StoreOption = {
  value?: string | null;
  option?: { title?: string | null } | null;
};

type StoreVariant = {
  options?: StoreOption[] | null;
  manage_inventory?: boolean | null;
  allow_backorder?: boolean | null;
  inventory_quantity?: number | null;
  available_quantity?: number | null;
  purchasable?: boolean | null;
};

type StoreProduct = {
  handle?: string | null;
  variants?: StoreVariant[] | null;
};

type StoreResponse = { products?: StoreProduct[] };

function optionValue(variant: StoreVariant, title: RegExp) {
  return variant.options?.find((option) => title.test(option.option?.title || ""))?.value?.toLowerCase();
}

function availabilityFields(variant: StoreVariant | undefined) {
  if (!variant) return null;

  return {
    manage_inventory: variant.manage_inventory ?? null,
    allow_backorder: variant.allow_backorder ?? null,
    inventory_quantity: variant.inventory_quantity ?? null,
    available_quantity: variant.available_quantity ?? null,
    purchasable: variant.purchasable ?? null,
  };
}

export async function GET() {
  const backendUrl = process.env.MEDUSA_BACKEND_URL;
  const publishableKey = process.env.MEDUSA_PUBLISHABLE_KEY;

  if (!backendUrl || !publishableKey) {
    return NextResponse.json({ error: "Medusa storefront configuration is unavailable." }, { status: 500 });
  }

  const url = new URL("/store/products", `${backendUrl}/`);
  url.searchParams.set("handle", "pheno-type-1-hoodie");
  url.searchParams.set("fields", "*variants.calculated_price,+variants.inventory_quantity");
  if (process.env.MEDUSA_REGION_ID) url.searchParams.set("region_id", process.env.MEDUSA_REGION_ID);

  const response = await fetch(url, {
    headers: { Accept: "application/json", "x-publishable-api-key": publishableKey },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Medusa Store API request failed.", status: response.status }, { status: 502 });
  }

  const payload = (await response.json()) as StoreResponse;
  const hoodie = payload.products?.find((product) => product.handle === "pheno-type-1-hoodie");
  const variants = hoodie?.variants || [];
  const hoodieXs = variants.find((variant) => optionValue(variant, /size/i) === "xs" && optionValue(variant, /colou?r/i) === "black");
  const hoodieSmall = variants.find((variant) => optionValue(variant, /size/i) === "s" && optionValue(variant, /colou?r/i) === "black");

  return NextResponse.json({
    requested_fields: ["variants.calculated_price", "variants.inventory_quantity"],
    managed_zero_stock_variant: availabilityFields(hoodieXs),
    unmanaged_variant: availabilityFields(hoodieSmall),
  });
}
