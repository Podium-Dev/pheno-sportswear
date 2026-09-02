"use client";

import { useEffect, useRef, useState } from "react";
import { useCommerce } from "@/components/CommerceProvider";
import { formatCurrency } from "@/lib/format";
import { searchCatalogProducts } from "@/lib/commerce/catalog-utils";

export function SearchOverlay() {
  const { catalogProducts, searchOpen, setSearchOpen } = useCommerce();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = searchCatalogProducts(catalogProducts, query);

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) {
    return null;
  }

  return (
    <div className="overlay-layer" role="presentation">
      <button
        className="overlay-layer__backdrop"
        type="button"
        aria-label="Close search"
        onClick={() => setSearchOpen(false)}
      />
      <section
        className="search-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-panel-title"
      >
        <div className="search-panel__header">
          <div>
            <p className="eyebrow">PHENO SPORTSWEAR</p>
            <h2 id="search-panel-title">Search</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
          >
            ×
          </button>
        </div>

        <form
          className="search-panel__form"
          action="/search"
          onSubmit={() => setSearchOpen(false)}
        >
          <label htmlFor="overlay-search">Search products</label>
          <div className="search-panel__input-wrap">
            <input
              ref={inputRef}
              id="overlay-search"
              name="q"
              type="search"
              placeholder="Try shorts or hoodie"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button className="button button--dark" type="submit">
              Search
            </button>
          </div>
        </form>

        <div className="search-panel__results" aria-live="polite">
          {query.trim() ? (
            results.length ? (
              <ul className="search-results" role="list">
                {results.map((product) => (
                  <li key={product.slug}>
                    <a
                      className="search-result"
                      href={`/product/${product.slug}`}
                      onClick={() => setSearchOpen(false)}
                    >
                      <img src={product.images[0]} alt="" />
                      <span>
                        <strong>{product.name}</strong>
                        <small>{formatCurrency(product.price, product.currencyCode)}</small>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state empty-state--search">
                <p>No results found.</p>
                <a className="text-link" href="/shop" onClick={() => setSearchOpen(false)}>
                  Shop all
                </a>
              </div>
            )
          ) : (
            <p className="search-panel__hint">
              Search the Type 1 collection by product, category, or performance feature.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
