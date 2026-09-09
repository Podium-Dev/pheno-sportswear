"use client";

import { useCommerce } from "@/components/CommerceProvider";

export function CheckoutButton() {
  const {
    cartProvider,
    checkoutEnabled,
    checkoutMessage,
    setCheckoutMessage,
  } = useCommerce();

  if (checkoutEnabled && cartProvider === "medusa") {
    return (
      <a className="button button--dark button--wide" href="/checkout">
        Checkout
      </a>
    );
  }

  return (
    <div className="checkout-action">
      <button
        className="button button--dark button--wide"
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
  );
}
