# PHENO Sportswear

Phase 1 homepage rebuild for PHENO Sportswear, based on the supplied desktop reference composition.

## Stack

- Next.js 16
- React 19
- TypeScript
- App Router
- Vanilla CSS with project-level CSS variables for layout, colour, type, and spacing

## Run locally

```bash
npm install
npm run dev
```

The homepage is available at `http://localhost:3000/`.

## Routes

The homepage is implemented at `/`. Phase 1 route shells are available for:

- `/shop`
- `/shop/type-1`
- `/shop/tops`
- `/shop/bottoms`
- `/shop/sets`
- `/our-story`
- `/train-with-yousef`
- `/contact`
- `/help/faq`
- `/help/size-guide`
- `/help/shipping`
- `/help/returns`

## Reference and temporary assets

The supplied design reference is kept at `development/reference/homepage-reference.png` for visual QA. It is intentionally outside `public/`, so it is not served by the production website. Temporary images live in `public/images/` and can be replaced without changing the page structure.
