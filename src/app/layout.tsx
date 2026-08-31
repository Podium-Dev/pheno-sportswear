import type { Metadata } from "next";
import localFont from "next/font/local";
import { CommerceProvider } from "@/components/CommerceProvider";
import { ParallaxEffects } from "@/components/ParallaxEffects";
import "./styles.css";

const inter = localFont({
  src: "../../public/fonts/Inter-Variable.ttf",
  weight: "400",
  display: "swap",
  variable: "--font-inter",
});

const quantico = localFont({
  src: "../../public/fonts/Quantico-Regular.ttf",
  weight: "400",
  display: "swap",
  variable: "--font-quantico",
});

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
      <body className={`${inter.variable} ${quantico.variable}`}>
        <CommerceProvider>
          <ParallaxEffects />
          {children}
        </CommerceProvider>
      </body>
    </html>
  );
}

