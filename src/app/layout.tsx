import type { Metadata } from "next";
import { CommerceProvider } from "@/components/CommerceProvider";
import { EarlyAccessModal } from "@/components/EarlyAccessModal";
import { ParallaxEffects } from "@/components/ParallaxEffects";
import { getCatalogProducts } from "@/lib/commerce/catalog";
import "./styles.css";

export const metadata: Metadata = {
  title: "PHENO Sportswear | Pursue the Rise",
  description:
    "Performance sportswear built for movement, discipline and the work it takes to become more.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://pheno-sportswear-production.up.railway.app",
  ),
  alternates: { canonical: "/" },
  openGraph: {
    title: "PHENO Sportswear | Pursue the Rise",
    description: "Performance sportswear built for movement, discipline and the work it takes to become more.",
    type: "website",
    url: "/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const catalogProducts = await getCatalogProducts();

  return (
    <html lang="en-GB">
      <body>
        <CommerceProvider catalogProducts={catalogProducts}>
          <ParallaxEffects />
          {children}
          <EarlyAccessModal />
        </CommerceProvider>
      </body>
    </html>
  );
}

