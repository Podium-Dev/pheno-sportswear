import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/CollectionPage";
import { collectionLabels } from "@/data/products";

export function generateStaticParams() {
  return Object.keys(collectionLabels)
    .filter((collection) => collection !== "all")
    .map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const label = collectionLabels[category];
  if (!label || category === "all") return {};
  return {
    title: `${label} | PHENO Sportswear`,
    description: `Explore the PHENO ${label} range.`,
    alternates: { canonical: `/shop/${category}` },
    openGraph: { title: `${label} | PHENO Sportswear`, description: `Explore the PHENO ${label} range.`, url: `/shop/${category}`, type: "website" },
  };
}

export default async function ShopCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!collectionLabels[category] || category === "all") notFound();
  return <CollectionPage collection={category} />;
}
