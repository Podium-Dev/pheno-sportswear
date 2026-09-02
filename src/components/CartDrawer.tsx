"use client";

import { useEffect, useMemo, useState } from "react";
import { useCommerce } from "@/components/CommerceProvider";
import { formatCurrency } from "@/lib/format";
import { QuickAddPanel } from "@/components/ProductCard";
import { findCatalogProduct } from "@/lib/commerce/catalog-utils";

export function CartDrawer() {
  const {
    catalogProducts,
    cart,
    cartCount,
    cartOpen,
    cartSubtotal,
    checkoutMessage,
    removeFromCart,
    setCartOpen,
    setCheckoutMessage,
    updateCartLine,
  } = useCommerce();
  const [recommendationOpen, setRecommendationOpen] = useState(false);

  useEffect(() => {
    if (!cartOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCartOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [cartOpen, setCartOpen]);

  const recommendation = useMemo(() => {
    const sourceLine = cart.at(-1);
    const sourceProduct = sourceLine ? findCatalogProduct(catalogProducts, sourceLine.productSlug) : undefined;
    const recommendedSlug = sourceProduct?.completeTheLookSlugs.find(
      (slug) => !cart.some((line) => line.productSlug === slug),
    );
    return recommendedSlug ? findCatalogProduct(catalogProducts, recommendedSlug) : undefined;
  }, [catalogProducts, cart]);

  if (!cartOpen) {
    return null;
  }

  return (
    <div className="overlay-layer" role="presentation">
      <button
        className="overlay-layer__backdrop"
        type="button"
        aria-label="Close cart"
        onClick={() => setCartOpen(false)}
      />
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <header className="cart-drawer__header">
          <div>
            <p className="eyebrow">YOUR SELECTION</p>
            <h2 id="cart-drawer-title">Cart ({cartCount})</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
          >
            ×
          </button>
        </header>

        {cart.length ? (
          <>
            <ul className="cart-lines" role="list">
              {cart.map((line) => (
                <li className="cart-line" key={line.id}>
                  <img src={line.image} alt="" />
                  <div className="cart-line__content">
                    <a href={`/product/${line.productSlug}`} onClick={() => setCartOpen(false)}>
                      <strong>{line.name}</strong>
                    </a>
                    <span className="cart-line__meta">
                      {line.colour} / {line.size}
                    </span>
                    <span className="cart-line__price">{formatCurrency(line.price, line.currencyCode)}</span>
                    <div className="cart-line__actions">
                      <div className="quantity-control" aria-label={`Quantity for ${line.name}`}>
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${line.name}`}
                          onClick={() => updateCartLine(line.id, line.quantity - 1)}
                        >
                          −
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${line.name}`}
                          onClick={() => updateCartLine(line.id, line.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-button"
                        type="button"
                        onClick={() => removeFromCart(line.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {recommendation ? (
              <div className="cart-drawer__recommendation">
                <p className="eyebrow">COMPLETE YOUR KIT</p>
                <div className="cart-drawer__recommendation-row">
                  <a href={`/product/${recommendation.slug}`} onClick={() => setCartOpen(false)}>
                    {recommendation.name}
                  </a>
                  <span>{formatCurrency(recommendation.price, recommendation.currencyCode)}</span>
                </div>
                <button className="quick-add-trigger" type="button" aria-expanded={recommendationOpen} onClick={() => setRecommendationOpen((open) => !open)}>
                  {recommendationOpen ? "Close" : "Quick add"}
                </button>
                {recommendationOpen ? <QuickAddPanel product={recommendation} onAdded={() => setRecommendationOpen(false)} /> : null}
              </div>
            ) : null}

            <div className="cart-drawer__footer">
              <div className="cart-drawer__subtotal">
                <span>Subtotal</span>
                <strong>{formatCurrency(cartSubtotal, cart[0]?.currencyCode)}</strong>
              </div>
              <p className="cart-drawer__shipping">
                Free UK shipping on orders over £75. Delivery rules will be confirmed before launch.
              </p>
              <a className="button button--dark button--wide" href="/cart" onClick={() => setCartOpen(false)}>
                View cart
              </a>
              <button
                className="button button--outline button--wide"
                type="button"
                onClick={() =>
                  setCheckoutMessage(
                    "Online checkout is not connected yet. Configure the Shopify or Medusa cart/checkout adapter before payment can be enabled.",
                  )
                }
              >
                Checkout
              </button>
              {checkoutMessage ? (
                <p className="form-message form-message--error" role="status">
                  {checkoutMessage}
                </p>
              ) : null}
            </div>
          </>
        ) : (
          <div className="empty-state empty-state--cart">
            <p>Your cart is currently empty.</p>
            <a className="button button--dark" href="/shop" onClick={() => setCartOpen(false)}>
              Continue shopping
            </a>
          </div>
        )}
      </aside>
    </div>
  );
}
