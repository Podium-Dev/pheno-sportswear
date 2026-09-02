export type CommerceProvider = "local" | "shopify" | "medusa";

export type ShopifyCommerceConfig = {
  provider: "shopify";
  storeDomain: string;
  storefrontAccessToken: string;
  apiVersion: string;
  countryCode: string;
};

export type MedusaCommerceConfig = {
  provider: "medusa";
  backendUrl: string;
  publishableKey: string;
  regionId?: string;
};

export type CommerceConfig =
  | { provider: "local" }
  | ShopifyCommerceConfig
  | MedusaCommerceConfig;
