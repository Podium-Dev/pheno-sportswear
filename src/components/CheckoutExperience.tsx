"use client";

import { useCallback, useEffect, useRef, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { useCommerce } from "@/components/CommerceProvider";
import { type Stripe, type StripeElements } from "@stripe/stripe-js";
import { formatCurrency } from "@/lib/format";
import {
  addCheckoutShippingMethod,
  CHECKOUT_ORDER_CONFIRMATION_KEY,
  clearMedusaCartId,
  updateCheckoutDetails,
  completeCheckout,
  initializeCheckoutPayment,
  listCheckoutPaymentProviders,
  listCheckoutShippingOptions,
  readMedusaCartId,
  retrieveCheckoutCart,
  type CheckoutAddress,
  type CheckoutCart,
  type CheckoutPaymentProvider,
  type CheckoutShippingOption,
  type CheckoutRequestError,
} from "@/lib/commerce/checkout/medusa-client";
import { checkoutDevelopment } from "@/lib/checkout/development";
import { StripePaymentElement } from "@/components/StripePaymentElement";

type CheckoutStep = "details" | "shipping" | "payment" | "review";

type AddressForm = CheckoutAddress;

const emptyAddress = (): AddressForm => ({
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  province: "",
  postalCode: "",
  countryCode: "GB",
  phone: "",
});

function errorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as Error).message;
    if (message) return message;
  }
  return "Checkout could not continue. Please try again.";
}

function updateAddressField(
  setter: Dispatch<SetStateAction<AddressForm>>,
  field: keyof AddressForm,
  value: string,
) {
  setter((current) => ({ ...current, [field]: value }));
}

function AddressFields({
  prefix,
  title,
  address,
  setAddress,
}: {
  prefix: string;
  title: string;
  address: AddressForm;
  setAddress: Dispatch<SetStateAction<AddressForm>>;
}) {
  return (
    <fieldset className="checkout-address">
      <legend>{title}</legend>
      <div className="checkout-form__grid">
        <label className="checkout-field">
          <span>First name</span>
          <input
            name={prefix + "-first-name"}
            value={address.firstName}
            autoComplete="given-name"
            onChange={(event) => updateAddressField(setAddress, "firstName", event.target.value)}
            required
          />
        </label>
        <label className="checkout-field">
          <span>Last name</span>
          <input
            name={prefix + "-last-name"}
            value={address.lastName}
            autoComplete="family-name"
            onChange={(event) => updateAddressField(setAddress, "lastName", event.target.value)}
            required
          />
        </label>
      </div>
      <label className="checkout-field">
        <span>Address line 1</span>
        <input
          name={prefix + "-address-1"}
          value={address.address1}
          autoComplete="address-line1"
          onChange={(event) => updateAddressField(setAddress, "address1", event.target.value)}
          required
        />
      </label>
      <label className="checkout-field">
        <span>Address line 2 <small>(optional)</small></span>
        <input
          name={prefix + "-address-2"}
          value={address.address2}
          autoComplete="address-line2"
          onChange={(event) => updateAddressField(setAddress, "address2", event.target.value)}
        />
      </label>
      <div className="checkout-form__grid">
        <label className="checkout-field">
          <span>Town / city</span>
          <input
            name={prefix + "-city"}
            value={address.city}
            autoComplete="address-level2"
            onChange={(event) => updateAddressField(setAddress, "city", event.target.value)}
            required
          />
        </label>
        <label className="checkout-field">
          <span>County / region <small>(optional)</small></span>
          <input
            name={prefix + "-province"}
            value={address.province}
            autoComplete="address-level1"
            onChange={(event) => updateAddressField(setAddress, "province", event.target.value)}
          />
        </label>
      </div>
      <div className="checkout-form__grid">
        <label className="checkout-field">
          <span>Postcode</span>
          <input
            name={prefix + "-postcode"}
            value={address.postalCode}
            autoComplete="postal-code"
            onChange={(event) => updateAddressField(setAddress, "postalCode", event.target.value)}
            required
          />
        </label>
        <label className="checkout-field">
          <span>Country</span>
          <select
            name={prefix + "-country"}
            value={address.countryCode}
            onChange={(event) => updateAddressField(setAddress, "countryCode", event.target.value)}
          >
            <option value="GB">United Kingdom</option>
          </select>
        </label>
      </div>
      <label className="checkout-field">
        <span>Phone <small>(optional)</small></span>
        <input
          name={prefix + "-phone"}
          type="tel"
          value={address.phone}
          autoComplete="tel"
          onChange={(event) => updateAddressField(setAddress, "phone", event.target.value)}
        />
      </label>
    </fieldset>
  );
}

