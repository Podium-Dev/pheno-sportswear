"use client";

import { type FormEvent, useState } from "react";
import {
  IconBox,
  IconChevronLeft,
  IconChevronRight,
  IconCurrencyPound,
  IconInfoCircle,
  IconLayoutGrid,
  IconLogout,
  IconMapPin,
  IconPencil,
  IconPlus,
  IconShoppingBag,
  IconTrash,
  IconTruckDelivery,
  IconUser,
} from "@tabler/icons-react";
import {
  accountService,
  type AccountOrder,
  type AccountOrderStatus,
  type AccountView,
} from "@/lib/commerce/account-service";

const accountNavItems = [
  { id: "overview", label: "Overview", Icon: IconLayoutGrid },
  { id: "orders", label: "Orders", Icon: IconBox },
  { id: "addresses", label: "Addresses", Icon: IconMapPin },
  { id: "profile", label: "Profile", Icon: IconUser },
] as const satisfies Array<{ id: AccountView; label: string; Icon: typeof IconLayoutGrid }>;

const accountOrderFilters = ["All orders", "Processing", "In transit", "Completed", "Cancelled"] as const;
type AccountOrderFilter = (typeof accountOrderFilters)[number];
type AddressKind = "delivery" | "billing";

type AuthMode = "sign-in" | "create-account";
type AccountField = "email" | "password";
type AccountFieldErrors = Partial<Record<AccountField, string>>;

function AccountStatus({ status }: { status: AccountOrderStatus }) {
  const statusClass = status.toLowerCase().replace(/\s+/g, "-");

  return (
    <span className={`account-status account-status--${statusClass}`}>
      <span className="account-status__marker" aria-hidden="true" />
      {status}
    </span>
  );
}

function getOrderStatusMessage(status: AccountOrderStatus) {
  switch (status) {
    case "In transit":
      return "Your order is on its way.";
    case "Processing":
      return "Your order is being prepared.";
    case "Cancelled":
      return "This order was cancelled.";
    default:
      return "Your order has been delivered.";
  }
}

function AccountOrderAction({ onClick }: { onClick: () => void }) {
  return (
    <button className="account-text-link" type="button" onClick={onClick}>
      View order <IconChevronRight size={18} stroke={1.6} aria-hidden="true" />
    </button>
  );
}

