# PHENO Sportswear

Functional Phase 2 storefront for PHENO Sportswear. The approved Phase 1 homepage composition is preserved, with the catalogue, product, search, cart, forms, and supporting routes now wired into a real frontend experience.

## Stack

- Next.js 16.3.3
- React 19.2.8
- TypeScript
- App Router
- Vanilla CSS with project-level OKLCH variables and BEM-style component classes
- Headless commerce boundary with a local default and Shopify Storefront API / Medusa Store API adapters

## Run locally

```bash
npm install
npm run dev
```

The site is available at `http://localhost:3000/`.

Useful checks:

```bash
npm run typecheck
npm run build
npm run test:smoke
```

## Routes

- `/`
- `/shop`
- `/shop/type-1`
- `/shop/tops`
- `/shop/bottoms`
- `/shop/sets`
- `/shop/t-shirts`
- `/shop/tanks`
- `/shop/hoodies`
- `/shop/shorts`
- `/shop/joggers`
- `/product/[slug]`
- `/our-story`
- `/train-with-yousef`
- `/contact`
- `/help/faq`
- `/help/size-guide`
- `/help/shipping`
- `/help/returns`
- `/search`
- `/cart`
- `/account`
- `/privacy`

## Data and integrations

The storefront reads its catalogue through `src/lib/commerce/catalog.ts`. Set `COMMERCE_PROVIDER` to `shopify` or `medusa` to use the corresponding server-side adapter; leave it as `local` to use the editorial catalogue in `src/data/products.ts`. Remote commerce data supplies product identity, prices, images, variants, and availability, while the local catalogue supplies PHENO-specific editorial content where a matching handle exists.

Shopify uses the Storefront GraphQL API and Medusa uses the v2 `/store/products` API. Both adapters normalize their response to the product shape already consumed by the UI, so product data is not hardcoded into the page components. Copy `.env.example` to a local env file or add the same variables to Railway. Keep all commerce credentials server-only; only the normalized product data crosses into interactive client components.

Cart and favourites still use browser `localStorage` with no account required. Cart lines retain the commerce product and variant identifiers so a server-side cart/checkout adapter can be added without changing product cards or product detail UI. Checkout is intentionally not faked; connect the selected Shopify or Medusa cart/checkout flow before enabling payment.

Contact, newsletter, coaching-interest, and back-in-stock forms post to their own route handlers. They return a clear not-configured state until these server-only Railway variables are supplied:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL` (optional, defaults to `info@phenosportswear.com`)
- `NEWSLETTER_TO_EMAIL` (optional)

No credentials are committed to the repository or exposed to the browser.

Shipping copy is centralised in `src/data/site.ts`, including the still-to-be-confirmed European and international rules.

## Reference and temporary assets

The supplied design reference is kept at `development/reference/homepage-reference.png` for visual QA. It is intentionally outside `public/`, so it is not served by the production website. Temporary and current PHENO product images live in `public/images/` and can be replaced without changing the page structure.

The pre-implementation interaction audit is recorded at `development/phase2-audit.md`.
