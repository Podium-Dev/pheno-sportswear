import type { Metadata } from "next";
import { CommerceProvider } from "@/components/CommerceProvider";
import "./styles.css";

export const metadata: Metadata = {
  title: "PHENO Sportswear | Pursue the Rise",
  description:
    "Performance sportswear built for those who refuse to stay down.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://pheno-sportswear-production.up.railway.app",
  ),
  alternates: { canonical: "/" },
  openGraph: {
    title: "PHENO Sportswear | Pursue the Rise",
    description: "Performance sportswear built for those who refuse to stay down.",
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
      <body><CommerceProvider>{children}</CommerceProvider></body>
    </html>
  );
}
