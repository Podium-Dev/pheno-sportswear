import type { CommerceConfig, CommerceProvider } from "@/lib/commerce/types";

const supportedProviders: CommerceProvider[] = ["local", "shopify", "medusa"];

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required commerce environment variable: ${name}`);
  }
  return value;
}

function withoutTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getCommerceConfig(): CommerceConfig {
  const configuredProvider = (process.env.COMMERCE_PROVIDER?.trim().toLowerCase() || "local") as CommerceProvider;

  if (!supportedProviders.includes(configuredProvider)) {
    throw new Error(
      `Unsupported COMMERCE_PROVIDER "${configuredProvider}". Use local, shopify, or medusa.`,
    );
  }

  if (configuredProvider === "local") {
    return { provider: "local" };
  }

  if (configuredProvider === "shopify") {
    const rawDomain = requiredEnv("SHOPIFY_STORE_DOMAIN");
    const storeDomain = withoutTrailingSlash(
      rawDomain.startsWith("http://") || rawDomain.startsWith("https://")
        ? rawDomain
        : `https://${rawDomain}`,
    );

    return {
      provider: "shopify",
      storeDomain,
      storefrontAccessToken: requiredEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN"),
      apiVersion: process.env.SHOPIFY_STOREFRONT_API_VERSION?.trim() || "2026-07",
      countryCode: process.env.SHOPIFY_STOREFRONT_COUNTRY?.trim().toUpperCase() || "GB",
    };
  }

  return {
    provider: "medusa",
    backendUrl: withoutTrailingSlash(requiredEnv("MEDUSA_BACKEND_URL")),
    publishableKey: requiredEnv("MEDUSA_PUBLISHABLE_KEY"),
    regionId: process.env.MEDUSA_REGION_ID?.trim() || undefined,
  };
}
