import type { Metadata } from "next";
import { Breadcrumbs, EditorialPageIntro, StorefrontPage } from "@/components/StorefrontPage";

export const metadata: Metadata = {
  title: "Privacy & Cookies | PHENO Sportswear",
  description: "Privacy and cookie information for the PHENO Sportswear preview website.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy & Cookies | PHENO Sportswear", description: "PHENO privacy and cookie information.", url: "/privacy", type: "website" },
};

export default function PrivacyPage() {
  return (
    <StorefrontPage className="storefront-page--help">
      <div className="help-page">
        <Breadcrumbs current="Privacy & Cookies" />
        <EditorialPageIntro eyebrow="PHENO INFORMATION" title="Privacy & cookies">
          This preview site does not yet have a production customer account or payment integration.
        </EditorialPageIntro>
        <div className="help-content">
          <h2>What is active in this preview</h2>
          <p>Your cart and favourites are stored locally in your browser so the storefront can be tested. No payment is taken and no customer account is created.</p>
          <h2>Questions</h2>
          <p>For privacy questions, contact <a className="text-link" href="mailto:info@phenosportswear.com">info@phenosportswear.com</a>.</p>
        </div>
      </div>
    </StorefrontPage>
  );
}
