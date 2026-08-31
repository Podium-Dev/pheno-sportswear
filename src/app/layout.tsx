import type { Metadata } from "next";
import { CommerceProvider } from "@/components/CommerceProvider";
import { ParallaxEffects } from "@/components/ParallaxEffects";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body>
        <CommerceProvider>
          <ParallaxEffects />
          {children}
        </CommerceProvider>
      </body>
    </html>
  );
}

