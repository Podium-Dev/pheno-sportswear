"use client";

import { useMemo, useState } from "react";
import { getProductBySlug, type Product } from "@/data/products";
import { useCommerce } from "@/components/CommerceProvider";
import { formatCurrency } from "@/lib/format";

const topPickSlugs = [
  "pheno-type-1-shorts",
  "pheno-type-1-joggers",
  "pheno-type-1-t-shirt",
  "pheno-type-1-hoodie",
  "pheno-type-1-tank",
];

function HomepageProductCard({ product }: { product: Product }) {
  const { isWishlisted, toggleWishlist } = useCommerce();
  const wishlisted = isWishlisted(product.slug);

  return (
    <article className="product-card product-card--homepage">
      <div className="product-card__media-wrap">
        <a className="product-card__media-link" href={`/product/${product.slug}`}>
          <span className="product-card__media">
            <img src={product.images[0]} alt={`${product.name}, PHENO Sportswear`} />
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
      <a className="product-card__text-link" href={`/product/${product.slug}`}>
        <span className="product-card__name">{product.name}</span>
        <span className="product-card__price">{formatCurrency(product.price)}</span>
      </a>
    </article>
  );
}

export function HomepageProductRail() {
  const allTopPicks = useMemo(
    () => topPickSlugs.map((slug) => getProductBySlug(slug)).filter((product): product is Product => Boolean(product)),
    [],
  );
  const [startIndex, setStartIndex] = useState(0);

  const visibleProducts = [0, 1, 2].map((offset) => allTopPicks[(startIndex + offset) % allTopPicks.length]);

  return (
    <>
      <div className="section-heading-row">
        <h2 className="section-heading" id="top-picks-title">Top picks</h2>
        <div className="carousel-controls" aria-label="Top picks carousel controls">
          <button
            type="button"
            aria-label="Previous top picks"
            onClick={() => setStartIndex((current) => (current - 1 + allTopPicks.length) % allTopPicks.length)}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next top picks"
            onClick={() => setStartIndex((current) => (current + 1) % allTopPicks.length)}
          >
            ›
          </button>
        </div>
      </div>

      <div className="product-grid">
        {visibleProducts.map((product) => <HomepageProductCard key={product.slug} product={product} />)}
      </div>

      <div className="carousel-progress" aria-label={`Top picks set ${startIndex + 1} of ${allTopPicks.length}`}>
        <span style={{ width: `${Math.max(18, ((startIndex + 3) / allTopPicks.length) * 100)}%` }} />
      </div>
    </>
  );
}
