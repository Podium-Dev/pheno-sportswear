import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "PHENO Sportswear | Pursue the Rise",
  description:
    "Performance sportswear built for those who refuse to stay down.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
