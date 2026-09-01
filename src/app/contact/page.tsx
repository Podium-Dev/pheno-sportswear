import type { Metadata } from "next";
import { ContactForm } from "@/components/Forms";
import { StorefrontPage } from "@/components/StorefrontPage";

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
        <section className="contact-hero" aria-labelledby="contact-hero-title">
          <img className="contact-hero__mark" src="/images/pheno-hero-mark.png" alt="" aria-hidden="true" />
          <div className="contact-hero__inner">
            <div className="contact-hero__copy">
              <p className="contact-hero__eyebrow">PHENO SUPPORT</p>
              <h1 id="contact-hero-title"><span>Here to</span><span>help.</span></h1>
              <p>Questions about an order, a product, or the next step? We are here to help.</p>
              <a className="contact-hero__cta" href="#contact-form">
                <span>Send a message</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
        <div id="contact-form" className="contact-page__layout">
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
