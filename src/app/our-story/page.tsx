import type { Metadata } from "next";
import { EditorialPageIntro, StorefrontPage } from "@/components/StorefrontPage";

export const metadata: Metadata = {
  title: "Our Story | PHENO Sportswear",
  description: "The PHENO philosophy, the phoenix, and the idea behind Pursue the Rise.",
  alternates: { canonical: "/our-story" },
  openGraph: { title: "Our Story | PHENO Sportswear", description: "The PHENO philosophy, Pursue the Rise.", url: "/our-story", type: "website" },
};

export default function OurStoryPage() {
  return (
    <StorefrontPage className="storefront-page--story">
      <div className="story-page">

        <EditorialPageIntro eyebrow="PHENO / THE IDEA" title="Pursue the rise">
          PHENO is built around the belief that your starting point does not determine your potential.
        </EditorialPageIntro>

        <section className="story-hero" aria-labelledby="story-hero-title">
          <div className="story-hero__media">
            <div className="story-hero__image">
              <img
                src="/images/editorial-left.jpg"
                alt="Runners moving together on a track at sunrise"
              />
            </div>
            <div className="story-hero__media-meta" aria-hidden="true">
              <span>01</span>
              <span>The work continues</span>
            </div>
          </div>
          <div className="story-hero__copy">
            <p className="eyebrow">PHENOTYPE</p>
            <h2 id="story-hero-title">What you show is only the beginning.</h2>
            <p>
              PHENO comes from phenotype, the observable characteristics and physical expression of an individual. We make performance pieces for the work of shaping what comes next.
            </p>
            <div className="story-hero__copy-footer">
              <span className="story-hero__copy-rule" aria-hidden="true" />
              <a className="story-hero__link" href="/shop/type-1">
                Explore Type 1 <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="story-section" aria-labelledby="phoenix-title">
          <div className="story-section__heading">
            <p className="eyebrow">THE PHOENIX</p>
            <h2 id="phoenix-title">Built through adversity.</h2>
            <span className="story-section__index" aria-hidden="true">02 / THE SYMBOL</span>
          </div>
          <div className="story-section__copy">
            <div className="story-section__icon" aria-hidden="true">
              <svg viewBox="0 0 64 64" focusable="false">
                <path d="M32 7 20 18l-9 2 7 10-4 16 18-11 18 11-4-16 7-10-9-2L32 7Z" />
                <path d="M32 17v30M22 24l10 8 10-8" />
              </svg>
            </div>
            <div className="story-section__copy-text">
              <p>
                The phoenix is a reminder of resilience, rebirth, transformation, and discipline. It represents the decision to rise again, with more clarity and more intent than before.
              </p>
              <p>
                That is the PHENO mindset: make the next session count, keep moving through the difficult part, and pursue the rise.
              </p>
            </div>
          </div>
        </section>

        <section className="story-principles" aria-labelledby="principles-title">
          <p className="eyebrow">THE PRINCIPLES</p>
          <h2 id="principles-title">Performance with purpose.</h2>
          <div className="story-principles__grid">
            <article>
              <span className="story-principles__number">01</span>
              <h3>Discipline</h3>
              <p>Show up for the work, especially when motivation is not there.</p>
              <svg className="story-principles__icon" viewBox="0 0 44 44" aria-hidden="true" focusable="false">
                <path d="m22 5 12 5v10c0 8-5.2 14.3-12 18-6.8-3.7-12-10-12-18V10l12-5Z" />
              </svg>
            </article>
            <article>
              <span className="story-principles__number">02</span>
              <h3>Resilience</h3>
              <p>Use the difficult days as part of the process, not proof that you should stop.</p>
              <svg className="story-principles__icon" viewBox="0 0 44 44" aria-hidden="true" focusable="false">
                <path d="m5 35 11-14 7 7 9-15 7 22H5Z" />
                <path d="M31 13h8v8" />
              </svg>
            </article>
            <article>
              <span className="story-principles__number">03</span>
              <h3>Expression</h3>
              <p>Build a physical practice that reflects the person you are becoming.</p>
              <svg className="story-principles__icon" viewBox="0 0 44 44" aria-hidden="true" focusable="false">
                <path d="m22 5 7 10 10 7-10 7-7 10-7-10-10-7 10-7 7-10Z" />
                <path d="M22 15v14M15 22h14" />
              </svg>
            </article>
          </div>
        </section>

        <section className="founder-section" aria-labelledby="founder-title">
          <div className="founder-section__media">
            <span className="founder-section__media-meta" aria-hidden="true">04 / THE FOUNDER</span>
            <img src="/images/pheno-banner.jpg" alt="Athlete training in PHENO sportswear on a field" />
          </div>
          <div className="founder-section__copy">
            <p className="eyebrow">THE FOUNDER</p>
            <h2 id="founder-title">Yousef Jaafar</h2>
            <span className="founder-section__rule" aria-hidden="true" />
            <p>
              Yousef founded PHENO around a clear idea: the work matters as much as the outcome. The collection is made for people who keep moving toward what comes next.
            </p>
            <p>A practice built on discipline, resilience, and the decision to keep showing up.</p>
            <a className="button button--dark" href="/train-with-yousef">Train with Yousef</a>
          </div>
        </section>
      </div>
    </StorefrontPage>
  );
}
