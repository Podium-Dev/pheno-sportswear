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
          <div className="story-hero__image">
            <video
              src="/videos/social-04.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label="PHENO athlete training for the Pursue the Rise campaign"
            />
          </div>
          <div className="story-hero__copy">
            <p className="eyebrow">PHENOTYPE</p>
            <h2 id="story-hero-title">What you show is only the beginning.</h2>
            <p>
              PHENO comes from phenotype, the observable characteristics and physical expression of an individual. We make performance pieces for the work of shaping what comes next.
            </p>
          </div>
        </section>

        <section className="story-section" aria-labelledby="phoenix-title">
          <div>
            <p className="eyebrow">THE PHOENIX</p>
            <h2 id="phoenix-title">Built through adversity.</h2>
          </div>
          <div className="story-section__copy">
            <p>
              The phoenix is a reminder of resilience, rebirth, transformation, and discipline. It represents the decision to rise again, with more clarity and more intent than before.
            </p>
            <p>
              That is the PHENO mindset, make the next session count, keep moving through the difficult part, and pursue the rise.
            </p>
          </div>
        </section>

        <section className="story-principles" aria-labelledby="principles-title">
          <p className="eyebrow">THE PRINCIPLES</p>
          <h2 id="principles-title">Performance with purpose.</h2>
          <div className="story-principles__grid">
            <article><span>01</span><h3>Discipline</h3><p>Show up for the work, especially when motivation is not there.</p></article>
            <article><span>02</span><h3>Resilience</h3><p>Use the difficult days as part of the process, not proof that you should stop.</p></article>
            <article><span>03</span><h3>Expression</h3><p>Build a physical practice that reflects the person you are becoming.</p></article>
          </div>
        </section>

        <section className="founder-section" aria-labelledby="founder-title">
          <div className="founder-section__media">
            <img src="/images/pheno-banner.jpg" alt="Athlete training in PHENO sportswear on a field" />
          </div>
          <div>
            <p className="eyebrow">THE FOUNDER</p>
            <h2 id="founder-title">Yousef Jaafar</h2>
            <p>
              Yousef founded PHENO with a focus on performance, discipline, and the belief that people can build beyond the circumstances they start with.
            </p>
            <p>Founder biography and final photography will be added once supplied.</p>
            <a className="button button--dark" href="/train-with-yousef">Train with Yousef</a>
          </div>
        </section>
      </div>
    </StorefrontPage>
  );
}
