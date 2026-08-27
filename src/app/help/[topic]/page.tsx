import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqAccordions, SizeGuideContent } from "@/components/InfoBlocks";
import { Breadcrumbs, EditorialPageIntro, StorefrontPage } from "@/components/StorefrontPage";
import { shippingConfig } from "@/data/site";

const topics = {
  faq: { title: "FAQ", eyebrow: "PHENO HELP", description: "Useful answers about orders, sizing, products, and contact." },
  "size-guide": { title: "Size Guide", eyebrow: "PHENO FIT", description: "Use the current measurement guide to choose your PHENO size." },
  shipping: { title: "Shipping", eyebrow: "PHENO DELIVERY", description: "Current shipping information, with international rules kept ready to update." },
  returns: { title: "Returns", eyebrow: "PHENO SUPPORT", description: "Returns information and how to get help with an existing order." },
} as const;

export function generateStaticParams() {
  return Object.keys(topics).map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const detail = topics[topic as keyof typeof topics];
  if (!detail) return { title: "Help | PHENO Sportswear" };
  return {
    title: `${detail.title} | PHENO Sportswear`,
    description: detail.description,
    alternates: { canonical: `/help/${topic}` },
    openGraph: { title: `${detail.title} | PHENO Sportswear`, description: detail.description, url: `/help/${topic}`, type: "website" },
  };
}

export default async function HelpPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const detail = topics[topic as keyof typeof topics];
  if (!detail) notFound();

  return (
    <StorefrontPage className="storefront-page--help">
      <div className="help-page">
        <Breadcrumbs current={detail.title} />
        <EditorialPageIntro eyebrow={detail.eyebrow} title={detail.title}>{detail.description}</EditorialPageIntro>
        {topic === "faq" ? <FaqAccordions /> : null}
        {topic === "size-guide" ? <SizeGuideContent /> : null}
        {topic === "shipping" ? (
          <div className="help-content">
            <h2>Current delivery information</h2>
            <p>{shippingConfig.uk}</p>
            <h2>Europe and international</h2>
            <p>{shippingConfig.international}</p>
            <p>For an existing order, email <a className="text-link" href="mailto:info@phenosportswear.com">info@phenosportswear.com</a>.</p>
          </div>
        ) : null}
        {topic === "returns" ? (
          <div className="help-content">
            <h2>Returns support</h2>
            <p>{shippingConfig.returns}</p>
            <p>Before sending an item back, contact PHENO with your order details so the correct process can be confirmed.</p>
            <a className="button button--dark" href="/contact">Contact PHENO</a>
          </div>
        ) : null}
      </div>
    </StorefrontPage>
  );
}
