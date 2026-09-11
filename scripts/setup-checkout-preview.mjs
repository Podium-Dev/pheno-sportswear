#!/usr/bin/env node

/*
 * Idempotent setup for the isolated PHENO guest-checkout preview.
 *
 * Safety boundary:
 * - This runner is hard-wired to the isolated Railway project created for
 *   checkout preview work.
 * - It refuses to run unless the caller explicitly supplies the preview-only
 *   marker and the exact isolated backend hostname.
 * - It does not import products. Catalogue seeding is a separate guarded step.
 * - Admin bearer tokens and publishable-key values stay in memory and are
 *   never logged.
 *
 * All shipping, tax, fulfillment, notification, and payment values below are
 * DEVELOPMENT PLACEHOLDERS and must be replaced after client decisions.
 */

import process from "node:process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ISOLATED_PROJECT_ID = "abc3d54e-b612-43a8-bf53-7d9cf34eafef";
const PRODUCTION_MEDUSA_HOST = "medusa-server-production-4fc6.up.railway.app";
const REQUEST_TIMEOUT = Number(process.env.CHECKOUT_SETUP_TIMEOUT_MS || 30000);

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error("Missing required environment variable: " + name);
  return value;
}

const backendUrlValue = required("MEDUSA_BACKEND_URL").replace(/\/+$/, "");
const backendUrl = new URL(backendUrlValue + "/");
const previewHost = required("CHECKOUT_PREVIEW_BACKEND_HOST");
if (process.env.CHECKOUT_PREVIEW_ONLY !== "true") {
  throw new Error("Refusing to run without CHECKOUT_PREVIEW_ONLY=true.");
}
if (process.env.CHECKOUT_PREVIEW_PROJECT_ID !== ISOLATED_PROJECT_ID) {
  throw new Error("Refusing to run for an unapproved Railway project.");
}
if (process.env.RAILWAY_PROJECT_ID && process.env.RAILWAY_PROJECT_ID !== ISOLATED_PROJECT_ID) {
  throw new Error("Refusing to run outside the isolated Railway project.");
}
if (backendUrl.hostname !== previewHost) {
  throw new Error("Refusing to run: MEDUSA_BACKEND_URL is not the exact isolated preview host.");
}
if (backendUrl.hostname === PRODUCTION_MEDUSA_HOST) {
  throw new Error("Refusing to run against the production Medusa backend.");
}

const config = {
  backendUrl: backendUrlValue,
  adminEmail: required("MEDUSA_ADMIN_EMAIL"),
  adminPassword: required("MEDUSA_ADMIN_PASSWORD"),
};

const PLACEHOLDERS = {
  regionName: "United Kingdom",
  currencyCode: "gbp",
  countryCode: "gb",
  salesChannelName: "PHENO Web Storefront",
  stockLocationName: "PHENO Main Warehouse",
  fulfillmentSetName: "PHENO Development Shipping",
  serviceZoneName: "PHENO United Kingdom",
  shippingProfileName: "PHENO Development Shipping Profile",
  shippingOptionName: "PHENO Development Shipping",
  taxProviderId: "tp_system",
  fulfillmentProviderId: "fp_manual_manual",
  paymentProviderId: "pp_system_default",
  adminKeyTitle: "PHENO Isolated Checkout Preview",
  developmentTaxRate: 0,
};

if (!Number.isFinite(REQUEST_TIMEOUT) || REQUEST_TIMEOUT < 1000) {
  throw new Error("CHECKOUT_SETUP_TIMEOUT_MS must be at least 1000 milliseconds.");
}

async function request(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const text = await response.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }
    }
    return { response, data };
  } finally {
    clearTimeout(timer);
  }
}

let adminToken = null;

