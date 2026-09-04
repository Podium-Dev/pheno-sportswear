"use client";

import { type FormEvent, useState } from "react";
import {
  accountService,
  type AccountOrder,
  type AccountOrderStatus,
  type AccountView,
} from "@/lib/commerce/account-service";

const accountNavItems: Array<{ id: AccountView; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders" },
  { id: "addresses", label: "Addresses" },
  { id: "profile", label: "Profile" },
];

type AuthMode = "sign-in" | "create-account";
type AccountField = "email" | "password";
type AccountFieldErrors = Partial<Record<AccountField, string>>;

function AccountStatus({ status }: { status: AccountOrderStatus }) {
  return (
    <span className={`account-status account-status--${status === "In transit" ? "transit" : "complete"}`}>
      <span className="account-status__marker" aria-hidden="true" />
      {status}
    </span>
  );
}

function AccountOrderAction({ onClick }: { onClick: () => void }) {
  return (
    <button className="account-text-link" type="button" onClick={onClick}>
      View order <span aria-hidden="true">↗</span>
    </button>
  );
}

export function AccountExperience() {
  const dashboard = accountService.getDashboard();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<AccountView>("overview");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AccountFieldErrors>({});
  const [authFeedback, setAuthFeedback] = useState("");
  const [authFeedbackTone, setAuthFeedbackTone] = useState<"error" | "info" | "">("");
  const [profileName, setProfileName] = useState(dashboard.customer.fullName);
  const [profileEmail, setProfileEmail] = useState(dashboard.customer.email);
  const [profilePhone, setProfilePhone] = useState(dashboard.customer.phone);
  const [profileFeedback, setProfileFeedback] = useState("");
  const [addressFeedback, setAddressFeedback] = useState("");

  const selectedOrder = selectedOrderId
    ? dashboard.orders.find((order) => order.id === selectedOrderId) ?? null
    : null;

  const enterDashboard = () => {
    setIsAuthenticated(true);
    setActiveView("overview");
    setSelectedOrderId(null);
  };

  const handleAuthSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: AccountFieldErrors = {};
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      nextErrors.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Enter your password.";
    } else if (password.length < 6) {
      nextErrors.password = "Use at least 6 characters.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setAuthFeedback("Check the highlighted fields and try again.");
      setAuthFeedbackTone("error");
      return;
    }

    const result = authMode === "sign-in"
      ? accountService.signIn({ email: normalizedEmail, password })
      : accountService.createAccount({ email: normalizedEmail, password });

    if (!result.ok) {
      setFieldErrors({});
      setAuthFeedback(result.message ?? "We could not complete that request.");
      setAuthFeedbackTone("error");
      return;
    }

    setFieldErrors({});
    setAuthFeedback("");
    setAuthFeedbackTone("");
    enterDashboard();
  };

  const handleForgotPassword = () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setFieldErrors({ email: "Enter a valid email address to request a reset." });
      setAuthFeedback("We need your email address before requesting a reset.");
      setAuthFeedbackTone("error");
      return;
    }

    setFieldErrors({});
    setAuthFeedback(accountService.requestPasswordReset(normalizedEmail));
    setAuthFeedbackTone("info");
  };

  const handleAuthModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setFieldErrors({});
    setAuthFeedback("");
    setAuthFeedbackTone("");
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setActiveView("overview");
    setSelectedOrderId(null);
    setPassword("");
    setAuthFeedback("You have been signed out of this preview.");
    setAuthFeedbackTone("info");
  };

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileFeedback("Your changes are saved locally for this frontend preview.");
  };

  const openAddressEditor = () => {
    setAddressFeedback("Address editing will connect to the selected commerce platform later.");
  };

  const openOrder = (order: AccountOrder) => {
    setSelectedOrderId(order.id);
    setActiveView("orders");
    setProfileFeedback("");
    setAddressFeedback("");
  };

  const renderAuth = () => (
    <section className="account-auth" aria-labelledby="account-auth-title">
      <header className="account-page__intro account-page__intro--auth">
        <p className="account-eyebrow">MY ACCOUNT</p>
        <h1 id="account-auth-title">Your PHENO account.</h1>
        <p className="account-page__summary">Keep orders, delivery details and account preferences together.</p>
      </header>

      <div className="account-auth__layout">
        <aside className="account-auth__statement" aria-label="PHENO account benefits">
          <p className="account-eyebrow">BUILT FOR THE WORK</p>
          <h2>
            <span>Keep moving</span>
            <span>toward what</span>
            <span>comes next.</span>
          </h2>
          <p>Sign in to see your orders, saved details and delivery information in one place.</p>
          <dl className="account-auth__signals">
            <div>
              <dt>Orders</dt>
              <dd>Track the pieces already in motion.</dd>
            </div>
            <div>
              <dt>Details</dt>
              <dd>Keep your delivery information ready.</dd>
            </div>
            <div>
              <dt>Profile</dt>
              <dd>Manage your account preferences.</dd>
            </div>
          </dl>
        </aside>

        <div className="account-auth__panel">
          <div className="account-auth__tabs" role="tablist" aria-label="Account access">
            <button
              className={authMode === "sign-in" ? "account-auth__tab account-auth__tab--active" : "account-auth__tab"}
              type="button"
              role="tab"
              aria-selected={authMode === "sign-in"}
              onClick={() => handleAuthModeChange("sign-in")}
            >
              Sign in
            </button>
            <button
              className={authMode === "create-account" ? "account-auth__tab account-auth__tab--active" : "account-auth__tab"}
              type="button"
              role="tab"
              aria-selected={authMode === "create-account"}
              onClick={() => handleAuthModeChange("create-account")}
            >
              Create account
            </button>
          </div>

          <div className="account-auth__panel-heading">
            <p className="account-eyebrow">{authMode === "sign-in" ? "WELCOME BACK" : "START HERE"}</p>
            <h2>{authMode === "sign-in" ? "Sign in to PHENO." : "Create your PHENO account."}</h2>
            <p>Frontend preview. Your customer data will connect after the commerce platform is selected.</p>
          </div>

          <form className="account-auth__form" onSubmit={handleAuthSubmit} noValidate>
            <div className="account-field">
              <label htmlFor="account-email">Email</label>
              <input
                id="account-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "account-email-error" : undefined}
              />
              {fieldErrors.email ? <span className="account-field__error" id="account-email-error">{fieldErrors.email}</span> : null}
            </div>

            <div className="account-field">
              <div className="account-field__label-row">
                <label htmlFor="account-password">Password</label>
                <button className="account-auth__forgot" type="button" onClick={handleForgotPassword}>Forgot password?</button>
              </div>
              <input
                id="account-password"
                name="password"
                type="password"
                autoComplete={authMode === "sign-in" ? "current-password" : "new-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? "account-password-error" : undefined}
              />
              {fieldErrors.password ? <span className="account-field__error" id="account-password-error">{fieldErrors.password}</span> : null}
            </div>

            {authFeedback ? (
              <p className={`account-auth__feedback account-auth__feedback--${authFeedbackTone}`} role={authFeedbackTone === "error" ? "alert" : "status"}>
                {authFeedback}
              </p>
            ) : null}

            <button className="button button--dark account-auth__submit" type="submit">
              {authMode === "sign-in" ? "Sign in" : "Create account"}
              <span aria-hidden="true">↗</span>
            </button>
          </form>

          <button className="account-auth__demo" type="button" onClick={enterDashboard}>
            Preview dashboard with sample data
          </button>
        </div>
      </div>
    </section>
  );

  const renderOverview = () => (
    <div className="account-main__content">
      <dl className="account-metrics" aria-label="Account summary">
        <div className="account-metric">
          <dt>Orders</dt>
          <dd>{dashboard.orders.length}</dd>
          <span>All orders</span>
        </div>
        <div className="account-metric">
          <dt>Active order</dt>
          <dd>{dashboard.orders.filter((order) => order.status === "In transit").length}</dd>
          <span>In motion</span>
        </div>
        <div className="account-metric">
          <dt>Total spent</dt>
          <dd>{dashboard.totalSpent}</dd>
          <span>Account total</span>
        </div>
      </dl>

      <div className="account-dashboard-grid">
        <section className="account-panel account-panel--orders" aria-labelledby="recent-orders-title">
          <div className="account-panel__header">
            <div>
              <p className="account-panel__eyebrow">ORDERS</p>
              <h2 id="recent-orders-title">Recent orders</h2>
            </div>
            <button className="account-text-link" type="button" onClick={() => setActiveView("orders")}>
              View all orders <span aria-hidden="true">↗</span>
            </button>
          </div>

          <div className="account-orders-table-wrap">
            <table className="account-orders-table">
              <caption className="account-visually-hidden">Recent PHENO orders</caption>
              <thead>
                <tr>
                  <th scope="col">Order</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Total</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.orders.map((order) => (
                  <tr key={order.id}>
                    <th scope="row">{order.id}</th>
                    <td>{order.date}</td>
                    <td><AccountStatus status={order.status} /></td>
                    <td>{order.total}</td>
                    <td><AccountOrderAction onClick={() => openOrder(order)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="account-side-stack">
          <section className="account-panel account-panel--address" aria-labelledby="default-address-title">
            <div className="account-panel__header">
              <h2 id="default-address-title">Default address</h2>
              <button className="account-panel__edit" type="button" onClick={() => setActiveView("addresses")}>Edit <span aria-hidden="true">↗</span></button>
            </div>
            <address className="account-address">
              <strong>{dashboard.defaultAddress.fullName}</strong>
              <span>{dashboard.defaultAddress.line1}</span>
              <span>{dashboard.defaultAddress.city}, {dashboard.defaultAddress.region}</span>
              <span>{dashboard.defaultAddress.country}</span>
            </address>
          </section>

          <section className="account-panel account-panel--details" aria-labelledby="account-details-title">
            <div className="account-panel__header">
              <h2 id="account-details-title">Account details</h2>
              <button className="account-panel__edit" type="button" onClick={() => setActiveView("profile")}>Edit profile <span aria-hidden="true">↗</span></button>
            </div>
            <div className="account-details">
              <strong>{dashboard.customer.fullName}</strong>
              <span>{dashboard.customer.email}</span>
              <span>{dashboard.customer.phone}</span>
            </div>
          </section>
        </div>
      </div>

      <aside className="account-promo" aria-labelledby="account-promo-title">
        <img src={dashboard.promotionalImage} alt="PHENO training space with barbells" />
        <div className="account-promo__overlay" />
        <div className="account-promo__content">
          <p className="account-eyebrow">PURSUE THE RISE</p>
          <h2 id="account-promo-title">Keep pushing. Keep growing.</h2>
          <p>New drops and proven performance for the work ahead.</p>
          <a className="button account-promo__cta" href="/shop">Shop new arrivals <span aria-hidden="true">↗</span></a>
        </div>
      </aside>
    </div>
  );

  const renderOrders = () => {
    if (selectedOrder) {
      return (
        <section className="account-panel account-order-detail" aria-labelledby="order-detail-title">
          <div className="account-order-detail__topline">
            <button className="account-back-link" type="button" onClick={() => setSelectedOrderId(null)}>
              <span aria-hidden="true">↙</span> Back to orders
            </button>
            <AccountStatus status={selectedOrder.status} />
          </div>

          <div className="account-order-detail__heading">
            <div>
              <p className="account-panel__eyebrow">{selectedOrder.date}</p>
              <h2 id="order-detail-title">{selectedOrder.id}</h2>
            </div>
            <p>{selectedOrder.status === "In transit" ? "Your order is on its way." : "Your order has been delivered."}</p>
          </div>

          <div className="account-order-detail__grid">
            <div className="account-order-detail__items">
              <h3>Items</h3>
              <div className="account-order-items">
                {selectedOrder.items.map((item) => (
                  <article className="account-order-item" key={item.id}>
                    <div className="account-order-item__media">
                      <img src={item.image} alt={item.alt} />
                    </div>
                    <div className="account-order-item__copy">
                      <h4>{item.name}</h4>
                      <p>{item.variant}</p>
                      <span>Quantity {item.quantity}</span>
                    </div>
                    <strong>{item.unitPrice}</strong>
                  </article>
                ))}
              </div>
            </div>

            <aside className="account-order-detail__summary">
              <div>
                <h3>Order summary</h3>
                <dl>
                  <div><dt>Subtotal</dt><dd>{selectedOrder.subtotal}</dd></div>
                  <div><dt>Shipping</dt><dd>{selectedOrder.shipping}</dd></div>
                  <div className="account-order-detail__total"><dt>Total</dt><dd>{selectedOrder.total}</dd></div>
                </dl>
              </div>
              <div>
                <h3>Shipping to</h3>
                <address className="account-address">
                  <strong>{selectedOrder.shippingAddress.fullName}</strong>
                  <span>{selectedOrder.shippingAddress.line1}</span>
                  <span>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.region}</span>
                  <span>{selectedOrder.shippingAddress.country}</span>
                </address>
              </div>
            </aside>
          </div>
        </section>
      );
    }

    return (
      <section className="account-panel account-order-history" aria-labelledby="order-history-title">
        <div className="account-panel__header account-panel__header--stacked">
          <div>
            <p className="account-panel__eyebrow">ORDERS</p>
            <h2 id="order-history-title">Order history</h2>
          </div>
          <p>Review the products, totals and delivery details for this sample account.</p>
        </div>
        <div className="account-order-list">
          {dashboard.orders.map((order) => (
            <article className="account-order-card" key={order.id}>
              <div>
                <span className="account-order-card__label">Order</span>
                <h3>{order.id}</h3>
              </div>
              <div>
                <span className="account-order-card__label">Date</span>
                <p>{order.date}</p>
              </div>
              <div>
                <span className="account-order-card__label">Status</span>
                <AccountStatus status={order.status} />
              </div>
              <div>
                <span className="account-order-card__label">Total</span>
                <p>{order.total}</p>
              </div>
              <AccountOrderAction onClick={() => openOrder(order)} />
            </article>
          ))}
        </div>
      </section>
    );
  };

  const renderAddresses = () => (
    <section className="account-panel account-addresses-view" aria-labelledby="addresses-title">
      <div className="account-panel__header account-panel__header--stacked">
        <div>
          <p className="account-panel__eyebrow">DELIVERY</p>
          <h2 id="addresses-title">Addresses</h2>
        </div>
        <p>Keep the address used for your next session ready to go.</p>
      </div>
      <div className="account-address-card">
        <div className="account-address-card__header">
          <h3>Default address</h3>
          <span>Primary</span>
        </div>
        <address className="account-address">
          <strong>{dashboard.defaultAddress.fullName}</strong>
          <span>{dashboard.defaultAddress.line1}</span>
          <span>{dashboard.defaultAddress.city}, {dashboard.defaultAddress.region}</span>
          <span>{dashboard.defaultAddress.country}</span>
        </address>
        <button className="account-text-link" type="button" onClick={openAddressEditor}>Edit address <span aria-hidden="true">↗</span></button>
      </div>
      {addressFeedback ? <p className="account-view-feedback" role="status">{addressFeedback}</p> : null}
    </section>
  );

  const renderProfile = () => (
    <section className="account-panel account-profile-view" aria-labelledby="profile-title">
      <div className="account-panel__header account-panel__header--stacked">
        <div>
          <p className="account-panel__eyebrow">ACCOUNT</p>
          <h2 id="profile-title">Profile details</h2>
        </div>
        <p>Update the details attached to this sample customer account.</p>
      </div>
      <form className="account-profile-form" onSubmit={handleProfileSubmit}>
        <div className="account-field">
          <label htmlFor="profile-name">Full name</label>
          <input id="profile-name" name="fullName" value={profileName} onChange={(event) => setProfileName(event.target.value)} />
        </div>
        <div className="account-field">
          <label htmlFor="profile-email">Email</label>
          <input id="profile-email" name="email" type="email" value={profileEmail} onChange={(event) => setProfileEmail(event.target.value)} />
        </div>
        <div className="account-field">
          <label htmlFor="profile-phone">Phone</label>
          <input id="profile-phone" name="phone" type="tel" value={profilePhone} onChange={(event) => setProfilePhone(event.target.value)} />
        </div>
        <div className="account-profile-form__actions">
          <button className="button button--dark" type="submit">Save changes <span aria-hidden="true">↗</span></button>
          {profileFeedback ? <p className="account-view-feedback" role="status">{profileFeedback}</p> : null}
        </div>
      </form>
    </section>
  );

  const renderDashboard = () => (
    <section className="account-dashboard" aria-labelledby="account-dashboard-title">
      <header className="account-page__intro account-page__intro--dashboard">
        <p className="account-eyebrow">MY ACCOUNT</p>
        <h1 id="account-dashboard-title">Welcome back, {dashboard.customer.firstName}.</h1>
        <p className="account-page__summary">Manage your orders, details and account preferences.</p>
        <p className="account-page__sample-note">Sample customer data for the frontend preview.</p>
      </header>

      <div className="account-dashboard__layout">
        <aside className="account-sidebar" aria-label="Account navigation">
          <p className="account-sidebar__label">Account</p>
          <nav className="account-sidebar__nav">
            {accountNavItems.map((item) => (
              <button
                className={activeView === item.id ? "account-sidebar__link account-sidebar__link--active" : "account-sidebar__link"}
                key={item.id}
                type="button"
                aria-current={activeView === item.id ? "page" : undefined}
                onClick={() => {
                  setActiveView(item.id);
                  setSelectedOrderId(null);
                  setProfileFeedback("");
                  setAddressFeedback("");
                }}
              >
                <span className="account-sidebar__link-mark" aria-hidden="true" />
                {item.label}
              </button>
            ))}
            <span className="account-sidebar__divider" aria-hidden="true" />
            <button className="account-sidebar__link account-sidebar__link--signout" type="button" onClick={handleSignOut}>
              <span className="account-sidebar__link-mark" aria-hidden="true" />
              Sign out
            </button>
          </nav>
        </aside>

        <div className="account-main">
          {activeView === "overview" ? renderOverview() : null}
          {activeView === "orders" ? renderOrders() : null}
          {activeView === "addresses" ? renderAddresses() : null}
          {activeView === "profile" ? renderProfile() : null}
        </div>
      </div>
    </section>
  );

  return <div className="account-experience">{isAuthenticated ? renderDashboard() : renderAuth()}</div>;
}

