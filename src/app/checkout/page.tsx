import type { Metadata } from "next";
import { CheckoutExperience } from "@/components/CheckoutExperience";
import {
  Breadcrumbs,
  EditorialPageIntro,
  StorefrontPage,
} from "@/components/StorefrontPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout | PHENO Sportswear",
  description: "Complete a PHENO development checkout.",
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage() {
  return (
    <StorefrontPage className="storefront-page--checkout">
      <div className="checkout-page">
        <Breadcrumbs current="Checkout" />
        <EditorialPageIntro
          eyebrow="SECURE CHECKOUT"
          title="Complete your order."
        >
          Guest checkout preview powered by Medusa.
        </EditorialPageIntro>
        <CheckoutExperience />
      </div>
    </StorefrontPage>
  );
}
