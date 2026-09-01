"use client";

import { useEffect, useState } from "react";
import { useCommerce } from "@/components/CommerceProvider";

const retailNavLinks = [
  ["Shop", "/shop"],
  ["Our story", "/our-story"],
  ["Train with Yousef", "/train-with-yousef"],
  ["Contact", "/contact"],
] as const;

function MenuIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M3 6h14M3 10h14M3 14h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 6h2l1.7 10.2a2 2 0 0 0 2 1.7h7.6a2 2 0 0 0 2-1.6L21 9H7" />
      <circle cx="10" cy="21" r="1" />
      <circle cx="18" cy="21" r="1" />
    </svg>
  );
}

export function SiteHeader() {
  const { cartCount, setCartOpen, setSearchOpen } = useCommerce();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openSearch = () => {
    setMobileOpen(false);
    setSearchOpen(true);
  };

  const openCart = () => {
    setMobileOpen(false);
    setCartOpen(true);
  };

  return (
    <header className="retail-header">
      <div className="retail-navigation">
        <a className="retail-navigation__brand" href="/" aria-label="PHENO home">
          <img src="/images/pheno-desktop-logo-wide.avif" alt="PHENO" />
        </a>

        <nav className="retail-navigation__links" aria-label="Primary navigation">
          {retailNavLinks.map(([label, href]) => (
            <a href={href} key={href}>{label}</a>
          ))}
        </nav>

        <div className="retail-navigation__tools" aria-label="Utility navigation">
          <button type="button" aria-label="Search" onClick={openSearch}>
            <SearchIcon />
            <span>Search</span>
          </button>
          <button type="button" aria-label={`Cart (${cartCount})`} onClick={openCart}>
            <CartIcon />
            <span>My cart ({cartCount})</span>
          </button>
        </div>

        <button className="retail-navigation__mobile-toggle" type="button" aria-expanded={mobileOpen} aria-controls="retail-mobile-menu" onClick={() => setMobileOpen((open) => !open)}>
          <span>{mobileOpen ? "Close" : "Menu"}</span>
          <MenuIcon />
        </button>
      </div>

      {mobileOpen ? (
        <nav id="retail-mobile-menu" className="retail-mobile-menu" aria-label="Mobile navigation">
          {retailNavLinks.map(([label, href]) => (
            <a href={href} key={href} onClick={() => setMobileOpen(false)}>{label}</a>
          ))}
          <button type="button" onClick={openSearch}>Search</button>
          <button type="button" onClick={openCart}>My cart ({cartCount})</button>
        </nav>
      ) : null}
    </header>
  );
}

