import type { Metadata } from "next";
import { CollectionPage } from "@/components/CollectionPage";

export const metadata: Metadata = {
  title: "Shop PHENO | Type 1 Performance Sportswear",
  description: "Shop the current PHENO Type 1 performance sportswear range.",
  alternates: { canonical: "/shop" },
  openGraph: { title: "Shop PHENO", description: "The current PHENO Type 1 range.", url: "/shop", type: "website" },
};

export default function ShopPage() {
  return <CollectionPage collection="all" />;
}
