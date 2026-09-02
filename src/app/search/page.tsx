import type { Metadata } from "next";
import { SearchPageContent } from "@/components/SearchPageContent";
import { Breadcrumbs, EditorialPageIntro, StorefrontPage } from "@/components/StorefrontPage";
import { getCatalogProducts } from "@/lib/commerce/catalog";

export const metadata: Metadata = {
  title: "Search | PHENO Sportswear",
  description: "Search the PHENO Type 1 performance sportswear range.",
  alternates: { canonical: "/search" },
  openGraph: { title: "Search | PHENO Sportswear", description: "Search the PHENO performance range.", url: "/search", type: "website" },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const catalogProducts = await getCatalogProducts();
  return (
    <StorefrontPage className="storefront-page--search">
      <div className="search-page">
        <Breadcrumbs current="Search" />
        <EditorialPageIntro eyebrow="FIND YOUR PIECE" title="Search" />
        <SearchPageContent initialQuery={q} products={catalogProducts} />
      </div>
    </StorefrontPage>
  );
}
