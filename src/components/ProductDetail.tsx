"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getProductImage,
  getProductBySlug,
  getVariant,
  SIZE_OPTIONS,
  type Colour,
  type Product,
  type Size,
} from "@/data/products";
import { useCommerce } from "@/components/CommerceProvider";
import { formatCurrency } from "@/lib/format";
import { NotifyMeForm } from "@/components/Forms";
import { ProductCard } from "@/components/ProductCard";
import { ProductFeatureStrip } from "@/components/ProductFeatureStrip";
import { SizeGuideModal } from "@/components/SizeGuideModal";

function ProductGallery({ product, colour }: { product: Product; colour: Colour }) {
  const [activeImage, setActiveImage] = useState(getProductImage(product, colour));
  const images = product.galleryImagesByColour?.[colour] ?? product.images;

  useEffect(() => {
    setActiveImage(getProductImage(product, colour));
  }, [colour, product]);

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        <img src={activeImage} alt={`${product.name} in ${colour}`} />
      </div>
      <div className="product-gallery__thumbs" role="list" aria-label="Product images">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            className={activeImage === image ? "product-gallery__thumb product-gallery__thumb--active" : "product-gallery__thumb"}
            aria-label={`View ${product.name} image ${index + 1}`}
            aria-pressed={activeImage === image}
            onClick={() => setActiveImage(image)}
          >
            <img src={image} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart, isWishlisted, toggleWishlist } = useCommerce();
  const [colour, setColour] = useState<Colour | "">(product.colours[0] || "");
  const [size, setSize] = useState<Size | "">("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const variant = colour && size ? getVariant(product, colour, size) : undefined;
  const wishlisted = isWishlisted(product.slug);
  const completeTheLook = useMemo(
    () => product.completeTheLookSlugs.map((slug) => getProductBySlug(slug)).filter((item): item is Product => Boolean(item)),
    [product.completeTheLookSlugs],
  );

  const handleAddToCart = () => {
    if (!colour || !size) {
      setError("Choose a colour and size before adding this piece to your cart.");
      return;
    }

    if (!variant?.available) {
      setError("Your selected size is sold out. Use Notify Me below to register interest.");
      return;
    }

    addToCart(product, variant, quantity);
    setError("");
  };

  return (
    <>
      <div className="product-detail">
        <ProductGallery product={product} colour={colour || product.colours[0]} />

        <section className="product-purchase" aria-labelledby="product-title">
          <div className="product-purchase__heading">
            <div>
              <p className="eyebrow">TYPE 1 / {product.category.replace("-", " ")}</p>
              <h1 id="product-title">{product.name}</h1>
            </div>
            <button
              className={`wishlist-button wishlist-button--product${wishlisted ? " wishlist-button--saved" : ""}`}
              type="button"
              aria-label={wishlisted ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`}
              aria-pressed={wishlisted}
              onClick={() => toggleWishlist(product.slug)}
            >
              {wishlisted ? "♥" : "♡"}
            </button>
          </div>
          <p className="product-purchase__price">{formatCurrency(product.price)}</p>
          <p className="product-purchase__description">{product.description}</p>

          <div className="product-options">
            <fieldset>
              <legend>Colour{colour ? `, ${colour}` : ""}</legend>
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

            <fieldset>
              <legend>Size{size ? `, ${size}` : ""}</legend>
              <div className="option-row option-row--sizes">
                {SIZE_OPTIONS.map((option) => {
                  const optionVariant = colour ? getVariant(product, colour, option) : undefined;
                  const unavailable = !optionVariant?.available;
                  return (
                    <button
                      className={`option-chip${size === option ? " option-chip--selected" : ""}${unavailable ? " option-chip--unavailable" : ""}`}
                      key={option}
                      type="button"
                      aria-pressed={size === option}
                      aria-label={`${option}${unavailable ? ", sold out" : ""}`}
                      onClick={() => {
                        setSize(option);
                        setError("");
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              <button className="text-button" type="button" onClick={() => setSizeGuideOpen(true)}>
                Size guide
              </button>
            </fieldset>
          </div>

          {variant && !variant.available ? (
            <div className="sold-out-panel">
              <p className="eyebrow">YOUR SIZE SOLD OUT?</p>
              <p>Leave your email and we will connect this request to the PHENO restock service when it is configured.</p>
              <NotifyMeForm productSlug={product.slug} productName={product.name} colour={variant.colour} size={variant.size} />
            </div>
          ) : null}

          <div className="product-purchase__actions">
            <div className="quantity-control quantity-control--large" aria-label="Product quantity">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>−</button>
              <span>{quantity}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((current) => current + 1)}>+</button>
            </div>
            <button className="button button--dark button--wide" type="button" onClick={handleAddToCart}>
              Add to cart
            </button>
          </div>
          {error ? <p className="form-message form-message--error" role="alert">{error}</p> : null}

          <div className="purchase-reassurance">
            <p><strong>{variant?.available === false ? "Selected size unavailable" : "In stock"}</strong> · Ships within 1–2 working days.</p>
            <p>Free UK shipping on orders over £75.</p>
            <p>Easy returns, support at info@phenosportswear.com.</p>
          </div>
        </section>
      </div>

      <ProductFeatureStrip
        features={product.performanceFeaturesByColour?.[colour || product.colours[0]] ?? product.performanceFeatures}
      />

      <section className="product-information" aria-labelledby="product-information-title">
        <div className="product-information__intro">
          <p className="eyebrow">THE BUILD</p>
          <h2 id="product-information-title">Made for the work.</h2>
          <p>Technical details are kept visible, so you can understand what each piece is built to do.</p>
        </div>
        <div className="product-accordions">
          <details open>
            <summary>Product details</summary>
            <p>{product.description}</p>
          </details>
          <details>
            <summary>Construction</summary>
            <p>{product.construction}</p>
          </details>
          <details>
            <summary>Performance features</summary>
            <ul role="list">
              {product.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
          </details>
          <details>
            <summary>Fit &amp; sizing</summary>
            <p>Available in XS to 2XL. Use the <a className="text-link" href="/help/size-guide">PHENO Size Guide</a> for measurements.</p>
          </details>
          <details>
            <summary>Shipping &amp; returns</summary>
            <p>Free UK shipping on orders over £75. European and international rules will be confirmed before launch.</p>
          </details>
        </div>
      </section>

      {completeTheLook.length ? (
        <section className="complete-look" aria-labelledby="complete-look-title">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">COMPLETE THE LOOK</p>
              <h2 id="complete-look-title">Pair it with purpose.</h2>
            </div>
            <a className="text-link" href="/shop/type-1">View Type 1</a>
          </div>
          <div className="product-grid product-grid--recommendations">
            {completeTheLook.slice(0, 2).map((item) => <ProductCard key={item.slug} product={item} compact />)}
          </div>
        </section>
      ) : null}

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );
}
