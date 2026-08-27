"use client";

import { useEffect, useState } from "react";
import { useCommerce } from "@/components/CommerceProvider";

const shopGroups = [
  {
    title: "Shop",
    links: [
      ["Shop all", "/shop"],
      ["Type 1", "/shop/type-1"],
      ["Tops", "/shop/tops"],
      ["Bottoms", "/shop/bottoms"],
      ["Sets", "/shop/sets"],
    ],
  },
  {
    title: "Tops",
    links: [
      ["T-Shirts", "/shop/t-shirts"],
      ["Tanks", "/shop/tanks"],
      ["Hoodies", "/shop/hoodies"],
    ],
  },
  {
    title: "Bottoms",
    links: [
      ["Shorts", "/shop/shorts"],
      ["Joggers", "/shop/joggers"],
    ],
  },
] as const;

const primaryLinks = [
  ["Our Story", "/our-story"],
  ["Train With Yousef", "/train-with-yousef"],
  ["Contact", "/contact"],
] as const;

function Brand() {
  return (
    <a className="brand" href="/" aria-label="PHENO home">
      <img className="brand__image" src="/images/pheno-logo.png" alt="PHENO" />
    </a>
  );
}

function ShopMenu({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="shop-menu" role="menu" aria-label="Shop categories">
      {shopGroups.map((group) => (
        <div className="shop-menu__group" key={group.title}>
          <p className="shop-menu__title">{group.title}</p>
          <ul role="list">
            {group.links.map(([label, href]) => (
              <li key={href}>
                <a href={href} role="menuitem" onClick={onNavigate}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const { cartCount, setCartOpen, setSearchOpen } = useCommerce();
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShopOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openSearch = () => {
    setShopOpen(false);
    setMobileOpen(false);
    setSearchOpen(true);
  };

  const openCart = () => {
    setShopOpen(false);
    setMobileOpen(false);
    setCartOpen(true);
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Brand />

        <nav className="site-nav" aria-label="Primary navigation">
          <div className="site-nav__shop">
            <button
              className="site-nav__trigger"
              type="button"
              aria-expanded={shopOpen}
              aria-controls="desktop-shop-menu"
              onClick={() => setShopOpen((open) => !open)}
            >
              Shop <span aria-hidden="true">⌄</span>
            </button>
            {shopOpen ? (
              <div id="desktop-shop-menu" className="shop-menu-wrap">
                <ShopMenu onNavigate={() => setShopOpen(false)} />
              </div>
            ) : null}
          </div>
          {primaryLinks.map(([label, href]) => (
            <a className="site-nav__link" href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>

        <nav className="site-tools" aria-label="Utility navigation">
          <button className="site-tools__link site-tools__button" type="button" onClick={openSearch}>
            Search
          </button>
          <a className="site-tools__link" href="/account">
            Account
          </a>
          <button className="site-tools__link site-tools__button" type="button" onClick={openCart}>
            Cart ({cartCount})
          </button>
        </nav>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className="mobile-menu-toggle__label">{mobileOpen ? "Close" : "Menu"}</span>
          <span className="mobile-menu-toggle__icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>

        {mobileOpen ? (
          <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation">
            <details className="mobile-navigation__shop">
              <summary>Shop</summary>
              <ShopMenu onNavigate={() => setMobileOpen(false)} />
            </details>
            {primaryLinks.map(([label, href]) => (
              <a href={href} key={href} onClick={() => setMobileOpen(false)}>
                {label}
              </a>
            ))}
            <button type="button" onClick={openSearch}>
              Search
            </button>
            <a href="/account" onClick={() => setMobileOpen(false)}>
              Account
            </a>
            <button type="button" onClick={openCart}>
              Cart ({cartCount})
            </button>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