export function CheckoutExperience() {
  const { cart, cartProvider, checkoutEnabled } = useCommerce();
  const [step, setStep] = useState<CheckoutStep>("details");
  const [checkoutCart, setCheckoutCart] = useState<CheckoutCart | null>(null);
  const [shippingOptions, setShippingOptions] = useState<CheckoutShippingOption[]>([]);
  const [paymentProviders, setPaymentProviders] = useState<CheckoutPaymentProvider[]>([]);
  const [shippingAddress, setShippingAddress] = useState<AddressForm>(emptyAddress);
  const [billingAddress, setBillingAddress] = useState<AddressForm>(emptyAddress);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [email, setEmail] = useState("");
  const [paymentClientSecret, setPaymentClientSecret] = useState("");
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [stripeElements, setStripeElements] = useState<StripeElements | null>(null);
  const [stripeReady, setStripeReady] = useState(false);
  const [stripeError, setStripeError] = useState("");
  const submittingRef = useRef(false);

  const [selectedShippingId, setSelectedShippingId] = useState("");
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!checkoutEnabled || cartProvider !== "medusa") {
      setLoading(false);
      return;
    }

    const storedCartId = readMedusaCartId();
    setCartId(storedCartId);

    if (!storedCartId) {
      setLoading(false);
      setLoaded(true);
      return;
    }

    let active = true;
    void retrieveCheckoutCart(storedCartId)
      .then((remoteCart) => {
        if (!active) return;
        setCheckoutCart(remoteCart);
        if (remoteCart.email) setEmail(remoteCart.email);
        setLoaded(true);
      })
      .catch((requestError) => {
        if (!active) return;
        setError(errorMessage(requestError));
        setLoaded(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [cartProvider, checkoutEnabled]);

  const handleStripeReady = useCallback((nextStripe: Stripe, nextElements: StripeElements) => {
    setStripeInstance(nextStripe);
    setStripeElements(nextElements);
    setStripeReady(true);
  }, []);

  const handleStripeError = useCallback((message: string) => {
    setStripeError(message);
  }, []);

  const hasItems = Boolean(checkoutCart?.lines.length || cart.length);

  const submitDetails = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cartId) {
      setError("Your cart is unavailable. Return to the cart and try again.");
      return;
    }
    setBusy(true);
    setError("");
    const billing = billingSameAsShipping ? shippingAddress : billingAddress;
    try {
      const nextCart = await updateCheckoutDetails(cartId, email, shippingAddress, billing);
      const options = await listCheckoutShippingOptions(cartId);
      setCheckoutCart(nextCart);
      setShippingOptions(options);
      setSelectedShippingId(options[0]?.id || "");
      setStep("shipping");
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  const submitShipping = async () => {
    if (!cartId || !selectedShippingId) {
      setError("Choose a shipping option to continue.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const nextCart = await addCheckoutShippingMethod(cartId, selectedShippingId);
      const providers = await listCheckoutPaymentProviders();
      setCheckoutCart(nextCart);
      setPaymentProviders(providers);
      const preferred = providers.find((provider) => provider.id === checkoutDevelopment.payment.providerId)
        || providers[0];
      setSelectedProviderId(preferred?.id || "");
      setStep("payment");
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  const submitPayment = async () => {
    if (!cartId || !selectedProviderId) {
      setError("Choose a payment method to continue.");
      return;
    }
    setBusy(true);
    setError("");
    setStripeError("");
    try {
      const initialized = await initializeCheckoutPayment(cartId, selectedProviderId);
      setCheckoutCart(initialized.cart);
      setPaymentClientSecret(initialized.clientSecret || "");
      setStripeInstance(null);
      setStripeElements(null);
      setStripeReady(false);
      setStep(initialized.clientSecret ? "payment" : "review");
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  const submitOrder = async () => {
    if (!cartId || submittingRef.current) {
      if (!cartId) setError("Your cart is unavailable. Return to the cart and try again.");
      return;
    }
    if (paymentClientSecret && (!stripeInstance || !stripeElements)) {
      setError("The Stripe payment form is not ready yet.");
      return;
    }
    submittingRef.current = true;
    setBusy(true);
    setError("");
    try {
      if (paymentClientSecret && stripeInstance && stripeElements) {
        const paymentResult = await stripeInstance.confirmPayment({
          elements: stripeElements,
          redirect: "if_required",
        });
        if (paymentResult.error) {
          throw new Error(paymentResult.error.message || "Stripe could not confirm the payment.");
        }
        const status = paymentResult.paymentIntent?.status;
        if (status && status !== "succeeded" && status !== "processing") {
          throw new Error("Stripe did not authorise the test payment.");
        }
      }

      const result = await completeCheckout(cartId);
      if (!result.order.id) {
        throw new Error("Medusa returned no order ID.");
      }
      window.sessionStorage.setItem(
        CHECKOUT_ORDER_CONFIRMATION_KEY,
        JSON.stringify(result.order),
      );
      clearMedusaCartId();
      window.location.assign("/order-confirmation");
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      submittingRef.current = false;
      setBusy(false);
    }
  };

  if (!checkoutEnabled || cartProvider !== "medusa") {
    return (
      <div className="empty-state checkout-disabled">
        <p>Checkout is disabled outside the isolated development preview.</p>
      </div>
    );
  }

  if (loading) {
    return <p className="checkout-loading" role="status">Loading your Medusa cart…</p>;
  }

  if (!loaded || !cartId || !hasItems) {
    return (
      <div className="empty-state checkout-empty">
        <p className="eyebrow">YOUR SELECTION</p>
        <h2>Your cart is empty.</h2>
        <p>Add a PHENO piece before starting checkout.</p>
        <a className="button button--dark" href="/shop">Return to shop</a>
      </div>
    );
  }

  const currentCart = checkoutCart;
  const currency = currentCart?.currencyCode || cart[0]?.currencyCode || "GBP";
  const stripePaymentSelected = selectedProviderId === checkoutDevelopment.payment.providerId;
  const summaryLines = currentCart?.lines || cart.map((line) => ({ ...line, total: line.price * line.quantity }));


  return (
    <section className="checkout-experience" data-checkout-provider="medusa" data-cart-id-present="true">
      <nav className="checkout-progress" aria-label="Checkout progress">
        {(["details", "shipping", "payment", "review"] as CheckoutStep[]).map((item, index) => (
          <span className={step === item ? "checkout-progress__item checkout-progress__item--active" : "checkout-progress__item"} key={item}>
            <span className="checkout-progress__number">0{index + 1}</span>
            <span>{item === "details" ? "Details" : item === "review" ? "Review" : item[0].toUpperCase() + item.slice(1)}</span>
          </span>
        ))}
      </nav>

      <div className="checkout-layout">
        <div className="checkout-main">
          {paymentClientSecret ? (
            <div className="checkout-payment-panel">
              <p className="eyebrow">SECURE PAYMENT</p>
              <h2>Pay securely with Stripe</h2>
              <p className="checkout-development-note">Stripe test mode is active for this isolated preview.</p>
              <StripePaymentElement
                clientSecret={paymentClientSecret}
                onReady={handleStripeReady}
                onError={handleStripeError}
              />
              {stripeError ? <p className="checkout-inline-error" role="alert">{stripeError}</p> : null}
            </div>
          ) : null}

          {step === "details" ? (
            <form className="checkout-form" onSubmit={submitDetails}>
              <div className="checkout-form__section">
                <p className="eyebrow">GUEST CHECKOUT</p>
                <h2>Contact and delivery</h2>
                <p className="checkout-development-note">{checkoutDevelopment.contact}</p>
              </div>
              <label className="checkout-field">
                <span>Email address</span>
                <input
                  type="email"
                  value={email}
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              <AddressFields
                prefix="shipping"
                title="Shipping address"
                address={shippingAddress}
                setAddress={setShippingAddress}
              />
              <label className="checkout-checkbox">
                <input
                  type="checkbox"
                  checked={billingSameAsShipping}
                  onChange={(event) => setBillingSameAsShipping(event.target.checked)}
                />
                <span>Billing address is the same as shipping address</span>
              </label>
              {!billingSameAsShipping ? (
                <AddressFields
                  prefix="billing"
                  title="Billing address"
                  address={billingAddress}
                  setAddress={setBillingAddress}
                />
              ) : null}
              <button className="button button--dark" type="submit" disabled={busy}>
                {busy ? "Saving details…" : "Continue to shipping"}
              </button>
            </form>
          ) : null}

          {step === "shipping" ? (
            <div className="checkout-step">
              <div className="checkout-form__section">
                <p className="eyebrow">DELIVERY</p>
                <h2>Choose shipping</h2>
                <p className="checkout-development-note">{checkoutDevelopment.shipping.description}</p>
              </div>
              <div className="checkout-option-list">
                {shippingOptions.map((option) => (
                  <button
                    className={selectedShippingId === option.id ? "checkout-option checkout-option--selected" : "checkout-option"}
                    type="button"
                    key={option.id}
                    onClick={() => setSelectedShippingId(option.id)}
                  >
                    <span>
                      <strong>{option.name}</strong>
                      <small>{option.description || checkoutDevelopment.shipping.label}</small>
                    </span>
                    <b>{formatCurrency(option.amount, currency)}</b>
                  </button>
                ))}
              </div>
              {!shippingOptions.length ? (
                <p className="checkout-inline-error" role="alert">No shipping option is configured for this preview cart.</p>
              ) : null}
              <div className="checkout-step__actions">
                <button className="button button--outline" type="button" onClick={() => setStep("details")}>Back</button>
                <button className="button button--dark" type="button" onClick={() => void submitShipping()} disabled={busy || !selectedShippingId}>
                  {busy ? "Adding shipping…" : "Continue to payment"}
                </button>
              </div>
            </div>
          ) : null}

          {step === "payment" ? (
            <div className="checkout-step">
              <div className="checkout-form__section">
                <p className="eyebrow">PAYMENT</p>
                <h2>Secure payment</h2>
                <p className="checkout-development-note">{checkoutDevelopment.payment.description}</p>
              </div>
              <div className="checkout-option-list">
                {paymentProviders.map((provider) => (
                  <button
                    className={selectedProviderId === provider.id ? "checkout-option checkout-option--selected" : "checkout-option"}
                    type="button"
                    key={provider.id}
                    onClick={() => setSelectedProviderId(provider.id)}
                  >
                    <span>
                      <strong>{provider.title}</strong>
                      <small>{provider.id === checkoutDevelopment.payment.providerId ? checkoutDevelopment.payment.description : "Development payment provider."}</small>
                    </span>
                    <b>{provider.id === checkoutDevelopment.payment.providerId ? "TEST" : "DEV"}</b>
                  </button>
                ))}
              </div>
              {!paymentProviders.length ? (
                <p className="checkout-inline-error" role="alert">No payment provider is enabled for this preview region.</p>
              ) : null}
              <div className="checkout-step__actions">
                <button className="button button--outline" type="button" onClick={() => setStep("shipping")}>Back</button>
                <button
                  className="button button--dark"
                  type="button"
                  onClick={() => paymentClientSecret ? setStep("review") : void submitPayment()}
                  disabled={busy || !selectedProviderId || (Boolean(paymentClientSecret) && !stripeReady)}
                >
                  {busy ? "Preparing payment…" : paymentClientSecret ? "Continue to review" : "Prepare secure payment"}
                </button>
              </div>
            </div>
          ) : null}

          {step === "review" ? (
            <div className="checkout-step">
              <div className="checkout-form__section">
                <p className="eyebrow">REVIEW</p>
                <h2>Ready to place the test order?</h2>
                <p className="checkout-development-note">{checkoutDevelopment.review}</p>
              </div>
              <dl className="checkout-review-details">
                <div><dt>Email</dt><dd>{email}</dd></div>
                <div><dt>Shipping to</dt><dd>{shippingAddress.city}, {shippingAddress.postalCode}</dd></div>
                <div><dt>Payment</dt><dd>{stripePaymentSelected ? checkoutDevelopment.payment.label : "Manual development payment"}</dd></div>
              </dl>
              <div className="checkout-step__actions">
                <button className="button button--outline" type="button" onClick={() => setStep("payment")}>Back</button>
                <button className="button button--dark" type="button" onClick={() => void submitOrder()} disabled={busy}>
                  {busy ? "Placing test order…" : "Place test order"}
                </button>
              </div>
            </div>
          ) : null}

          {error ? <p className="checkout-inline-error" role="alert">{error}</p> : null}
        </div>

        <aside className="checkout-summary" aria-labelledby="checkout-summary-title">
          <p className="eyebrow">ORDER SUMMARY</p>
          <h2 id="checkout-summary-title">Your selection</h2>
          <ul role="list">
            {summaryLines.map((line) => (
              <li key={line.id}>
                <span>
                  <strong>{line.name}</strong>
                  <small>{line.colour}{line.size ? " / " + line.size : ""} · {line.quantity}</small>
                </span>
                <b>{formatCurrency(line.total ?? line.price * line.quantity, currency)}</b>
              </li>
            ))}
          </ul>
          <dl>
            <div><dt>Items</dt><dd>{formatCurrency(currentCart?.itemSubtotal || 0, currency)}</dd></div>
            <div><dt>Development tax</dt><dd>{formatCurrency(currentCart?.taxTotal || 0, currency)}</dd></div>
            <div><dt>Development shipping</dt><dd>{formatCurrency(currentCart?.shippingTotal || 0, currency)}</dd></div>
            <div className="checkout-summary__total"><dt>Total</dt><dd>{formatCurrency(currentCart?.total || 0, currency)}</dd></div>
          </dl>
          <p className="checkout-development-note">{checkoutDevelopment.tax.description}</p>
        </aside>
      </div>
    </section>
  );
}
