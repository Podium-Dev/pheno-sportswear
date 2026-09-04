import type { Metadata } from "next";
import {
  IconAward,
  IconChartBar,
  IconFingerprint,
  IconMountain,
  IconSettings,
  IconStar,
} from "@tabler/icons-react";
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
    principle: "More than a moment",
    Icon: IconAward,
  },
  {
    title: "Evolution",
    description: "Change isn't optional. It's who we are.",
    principle: "Always level up",
    Icon: IconChartBar,
  },
  {
    title: "Authenticity",
    description: "No filters. No hype. Just raw, real progress.",
    principle: "Real people, real progress",
    Icon: IconFingerprint,
  },
  {
    title: "Discipline",
    description: "No shortcuts. Just the grind, every damn day.",
    principle: "Consistency creates freedom",
    Icon: IconSettings,
  },
  {
    title: "Excellence",
    description: "Good isn't good enough. We chase greatness.",
    principle: "Higher standards, stronger tomorrows",
    Icon: IconStar,
  },
  {
    title: "Resilience",
    description: "Fall. Rise. Repeat.",
    principle: "Built to go further",
    Icon: IconMountain,
  },
] as const;

export default function CoreValuesPage() {
  return (
    <StorefrontPage className="storefront-page--core-values">
      <div className="core-values-page">
        <section className="core-values-hero" aria-labelledby="core-values-title">
          <img className="core-values-hero__image" src="/images/pheno-banner.jpg" alt="PHENO athlete training" />
          <div className="core-values-hero__veil" aria-hidden="true" />
          <div className="core-values-hero__copy">
            <p className="core-values-hero__eyebrow">Our foundation</p>
            <h1 id="core-values-title">Core Values</h1>
            <p className="core-values-hero__intro">More than a brand. A mindset. These are the principles that drive everything we do.</p>
            <span className="core-values-hero__rule" aria-hidden="true" />
            <p className="core-values-hero__motto">Pursue the rise</p>
          </div>
        </section>

        <section className="core-values-list" aria-labelledby="core-values-list-title">
          <h2 className="visually-hidden" id="core-values-list-title">Core Values</h2>
          {coreValues.map(({ title, description, principle, Icon }, index) => (
            <article className="core-value" key={title}>
              <span className="core-value__number">0{index + 1}</span>
              <span className="core-value__icon"><Icon size={37} stroke={1.8} aria-hidden="true" /></span>
              <div className="core-value__content">
                <h3>{title}</h3>
                <p>{description}</p>
                {title === "Resilience" ? <p className="core-value__signature"><strong>PHENO</strong><span>Pursue The Rise.</span></p> : null}
              </div>
              <p className="core-value__principle">{principle}</p>
            </article>
          ))}
        </section>

        <section className="core-values-cta" aria-labelledby="core-values-cta-title">
          <img src="/images/campaign-athlete.jpg" alt="PHENO training equipment" />
          <div className="core-values-cta__veil" aria-hidden="true" />
          <div className="core-values-cta__content">
            <p>Join the movement</p>
            <h2 id="core-values-cta-title">Pursue the rise.</h2>
            <span>Performance starts with purpose.</span>
            <a href="/shop" className="core-values-cta__button">Shop now <span aria-hidden="true">›</span></a>
          </div>
        </section>
      </div>
    </StorefrontPage>
  );
}
