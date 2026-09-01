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
        <section className="contact-page__split" aria-labelledby="contact-title">
          <div className="contact-page__panel">
            <div className="contact-page__panel-inner">
              <div className="contact-page__intro">
                <p className="contact-page__eyebrow">GET IN TOUCH</p>
                <h1 id="contact-title">Here to help.</h1>
                <p>Questions about an order, a product, or the next step? We are here to help.</p>
              </div>
              <aside className="contact-page__aside" aria-label="Contact details">
                <div className="contact-page__detail">
                  <p className="contact-page__detail-label">Email</p>
                  <a className="contact-page__email" href="mailto:info@phenosportswear.com">info@phenosportswear.com</a>
                </div>
                <div className="contact-page__detail">
                  <p className="contact-page__detail-label">Response time</p>
                  <p>We aim to reply within 24 hours on weekdays.</p>
                </div>
                <div className="contact-page__detail contact-page__detail--wide">
                  <p className="contact-page__detail-label">Coaching enquiries</p>
                  <p>Visit <a className="text-link" href="/train-with-yousef">Train With Yousef</a>.</p>
                </div>
              </aside>
            </div>
          </div>
          <div id="contact-form" className="contact-page__form-pane">
            <div className="contact-page__form-card">
              <p className="contact-page__form-eyebrow">SEND A MESSAGE</p>
              <h2>Tell us what you need.</h2>
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </StorefrontPage>
  );
}
