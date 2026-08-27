# PHENO Sportswear

Functional Phase 2 storefront for PHENO Sportswear. The approved Phase 1 homepage composition is preserved, with the catalogue, product, search, cart, forms, and supporting routes now wired into a real frontend experience.

## Stack

- Next.js 16.3.3
- React 19.2.8
- TypeScript
- App Router
- Vanilla CSS with project-level OKLCH variables and BEM-style component classes
- Local browser persistence for cart and favourites until the commerce backend is connected

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

The current catalogue is centralised in `src/data/products.ts`. It models the Type 1 range, grouped colour variants, availability, technical features, recommendations, and deliberate sets. This is the seam for a future Shopify Storefront API adapter.

Cart and favourites use browser `localStorage` with no account required. Checkout is intentionally not faked. Connect Shopify Storefront API credentials and a server-side checkout adapter before enabling payment.

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