export function AccountExperience() {
  const dashboard = accountService.getDashboard();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<AccountView>("overview");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState<AccountOrderFilter>("All orders");
  const [addressKind, setAddressKind] = useState<AddressKind>("delivery");
  const [authMode, setAuthMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AccountFieldErrors>({});
  const [authFeedback, setAuthFeedback] = useState("");
  const [authFeedbackTone, setAuthFeedbackTone] = useState<"error" | "info" | "">("");
  const [profileFirstName, setProfileFirstName] = useState(dashboard.customer.firstName);
  const [profileLastName, setProfileLastName] = useState(dashboard.customer.lastName);
  const [profileEmail, setProfileEmail] = useState(dashboard.customer.email);
  const [profilePhone, setProfilePhone] = useState(dashboard.customer.phone);
  const [emailPreferences, setEmailPreferences] = useState(dashboard.emailPreferences);
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

  const handleProfileSave = () => {
    setProfileFeedback("Your changes are saved locally for this frontend preview.");
  };

  const handlePreferenceSave = () => {
    setProfileFeedback("Your email preferences are saved locally for this frontend preview.");
  };

  const handleAddressAction = (action: "add" | "edit" | "remove", addressLabel?: string) => {
    const subject = addressLabel ? ` for ${addressLabel}` : "";
    const messages = {
      add: "Adding a saved address will connect to the selected commerce platform later.",
      edit: `Address editing${subject} will connect to the selected commerce platform later.`,
      remove: `Address removal${subject} will connect to the selected commerce platform later.`,
    };

    setAddressFeedback(messages[action]);
  };

  const openOrder = (order: AccountOrder) => {
    setSelectedOrderId(order.id);
    setActiveView("orders");
    setProfileFeedback("");
    setAddressFeedback("");
  };

  const renderPromo = () => (
    <aside className="account-promo" aria-labelledby="account-promo-title">
      <img src={dashboard.promotionalImage} alt="PHENO training space with barbells" />
      <div className="account-promo__overlay" />
      <div className="account-promo__content">
        <p className="account-eyebrow">PURSUE THE RISE</p>
        <h2 id="account-promo-title">Keep pushing. Keep growing.</h2>
        <p>New drops. Proven performance. Built for your journey.</p>
        <a className="button account-promo__cta" href="/shop">Shop new arrivals <IconChevronRight size={18} stroke={1.7} aria-hidden="true" /></a>
      </div>
    </aside>
  );

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
          <span className="account-metric__icon" aria-hidden="true"><IconShoppingBag size={29} stroke={1.45} /></span>
          <dt>Orders</dt>
          <dd>{dashboard.overviewOrders.length}</dd>
        </div>
        <div className="account-metric">
          <span className="account-metric__icon" aria-hidden="true"><IconTruckDelivery size={30} stroke={1.45} /></span>
          <dt>Active order</dt>
          <dd>{dashboard.overviewOrders.filter((order) => order.status === "In transit").length}</dd>
        </div>
        <div className="account-metric">
          <span className="account-metric__icon" aria-hidden="true"><IconCurrencyPound size={30} stroke={1.45} /></span>
          <dt>Total spent</dt>
          <dd>{dashboard.totalSpent}</dd>
        </div>
      </dl>

      <div className="account-dashboard-grid">
        <section className="account-panel account-panel--orders" aria-labelledby="recent-orders-title">
          <div className="account-panel__header">
            <div>
              <h2 id="recent-orders-title">Recent orders</h2>
            </div>
            <button className="account-text-link" type="button" onClick={() => setActiveView("orders")}>
              View all orders <IconChevronRight size={18} stroke={1.6} aria-hidden="true" />
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
                {dashboard.overviewOrders.map((order) => (
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
              <button className="account-panel__edit" type="button" onClick={() => setActiveView("addresses")}>Edit <IconPencil size={15} stroke={1.7} aria-hidden="true" /></button>
            </div>
            <address className="account-address">
              <strong>{dashboard.defaultAddress.fullName}</strong>
              <span>{dashboard.defaultAddress.line1}</span>
              <span>{dashboard.defaultAddress.city}, {dashboard.defaultAddress.region}</span>
              <span>{dashboard.defaultAddress.country}</span>
              <span>{dashboard.customer.phone}</span>
            </address>
          </section>

          <section className="account-panel account-panel--details" aria-labelledby="account-details-title">
            <div className="account-panel__header">
              <h2 id="account-details-title">Account details</h2>
              <button className="account-panel__edit" type="button" onClick={() => setActiveView("profile")}>Edit profile <IconPencil size={15} stroke={1.7} aria-hidden="true" /></button>
            </div>
            <div className="account-details">
              <strong>{dashboard.customer.fullName}</strong>
              <span>{dashboard.customer.email}</span>
            </div>
          </section>
        </div>
      </div>

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
            <p>{getOrderStatusMessage(selectedOrder.status)}</p>
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

    const filteredOrders = orderFilter === "All orders"
      ? dashboard.orders
      : dashboard.orders.filter((order) => order.status === orderFilter);

    return (
      <div className="account-order-view">
        <div className="account-orders-layout">
          <section className="account-panel account-order-history" aria-labelledby="order-history-title">
            <div className="account-order-filters" role="tablist" aria-label="Filter orders by status">
              {accountOrderFilters.map((filter) => (
                <button
                  className={orderFilter === filter ? "account-order-filter account-order-filter--active" : "account-order-filter"}
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={orderFilter === filter}
                  onClick={() => setOrderFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="account-orders-table-wrap">
              <table className="account-orders-table account-orders-table--history">
                <caption className="account-visually-hidden">PHENO order history</caption>
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
                  {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <th scope="row">{order.id}</th>
                      <td>{order.date}</td>
                      <td><AccountStatus status={order.status} /></td>
                      <td>{order.total}</td>
                      <td><AccountOrderAction onClick={() => openOrder(order)} /></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5}>
                        <p className="account-orders-empty">No orders match this filter.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="account-order-footer">
              <p>Showing {filteredOrders.length > 0 ? `1 to ${filteredOrders.length}` : "0"} of {dashboard.orders.length} orders</p>
              <div className="account-pagination" aria-label="Order pages">
                <button type="button" aria-label="Previous page" disabled>
                  <IconChevronLeft size={17} stroke={1.7} aria-hidden="true" />
                </button>
                <button className="account-pagination__current" type="button" aria-current="page">1</button>
                <button type="button" aria-label="Next page" disabled>
                  <IconChevronRight size={17} stroke={1.7} aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>

          <aside className="account-orders-rail" aria-label="Order tools">
            <section className="account-panel account-filter-panel" aria-labelledby="filter-orders-title">
              <div className="account-panel__header">
                <h2 id="filter-orders-title">Filter orders</h2>
                <button className="account-clear-filter" type="button" onClick={() => setOrderFilter("All orders")}>Clear all</button>
              </div>
              <div className="account-filter-panel__field">
                <label htmlFor="account-order-status">Status</label>
                <select
                  id="account-order-status"
                  value={orderFilter}
                  onChange={(event) => setOrderFilter(event.target.value as AccountOrderFilter)}
                >
                  {accountOrderFilters.map((filter) => <option key={filter} value={filter}>{filter}</option>)}
                </select>
              </div>
            </section>

            <section className="account-panel account-help-panel" aria-labelledby="account-help-title">
              <h2 id="account-help-title">Need help?</h2>
              <p>If you have any questions about your orders, our support team is here to help.</p>
              <a className="account-outline-cta" href="/contact">Contact support <IconChevronRight size={17} stroke={1.7} aria-hidden="true" /></a>
            </section>
          </aside>
        </div>

      </div>
    );
  };

  const renderAddresses = () => {
    const savedAddresses = addressKind === "delivery" ? dashboard.addresses : dashboard.billingAddresses;

    return (
      <div className="account-addresses-layout">
        <section className="account-panel account-addresses-view" aria-labelledby="addresses-title">
          <div className="account-addresses__toolbar">
            <div className="account-addresses__tabs" role="tablist" aria-label="Address type">
              <button
                className={addressKind === "delivery" ? "account-addresses__tab account-addresses__tab--active" : "account-addresses__tab"}
                type="button"
                role="tab"
                aria-selected={addressKind === "delivery"}
                onClick={() => setAddressKind("delivery")}
              >
                Delivery addresses
              </button>
              <button
                className={addressKind === "billing" ? "account-addresses__tab account-addresses__tab--active" : "account-addresses__tab"}
                type="button"
                role="tab"
                aria-selected={addressKind === "billing"}
                onClick={() => setAddressKind("billing")}
              >
                Billing addresses
              </button>
            </div>
            <button className="button account-addresses__add" type="button" onClick={() => handleAddressAction("add")}>
              <IconPlus size={15} stroke={2} aria-hidden="true" />
              Add new address
            </button>
          </div>

          <div className="account-addresses__list">
            {savedAddresses.map((address) => (
              <article className="account-address-card" key={`${addressKind}-${address.label}`}>
                <div className="account-address-card__content">
                  {address.isDefault ? <span className="account-address-card__badge">Default</span> : null}
                  <h2 id={address.isDefault ? "addresses-title" : undefined}>{address.label}</h2>
                  <address className="account-address">
                    <strong>{address.fullName}</strong>
                    <span>{address.line1}</span>
                    {address.line2 ? <span>{address.line2}</span> : null}
                    <span>{address.city}, {address.region}</span>
                    <span>{address.country}</span>
                    <span>{address.phone}</span>
                  </address>
                </div>

                <span className="account-address-card__type">
                  <IconTruckDelivery size={14} stroke={1.7} aria-hidden="true" />
                  {address.type}
                </span>

                <div className="account-address-card__actions">
                  <button type="button" onClick={() => handleAddressAction("edit", address.label)}>
                    <IconPencil size={15} stroke={1.7} aria-hidden="true" />
                    Edit
                  </button>
                  <button type="button" onClick={() => handleAddressAction("remove", address.label)}>
                    <IconTrash size={15} stroke={1.7} aria-hidden="true" />
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <p className="account-addresses__notice">
            <IconInfoCircle size={17} stroke={1.7} aria-hidden="true" />
            You can add multiple delivery addresses and choose your preferred one at checkout.
          </p>
          {addressFeedback ? <p className="account-view-feedback" role="status">{addressFeedback}</p> : null}
        </section>

        <aside className="account-addresses__rail" aria-label="Address help">
          <section className="account-panel account-addresses__help">
            <h2>About addresses</h2>
            <p>Your default delivery address will be used at checkout when no other address is selected.</p>
            <p>You can add, edit or remove addresses at any time.</p>
          </section>

          <section className="account-panel account-addresses__help">
            <h2>Need help?</h2>
            <p>If you have any questions about your addresses, our support team is here to help.</p>
            <a className="account-outline-cta" href="/contact">Contact support <IconChevronRight size={17} stroke={1.7} aria-hidden="true" /></a>
          </section>
        </aside>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="account-profile-layout">
      <section className="account-panel account-profile-view" aria-labelledby="profile-title">
        <div className="account-profile-head">
          <div>
            <h2 id="profile-title">Personal information</h2>
            <p>Update your personal details and how we contact you.</p>
          </div>
          <button className="account-profile-edit" type="button" onClick={handleProfileSave}>
            Edit <IconPencil size={16} stroke={1.8} aria-hidden="true" />
          </button>
        </div>
        <div className="account-profile-fields">
          <div className="account-field">
            <label htmlFor="profile-first-name">First name</label>
            <input id="profile-first-name" value={profileFirstName} onChange={(event) => setProfileFirstName(event.target.value)} />
          </div>
          <div className="account-field">
            <label htmlFor="profile-last-name">Last name</label>
            <input id="profile-last-name" value={profileLastName} onChange={(event) => setProfileLastName(event.target.value)} />
          </div>
          <div className="account-field account-field--wide">
            <label htmlFor="profile-email">Email address</label>
            <input id="profile-email" type="email" value={profileEmail} onChange={(event) => setProfileEmail(event.target.value)} />
          </div>
          <div className="account-field account-field--wide">
            <label htmlFor="profile-phone">Phone number (optional)</label>
            <input id="profile-phone" type="tel" value={profilePhone} onChange={(event) => setProfilePhone(event.target.value)} />
          </div>
        </div>
        <section className="account-profile-password" aria-labelledby="password-title">
          <div className="account-profile-head">
            <div>
              <h2 id="password-title">Change password</h2>
              <p>Choose a strong password to keep your account secure.</p>
            </div>
            <button className="account-profile-edit" type="button" onClick={handleProfileSave}>
              Edit password <IconPencil size={16} stroke={1.8} aria-hidden="true" />
            </button>
          </div>
          <div className="account-profile-password__value">
            <span>Password</span>
            <strong>••••••••••••••••</strong>
            <small>Last updated: {dashboard.passwordLastUpdated}</small>
          </div>
        </section>
      </section>
      <aside className="account-profile-rail">
        <section className="account-panel account-profile-preferences" aria-labelledby="preferences-title">
          <h2 id="preferences-title">Email preferences</h2>
          <p>Choose what emails you’d like to receive from PHENO.</p>
          <div className="account-profile-preference-list">
            {[
              ["orderUpdates", "Order updates", "Get notified about your orders and delivery."],
              ["newDrops", "New drops & updates", "Be the first to know about new products and offers."],
              ["marketing", "Marketing emails", "Receive exclusive offers and promotions."],
            ].map(([key, label, description]) => (
              <label className="account-profile-preference" key={key}>
                <input
                  type="checkbox"
                  checked={emailPreferences[key as keyof typeof emailPreferences]}
                  onChange={(event) => setEmailPreferences((current) => ({ ...current, [key]: event.target.checked }))}
                />
                <span>
                  <strong>{label}</strong>
                  <small>{description}</small>
                </span>
              </label>
            ))}
          </div>
          <button className="button account-profile-preferences__save" type="button" onClick={handlePreferenceSave}>Save preferences</button>
        </section>
        <section className="account-panel account-profile-details" aria-labelledby="account-details-title">
          <h2 id="account-details-title">Account details</h2>
          <dl>
            <div><dt>Customer since</dt><dd>{dashboard.customerSince}</dd></div>
            <div><dt>Account status</dt><dd><span className="account-profile-status">{dashboard.accountStatus}</span></dd></div>
            <div><dt>Default currency</dt><dd>{dashboard.defaultCurrency}</dd></div>
            <div><dt>Language</dt><dd>{dashboard.language}</dd></div>
          </dl>
        </section>
      </aside>
      {profileFeedback ? <p className="account-view-feedback account-profile-feedback" role="status">{profileFeedback}</p> : null}
    </div>
  );

  const renderDashboard = () => (
    <section className="account-dashboard" aria-labelledby="account-dashboard-title">
      <header className="account-page__intro account-page__intro--dashboard">
        <p className="account-eyebrow">MY ACCOUNT</p>
        <h1 id="account-dashboard-title">
          {activeView === "overview" ? `Welcome back, ${dashboard.customer.firstName}` : null}
          {activeView === "orders" ? "Orders" : null}
          {activeView === "addresses" ? "Addresses" : null}
          {activeView === "profile" ? "Profile" : null}
        </h1>
        <p className="account-page__summary">
          {activeView === "overview" ? "Manage your orders, details and account preferences." : null}
          {activeView === "orders" ? "View and track all your orders." : null}
          {activeView === "addresses" ? "Manage your delivery and billing addresses." : null}
          {activeView === "profile" ? "Manage your personal information and account settings." : null}
        </p>
      </header>

      <div className={`account-dashboard__layout account-dashboard__layout--${activeView}`}>
        <aside className="account-sidebar" aria-label="Account navigation">
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
                <item.Icon className="account-sidebar__icon" size={25} stroke={1.6} aria-hidden="true" />
                {item.label}
              </button>
            ))}
            <span className="account-sidebar__divider" aria-hidden="true" />
            <button className="account-sidebar__link account-sidebar__link--signout" type="button" onClick={handleSignOut}>
              <IconLogout className="account-sidebar__icon" size={25} stroke={1.6} aria-hidden="true" />
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

      {renderPromo()}
    </section>
  );

  return <div className="account-experience">{isAuthenticated ? renderDashboard() : renderAuth()}</div>;
}
