"use client";

import { useMemo, useState } from "react";
import {
  getProductImage,
  getVariant,
  SIZE_OPTIONS,
  type Colour,
  type ProductBundle,
  type Product,
  type Size,
} from "@/data/products";
import { useCommerce } from "@/components/CommerceProvider";
import { formatCurrency } from "@/lib/format";
import { findCatalogProduct } from "@/lib/commerce/catalog-utils";

export function BundleCard({ bundle, products }: { bundle: ProductBundle; products: Product[] }) {
  const { addToCart, setCartOpen } = useCommerce();
  const bundleProducts = useMemo(
    () => bundle.productSlugs.map((slug) => findCatalogProduct(products, slug)).filter((product): product is Product => Boolean(product)),
    [bundle.productSlugs, products],
  );
  const [open, setOpen] = useState(false);
  const [sizes, setSizes] = useState<Record<string, Size | "">>({});
  const [colours, setColours] = useState<Record<string, Colour>>({});
  const [error, setError] = useState("");
  const total = bundleProducts.reduce((sum, product) => sum + product.price, 0);

  const handleAddBundle = () => {
    if (bundleProducts.some((product) => !sizes[product.slug])) {
      setError("Choose a size for each piece first.");
      return;
    }

    const selectedVariants = bundleProducts.map((product) => {
      const colour = colours[product.slug] || product.colours[0];
      const size = sizes[product.slug] as Size;
      return { product, variant: getVariant(product, colour, size) };
    });

    if (selectedVariants.some(({ variant }) => !variant?.available)) {
      setError("One of those sizes is unavailable. Choose another size.");
      return;
    }

    selectedVariants.forEach(({ product, variant }) => {
      if (variant) addToCart(product, variant, 1, false);
    });
    setError("");
    setCartOpen(true);
  };

  return (
    <article className="bundle-card">
      <div className="bundle-card__media">
        {bundleProducts.map((product) => (
          <a href={`/product/${product.slug}`} key={product.slug}>
            <img src={getProductImage(product)} alt={`${product.name}, ${bundle.name}`} />
          </a>
        ))}
      </div>
      <div className="bundle-card__body">
        <p className="eyebrow">TYPE 1 SET</p>
        <h2>{bundle.name}</h2>
        <p>{bundle.description}</p>
        <div className="bundle-card__meta">
          <span>{formatCurrency(total, bundleProducts[0]?.currencyCode)}</span>
          <span>{bundleProducts.length} pieces</span>
        </div>
        <button
          className="button button--dark"
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((currentOpen) => !currentOpen)}
        >
          {open ? "Close options" : "Choose sizes"}
        </button>
        {open ? (
          <div className="bundle-card__options">
            {bundleProducts.map((product) => (
              <fieldset key={product.slug}>
                <legend>{product.name.replace("PHENO ", "")}</legend>
                {product.colours.length > 1 ? (
                  <label>
                    Colour
                    <select
                      value={colours[product.slug] || product.colours[0]}
                      onChange={(event) =>
                        setColours((current) => ({
                          ...current,
                          [product.slug]: event.target.value as Colour,
                        }))
                      }
                    >
                      {product.colours.map((colour) => <option key={colour}>{colour}</option>)}
                    </select>
                  </label>
                ) : null}
                <label>
                  Size
                  <select
                    value={sizes[product.slug] || ""}
                    onChange={(event) =>
                      setSizes((current) => ({
                        ...current,
                        [product.slug]: event.target.value as Size,
                      }))
                    }
                  >
                    <option value="">Select size</option>
                    {(product.sizes.length ? product.sizes : SIZE_OPTIONS).map((size) => {
                      const colour = colours[product.slug] || product.colours[0];
                      const variant = getVariant(product, colour, size);
                      return <option key={size} value={size} disabled={!variant?.available}>{size}{!variant?.available ? " · sold out" : ""}</option>;
                    })}
                  </select>
                </label>
              </fieldset>
            ))}
            <button className="button button--dark button--wide" type="button" onClick={handleAddBundle}>
              Add set to cart
            </button>
            {error ? <p className="form-message form-message--error">{error}</p> : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
