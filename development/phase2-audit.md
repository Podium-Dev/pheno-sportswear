# Phase 2 audit, before implementation

## Findings

- The homepage renders, but the Top Picks previous and next controls do not change content or scroll position.
- Homepage product cards link to collection shells rather than product detail pages.
- Search, account, and cart are links to placeholder routes with no working behaviour.
- The desktop Shop item is a direct link with no shop menu or category navigation.
- The mobile disclosure menu opens, but its destinations are the same placeholder routes.
- Our Story, Train With Yousef, Contact, FAQ, Size Guide, Shipping, Returns, Shop, and collection routes all render the old placeholder component.
- The footer contains a hash route for Pursue The Rise and a privacy route that is not part of the requested architecture.
- No product catalogue/data abstraction, variant selection, cart state, wishlist, forms, or API integration layer exists.
- No real 404 or product-not-found state exists.

## Phase 2 acceptance flow

- [x] Home to Shop to Type 1 to Shorts
- [x] Select size and add Shorts to cart
- [x] Add the recommended T-Shirt
- [x] Change quantity, refresh, and confirm persistence
- [x] Remove an item
- [x] Search for Joggers and open the product
- [x] Save Joggers to wishlist
- [x] Visit Our Story, Train With Yousef, Contact, and FAQ
- [x] Validate the contact form and newsletter form without pretending delivery is configured
- [x] Navigate the footer links
- [x] Repeat the core shopping flow on mobile
