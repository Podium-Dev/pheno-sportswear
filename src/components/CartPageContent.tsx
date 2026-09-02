"use client";

import { useCommerce } from "@/components/CommerceProvider";
import { CheckoutButton } from "@/components/CheckoutButton";
import { formatCurrency } from "@/lib/format";

export function CartPageContent() {
  const { cart, cartCount, cartSubtotal, removeFromCart, updateCartLine } = useCommerce();

  if (!cart.length) {
    return (
      <div className="empty-state empty-state--cart-page">
        <p className="eyebrow">YOUR SELECTION</p>
        <h2>Your cart is currently empty.</h2>
        <p>Start with the Type 1 performance range.</p>
        <a className="button button--dark" href="/shop">Continue shopping</a>
      </div>
    );
  }

  return (
    <div className="cart-page__layout">
      <section className="cart-page__items" aria-labelledby="cart-page-items-title">
        <div className="section-heading-row">
          <h2 id="cart-page-items-title">Cart ({cartCount})</h2>
          <a className="text-link" href="/shop">Continue shopping</a>
        </div>
        <ul className="cart-page__lines" role="list">
          {cart.map((line) => (
            <li className="cart-page__line" key={line.id}>
              <img src={line.image} alt="" />
              <div className="cart-page__line-content">
                <a href={`/product/${line.productSlug}`}><h3>{line.name}</h3></a>
                <p>{line.colour} / {line.size}</p>
                <strong>{formatCurrency(line.price, line.currencyCode)}</strong>
                <div className="cart-page__line-actions">
                  <div className="quantity-control" aria-label={`Quantity for ${line.name}`}>
                    <button type="button" aria-label={`Decrease quantity of ${line.name}`} onClick={() => updateCartLine(line.id, line.quantity - 1)}>−</button>
                    <span>{line.quantity}</span>
                    <button type="button" aria-label={`Increase quantity of ${line.name}`} onClick={() => updateCartLine(line.id, line.quantity + 1)}>+</button>
                  </div>
                  <button className="text-button" type="button" onClick={() => removeFromCart(line.id)}>Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="cart-page__summary" id="checkout">
        <p className="eyebrow">ORDER SUMMARY</p>
        <div className="cart-page__summary-row"><span>Subtotal</span><strong>{formatCurrency(cartSubtotal, cart[0]?.currencyCode)}</strong></div>
        <p className="cart-page__delivery">Free UK shipping on orders over £75. European and international rules will be confirmed before launch.</p>
        <CheckoutButton />
        <p className="cart-page__checkout-note">This preview cart is persistent, but payment is not enabled until the selected Shopify or Medusa connection is supplied.</p>
      </aside>
    </div>
  );
}
