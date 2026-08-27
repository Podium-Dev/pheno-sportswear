import type { Metadata } from "next";
import { CartPageContent } from "@/components/CartPageContent";
import { Breadcrumbs, EditorialPageIntro, StorefrontPage } from "@/components/StorefrontPage";

export const metadata: Metadata = {
  title: "Cart | PHENO Sportswear",
  description: "Review your PHENO Sportswear selection.",
  alternates: { canonical: "/cart" },
  openGraph: { title: "Cart | PHENO Sportswear", description: "Review your PHENO selection.", url: "/cart", type: "website" },
};

export default function CartPage() {
  return (
    <StorefrontPage className="storefront-page--cart">
      <div className="cart-page">
        <Breadcrumbs current="Cart" />
        <EditorialPageIntro eyebrow="YOUR SELECTION" title="Cart" />
        <CartPageContent />
      </div>
    </StorefrontPage>
  );
}
