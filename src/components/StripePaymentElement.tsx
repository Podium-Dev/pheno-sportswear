"use client";

import { useEffect, useRef } from "react";
import {
  loadStripe,
  type Stripe,
  type StripeElements,
  type StripePaymentElement,
} from "@stripe/stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export function StripePaymentElement({
  clientSecret,
  onReady,
  onError,
}: {
  clientSecret: string;
  onReady: (stripe: Stripe, elements: StripeElements) => void;
  onError: (message: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onReadyRef.current = onReady;
    onErrorRef.current = onError;
  }, [onError, onReady]);

  useEffect(() => {
    let cancelled = false;
    let paymentElement: StripePaymentElement | null = null;

    if (!stripePromise || !containerRef.current) {
      onErrorRef.current(
        "Stripe test mode is not configured for this preview. Add the publishable key to the isolated frontend service.",
      );
      return;
    }

    void stripePromise
      .then((stripe) => {
        if (cancelled || !stripe || !containerRef.current) return;

        const elements = stripe.elements({
          clientSecret,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#fb6d07",
              colorText: "#111313",
              colorBackground: "#ffffff",
              borderRadius: "0px",
              fontFamily: "Arial, Helvetica, sans-serif",
            },
          },
        });

        paymentElement = elements.create("payment", { layout: "tabs" });
        paymentElement.on("change", (event) => {
          onErrorRef.current("");
        });
        paymentElement.mount(containerRef.current);
        onReadyRef.current(stripe, elements);
      })
      .catch(() => {
        if (!cancelled) {
          onErrorRef.current("Stripe could not initialise the test payment form.");
        }
      });

    return () => {
      cancelled = true;
      paymentElement?.destroy();
    };
  }, [clientSecret]);

  return <div className="stripe-payment-element" ref={containerRef} />;
}
