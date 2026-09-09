"use client";

import { useEffect, useState } from "react";
import {
  CHECKOUT_ORDER_CONFIRMATION_KEY,
  type CheckoutOrder,
} from "@/lib/commerce/checkout/medusa-client";
import { formatCurrency } from "@/lib/format";

export function OrderConfirmation() {
  const [order, setOrder] = useState<CheckoutOrder | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(CHECKOUT_ORDER_CONFIRMATION_KEY);
      if (stored) setOrder(JSON.parse(stored) as CheckoutOrder);
    } catch {
      setOrder(null);
    } finally {
      setReady(true);
    }
  }, []);

  if (!ready) {
    return <p className="checkout-loading" role="status">Loading confirmation…</p>;
  }

  return (
    <section className="order-confirmation" aria-labelledby="order-confirmation-title">
      <p className="eyebrow">ORDER CONFIRMATION</p>
      <h1 id="order-confirmation-title">Order received.</h1>
      {order ? (
        <>
          <p>
            Your development order has been created in the isolated Medusa preview.
            No payment was collected.
          </p>
          <dl>
            <div><dt>Order reference</dt><dd>{order.displayId || order.id}</dd></div>
            {order.email ? <div><dt>Email</dt><dd>{order.email}</dd></div> : null}
            <div><dt>Total</dt><dd>{formatCurrency(order.total, order.currencyCode)}</dd></div>
          </dl>
        </>
      ) : (
        <p>We could not load the confirmation details in this browser session.</p>
      )}
      <a className="button button--dark" href="/shop">Continue shopping</a>
    </section>
  );
}
