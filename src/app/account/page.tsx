import "./account.css";
import type { Metadata } from "next";
import { AccountExperience } from "@/components/AccountExperience";
import { Breadcrumbs, StorefrontPage } from "@/components/StorefrontPage";

export const metadata: Metadata = {
  title: "Account | PHENO Sportswear",
  description: "Manage your PHENO orders, delivery details and account preferences.",
  alternates: { canonical: "/account" },
  openGraph: { title: "Account | PHENO Sportswear", description: "Manage your PHENO orders, delivery details and account preferences.", url: "/account", type: "website" },
};

export default function AccountPage() {
  return (
    <StorefrontPage className="storefront-page--account">
      <div className="account-page">
        <Breadcrumbs current="Account" />
        <AccountExperience />
      </div>
    </StorefrontPage>
  );
}