async function admin(pathname, options = {}) {
  const url = new URL(pathname, config.backendUrl + "/");
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  if (adminToken) headers.set("Authorization", "Bearer " + adminToken);

  const result = await request(url, {
    method: options.method || "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  if (!result.response.ok) {
    const detail =
      result.data?.message ||
      result.data?.type ||
      result.data?.code ||
      "HTTP " + result.response.status;
    const error = new Error(
      (options.method || "GET") +
        " " +
        url.pathname +
        url.search +
        " returned " +
        result.response.status +
        ": " +
        String(detail).slice(0, 240),
    );
    error.status = result.response.status;
    error.path = url.pathname + url.search;
    throw error;
  }
  return result.data;
}

async function login() {
  const result = await admin("/auth/user/emailpass", {
    method: "POST",
    body: { email: config.adminEmail, password: config.adminPassword },
  });
  adminToken = result.token || result.access_token || null;
  if (!adminToken) throw new Error("Admin authentication returned no bearer token.");
}

function listKey(pathname) {
  const name = pathname.replace(/\/+$/, "").split("/").pop();
  return {
    regions: "regions",
    "sales-channels": "sales_channels",
    "stock-locations": "stock_locations",
    "fulfillment-sets": "fulfillment_sets",
    "shipping-profiles": "shipping_profiles",
    "shipping-options": "shipping_options",
    "tax-regions": "tax_regions",
    "api-keys": "api_keys",
  }[name] || name;
}

async function listAdmin(pathname, extraParams = {}) {
  const key = listKey(pathname);
  const records = [];
  let offset = 0;
  while (true) {
    const query = new URLSearchParams({
      limit: "100",
      offset: String(offset),
      ...extraParams,
    });
    const data = await admin(pathname + "?" + query.toString());
    const page = Array.isArray(data[key]) ? data[key] : [];
    records.push(...page);
    if (page.length < 100) return records;
    offset += page.length;
  }
}

function idOf(value) {
  if (!value || typeof value !== "object") return value;
  return (
    value.id ||
    value.fulfillment_provider_id ||
    value.stock_location_id ||
    value.location_id ||
    value.fulfillment_provider?.id ||
    value.location?.id ||
    value.fulfillmentProvider?.id ||
    value.stockLocation?.id
  );
}

function hasRelation(items, wantedId) {
  return Array.isArray(items) && items.some((item) => idOf(item) === wantedId);
}

function exactlyOne(items, label) {
  if (items.length > 1) throw new Error("Duplicate isolated " + label + " records detected.");
  return items[0] || null;
}

function label(resource) {
  return resource
    ? (resource.name || resource.title || resource.id) + " (" + resource.id + ")"
    : "not found";
}

async function ensureRegion() {
  const desired = {
    name: PLACEHOLDERS.regionName,
    currency_code: PLACEHOLDERS.currencyCode,
    countries: [PLACEHOLDERS.countryCode],
    automatic_taxes: true,
    is_tax_inclusive: false,
    payment_providers: [PLACEHOLDERS.paymentProviderId],
    metadata: {
      pheno_preview: "true",
      pheno_placeholder_tax_policy: "system provider; final UK VAT decision pending",
    },
  };
  const existing = exactlyOne(
    (await listAdmin("/admin/regions")).filter((item) => item.name === desired.name),
    "region",
  );
  if (!existing) {
    const result = await admin("/admin/regions", { method: "POST", body: desired });
    return result.region;
  }
  const result = await admin("/admin/regions/" + encodeURIComponent(existing.id), {
    method: "POST",
    body: desired,
  });
  return result.region || existing;
}

async function ensureSalesChannel() {
  const desired = {
    name: PLACEHOLDERS.salesChannelName,
    description: "Isolated PHENO guest-checkout preview.",
    is_disabled: false,
    metadata: { pheno_preview: "true" },
  };
  const existing = exactlyOne(
    (await listAdmin("/admin/sales-channels")).filter((item) => item.name === desired.name),
    "sales channel",
  );
  if (!existing) {
    const result = await admin("/admin/sales-channels", { method: "POST", body: desired });
    return result.sales_channel;
  }
  const result = await admin("/admin/sales-channels/" + encodeURIComponent(existing.id), {
    method: "POST",
    body: desired,
  });
  return result.sales_channel || existing;
}

async function retrieveStockLocation(id) {
  const result = await admin(
    "/admin/stock-locations/" +
      encodeURIComponent(id) +
      "?fields=*sales_channels,*fulfillment_sets,*fulfillment_sets.service_zones,*fulfillment_providers",
  );
  return result.stock_location;
}
async function retrieveFulfillmentProvider(id) {
  // Medusa 2.20.1 exposes fulfillment providers through the collection
  // endpoint; the single-provider detail route is not available there.
  const query = new URLSearchParams({
    limit: "100",
    offset: "0",
    fields: "*locations",
  });
  const result = await admin("/admin/fulfillment-providers?" + query.toString());
  const providers = Array.isArray(result.fulfillment_providers)
    ? result.fulfillment_providers
    : [];
  return providers.find((provider) => provider.id === id) || null;
}

async function ensureStockLocation() {
  const desired = {
    name: PLACEHOLDERS.stockLocationName,
    address: {
      address_1: "PHENO Main Warehouse",
      city: "London",
      country_code: PLACEHOLDERS.countryCode,
      postal_code: "SW1A 1AA",
    },
    metadata: { pheno_preview: "true" },
  };
  const existing = exactlyOne(
    (await listAdmin("/admin/stock-locations")).filter((item) => item.name === desired.name),
    "stock location",
  );
  if (!existing) {
    const result = await admin("/admin/stock-locations", { method: "POST", body: desired });
    return retrieveStockLocation(result.stock_location.id);
  }
  const result = await admin("/admin/stock-locations/" + encodeURIComponent(existing.id), {
    method: "POST",
    body: desired,
  });
  return retrieveStockLocation(result.stock_location?.id || existing.id);
}

async function ensureStockLocationSalesChannel(stockLocation, salesChannel) {
  if (hasRelation(stockLocation.sales_channels, salesChannel.id)) return stockLocation;
  await admin(
    "/admin/stock-locations/" + encodeURIComponent(stockLocation.id) + "/sales-channels",
    { method: "POST", body: { add: [salesChannel.id], remove: [] } },
  );
  return retrieveStockLocation(stockLocation.id);
}

async function ensureFulfillmentProvider(stockLocation) {
  if (!hasRelation(stockLocation.fulfillment_providers, PLACEHOLDERS.fulfillmentProviderId)) {
    await admin(
      "/admin/stock-locations/" +
        encodeURIComponent(stockLocation.id) +
        "/fulfillment-providers",
      { method: "POST", body: { add: [PLACEHOLDERS.fulfillmentProviderId], remove: [] } },
    );
  }

  // Always refetch after the link operation. Medusa validates shipping options
  // against the fulfillment set's linked stock-location providers, not just
  // the provider list held by the caller's earlier response.
  const refreshed = await retrieveStockLocation(stockLocation.id);
  const provider = await retrieveFulfillmentProvider(PLACEHOLDERS.fulfillmentProviderId);
  const locationLinkedFromProvider = hasRelation(provider?.locations, stockLocation.id);
  if (
    !hasRelation(refreshed.fulfillment_providers, PLACEHOLDERS.fulfillmentProviderId) &&
    !locationLinkedFromProvider
  ) {
    throw new Error(
      "Fulfillment provider could not be confirmed on the stock location: " +
        PLACEHOLDERS.fulfillmentProviderId +
        " (stock-location relation IDs: " +
        (Array.isArray(refreshed?.fulfillment_providers)
          ? refreshed.fulfillment_providers.map(idOf).join(",")
          : "none") +
        "; provider locations: " +
        (Array.isArray(provider?.locations) ? provider.locations.map(idOf).join(",") : "none") +
        ")",
    );
  }
  return refreshed;
}

async function ensureFulfillmentSet(stockLocation) {
  let set = (stockLocation.fulfillment_sets || []).find(
    (item) => item.name === PLACEHOLDERS.fulfillmentSetName && item.type === "shipping",
  );
  if (set) return set;

  await admin(
    "/admin/stock-locations/" +
      encodeURIComponent(stockLocation.id) +
      "/fulfillment-sets",
    {
      method: "POST",
      body: { name: PLACEHOLDERS.fulfillmentSetName, type: "shipping" },
    },
  );

  // Medusa 2.20.1 returns the refreshed fulfillment-set relation through the
  // stock-location response. The /admin/fulfillment-sets collection endpoint
  // is not available in this version, so do not attempt a second lookup there.
  const refreshed = await retrieveStockLocation(stockLocation.id);
  set = (refreshed.fulfillment_sets || []).find(
    (item) => item.name === PLACEHOLDERS.fulfillmentSetName && item.type === "shipping",
  );
  if (!set) throw new Error("Created fulfillment set could not be resolved from the stock location.");
  return set;
}

async function ensureServiceZone(fulfillmentSet, stockLocationId) {
  const existingZones = Array.isArray(fulfillmentSet.service_zones)
    ? fulfillmentSet.service_zones
    : [];
  let zone = existingZones.find((item) => item.name === PLACEHOLDERS.serviceZoneName);
  if (zone) return zone;

  const created = await admin(
    "/admin/fulfillment-sets/" +
      encodeURIComponent(fulfillmentSet.id) +
      "/service-zones",
    {
      method: "POST",
      body: {
        name: PLACEHOLDERS.serviceZoneName,
        geo_zones: [{ type: "country", country_code: PLACEHOLDERS.countryCode }],
      },
    },
  );

  // The Medusa 2.20.1 route returns the refetched fulfillment set after the
  // service zone is created. Prefer that response, then use the supported
  // stock-location relation as a read-after-write fallback.
  zone = (created.fulfillment_set?.service_zones || []).find(
    (item) => item.name === PLACEHOLDERS.serviceZoneName,
  );
  if (zone) return zone;

  if (stockLocationId) {
    const refreshed = await retrieveStockLocation(stockLocationId);
    const refreshedSet = (refreshed.fulfillment_sets || []).find(
      (item) => item.id === fulfillmentSet.id,
    );
    zone = (refreshedSet?.service_zones || []).find(
      (item) => item.name === PLACEHOLDERS.serviceZoneName,
    );
  }

  if (!zone) throw new Error("Created service zone could not be resolved.");
  return zone;
}

async function ensureShippingProfile() {
  const desired = {
    name: PLACEHOLDERS.shippingProfileName,
    type: "default",
    metadata: { pheno_preview: "true" },
  };
  const existing = exactlyOne(
    (await listAdmin("/admin/shipping-profiles")).filter((item) => item.name === desired.name),
    "shipping profile",
  );
  if (existing) return existing;
  const result = await admin("/admin/shipping-profiles", { method: "POST", body: desired });
  return result.shipping_profile;
}

async function ensureShippingOption(serviceZone, shippingProfile, region) {
  const desired = {
    name: PLACEHOLDERS.shippingOptionName,
    service_zone_id: serviceZone.id,
    shipping_profile_id: shippingProfile.id,
    price_type: "flat",
    provider_id: PLACEHOLDERS.fulfillmentProviderId,
    type: {
      label: "Development standard shipping",
      code: "pheno-development-standard",
      description: "Temporary development shipping placeholder.",
    },
    prices: [{ region_id: region.id, amount: 0 }],
    metadata: {
      pheno_preview: "true",
      pheno_placeholder_shipping_policy: "Final carrier/rate decision pending",
    },
  };
  const existing = exactlyOne(
    (await listAdmin("/admin/shipping-options", { fields: "*prices,*type" })).filter(
      (item) => item.name === desired.name,
    ),
    "shipping option",
  );
  if (!existing) {
    const result = await admin("/admin/shipping-options", { method: "POST", body: desired });
    return result.shipping_option;
  }
  const result = await admin("/admin/shipping-options/" + encodeURIComponent(existing.id), {
    method: "POST",
    body: desired,
  });
  return result.shipping_option || existing;
}

async function ensureTaxRegion() {
  const matches = (await listAdmin("/admin/tax-regions")).filter(
    (item) => item.country_code === PLACEHOLDERS.countryCode && !item.province_code,
  );
  if (matches.length > 1) throw new Error("Duplicate isolated UK tax regions detected.");
  if (matches.length === 1) {
    const existing = matches[0];
    if (existing.provider_id !== PLACEHOLDERS.taxProviderId) {
      const result = await admin("/admin/tax-regions/" + encodeURIComponent(existing.id), {
        method: "POST",
        body: { provider_id: PLACEHOLDERS.taxProviderId },
      });
      return result.tax_region || existing;
    }
    return existing;
  }

  const result = await admin("/admin/tax-regions", {
    method: "POST",
    body: {
      country_code: PLACEHOLDERS.countryCode,
      provider_id: PLACEHOLDERS.taxProviderId,
      default_tax_rate: {
        rate: PLACEHOLDERS.developmentTaxRate,
        code: "PHENO-DEVELOPMENT-0",
        name: "Development tax placeholder (0%)",
        is_combinable: false,
        metadata: { pheno_preview: "true" },
      },
      metadata: {
        pheno_preview: "true",
        pheno_placeholder_tax_policy: "Final UK VAT decision pending",
      },
    },
  });
  return result.tax_region;
}

async function ensurePublishableKey(salesChannel) {
  const suppliedToken = process.env.MEDUSA_PUBLISHABLE_KEY?.trim();
  const keys = await listAdmin("/admin/api-keys", { type: "publishable" });
  const named = exactlyOne(
    keys.filter((item) => item.title === PLACEHOLDERS.adminKeyTitle),
    "publishable API key",
  );

  if (suppliedToken) {
    const supplied = keys.find((item) => item.token === suppliedToken);
    if (!supplied) throw new Error("MEDUSA_PUBLISHABLE_KEY does not match an isolated publishable key.");
    if (!hasRelation(supplied.sales_channels, salesChannel.id)) {
      await admin(
        "/admin/api-keys/" + encodeURIComponent(supplied.id) + "/sales-channels",
        { method: "POST", body: { add: [salesChannel.id], remove: [] } },
      );
    }
    return { id: supplied.id, created: false, available: true };
  }

  if (named) {
    throw new Error(
      "The isolated publishable key already exists but its raw token is intentionally unavailable. Set MEDUSA_PUBLISHABLE_KEY as a Railway secret and rerun.",
    );
  }

  if (process.env.CHECKOUT_CREATE_PUBLISHABLE_KEY !== "true") {
    return { id: null, created: false, available: false };
  }

  const created = await admin("/admin/api-keys", {
    method: "POST",
    body: { title: PLACEHOLDERS.adminKeyTitle, type: "publishable" },
  });
  const key = created.api_key;
  if (!key?.id || !key?.token) throw new Error("Medusa did not return the new publishable key.");
  await admin("/admin/api-keys/" + encodeURIComponent(key.id) + "/sales-channels", {
    method: "POST",
    body: { add: [salesChannel.id], remove: [] },
  });
  return { id: key.id, created: true, available: true };
}

async function main() {
  await login();
  const region = await ensureRegion();
  const salesChannel = await ensureSalesChannel();
  let stockLocation = await ensureStockLocation();
  stockLocation = await ensureStockLocationSalesChannel(stockLocation, salesChannel);
  stockLocation = await ensureFulfillmentProvider(stockLocation);
  const fulfillmentSet = await ensureFulfillmentSet(stockLocation);
  const serviceZone = await ensureServiceZone(fulfillmentSet, stockLocation.id);
  // Re-confirm the location/provider link after the service zone exists,
  // immediately before creating the shipping option.
  stockLocation = await ensureFulfillmentProvider(stockLocation);
  const shippingProfile = await ensureShippingProfile();
  const shippingOption = await ensureShippingOption(serviceZone, shippingProfile, region);
  const taxRegion = await ensureTaxRegion();
  const publishable = await ensurePublishableKey(salesChannel);

  console.log("PHENO isolated checkout infrastructure setup completed.");
  console.log("Region: " + label(region));
  console.log("Sales channel: " + label(salesChannel));
  console.log("Stock location: " + label(stockLocation));
  console.log("Fulfillment set: " + label(fulfillmentSet));
  console.log("Service zone: " + label(serviceZone));
  console.log("Shipping profile: " + label(shippingProfile));
  console.log("Shipping option: " + label(shippingOption));
  console.log("Tax region: " + label(taxRegion));
  console.log(
    "Publishable API key: " +
      (publishable.created
        ? "created and associated (raw token withheld)"
        : publishable.available
          ? "validated and associated"
          : "not provisioned"),
  );
  console.log("Catalogue seeding: separate guarded step required.");
}

main().catch((error) => {
  console.error("Isolated checkout setup stopped: " + error.message);
  if (error.path && error.status) console.error("Request diagnostic: " + error.path + " (" + error.status + ")");
  process.exitCode = 1;
});
