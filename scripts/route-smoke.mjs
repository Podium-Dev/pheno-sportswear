const baseUrl = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

const routes = [
  "/",
  "/shop",
  "/shop/type-1",
  "/shop/sets",
  "/product/pheno-type-1-shorts",
  "/our-story",
  "/train-with-yousef",
  "/contact",
  "/help/faq",
  "/help/size-guide",
  "/help/shipping",
  "/help/returns",
  "/search?q=joggers",
  "/cart",
  "/account",
  "/privacy",
];

const failures = [];

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`);
  const body = await response.text();

  if (response.status !== 200) {
    failures.push(`${route} returned ${response.status}`);
    continue;
  }

  const hasHeading = /<h1\b[^>]*>/.test(body) || (route === "/" && body.includes("Pursue the rise"));
  const hasPlaceholderState = />(?:\s*)(?:coming soon|under construction|placeholder)(?:\s*)</i.test(body);

  if (!hasHeading || hasPlaceholderState) {
    failures.push(`${route} did not render a real page heading/content`);
  }
}

const missingProduct = await fetch(`${baseUrl}/product/not-a-real-product`);
const missingProductBody = await missingProduct.text();

const missingProductIsNotFound =
  missingProduct.status === 404 ||
  missingProductBody.includes('NEXT_HTTP_ERROR_FALLBACK;404') ||
  missingProductBody.includes("This piece is not here.");

if (!missingProductIsNotFound || !missingProductBody.includes("This piece is not here.")) {
  failures.push("missing product did not return the PHENO 404 state");
}

const unknownRoute = await fetch(`${baseUrl}/not-a-real-route`);
const unknownRouteBody = await unknownRoute.text();

if (unknownRoute.status !== 404 || !unknownRouteBody.includes("This piece is not here.")) {
  failures.push("unknown route did not return the PHENO 404 state");
}

if (failures.length > 0) {
  console.error("Route smoke test failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Route smoke test passed for ${routes.length + 2} paths at ${baseUrl}`);
}
