"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  getProductImage,
  getVariant,
  products,
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
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const images = product.galleryImagesByColour?.[colour] ?? product.images;
  const activeImageIndex = Math.max(images.indexOf(activeImage), 0);
  const displayedImage = images[activeImageIndex] ?? activeImage;

  const moveImage = (direction: -1 | 1) => {
    if (images.length < 2) return;
    const nextIndex = (activeImageIndex + direction + images.length) % images.length;
    setActiveImage(images[nextIndex]);
  };

  useEffect(() => {
    setActiveImage(getProductImage(product, colour));
    setIsZoomOpen(false);
  }, [colour, product]);

  useEffect(() => {
    if (!isZoomOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsZoomOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isZoomOpen]);

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        {images.length > 1 ? (
          <>
            <button
              className="product-gallery__main-control product-gallery__main-control--previous"
              type="button"
              aria-label={`Previous ${product.name} image`}
              onClick={() => moveImage(-1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m14.5 5-7 7 7 7" />
              </svg>
            </button>
            <button
              className="product-gallery__main-control product-gallery__main-control--next"
              type="button"
              aria-label={`Next ${product.name} image`}
              onClick={() => moveImage(1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9.5 5 7 7-7 7" />
              </svg>
            </button>
          </>
        ) : null}
        <button
          className="product-gallery__zoom-control"
          type="button"
          aria-label={`View ${product.name} image larger`}
          onClick={() => setIsZoomOpen(true)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="5.5" />
            <path d="m15 15 5 5M10.5 7.5v6M7.5 10.5h6" />
          </svg>
        </button>
        <img src={displayedImage} alt={`${product.name} in ${colour}`} />
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
      {isZoomOpen ? (
        <div className="product-gallery__lightbox" role="presentation">
          <button
            className="product-gallery__lightbox-backdrop"
            type="button"
            aria-label="Close larger product image"
            onClick={() => setIsZoomOpen(false)}
          />
          <section
            className="product-gallery__lightbox-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} larger image`}
          >
            <button
              className="product-gallery__lightbox-close"
              type="button"
              aria-label="Close larger product image"
              onClick={() => setIsZoomOpen(false)}
            >
              ×
            </button>
            <img src={displayedImage} alt={`${product.name} in ${colour}`} />
          </section>
        </div>
      ) : null}
    </div>
  );
}

function ProductEngineeredDetails({ details }: { details: NonNullable<Product["engineeredDetails"]> }) {
  const [titleLead, ...titleRest] = details.title.split(" ");

  return (
    <section className="engineered-details" aria-labelledby="engineered-details-title">
      <h2 id="engineered-details-title">
        <span className="engineered-details__title-accent">{titleLead}</span>
        {titleRest.length ? ` ${titleRest.join(" ")}` : null}
      </h2>
      <div className="engineered-details__layout">
        <div className="engineered-details__visual">
          <img src={details.image} alt={details.imageAlt} loading="lazy" decoding="async" />
          <ol className="engineered-details__markers" aria-label="Engineered detail markers">
            {details.details.map((detail) => (
              <li
                key={detail.number}
                className={`engineered-details__marker engineered-details__marker--line-${detail.marker.line}`}
                style={{
                  top: detail.marker.top,
                  left: detail.marker.left,
                  "--marker-line-length": detail.marker.lineLength,
                } as CSSProperties}
                aria-label={`${detail.number}. ${detail.title}`}
              >
                <span aria-hidden="true">{detail.number}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="engineered-details__content">
          <ol className="engineered-details__list" aria-label="Engineered construction details">
            {details.details.map((detail) => (
              <li className="engineered-details__item" key={detail.number}>
                <span className="engineered-details__number" aria-hidden="true">{detail.number}</span>
                <div>
                  <h3>{detail.title}</h3>
                  <p>{detail.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <a className="button button--dark engineered-details__cta" href="#product-purchase">
            Buy Now
          </a>
        </div>
      </div>
    </section>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart, isWishlisted, toggleWishlist } = useCommerce();
  const colour: Colour = product.colours[0] ?? "Black";
  const [size, setSize] = useState<Size | "">("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const variant = colour && size ? getVariant(product, colour, size) : undefined;
  const wishlisted = isWishlisted(product.slug);
  const completeTheLook = useMemo(
    () => products.filter((item) => item.slug !== product.slug),
    [product.slug],
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

        <section className="product-purchase" id="product-purchase" aria-labelledby="product-title">
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
            <div className="product-colour-readout" aria-label={`Colour, ${colour}`}>
              <span className="product-colour-readout__label">Colour</span>
              <span className={`product-colour-readout__swatch product-colour-readout__swatch--${colour.toLowerCase()}`} aria-hidden="true" />
              <strong>{colour}</strong>
            </div>
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

      {product.engineeredDetails ? <ProductEngineeredDetails details={product.engineeredDetails} /> : null}

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
            {completeTheLook.map((item) => <ProductCard key={item.slug} product={item} compact />)}
          </div>
        </section>
      ) : null}

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );
}
