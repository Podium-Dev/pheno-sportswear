import type { Metadata } from "next";
import { Breadcrumbs, EditorialPageIntro, StorefrontPage } from "@/components/StorefrontPage";

export const metadata: Metadata = {
  title: "Account | PHENO Sportswear",
  description: "PHENO customer account area, ready for the authentication integration.",
  alternates: { canonical: "/account" },
  openGraph: { title: "Account | PHENO Sportswear", description: "The PHENO customer account area.", url: "/account", type: "website" },
};

export default function AccountPage() {
  return (
    <StorefrontPage className="storefront-page--account">
      <div className="account-page">
        <Breadcrumbs current="Account" />
        <EditorialPageIntro eyebrow="PHENO CUSTOMER AREA" title="Account">
          Customer accounts are ready to connect once the authentication provider is selected.
        </EditorialPageIntro>
        <section className="account-page__panel" aria-labelledby="account-panel-title">
          <p className="eyebrow">COMING NEXT</p>
          <h2 id="account-panel-title">Your account will live here.</h2>
          <p>For now, your cart and favourites persist locally on this device. You do not need an account to browse the current range.</p>
          <a className="button button--dark" href="/shop">Shop the range</a>
        </section>
      </div>
    </StorefrontPage>
  );
}
