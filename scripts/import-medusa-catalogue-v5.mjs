#!/usr/bin/env node

/*
 * PHENO catalogue importer for Medusa 2.20.1.
 *
 * This is the canonical compatibility revision of the v4 importer. It keeps
 * product options in CREATE payloads, but never sends top-level product
 * `options` in UPDATE payloads. Medusa 2.20.1 explicitly rejects that field
 * for updates because product options are managed through their own API.
 *
 * Default mode is read-only. A real import is gated behind both:
 *   --execute --allow-deferred-inventory
 *
 * Managed inventory uses Medusa's location-level API. Creating a missing
 * location level also creates the inventory-item/location association:
 *   POST /admin/inventory-items/{inventory_item_id}/location-levels
 *   { location_id, stocked_quantity: 0 }
 *
 * Only pheno-type-1-hoodie-black-xs is inventory-managed. The other 41
 * variants have unknown numeric stock and remain unmanaged.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import * as ts from "typescript";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATALOGUE_PATH = path.join(ROOT, "src", "data", "products.ts");
const EXPECTED_PRODUCTS = 7;
const EXPECTED_VARIANTS = 42;
const HOODIE_XS_SKU = "pheno-type-1-hoodie-black-xs";
const REQUEST_TIMEOUT = Number(process.env.IMPORT_TIMEOUT_MS || 30_000);
const args = new Set(process.argv.slice(2));
const execute = args.has("--execute");
const jsonOutput = args.has("--json");
const allowDeferredInventory = args.has("--allow-deferred-inventory");

if (args.has("--help") || args.has("-h")) {
  console.log([
    "PHENO Medusa catalogue importer v5 (2.20.1 product update compatibility)",
    "",
    "Read-only dry run:",
    "  node scripts/import-medusa-catalogue-v5.mjs --dry-run",
    "",
    "Actual import, only after approval:",
    "  node scripts/import-medusa-catalogue-v5.mjs --execute --allow-deferred-inventory",
    "",
    "Required environment variables:",
    "  MEDUSA_BACKEND_URL",
    "  MEDUSA_ADMIN_EMAIL",
    "  MEDUSA_ADMIN_PASSWORD",
    "  MEDUSA_REGION_ID",
    "  MEDUSA_SALES_CHANNEL_ID",
    "  MEDUSA_STOCK_LOCATION_ID",
    "  PHENO_STOREFRONT_URL",
  ].join("\n"));
  process.exit(0);
}

if (!Number.isFinite(REQUEST_TIMEOUT) || REQUEST_TIMEOUT < 1_000) {
  throw new Error("IMPORT_TIMEOUT_MS must be at least 1000 milliseconds.");
}

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error("Missing required environment variable: " + name);
  }
  return value;
}

const config = {
  backendUrl: required("MEDUSA_BACKEND_URL").replace(/\/+$/, ""),
  adminEmail: required("MEDUSA_ADMIN_EMAIL"),
  adminPassword: required("MEDUSA_ADMIN_PASSWORD"),
  regionId: required("MEDUSA_REGION_ID"),
  salesChannelId: required("MEDUSA_SALES_CHANNEL_ID"),
  stockLocationId: required("MEDUSA_STOCK_LOCATION_ID"),
  storefrontUrl: required("PHENO_STOREFRONT_URL").replace(/\/+$/, ""),
};

async function request(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    const bodyText = await response.text();
    let data = {};
    if (bodyText) {
      try {
        data = JSON.parse(bodyText);
      } catch {
        data = { raw: bodyText.slice(0, 400) };
      }
    }
    return { response, data };
  } finally {
    clearTimeout(timer);
  }
}

let token;

async function medusa(pathname, options = {}) {
  const url = new URL(pathname, config.backendUrl + "/");
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");
  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", "Bearer " + token);
  }
  const result = await request(url, {
    method: options.method || "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  if (!result.response.ok) {
    const detail =
      result.data?.message ||
      result.data?.detail ||
      result.data?.error ||
      "HTTP " + result.response.status;
    const error = new Error(
      (options.method || "GET") +
        " " +
        url.pathname +
        url.search +
        " returned " +
        result.response.status +
        ": " +
        detail,
    );
    error.status = result.response.status;
    error.path = url.pathname + url.search;
    throw error;
  }
  return result.data;
}

async function login() {
  const result = await medusa("/auth/user/emailpass", {
    method: "POST",
    body: {
      email: config.adminEmail,
      password: config.adminPassword,
    },
  });
  token = result.token || result.access_token;
  if (!token) {
    throw new Error("Medusa authentication returned no bearer token.");
  }
}

function listKey(pathname) {
  const name = pathname.replace(/\/+$/, "").split("/").pop();
  return {
    products: "products",
    collections: "collections",
    "product-categories": "product_categories",
    regions: "regions",
    "sales-channels": "sales_channels",
    "stock-locations": "stock_locations",
  }[name] || name;
}

async function listAdmin(pathname) {
  const records = [];
  let offset = 0;
  while (true) {
    const query = new URLSearchParams({ limit: "100", offset: String(offset) });
    const data = await medusa(pathname + "?" + query.toString());
    const page = Array.isArray(data[listKey(pathname)])
      ? data[listKey(pathname)]
      : [];
    records.push(...page);
    if (page.length < 100) {
      return records;
    }
    offset += page.length;
  }
}

function loadCatalogue() {
  const source = fs.readFileSync(CATALOGUE_PATH, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: CATALOGUE_PATH,
  }).outputText;
  const exportsObject = {};
  const moduleObject = { exports: exportsObject };
  vm.runInNewContext(
    output,
    { exports: exportsObject, module: moduleObject, console },
    { filename: CATALOGUE_PATH },
  );
  if (!Array.isArray(moduleObject.exports.products)) {
    throw new Error("Catalogue does not export products.");
  }
  return moduleObject.exports;
}

function unique(values) {
  return [...new Set(values)];
}

function duplicates(values) {
  const counts = new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value, count]) => ({ value, count }));
}

function assetsIn(value, result = new Set()) {
  if (typeof value === "string") {
    if (value.startsWith("/images/")) result.add(value);
    return result;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => assetsIn(item, result));
    return result;
  }
  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => assetsIn(item, result));
  }
  return result;
}

function assetUrl(asset) {
  return new URL(asset, config.storefrontUrl + "/").toString();
}

function replaceAssetPaths(value) {
  if (typeof value === "string") {
    return value.startsWith("/images/") ? assetUrl(value) : value;
  }
  if (Array.isArray(value)) return value.map(replaceAssetPaths);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, replaceAssetPaths(item)]),
    );
  }
  return value;
}

function moneyToMinor(price) {
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    throw new Error("Invalid GBP price: " + String(price));
  }
  return Math.round(price * 100);
}

function bundleAliases(catalogue, product) {
  return (Array.isArray(catalogue?.bundles) ? catalogue.bundles : [])
    .filter((bundle) => {
      const slugs = bundle.productSlugs || [];
      if (product.slug === "pheno-type-1-t-shirt-black") {
        return slugs.includes("pheno-type-1-t-shirt");
      }
      return slugs.includes(product.slug);
    })
    .map((bundle) => bundle.slug);
}

function buildRows(catalogue) {
  const errors = [];
  const rows = [];
  const allAssetRefs = new Set();
  const explicitSkuMissing = [];
  const missingPrices = [];
  const unknownInventory = [];
  const unavailable = [];

  for (const product of catalogue.products) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug || "")) {
      errors.push("Invalid handle: " + String(product.slug));
    }
    if (!Array.isArray(product.colours) || product.colours.length !== 1) {
      errors.push(product.slug + " must have one colour in the approved structure");
    }
    if (!Array.isArray(product.sizes) || product.sizes.length !== 6) {
      errors.push(product.slug + " must have six sizes");
    }
    const expected = (product.colours?.length || 0) * (product.sizes?.length || 0);
    if (!Array.isArray(product.variants) || product.variants.length !== expected) {
      errors.push(
        product.slug +
          " has " +
          (product.variants?.length || 0) +
          " variants; expected " +
          expected,
      );
    }

    const productRefs = [...assetsIn(product)];
    productRefs.forEach((ref) => allAssetRefs.add(ref));
    const gallery = unique(
      (product.images || []).filter(
        (image) => typeof image === "string" && image.startsWith("/images/"),
      ),
    );
    const variants = [];

    for (const variant of product.variants || []) {
      if (!("sku" in variant)) explicitSkuMissing.push(variant.id);
      if (!variant.id) errors.push(product.slug + " contains a variant without an ID");
      if (typeof product.price !== "number") missingPrices.push(variant.id);
      if (typeof variant.available !== "boolean") {
        errors.push(product.slug + "/" + variant.id + " has invalid availability");
      }

      const managed = variant.available === false;
      const inventory = managed
        ? {
            action: "SET_EXPLICIT_ZERO",
            quantity: 0,
            manageInventory: true,
            reason: "Approved hoodie black XS unavailable state",
          }
        : {
            action: "MANAGE_INVENTORY_FALSE",
            quantity: null,
            manageInventory: false,
            reason: "Unknown numeric quantity; preserve source availability without inventing stock",
          };
      if (managed) unavailable.push(variant.id);
      else unknownInventory.push(variant.id);

      variants.push({
        id: variant.id,
        sku: variant.id,
        title: variant.colour + " / " + variant.size,
        colour: variant.colour,
        size: variant.size,
        price: product.price,
        priceMinor: moneyToMinor(product.price),
        available: variant.available,
        inventory,
      });
    }

    const variantColours = unique((product.variants || []).map((v) => v.colour));
    const variantSizes = unique((product.variants || []).map((v) => v.size));
    if (
      variantColours.some((value) => !product.colours.includes(value)) ||
      variantSizes.some((value) => !product.sizes.includes(value))
    ) {
      errors.push(product.slug + " has variant values outside product options");
    }

    rows.push({
      sourceId: product.id,
      title: product.name,
      handle: product.slug,
      description: product.description,
      collection: product.collection,
      category: product.category,
      colour: product.colours[0],
      sizes: product.sizes,
      gallery,
      allAssetRefs: productRefs,
      price: product.price,
      variants,
      sourceProduct: product,
    });
  }

  return {
    rows,
    allAssetRefs: [...allAssetRefs],
    explicitSkuMissing,
    missingPrices,
    unknownInventory,
    unavailable,
    duplicateHandles: duplicates(catalogue.products.map((p) => p.slug)),
    duplicateSkus: duplicates(rows.flatMap((row) => row.variants.map((variant) => variant.sku))),
    errors,
  };
}

function rowMetadata(catalogue, row) {
  const product = row.sourceProduct;
  return {
    pheno_source_id: row.sourceId,
    pheno_source_slug: row.handle,
    pheno_collection: row.collection,
    pheno_collection_label: (catalogue?.collectionLabels || {})[row.collection] || row.collection,
    pheno_category: row.category,
    pheno_colour: row.colour,
    pheno_related_product_slugs: product.relatedProductSlugs,
    pheno_complete_the_look_slugs: product.completeTheLookSlugs,
    pheno_bundle_aliases: bundleAliases(catalogue, product),
    pheno_source_available_variant_ids: row.variants.filter((variant) => variant.available).map((variant) => variant.id),
    pheno_source_unavailable_variant_ids: row.variants.filter((variant) => !variant.available).map((variant) => variant.id),
    pheno_inventory_source: "source catalogue provides availability flags, not numeric quantities",
    pheno_asset_urls: row.allAssetRefs.map(assetUrl),
    pheno_features: product.features,
    pheno_performance_features: replaceAssetPaths(product.performanceFeaturesByColour || product.performanceFeatures),
    pheno_engineered_details: replaceAssetPaths(product.engineeredDetailsByColour || product.engineeredDetails || null),
  };
}

// These contracts are copied from the installed Medusa 2.20.1
// @medusajs/medusa/dist/api/admin/products/validators.js. The update schema
// contains an explicit refinement that rejects top-level `options`.
const MEDUSA_PRODUCT_CREATE_FIELDS = new Set([
  "title", "subtitle", "description", "is_giftcard", "discountable", "images",
  "thumbnail", "handle", "status", "external_id", "type_id", "collection_id",
  "categories", "tags", "options", "variants", "sales_channels",
  "shipping_profile_id", "weight", "length", "height", "width", "hs_code",
  "mid_code", "origin_country", "material", "metadata",
]);

const MEDUSA_PRODUCT_UPDATE_FIELDS = new Set([
  "title", "discountable", "is_giftcard", "option_ids", "variants", "status",
  "subtitle", "description", "images", "thumbnail", "handle", "type_id",
  "external_id", "collection_id", "categories", "tags", "sales_channels",
  "shipping_profile_id", "weight", "length", "height", "width", "hs_code",
  "mid_code", "origin_country", "material", "metadata",
]);

const MEDUSA_PRODUCT_VARIANT_FIELDS = new Set([
  "id", "title", "prices", "sku", "ean", "upc", "barcode", "hs_code", "mid_code",
  "thumbnail", "allow_backorder", "manage_inventory", "variant_rank", "weight",
  "length", "height", "width", "origin_country", "material", "metadata", "options",
]);

function validateProductPayload(payload, kind) {
  const allowed = kind === "create" ? MEDUSA_PRODUCT_CREATE_FIELDS : MEDUSA_PRODUCT_UPDATE_FIELDS;
  const invalid = Object.keys(payload).filter((field) => !allowed.has(field));
  if (invalid.length) {
    throw new Error("Medusa 2.20.1 product " + kind + " payload contains invalid fields: " + invalid.join(", "));
  }
  if (kind === "update" && Object.prototype.hasOwnProperty.call(payload, "options")) {
    throw new Error("Medusa 2.20.1 product UPDATE payload must not contain top-level options.");
  }
  for (const variant of payload.variants || []) {
    const invalidVariantFields = Object.keys(variant).filter((field) => !MEDUSA_PRODUCT_VARIANT_FIELDS.has(field));
    if (invalidVariantFields.length) {
      throw new Error(
        "Medusa 2.20.1 product " + kind + " variant payload contains invalid fields: " + invalidVariantFields.join(", "),
      );
    }
  }
  return payload;
}

function productPayload(catalogue, row) {
  const payload = {
    title: row.title,
    handle: row.handle,
    description: row.description,
    status: "published",
    external_id: row.sourceId,
    images: row.gallery.map((image) => ({ url: assetUrl(image) })),
    thumbnail: row.gallery[0] ? assetUrl(row.gallery[0]) : null,
    options: [
      { title: "Colour", values: [row.colour], is_exclusive: true },
      { title: "Size", values: row.sizes, is_exclusive: true },
    ],
    variants: row.variants.map((variant, rank) => ({
      title: variant.title,
      sku: variant.sku,
      options: { Colour: variant.colour, Size: variant.size },
      manage_inventory: variant.inventory.manageInventory,
      allow_backorder: false,
      variant_rank: rank,
      prices: [{ amount: variant.priceMinor, currency_code: "gbp" }],
      metadata: {
        pheno_source_variant_id: variant.id,
        pheno_source_available: variant.available,
        pheno_inventory_policy: variant.inventory.action,
      },
    })),
    sales_channels: [{ id: config.salesChannelId }],
    metadata: rowMetadata(catalogue, row),
  };
  return validateProductPayload(payload, "create");
}

function createPayload(action, collection, category) {
  return validateProductPayload(
    {
      ...action.payload,
      collection_id: collection?.id,
      categories: category?.id ? [{ id: category.id }] : undefined,
    },
    "create",
  );
}

function relationPlan(rows, catalogue, collections, categories) {
  const collectionHandle = rows[0]?.collection || "type-1";
  const collectionMatches = collections.filter((item) => item.handle === collectionHandle);
  const categoryPlans = unique(rows.map((row) => row.category)).map((category) => {
    const handle = "pheno-" + category;
    const matches = categories.filter((item) => item.handle === handle);
    return {
      sourceCategory: category,
      handle,
      name: catalogue.collectionLabels?.[category] || category,
      matches,
      action: matches.length ? "USE_EXISTING" : "CREATE_IF_EXECUTED",
    };
  });
  return {
    collection: {
      handle: collectionHandle,
      name: catalogue.collectionLabels?.[collectionHandle] || collectionHandle,
      matches: collectionMatches,
      action: collectionMatches.length ? "USE_EXISTING" : "CREATE_IF_EXECUTED",
    },
    categories: categoryPlans,
  };
}

function buildActions(rows, remoteProducts) {
  const byHandle = new Map();
  for (const product of remoteProducts) {
    if (!byHandle.has(product.handle)) byHandle.set(product.handle, []);
    byHandle.get(product.handle).push(product);
  }
  return rows.map((row) => {
    const matches = byHandle.get(row.handle) || [];
    if (matches.length > 1) throw new Error("Duplicate remote product handles: " + row.handle);
    const existingProduct = matches.length === 1 ? matches[0] : null;
    const existingVariants = Array.isArray(existingProduct?.variants) ? existingProduct.variants : [];
    const variantActions = row.variants.map((variant) => {
      const matchesForSku = existingVariants.filter((candidate) => candidate.sku === variant.sku);
      if (matchesForSku.length > 1) throw new Error("Duplicate remote SKU: " + variant.sku);
      return {
        ...variant,
        action: existingProduct && matchesForSku.length === 1 ? "UPDATE" : "CREATE",
        existingVariantId: matchesForSku.length === 1 ? matchesForSku[0].id : null,
        existingVariant: matchesForSku.length === 1 ? matchesForSku[0] : null,
      };
    });
    const unmanaged = existingVariants
      .filter((variant) => !row.variants.some((desired) => desired.sku === variant.sku))
      .map((variant) => ({ id: variant.id, sku: variant.sku || null }));
    return {
      row,
      payload: row.payload,
      action: existingProduct ? "UPDATE" : "CREATE",
      existingProduct,
      existingProductId: existingProduct?.id || null,
      variantActions,
      unmanaged,
    };
  });
}

function updatePayload(catalogue, action, collection, category) {
  const existing = action.existingProduct || {};
  const existingMetadata = existing.metadata && typeof existing.metadata === "object" ? existing.metadata : {};
  const desiredPayload = productPayload(catalogue, action.row);
  // `options` is deliberately removed only from this UPDATE payload. Nested
  // variant `options` remains valid and is required to keep variant values.
  const { options: _createOnlyProductOptions, ...updateablePayload } = desiredPayload;
  const variants = desiredPayload.variants.map((desired) => {
    const current = (existing.variants || []).find((variant) => variant.sku === desired.sku);
    return current ? { ...desired, id: current.id } : desired;
  });
  return validateProductPayload(
    {
      ...updateablePayload,
      collection_id: collection?.id,
      categories: category?.id ? [{ id: category.id }] : undefined,
      variants,
      metadata: { ...existingMetadata, ...desiredPayload.metadata },
    },
    "update",
  );
}

function resolveInventoryItemId(variant) {
  const links = Array.isArray(variant?.inventory_items) ? variant.inventory_items : [];
  const link = links[0];
  return link?.inventory_item_id || link?.inventory?.id || (link?.id && String(link.id).startsWith("iitem_") ? link.id : null);
}

function extractLocationLevels(data) {
  if (Array.isArray(data?.inventory_levels)) return data.inventory_levels;
  if (Array.isArray(data?.location_levels)) return data.location_levels;
  if (Array.isArray(data?.inventory_item?.location_levels)) return data.inventory_item.location_levels;
  if (Array.isArray(data?.inventoryItem?.location_levels)) return data.inventoryItem.location_levels;
  return [];
}

async function listLocationLevels(inventoryItemId) {
  const data = await medusa(
    "/admin/inventory-items/" + encodeURIComponent(inventoryItemId) + "/location-levels?limit=100&offset=0",
  );
  return extractLocationLevels(data);
}

async function planInventoryOperations(actions) {
  const operations = [];
  for (const action of actions) {
    for (const variant of action.variantActions) {
      if (!variant.inventory.manageInventory) continue;
      if (!action.existingProductId) {
        operations.push({
          action: "CREATE_LOCATION_LEVEL_AFTER_VARIANT",
          sku: variant.sku,
          productHandle: action.row.handle,
          inventoryItemId: null,
          level: null,
          quantity: 0,
          reason: "Inventory item will be resolved after product creation",
        });
        continue;
      }
      const inventoryItemId = resolveInventoryItemId(variant.existingVariant);
      if (!inventoryItemId) {
        operations.push({
          action: "UNRESOLVED_INVENTORY_ITEM",
          sku: variant.sku,
          productHandle: action.row.handle,
          inventoryItemId: null,
          level: null,
          quantity: 0,
          reason: "Existing managed variant has no resolvable inventory item",
        });
        continue;
      }
      const levels = await listLocationLevels(inventoryItemId);
      const level = levels.find((item) => item.location_id === config.stockLocationId) || null;
      operations.push({
        action: level ? "UPDATE_LOCATION_LEVEL" : "CREATE_LOCATION_LEVEL",
        sku: variant.sku,
        productHandle: action.row.handle,
        inventoryItemId,
        level,
        quantity: 0,
        locationId: config.stockLocationId,
        reason: level
          ? "Existing PHENO Main Warehouse level will be set to zero"
          : "Create-level endpoint will associate the item with PHENO Main Warehouse and set zero",
      });
    }
  }
  return operations;
}

async function checkAssets(assetRefs) {
  const localMissing = [];
  for (const ref of assetRefs) {
    const local = path.join(ROOT, "public", ref.replace(/^\/+/, ""));
    if (!fs.existsSync(local) || !fs.statSync(local).isFile() || fs.statSync(local).size === 0) localMissing.push(ref);
  }
  if (localMissing.length) return { localMissing, publicFailures: [] };
  const publicFailures = [];
  let cursor = 0;
  async function worker() {
    while (true) {
      const index = cursor++;
      if (index >= assetRefs.length) return;
      const ref = assetRefs[index];
      try {
        const result = await request(assetUrl(ref), { method: "HEAD" });
        if (!result.response.ok) publicFailures.push({ asset: ref, status: result.response.status });
      } catch (error) {
        publicFailures.push({ asset: ref, status: error.name === "AbortError" ? "timeout" : "request_failed" });
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(8, Math.max(1, assetRefs.length)) }, () => worker()));
  return { localMissing, publicFailures };
}

function resourceLabel(resource) {
  return resource
    ? (resource.name || resource.title || resource.value || resource.id) + " (" + resource.id + ")"
    : "NOT FOUND";
}

function payloadContractReport(actions, productPlans, relation) {
  const firstCategory = relation.categories[0]?.matches?.[0] || null;
  const firstCreate = productPlans[0]
    ? createPayload(
        actions.find((action) => action.row.handle === productPlans[0].handle) || {
          payload: productPlans[0].payload,
        },
        relation.collection.matches[0],
        firstCategory,
      )
    : {};
  const updateAction = actions.find((action) => action.action === "UPDATE");
  const firstUpdate = updateAction
    ? updatePayload(
        null,
        updateAction,
        relation.collection.matches[0],
        relation.categories.find((item) => item.sourceCategory === updateAction.row.category)?.matches?.[0],
      )
    : {};
  return {
    medusaVersion: "2.20.1",
    productCreateFields: Object.keys(firstCreate),
    productUpdateFields: Object.keys(firstUpdate),
    createIncludesTopLevelOptions: Object.prototype.hasOwnProperty.call(firstCreate, "options"),
    updateIncludesTopLevelOptions: Object.prototype.hasOwnProperty.call(firstUpdate, "options"),
    rejectedProductUpdateFields: ["options"],
    nestedVariantFields: Object.keys(firstUpdate.variants?.[0] || firstCreate.variants?.[0] || {}),
  };
}

function printReport(report, assetChecks) {
  const source = report.source;
  console.log("PHENO Medusa catalogue import " + (execute ? "EXECUTION PLAN" : "DRY RUN"));
  console.log("Backend: " + config.backendUrl);
  console.log("Storefront assets: " + config.storefrontUrl);
  console.log("Admin authentication: OK");
  console.log("Region: " + resourceLabel(report.region));
  console.log("Sales channel: " + resourceLabel(report.salesChannel));
  console.log("Stock location: " + resourceLabel(report.stockLocation));
  console.log("");

  console.log("Medusa 2.20.1 product payload contract");
  console.log("- Product CREATE fields: " + report.payloadContracts.productCreateFields.join(", "));
  console.log("- Product UPDATE fields: " + report.payloadContracts.productUpdateFields.join(", "));
  console.log("- CREATE includes top-level options: " + (report.payloadContracts.createIncludesTopLevelOptions ? "YES" : "NO"));
  console.log("- UPDATE includes top-level options: " + (report.payloadContracts.updateIncludesTopLevelOptions ? "YES" : "NO"));
  console.log("- Rejected/removed update field excluded: options");
  console.log("- Nested variant fields retained: " + report.payloadContracts.nestedVariantFields.join(", "));
  console.log("- Other invalid product update fields found in importer: none");
  console.log("");

  console.log("Partial Medusa state");
  console.log("- Existing Medusa products: " + report.remoteProducts + " (current partial state expected 1)");
  console.log("- Existing hoodie variants: " + report.partial.hoodieVariants + " (current partial state expected 6)");
  console.log("- Existing partial handles/SKUs match approved plan: " + (report.partial.matchesApprovedPlan ? "YES" : "NO"));
  console.log("- Existing complete catalogue matches approved plan: " + (report.complete.matchesApprovedPlan ? "YES" : "NO"));
  console.log("- Existing duplicate handles/SKUs: " + (report.remoteDuplicateHandles.length || report.remoteDuplicateSkus.length ? "FOUND" : "none"));
  console.log("");

  console.log("Inventory-location workflow");
  console.log("- Resolve variant, then inventory item, then location level: YES");
  console.log("- Missing association + initial level: POST /admin/inventory-items/{inventory_item_id}/location-levels");
  console.log("- Missing association body: { location_id: PHENO Main Warehouse, stocked_quantity: 0 }");
  console.log("- Existing level update: POST /admin/inventory-items/{inventory_item_id}/location-levels/{location_id}");
  console.log("- Existing level update body: { stocked_quantity: 0 }");
  console.log("- manage_inventory=false variants: " + source.unknownInventory + " (expected 41)");
  console.log("- manage_inventory=true variants: " + source.managedInventory + " (expected 1)");
  console.log("- Planned location association creates: " + report.inventoryOperations.filter((item) => item.action === "CREATE_LOCATION_LEVEL" || item.action === "CREATE_LOCATION_LEVEL_AFTER_VARIANT").length);
  console.log("- Planned existing location-level updates: " + report.inventoryOperations.filter((item) => item.action === "UPDATE_LOCATION_LEVEL").length);
  console.log("- Planned unresolved inventory items: " + report.inventoryOperations.filter((item) => item.action === "UNRESOLVED_INVENTORY_ITEM").length);
  console.log("- Hoodie Black XS planned quantity: " + (report.inventoryOperations.find((item) => item.sku === HOODIE_XS_SKU)?.quantity ?? 0));
  console.log("- No inferred positive quantities: YES");
  console.log("");

  console.log("Catalogue validation");
  console.log("- Products: " + source.products + " (expected " + EXPECTED_PRODUCTS + ")");
  console.log("- Variants: " + source.variants + " (expected " + EXPECTED_VARIANTS + ")");
  console.log("- Handles: " + source.handles.join(", "));
  console.log("- Stable SKUs: " + source.skus.join(", "));
  console.log("- Missing source SKU fields: " + source.missingSourceSkus);
  console.log("- Missing stable import SKUs: " + source.missingStableSkus);
  console.log("- Missing effective GBP prices: " + source.missingPrices);
  console.log("- Explicit unavailable variant: " + (source.unavailable.join(", ") || "none"));
  console.log("- Duplicate handles: " + (report.duplicateHandles.length ? JSON.stringify(report.duplicateHandles) : "none"));
  console.log("- Duplicate SKUs: " + (report.duplicateSkus.length ? JSON.stringify(report.duplicateSkus) : "none"));
  console.log("- Local assets: " + (assetChecks.localMissing.length ? assetChecks.localMissing.length + " missing of " + source.assets : source.assets + "/" + source.assets + " present"));
  console.log("- Public image URLs: " + (assetChecks.publicFailures.length ? assetChecks.publicFailures.length + " failed of " + source.assets : source.assets + "/" + source.assets + " returned 2xx"));
  console.log("");

  console.log("Relation plan");
  console.log("- Collection " + report.relationPlan.collection.name + ": " + report.relationPlan.collection.action);
  report.relationPlan.categories.forEach((category) => console.log("- Category " + category.name + " [" + category.handle + "]: " + category.action));
  console.log("- Sales channel association: " + report.salesChannel.id + " for each product");
  console.log("");

  console.log("Planned inventory operations");
  report.inventoryOperations.forEach((operation) => {
    console.log(
      "- " + operation.action +
        " — " + operation.sku +
        " — location " + config.stockLocationId +
        " — quantity 0" +
        (operation.inventoryItemId ? " — inventory item " + operation.inventoryItemId : ""),
    );
  });
  console.log("");

  console.log("Exact product / variant create-update plan");
  report.actions.forEach((action) => {
    console.log(action.action + " product " + action.row.handle + " — " + action.row.title + " — " + action.row.gallery.length + " gallery images — " + action.variantActions.length + " variants");
    action.variantActions.forEach((variant) => {
      const inventory = variant.inventory.manageInventory
        ? "manage_inventory=true; location workflow sets level 0"
        : "manage_inventory=false; no inventory level";
      console.log("  " + variant.action + " " + variant.sku + " — " + variant.title + " — £" + variant.price.toFixed(2) + " GBP — " + inventory);
    });
    if (action.unmanaged.length) console.log("  WARNING existing remote variants not in source plan and not deleted: " + JSON.stringify(action.unmanaged));
  });
  console.log("");

  console.log("Totals");
  console.log("- Product creates: " + report.actions.filter((item) => item.action === "CREATE").length);
  console.log("- Product updates: " + report.actions.filter((item) => item.action === "UPDATE").length);
  console.log("- Variant creates: " + report.actions.flatMap((item) => item.variantActions).filter((item) => item.action === "CREATE").length);
  console.log("- Variant updates: " + report.actions.flatMap((item) => item.variantActions).filter((item) => item.action === "UPDATE").length);
  console.log("- Gallery image assignments: " + report.galleryImages);
  console.log("- Existing Medusa products: " + report.remoteProducts);
  console.log("- Medusa duplicate handles: " + (report.remoteDuplicateHandles.length ? JSON.stringify(report.remoteDuplicateHandles) : "none"));
  console.log("- Medusa duplicate SKUs: " + (report.remoteDuplicateSkus.length ? JSON.stringify(report.remoteDuplicateSkus) : "none"));
  console.log("");
  console.log(execute ? "Execution was explicitly requested; no writes occur before this report passes validation." : "No catalogue, product, variant, inventory, collection, or category writes were performed. Re-run with --execute only after approval.");
  if (jsonOutput) console.log(JSON.stringify({ report, assetChecks }, null, 2));
}

function assertClean(report, assetChecks) {
  const problems = [];
  if (report.source.products !== EXPECTED_PRODUCTS) problems.push("product count");
  if (report.source.variants !== EXPECTED_VARIANTS) problems.push("variant count");
  if (report.source.managedInventory !== 1) problems.push("managed inventory count");
  if (report.source.unknownInventory !== 41) problems.push("unmanaged unknown inventory count");
  if (report.source.explicitZeroInventory !== 1) problems.push("explicit zero inventory count");
  if (report.source.missingStableSkus !== 0) problems.push("stable SKU count");
  if (report.source.missingPrices !== 0) problems.push("price count");
  if (report.duplicateHandles.length || report.duplicateSkus.length || report.remoteDuplicateHandles.length || report.remoteDuplicateSkus.length) problems.push("duplicate handles or SKUs");
  if (report.source.errors.length) problems.push(...report.source.errors);
  if (report.remoteProducts !== 0 && !report.partial.matchesApprovedPlan && !report.complete.matchesApprovedPlan) problems.push("Medusa state does not match partial or complete approved plan");
  if (report.inventoryOperations.length !== 1 || report.inventoryOperations[0].sku !== HOODIE_XS_SKU || report.inventoryOperations[0].action === "UNRESOLVED_INVENTORY_ITEM") problems.push("managed inventory location workflow");
  if (assetChecks.localMissing.length || assetChecks.publicFailures.length) problems.push("image asset verification");
  if (report.payloadContracts.createIncludesTopLevelOptions !== true) problems.push("product CREATE options contract");
  if (report.payloadContracts.updateIncludesTopLevelOptions !== false) problems.push("product UPDATE options contract");
  if (problems.length) throw new Error("Dry-run validation is not clean: " + problems.join("; "));
}

async function ensureCollection(relation) {
  if (relation.matches.length === 1) return relation.matches[0];
  if (relation.matches.length > 1) throw new Error("Duplicate collection handle: " + relation.handle);
  const result = await medusa("/admin/collections", {
    method: "POST",
    body: { title: relation.name, handle: relation.handle, metadata: { pheno_source_collection: relation.handle } },
  });
  return result.collection;
}

async function ensureCategory(relation) {
  if (relation.matches.length === 1) return relation.matches[0];
  if (relation.matches.length > 1) throw new Error("Duplicate category handle: " + relation.handle);
  const result = await medusa("/admin/product-categories", {
    method: "POST",
    body: { name: relation.name, handle: relation.handle, is_active: true, metadata: { pheno_source_category: relation.sourceCategory } },
  });
  return result.product_category;
}

async function setManagedInventoryLevel(productId, sku) {
  const data = await medusa("/admin/products/" + encodeURIComponent(productId) + "?fields=*variants,*variants.inventory_items");
  const variant = data.product?.variants?.find((item) => item.sku === sku);
  if (!variant) throw new Error("Managed variant not found after product write: " + sku);
  const inventoryItemId = resolveInventoryItemId(variant);
  if (!inventoryItemId) throw new Error("No inventory item found after product write: " + sku);
  const levels = await listLocationLevels(inventoryItemId);
  const existingLevel = levels.find((item) => item.location_id === config.stockLocationId) || null;
  if (existingLevel) {
    await medusa("/admin/inventory-items/" + encodeURIComponent(inventoryItemId) + "/location-levels/" + encodeURIComponent(config.stockLocationId), {
      method: "POST",
      body: { stocked_quantity: 0 },
    });
    return "UPDATE_LOCATION_LEVEL";
  }
  await medusa("/admin/inventory-items/" + encodeURIComponent(inventoryItemId) + "/location-levels", {
    method: "POST",
    body: { location_id: config.stockLocationId, stocked_quantity: 0 },
  });
  return "CREATE_LOCATION_LEVEL";
}

async function executeImport(report, catalogue) {
  if (!allowDeferredInventory) {
    throw new Error("Execution is blocked until --allow-deferred-inventory acknowledges the 41 manage_inventory=false variants.");
  }
  const collection = await ensureCollection(report.relationPlan.collection);
  const categoryMap = new Map();
  for (const category of report.relationPlan.categories) categoryMap.set(category.sourceCategory, await ensureCategory(category));

  for (const action of report.actions) {
    const category = categoryMap.get(action.row.category);
    let productId = action.existingProductId;
    if (action.action === "CREATE") {
      const result = await medusa("/admin/products", { method: "POST", body: createPayload(action, collection, category) });
      productId = result.product?.id;
    } else {
      const result = await medusa("/admin/products/" + encodeURIComponent(productId), {
        method: "POST",
        body: updatePayload(catalogue, action, collection, category),
      });
      productId = result.product?.id || productId;
    }
    if (!productId) throw new Error("No Medusa product ID returned for " + action.row.handle);
    for (const variant of action.variantActions) {
      if (variant.inventory.manageInventory) await setManagedInventoryLevel(productId, variant.sku);
    }
  }
}

async function main() {
  const catalogue = loadCatalogue();
  const shape = buildRows(catalogue);
  const productPlans = shape.rows.map((row) => ({ ...row, payload: productPayload(catalogue, row) }));

  await login();
  const [regions, salesChannels, stockLocations, collections, categories, remoteProducts] = await Promise.all([
    listAdmin("/admin/regions"),
    listAdmin("/admin/sales-channels"),
    listAdmin("/admin/stock-locations"),
    listAdmin("/admin/collections"),
    listAdmin("/admin/product-categories"),
    listAdmin("/admin/products"),
  ]);
  const region = regions.find((item) => item.id === config.regionId);
  const salesChannel = salesChannels.find((item) => item.id === config.salesChannelId);
  const stockLocation = stockLocations.find((item) => item.id === config.stockLocationId);
  if (!region || !salesChannel || !stockLocation) throw new Error("One or more configured Medusa IDs could not be found.");

  const remoteDetails = [];
  for (const product of remoteProducts) {
    const detail = await medusa("/admin/products/" + encodeURIComponent(product.id) + "?fields=*variants,*variants.inventory_items,*options,*images,*sales_channels,*categories");
    remoteDetails.push(detail.product || product);
  }

  const relation = relationPlan(shape.rows, catalogue, collections, categories);
  const actions = buildActions(productPlans, remoteDetails);
  const remoteDuplicateHandles = duplicates(remoteDetails.map((product) => product.handle));
  const remoteDuplicateSkus = duplicates(remoteDetails.flatMap((product) => (product.variants || []).map((variant) => variant.sku)));
  const inventoryOperations = await planInventoryOperations(actions);
  const hoodieAction = actions.find((action) => action.row.handle === "pheno-type-1-hoodie");
  const hoodieVariants = hoodieAction?.existingProduct?.variants || [];
  const approvedHoodieSkus = new Set([
    "pheno-type-1-hoodie-black-xs", "pheno-type-1-hoodie-black-s", "pheno-type-1-hoodie-black-m",
    "pheno-type-1-hoodie-black-l", "pheno-type-1-hoodie-black-xl", "pheno-type-1-hoodie-black-2xl",
  ]);
  const partialMatchesApprovedPlan =
    remoteDetails.length === 1 &&
    Boolean(hoodieAction?.existingProduct) &&
    hoodieVariants.length === 6 &&
    hoodieVariants.every((variant) => approvedHoodieSkus.has(variant.sku)) &&
    remoteDuplicateHandles.length === 0 &&
    remoteDuplicateSkus.length === 0;
  const expectedHandles = new Set(shape.rows.map((row) => row.handle));
  const completeMatchesApprovedPlan =
    remoteDetails.length === EXPECTED_PRODUCTS &&
    remoteDetails.every((product) => {
      const desired = shape.rows.find((row) => row.handle === product.handle);
      const variants = Array.isArray(product.variants) ? product.variants : [];
      const desiredSkus = new Set(desired?.variants.map((variant) => variant.sku) || []);
      return Boolean(desired) && variants.length === desired.variants.length && variants.every((variant) => desiredSkus.has(variant.sku));
    }) &&
    new Set(remoteDetails.map((product) => product.handle)).size === expectedHandles.size &&
    [...expectedHandles].every((handle) => remoteDetails.some((product) => product.handle === handle)) &&
    remoteDuplicateHandles.length === 0 &&
    remoteDuplicateSkus.length === 0;

  const report = {
    source: {
      products: shape.rows.length,
      variants: shape.rows.reduce((sum, row) => sum + row.variants.length, 0),
      handles: shape.rows.map((row) => row.handle),
      skus: shape.rows.flatMap((row) => row.variants.map((variant) => variant.sku)),
      missingSourceSkus: shape.explicitSkuMissing.length,
      missingStableSkus: shape.rows.flatMap((row) => row.variants).filter((variant) => !variant.sku).length,
      missingPrices: shape.missingPrices.length,
      unknownInventory: shape.unknownInventory.length,
      managedInventory: shape.unavailable.length,
      explicitZeroInventory: shape.unavailable.filter((id) => id === HOODIE_XS_SKU).length,
      unavailable: shape.unavailable,
      assets: shape.allAssetRefs.length,
      errors: shape.errors,
    },
    partial: { hoodieVariants: hoodieVariants.length, matchesApprovedPlan: Boolean(partialMatchesApprovedPlan) },
    complete: { matchesApprovedPlan: Boolean(completeMatchesApprovedPlan) },
    actions,
    relationPlan: relation,
    inventoryOperations,
    payloadContracts: payloadContractReport(actions, productPlans, relation),
    region,
    salesChannel,
    stockLocation,
    duplicateHandles: shape.duplicateHandles,
    duplicateSkus: shape.duplicateSkus,
    remoteDuplicateHandles,
    remoteDuplicateSkus,
    remoteProducts: remoteDetails.length,
    galleryImages: productPlans.reduce((sum, product) => sum + product.gallery.length, 0),
  };
  const assetChecks = await checkAssets(shape.allAssetRefs);
  printReport(report, assetChecks);
  assertClean(report, assetChecks);
  if (execute) {
    await executeImport(report, catalogue);
    console.log("Execution completed.");
  }
}

main().catch((error) => {
  console.error("Importer stopped: " + error.message);
  if (error.path && error.status) console.error("Request diagnostic: " + error.path + " (" + error.status + ")");
  process.exitCode = 1;
});
