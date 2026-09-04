import type { Metadata } from "next";
import { StorefrontPage } from "@/components/StorefrontPage";
import "./core-values.css";

export const metadata: Metadata = {
  title: "Core Values | PHENO Sportswear",
  description: "The core values behind PHENO Sportswear.",
  alternates: { canonical: "/core-values" },
  openGraph: {
    title: "Core Values | PHENO Sportswear",
    description: "The core values behind PHENO Sportswear.",
    url: "/core-values",
    type: "website",
  },
};

const coreValues = [
  {
    title: "Legacy",
    description: "We're not here for trends. We're here to leave a mark. What we build today echoes tomorrow.",
  },
  {
    title: "Evolution",
    description: "Change isn't optional. It's who we are.",
  },
  {
    title: "Authenticity",
    description: "No filters. No hype. Just raw, real progress.",
  },
  {
    title: "Discipline",
    description: "No shortcuts. Just the grind, every damn day.",
  },
  {
    title: "Excellence",
    description: "Good isn't good enough. We chase greatness.",
  },
  {
    title: "Resilience",
    description: "Fall. Rise. Repeat.",
  },
] as const;

export default function CoreValuesPage() {
  return (
    <StorefrontPage className="storefront-page--core-values">
      <div className="core-values-page">
        <section className="core-values-hero" aria-labelledby="core-values-title">
          <div className="core-values-hero__copy">
            <p className="core-values-hero__eyebrow">Core values</p>
            <h1 id="core-values-title">Core Values</h1>
            <div className="core-values-hero__motto" aria-label="PHENO, Pursue The Rise.">
              <span>PHENO</span>
              <span>Pursue The Rise.</span>
            </div>
          </div>
          <div className="core-values-hero__media">
            <img src="/images/pheno-banner.jpg" alt="PHENO athlete training outdoors" />
            <span className="core-values-hero__media-rule" aria-hidden="true" />
          </div>
        </section>

        <section className="core-values-list" aria-labelledby="core-values-list-title">
          <h2 className="visually-hidden" id="core-values-list-title">Core Values</h2>
          <div className="core-values-list__grid">
            {coreValues.map((value, index) => (
              <article className={`core-value-card core-value-card--${index + 1}`} key={value.title}>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StorefrontPage>
  );
}
