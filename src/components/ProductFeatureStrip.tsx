import type { CSSProperties } from "react";
import type { ProductFeature } from "@/data/products";

/*
 * The supplied 128px feature crops do not all share the same focal point.
 * Keep the artwork, but nudge each crop inside the shared circular frame so
 * every garment has the same considered presentation as the shorts.
 */
const FEATURE_ICON_TRANSFORMS: Record<string, string> = {
  "type-1-hoodie-features/adjustable-hood.png":
    "translate(-8.6%, -2.7%) scale(1.08)",
  "type-1-hoodie-features/fabric.png": "translate(-10.5%, -0.8%) scale(1.08)",
  "type-1-hoodie-features/reflective-detail.png":
    "translate(-9.4%, -0.8%) scale(1.08)",
  "type-1-hoodie-features/ribbed-finish.png":
    "translate(-9.8%, -0.8%) scale(1.08)",
  "type-1-hoodie-features/secure-storage.png":
    "translate(-10.2%, -0.8%) scale(1.08)",
  "type-1-hoodie-features/shape-retention.png":
    "translate(-9.8%, -0.8%) scale(1.08)",
  "type-1-hoodie-features/stretch-comfort.png":
    "translate(-10.5%, -0.8%) scale(1.08)",
  "type-1-joggers-features/4-way-stretch-fabric.png":
    "translate(2%, 0.8%) scale(1.08)",
  "type-1-joggers-features/articulated-knees.png":
    "translate(4.3%, 0.8%) scale(1.08)",
  "type-1-joggers-features/high-stretch-construction.png":
    "translate(-7%, 0.8%) scale(1.08)",
  "type-1-joggers-features/secure-storage.png":
    "translate(-5.5%, 0.8%) scale(1.08)",
  "type-1-joggers-features/smooth-matte-fabric.png":
    "translate(6.3%, 0.8%) scale(1.08)",
  "type-1-joggers-features/tapered-performance-fit.png":
    "translate(-2%, 0.8%) scale(1.08)",
  "type-1-tshirt-features/breathable-fabric.png":
    "translate(-2.3%, -2.7%) scale(1.08)",
  "type-1-tshirt-features/cooling-zones.png":
    "translate(1.2%, -3.1%) scale(1.08)",
  "type-1-tshirt-features/lightweight.png":
    "translate(8.2%, -2.7%) scale(1.08)",
  "type-1-tshirt-features/mesh-side-panels.png":
    "translate(-5.1%, -2.7%) scale(1.08)",
  "type-1-tshirt-features/quick-dry.png":
    "translate(-0.4%, -2.7%) scale(1.08)",
  "type-1-tshirt-features/reflective-detail.png":
    "translate(9%, -2.7%) scale(1.08)",
  "type-1-tshirt-features/stretch-jersey.png":
    "translate(2%, -2.7%) scale(1.08)",
  "type-1-tshirt-features/white/breathable-fabric.png":
    "translate(0.8%, -9.8%) scale(1.08)",
  "type-1-tshirt-features/white/cooling-zones.png":
    "translate(6.3%, -11.3%) scale(1.08)",
  "type-1-tshirt-features/white/lightweight.png":
    "translate(10.9%, -9.8%) scale(1.08)",
  "type-1-tshirt-features/white/mesh-side-panels.png":
    "translate(0%, -9.8%) scale(1.08)",
  "type-1-tshirt-features/white/quick-dry.png":
    "translate(3.5%, -10.5%) scale(1.08)",
  "type-1-tshirt-features/white/reflective-detail.png":
    "translate(11.7%, -11.3%) scale(1.08)",
  "type-1-tshirt-features/white/stretch-jersey.png":
    "translate(9%, -11.3%) scale(1.08)",
  "type-1-tank-features/black/breathable-fabric.png":
    "translate(2.3%, -5.1%) scale(1.08)",
  "type-1-tank-features/black/cooling-zones.png":
    "translate(9%, -5.1%) scale(1.08)",
  "type-1-tank-features/black/lightweight-stretch.png":
    "translate(9.4%, -5.1%) scale(1.08)",
  "type-1-tank-features/black/mesh-side-panels.png":
    "translate(4.3%, -5.1%) scale(1.08)",
  "type-1-tank-features/black/performance-fit.png":
    "translate(9.8%, -5.1%) scale(1.08)",
  "type-1-tank-features/black/quick-dry.png":
    "translate(7.8%, -5.1%) scale(1.08)",
  "type-1-tank-features/black/reflective-detail.png":
    "translate(9.8%, -5.1%) scale(1.08)",
  "type-1-tank-features/white/breathable-fabric.png":
    "translate(1.6%, 5.9%) scale(1.08)",
  "type-1-tank-features/white/cooling-zones.png":
    "translate(11.7%, 4.7%) scale(1.08)",
  "type-1-tank-features/white/lightweight.png":
    "translate(15.2%, 5.1%) scale(1.08)",
  "type-1-tank-features/white/mesh-side-panels.png":
    "translate(3.9%, 5.5%) scale(1.08)",
  "type-1-tank-features/white/quick-dry.png":
    "translate(8.2%, 5.1%) scale(1.08)",
  "type-1-tank-features/white/reflective-detail.png":
    "translate(17.2%, 4.7%) scale(1.08)",
  "type-1-tank-features/white/stretch-jersey.png":
    "translate(13.3%, 5.1%) scale(1.08)",
};

function getFeatureIconScale(image: string) {
  const featurePath = image.replace(/^\/images\//, "");

  if (featurePath.startsWith("type-1-hoodie-features/")) return "1.11";
  if (featurePath.startsWith("type-1-joggers-features/")) return "1.06";
  if (featurePath.startsWith("type-1-tshirt-features/")) return "1.05";
  if (featurePath.startsWith("type-1-tank-features/")) return "1.03";

  return "1";
}

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
              <div
                className={`product-feature-strip__image${feature.image.includes("/white/") ? " product-feature-strip__image--light" : ""}`}
              >
                <img
                  src={feature.image}
                  alt={feature.imageAlt}
                  loading="lazy"
                  decoding="async"
                  style={
                    {
                      "--_feature-icon-transform":
                        FEATURE_ICON_TRANSFORMS[feature.image.replace(/^\/images\//, "")],
                      "--_feature-icon-scale": getFeatureIconScale(feature.image),
                    } as CSSProperties
                  }
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
