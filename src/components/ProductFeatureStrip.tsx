import type { CSSProperties } from "react";
import type { ProductFeature } from "@/data/products";

export function ProductFeatureStrip({ features }: { features: ProductFeature[] }) {
  if (!features.length) return null;

  return (
    <section className="product-feature-strip" aria-label="Product performance features">
      <ul
        className="product-feature-strip__list"
        role="list"
        style={{ "--_feature-count": features.length } as CSSProperties}
      >
        {features.map((feature) => (
          <li className="product-feature-strip__item" key={feature.id}>
            <figure>
              <div className="product-feature-strip__image">
                <img
                  src={feature.image}
                  alt={feature.imageAlt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                <strong>{feature.title}</strong>
                <span>{feature.description}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
