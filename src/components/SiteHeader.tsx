const navigation = [
  { label: "Shop", href: "/shop" },
  { label: "Our Story", href: "/our-story" },
  { label: "Train With Yousef", href: "/train-with-yousef" },
  { label: "Contact", href: "/contact" },
];

const utilities = [
  { label: "Search", href: "/search" },
  { label: "Account", href: "/account" },
  { label: "Cart (0)", href: "/cart" },
];

function Brand() {
  return (
    <a className="brand" href="/" aria-label="PHENO home">
      <img className="brand__image" src="/images/pheno-logo.png" alt="PHENO" />
    </a>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Brand />

        <nav className="site-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <a className="site-nav__link" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <nav className="site-tools" aria-label="Utility navigation">
          {utilities.map((item) => (
            <a className="site-tools__link" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <details className="site-header__mobile-menu">
          <summary aria-label="Open navigation">Menu</summary>
          <nav className="site-header__mobile-panel" aria-label="Mobile navigation">
            {[...navigation, ...utilities].map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
