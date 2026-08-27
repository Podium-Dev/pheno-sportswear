"use client";

import { FormEvent, useState } from "react";
import { searchProducts } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export function SearchPageContent({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const results = searchProducts(submittedQuery);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = query.trim();
    setSubmittedQuery(nextQuery);
    window.history.replaceState({}, "", nextQuery ? `/search?q=${encodeURIComponent(nextQuery)}` : "/search");
  };

  return (
    <>
      <form className="search-page__form" onSubmit={handleSubmit}>
        <label htmlFor="search-page-query">Search the range</label>
        <div className="search-page__input-row">
          <input
            id="search-page-query"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try shorts or hoodie"
          />
          <button className="button button--dark" type="submit">Search</button>
        </div>
      </form>

      <div className="search-page__results" aria-live="polite">
        {submittedQuery.trim() ? (
          <p className="search-page__result-count">
            {results.length} {results.length === 1 ? "result" : "results"} for “{submittedQuery}”
          </p>
        ) : null}
        {results.length ? (
          <div className="catalogue-grid">
            {results.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        ) : submittedQuery.trim() ? (
          <div className="empty-state empty-state--search-page">
            <h2>No results found.</h2>
            <p>Try another product, category, or training feature.</p>
            <a className="button button--dark" href="/shop">Shop all</a>
          </div>
        ) : (
          <div className="search-page__suggestions">
            <p>Search by product, category, or performance feature.</p>
            <div className="search-page__suggestion-links">
              {['shorts', 'hoodie', '4-way stretch'].map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => {
                  setQuery(suggestion);
                  setSubmittedQuery(suggestion);
                }}>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
