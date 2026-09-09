import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { StorefrontPage } from "@/components/StorefrontPage";

export const metadata: Metadata = {
  title: "Order confirmation | PHENO Sportswear",
  description: "PHENO development order confirmation.",
  robots: { index: false, follow: false },
};

export default function OrderConfirmationPage() {
  return (
    <StorefrontPage className="storefront-page--order-confirmation">
      <div className="order-confirmation-page">
        <OrderConfirmation />
      </div>
    </StorefrontPage>
  );
}
