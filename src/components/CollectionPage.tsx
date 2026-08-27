import {
  bundles,
  collectionLabels,
  getProductsForCollection,
} from "@/data/products";
import { BundleCard } from "@/components/BundleCard";
import { ProductGrid } from "@/components/ProductGrid";
import { Breadcrumbs, EditorialPageIntro, StorefrontPage } from "@/components/StorefrontPage";

const collectionDescriptions: Record<string, string> = {
  all: "The current PHENO range, built around the Type 1 performance system.",
  "type-1": "A focused performance range designed to move with you through every session.",
  tops: "Technical layers for warm-ups, hard sessions, and the work between them.",
  bottoms: "Movement-first foundations, built for training without distraction.",
  "t-shirts": "Lightweight performance tops with ventilation where it matters.",
  tanks: "Open, breathable layers for high-output training.",
  hoodies: "Warm-up and recovery layers with stretch built into the construction.",
  shorts: "Supportive training shorts with stretch, liner, and ventilation zones.",
  joggers: "A tapered, high-stretch layer for training and recovery.",
};

export function CollectionPage({ collection }: { collection: string }) {
  const label = collectionLabels[collection] || "Shop";
  const products = getProductsForCollection(collection);
  const isSets = collection === "sets";

  return (
    <StorefrontPage className="storefront-page--catalogue">
      <div className="catalogue-page">
        <Breadcrumbs current={label} />
        <EditorialPageIntro eyebrow="PHENO SPORTSWEAR" title={label}>
          {isSets
            ? "Two deliberate combinations from the Type 1 range. Choose the size for each piece, then add the complete set to your cart."
            : collectionDescriptions[collection]}
        </EditorialPageIntro>

        {isSets ? (
          <div className="bundle-grid">
            {bundles.map((bundle) => <BundleCard key={bundle.id} bundle={bundle} />)}
          </div>
        ) : (
          <>
            <div className="catalogue-summary">
              <span>{products.length} pieces</span>
              <span>Type 1 / Current range</span>
            </div>
            <ProductGrid products={products} />
          </>
        )}
      </div>
    </StorefrontPage>
  );
}
