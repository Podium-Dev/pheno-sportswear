import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, StorefrontPage } from "@/components/StorefrontPage";
import { ProductDetail } from "@/components/ProductDetail";
import { getCatalogProductBySlug, getCatalogProducts } from "@/lib/commerce/catalog";

export async function generateStaticParams() {
  const catalogProducts = await getCatalogProducts();
  return catalogProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  if (!product) return { title: "Product not found | PHENO Sportswear" };
  return {
    title: `${product.name} | PHENO Sportswear`,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { title: product.name, description: product.description, url: `/product/${product.slug}`, type: "website", images: [{ url: product.images[0], alt: product.name }] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, catalogProducts] = await Promise.all([
    getCatalogProductBySlug(slug),
    getCatalogProducts(),
  ]);
  if (!product) notFound();

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: "PHENO" },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currencyCode || "GBP",
      price: product.price.toFixed(2),
      availability: product.variants.some((variant) => variant.available)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `/product/${product.slug}`,
    },
  };

  return (
    <StorefrontPage className="storefront-page--product">
      <div className="product-page">
        <Breadcrumbs current={product.name} />
        <ProductDetail product={product} catalogProducts={catalogProducts} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }} />
      </div>
    </StorefrontPage>
  );
}
