"use client";

import { useState } from "react";
import {
  getProductImage,
  getVariant,
  type Colour,
  type Product,
  SIZE_OPTIONS,
  type Size,
} from "@/data/products";
import { useCommerce } from "@/components/CommerceProvider";
import { formatCurrency } from "@/lib/format";

export function QuickAddPanel({
  product,
  onAdded,
}: {
  product: Product;
  onAdded?: () => void;
}) {
  const { addToCart } = useCommerce();
  const [colour, setColour] = useState<Colour | "">(product.colours[0] || "");
  const [size, setSize] = useState<Size | "">("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!colour || !size) {
      setError("Choose a colour and size first.");
      return;
    }

    const variant = getVariant(product, colour, size);
    if (!variant?.available) {
      setError("That variant is sold out. Choose another size.");
      return;
    }

    addToCart(product, variant);
    setError("");
    onAdded?.();
  };

  return (
    <div className="quick-add-panel">
      {product.colours.length > 1 ? (
        <fieldset>
          <legend>Colour</legend>
          <div className="option-row">
            {product.colours.map((option) => (
              <button
                className={`option-chip${colour === option ? " option-chip--selected" : ""}`}
                key={option}
                type="button"
                aria-pressed={colour === option}
                onClick={() => setColour(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}
      <fieldset>
        <legend>Size</legend>
        <div className="option-row option-row--sizes">
          {SIZE_OPTIONS.map((option) => {
            const variant = colour ? getVariant(product, colour, option) : undefined;
            const unavailable = !variant?.available;
            return (
              <button
                className={`option-chip${size === option ? " option-chip--selected" : ""}`}
                key={option}
                type="button"
                aria-pressed={size === option}
                aria-label={`${option}${unavailable ? ", sold out" : ""}`}
                disabled={unavailable}
                onClick={() => setSize(option)}
              >
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>
      <button className="button button--dark button--wide" type="button" onClick={handleAdd}>
        Add to cart
      </button>
      {error ? <p className="form-message form-message--error">{error}</p> : null}
    </div>
  );
}

export function ProductCard({
  product,
  showQuickAdd = true,
  compact = false,
}: {
  product: Product;
  showQuickAdd?: boolean;
  compact?: boolean;
}) {
  const { isWishlisted, toggleWishlist } = useCommerce();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const wishlisted = isWishlisted(product.slug);
  const hasAvailableVariant = product.variants.some((variant) => variant.available);
  const hasUnavailableVariant = product.variants.some((variant) => !variant.available);

  return (
    <article className={`product-card${compact ? " product-card--compact" : ""}`}>
      <div className="product-card__media-wrap">
        <a className="product-card__media-link" href={`/product/${product.slug}`}>
          <span className="product-card__media">
            <img src={getProductImage(product)} alt={`${product.name}, PHENO Sportswear`} />
          </span>
        </a>
        <button
          className={`wishlist-button${wishlisted ? " wishlist-button--saved" : ""}`}
          type="button"
          aria-label={wishlisted ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`}
          aria-pressed={wishlisted}
          onClick={() => toggleWishlist(product.slug)}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>
      <div className="product-card__details">
        <a className="product-card__text-link" href={`/product/${product.slug}`}>
          <span className="product-card__name">{product.name}</span>
          <span className="product-card__price">{formatCurrency(product.price)}</span>
          <span className="product-card__colours">{product.colours.join(" / ")}</span>
        </a>
        <div className="product-card__status" aria-live="polite">
          {!hasAvailableVariant ? "Sold out" : hasUnavailableVariant ? "Some sizes sold out" : "In stock"}
        </div>
        {showQuickAdd && hasAvailableVariant ? (
          <button
            className="quick-add-trigger"
            type="button"
            aria-expanded={quickAddOpen}
            onClick={() => setQuickAddOpen((open) => !open)}
          >
            {quickAddOpen ? "Close" : "Quick add"}
          </button>
        ) : null}
        {quickAddOpen ? <QuickAddPanel product={product} onAdded={() => setQuickAddOpen(false)} /> : null}
      </div>
    </article>
  );
}
