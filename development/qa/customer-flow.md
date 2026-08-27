# Phase 2 customer-flow QA

The interaction checks below were executed against the local Next.js server with the in-app browser automation harness at desktop and mobile widths. The route-level checks are repeatable with `npm run test:smoke`.

## Desktop flow

- [x] Home → Shop → Type 1 → Shorts
- [x] Select a size and add Shorts to cart
- [x] Add the recommended T-Shirt from the cart drawer
- [x] Change quantity, reload, and confirm cart persistence
- [x] Remove an item
- [x] Search for Joggers and open the product page
- [x] Save Joggers to favourites and confirm the pressed state
- [x] Open the size guide and close it with the close control
- [x] Select an unavailable Hoodie size and show the back-in-stock state
- [x] Visit the story, coaching, contact, FAQ, shipping, returns, account, privacy, and collection routes
- [x] Submit contact, newsletter, coaching-interest, and back-in-stock forms with valid data and receive the honest not-configured response
- [x] Open the Shop menu and verify every destination is a real route
- [x] Open the sets collection, configure a set, and add both items to cart

## Mobile flow

- [x] Open and close the mobile navigation
- [x] Expand the mobile Shop disclosure and follow Type 1 and Shorts
- [x] Select a size and add Shorts to cart from a 390px viewport
- [x] Open search from the mobile menu and find Hoodie
- [x] Expand an FAQ item
- [x] Confirm no horizontal overflow on the tested mobile pages

## Automated route coverage

`npm run test:smoke` checks the primary public routes, search rendering, real page headings, absence of placeholder copy, and the product not-found response. It accepts `BASE_URL` for Railway or another deployed environment.
