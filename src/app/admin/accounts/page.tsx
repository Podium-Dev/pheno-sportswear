import type { Metadata } from "next";
import { AdminAccountApproval } from "@/components/AdminAccountApproval";
import { StorefrontPage } from "@/components/StorefrontPage";

export const metadata: Metadata = {
  title: "Account Approval | PHENO Sportswear",
  description: "Review PHENO customer account requests.",
  alternates: { canonical: "/admin/accounts" },
};

export default function AdminAccountsPage() {
  return (
    <StorefrontPage className="storefront-page--admin">
      <div className="admin-page">
        <AdminAccountApproval />
      </div>
    </StorefrontPage>
  );
}
