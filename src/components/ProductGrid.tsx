"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  const [colourFilter, setColourFilter] = useState("all");
  const [stockOnly, setStockOnly] = useState(false);
  const [sort, setSort] = useState("featured");

  const filteredProducts = useMemo(() => {
    const nextProducts = products.filter((product) => {
      const matchesColour = colourFilter === "all" || product.colours.includes(colourFilter as "Black" | "White");
      const matchesStock = !stockOnly || product.variants.some((variant) => variant.available);
      return matchesColour && matchesStock;
    });

    return nextProducts.sort((first, second) => {
      if (sort === "price-low") return first.price - second.price;
      if (sort === "price-high") return second.price - first.price;
      if (sort === "alphabetical") return first.name.localeCompare(second.name);
      return products.indexOf(first) - products.indexOf(second);
    });
  }, [colourFilter, products, sort, stockOnly]);

  return (
    <>
      <div className="catalogue-toolbar" aria-label="Product filters">
        <div className="catalogue-toolbar__filters">
          <span className="catalogue-toolbar__label">Filter</span>
          {(["all", "Black", "White"] as const).map((colour) => (
            <button
              className={`filter-chip${colourFilter === colour ? " filter-chip--selected" : ""}`}
              key={colour}
              type="button"
              aria-pressed={colourFilter === colour}
              onClick={() => setColourFilter(colour)}
            >
              {colour === "all" ? "All colours" : colour}
            </button>
          ))}
          <label className="filter-check">
            <input type="checkbox" checked={stockOnly} onChange={(event) => setStockOnly(event.target.checked)} />
            In stock only
          </label>
        </div>
        <label className="sort-control">
          <span>Sort by</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="alphabetical">Alphabetically</option>
            <option value="price-low">Price, low to high</option>
            <option value="price-high">Price, high to low</option>
          </select>
        </label>
      </div>

      {filteredProducts.length ? (
        <div className="catalogue-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state empty-state--catalogue">
          <p>No products match these filters.</p>
          <button className="button button--dark" type="button" onClick={() => {
            setColourFilter("all");
            setStockOnly(false);
          }}>
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
