import type { Metadata } from "next";
import { ContactForm } from "@/components/Forms";
import { Breadcrumbs, EditorialPageIntro, StorefrontPage } from "@/components/StorefrontPage";

export const metadata: Metadata = {
  title: "Contact | PHENO Sportswear",
  description: "Contact PHENO Sportswear about products, orders, sizing, and coaching.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact | PHENO Sportswear", description: "Contact the PHENO team.", url: "/contact", type: "website" },
};

export default function ContactPage() {
  return (
    <StorefrontPage className="storefront-page--contact">
      <div className="contact-page">
        <Breadcrumbs current="Contact" />
        <EditorialPageIntro eyebrow="PHENO SUPPORT" title="Contact">
          Questions about an order, a product, or the next step? We are here to help.
        </EditorialPageIntro>
        <div className="contact-page__layout">
          <aside className="contact-page__aside">
            <p className="eyebrow">EMAIL</p>
            <a className="contact-page__email" href="mailto:info@phenosportswear.com">info@phenosportswear.com</a>
            <p>We aim to reply within 24 hours on weekdays.</p>
            <p>For coaching enquiries, visit <a className="text-link" href="/train-with-yousef">Train With Yousef</a>.</p>
          </aside>
          <ContactForm />
        </div>
      </div>
    </StorefrontPage>
  );
}
