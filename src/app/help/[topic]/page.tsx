import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqAccordions, SizeGuideContent } from "@/components/InfoBlocks";
import { Breadcrumbs, EditorialPageIntro, StorefrontPage } from "@/components/StorefrontPage";

const topics = {
  faq: { title: "FAQ", eyebrow: "PHENO HELP", description: "Useful answers about orders, sizing, products, and contact." },
  "size-guide": { title: "Size Guide", eyebrow: "PHENO FIT", description: "Use the current measurement guide to choose your PHENO size." },
  shipping: { title: "Shipping & Delivery", eyebrow: "PHENO DELIVERY", description: "Read the PHENO shipping and delivery policy, including delivery times, rates, and tracking." },
  returns: { title: "Refunds & Returns", eyebrow: "PHENO SUPPORT", description: "Read the PHENO returns and refund policy, including eligibility, exchanges, and defective items." },
} as const;

const shippingDeliverySections = [
  {
    title: "United Kingdom",
    paragraphs: [],
    items: [
      "Shipping Method: Royal Mail Tracked 48",
      "Standard Delivery: £4.95 (Free on orders over £75)",
      "Delivery Time: 2–3 working days",
      "Dispatch Time: Within 1 working day (excluding weekends)",
      "Tracking: Provided via email upon dispatch",
    ],
  },
  {
    title: "International Shipping",
    paragraphs: ["We currently ship to:"],
    items: [
      "Europe (Selected EU countries - free delivery on orders over £85)",
      "North America (USA, Canada)",
      "Middle East (UAE, Lebanon, Qatar)",
      "Australia & New Zealand",
    ],
  },
  {
    title: "International Rates",
    paragraphs: [
      "Europe | £11.95 | 2–11 working days (free on orders over £85)",
      "USA & Canada | £15.99 | 6–10 working days",
      "Middle East | £15.99 | 6–10 working days",
      "Australia/NZ | £15.99 | 7–12 working days",
      "*Note: Customs duties or local taxes (if applicable) are the responsibility of the customer.*",
    ],
    items: [],
  },
  {
    title: "Dispatch & Processing",
    paragraphs: [],
    items: [
      "Orders are dispatched within 1 working day (excluding weekends)",
      "Tracking details are sent via email once dispatched",
      "Weekend/holiday orders ship the next working day",
    ],
  },
  {
    title: "Undelivered Parcels",
    paragraphs: ["If your order is returned due to an incorrect address or failed delivery:"],
    items: ["We will contact you to arrange redelivery (a re-shipping fee may apply)"],
  },
] as const;

const refundsReturnsSections = [
  {
    title: "1. Returns Eligibility",
    paragraphs: [
      "Customers may request a return within 14 calendar days from the date of delivery. To be eligible for a return, all items must meet the following conditions:",
      "Returns that do not meet these criteria may be refused at our discretion.",
    ],
    items: ["Unworn and unwashed", "In original packaging, with tags intact", "Free of stains, damage, or odor"],
  },
  {
    title: "2. Non-Returnable Items",
    paragraphs: ["The following items are considered final sale and are not eligible for return or refund:"],
    items: ["Items marked “Sale”", "Gift cards", "Undergarments, base layers, or items with hygiene concerns"],
  },
  {
    title: "3. Return Process",
    paragraphs: [
      "To initiate a return, contact our team at info@phenosportswear.com within 14 days of receiving your order. Please include the following information:",
      "We will review your request and, if approved, provide return instructions and return address details. Return shipping costs are the responsibility of the customer, unless the item is faulty or incorrect.",
    ],
    items: ["Full name", "Order number", "Reason for return", "Photo(s) if the item is damaged or incorrect"],
  },
  {
    title: "4. Refunds",
    paragraphs: ["Once your return is received and inspected, we will notify you of the approval or rejection of your refund."],
    items: [
      "Approved refunds will be issued to the original payment method.",
      "Please allow up to 10 business days for the refund to appear in your account.",
      "Original shipping fees are non-refundable, unless the item was damaged or incorrect.",
    ],
  },
  {
    title: "5. Exchanges",
    paragraphs: ["We offer exchanges on eligible items pending stock availability. If your preferred size or item is unavailable, a refund will be issued."],
    items: [],
  },
  {
    title: "6. International Orders",
    paragraphs: ["Returns on international orders are accepted under the same 14-day policy. However, return shipping, duties, and customs fees are non-refundable and must be covered by the customer unless the item is incorrect or faulty."],
    items: [],
  },
  {
    title: "7. Defective or Incorrect Items",
    paragraphs: ["If you receive a defective or incorrect item, contact us immediately at info@phenosportswear.com with photos and a description of the issue. We will prioritise a replacement or refund at no cost to you."],
    items: [],
  },
] as const;

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

  const isPolicyPage = topic === "returns" || topic === "shipping";
  const policyPageClass = topic === "returns" ? "storefront-page--help-returns" : topic === "shipping" ? "storefront-page--help-shipping" : "";

  return (
    <StorefrontPage className={`storefront-page--help ${policyPageClass}`}>
      <div className="help-page">
        <Breadcrumbs current={detail.title} />
        <EditorialPageIntro eyebrow={detail.eyebrow} title={detail.title}>{isPolicyPage ? null : detail.description}</EditorialPageIntro>
        {topic === "faq" ? <FaqAccordions /> : null}
        {topic === "size-guide" ? <SizeGuideContent /> : null}
        {topic === "shipping" ? (
          <div className="help-content help-content--policy">
            <p className="help-policy__label">PHENO SHIPPING &amp; DELIVERY POLICY</p>
            <p className="help-policy__lead">We offer fast, tracked delivery to customers across the UK, Ireland, and selected international regions. Below you’ll find information about shipping methods, estimated delivery times, and rates.</p>
            {shippingDeliverySections.map((section) => (
              <section className="help-policy__section" key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.items.length ? (
                  <ul className="help-policy__list">
                    {section.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                ) : null}
              </section>
            ))}
            <section className="help-policy__section">
              <h2>Questions</h2>
              <p>For delivery support or order tracking, please contact:</p>
              <p><a className="text-link" href="mailto:info@phenosportswear.com">info@phenosportswear.com</a></p>
            </section>
          </div>
        ) : null}
        {topic === "returns" ? (
          <div className="help-content help-content--policy">
            <p className="help-policy__label">PHENO RETURNS &amp; REFUND POLICY</p>
            {refundsReturnsSections.map((section) => (
              <section className="help-policy__section" key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.items.length ? (
                  <ul className="help-policy__list">
                    {section.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                ) : null}
              </section>
            ))}
            <section className="help-policy__section">
              <h2>8. Questions</h2>
              <p>For questions regarding returns or refunds, please contact:</p>
              <p><a className="text-link" href="mailto:info@phenosportswear.com">info@phenosportswear.com</a></p>
            </section>
          </div>
        ) : null}
      </div>
    </StorefrontPage>
  );
}
