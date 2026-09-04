import type { Metadata } from "next";
import { CoachingCommunity } from "@/components/CoachingCommunity";
import { StorefrontPage } from "@/components/StorefrontPage";

export const metadata: Metadata = {
  title: "Train With Yousef | PHENO Sportswear",
  description: "Book one to one boxing coaching with Yousef Jaafar.",
  alternates: { canonical: "/train-with-yousef" },
  openGraph: { title: "Train With Yousef", description: "Book one to one boxing coaching with Yousef Jaafar.", url: "/train-with-yousef", type: "website" },
};

export default function TrainWithYousefPage() {
  return (
    <StorefrontPage className="storefront-page--coaching">
      <div className="coaching-page">

        <section className="coaching-hero" aria-labelledby="coaching-title">
          <div className="coaching-hero__copy">
            <p className="eyebrow">PHENO COACHING</p>
            <h1 id="coaching-title">Train with Yousef.</h1>
            <p>Boxing coaching built around your goals, your level, and the work required to move forward.</p>
            <div className="coaching-hero__actions">
              <a className="button button--dark" href="#register-interest">Book a 1:1</a>
              <a className="text-link" href="#register-interest">Register interest</a>
            </div>
          </div>
          <div className="coaching-hero__visual">
            <img src="/images/yousef-coaching-hero.png" alt="Yousef Jaafar in a boxing stance wearing PHENO sportswear" width={1440} height={1920} />
          </div>
        </section>

        <CoachingCommunity />

        <section className="coaching-section" aria-labelledby="coaching-intro-title">
          <div>
            <p className="eyebrow">THE APPROACH</p>
            <h2 id="coaching-intro-title">Learn the craft. Build the engine.</h2>
          </div>
          <p>Training is for people who want a clear process, focused coaching, and a place to keep showing up. Choose a weekday one to one session with Yousef and commit to the work.</p>
        </section>

        <section className="coaching-audience" aria-labelledby="audience-title">
          <p className="eyebrow">WHO IT IS FOR</p>
          <h2 id="audience-title">Start where you are.</h2>
          <div className="coaching-audience__grid">
            <article><span>01</span><h3>New to boxing</h3><p>Build confidence with clear fundamentals, movement, and technique.</p></article>
            <article><span>02</span><h3>Returning to training</h3><p>Rebuild consistency, fitness, and belief one session at a time.</p></article>
            <article><span>03</span><h3>Ready to sharpen up</h3><p>Use focused coaching to challenge your habits and raise your level.</p></article>
          </div>
        </section>

        <section className="coaching-process" aria-labelledby="process-title">
          <div className="coaching-process__visual">
            <img src="/images/coaching-process-training.png" alt="Two athletes standing together beside boxing bags" width={3072} height={4096} />
          </div>
          <div className="coaching-process__content">
            <div>
              <p className="eyebrow">HOW IT WILL WORK</p>
              <h2 id="process-title">A clear route in.</h2>
            </div>
            <ol>
              <li><span>01</span><div><h3>Register interest</h3><p>Tell us who you are and what you want to train towards.</p></div></li>
              <li><span>02</span><div><h3>Book your session</h3><p>Choose a weekday and a one to one time that works for you.</p></div></li>
              <li><span>03</span><div><h3>Do the work</h3><p>Arrive prepared, train with intent, and build from the session before.</p></div></li>
            </ol>
          </div>
        </section>

        <section className="coaching-faq" aria-labelledby="coaching-faq-title">
          <div className="coaching-faq__copy">
            <p className="eyebrow">QUESTIONS</p>
            <h2 id="coaching-faq-title">Before you register.</h2>
            <div className="coaching-faq__items">
              <details><summary>Is this a full booking system?</summary><p>Yes. Choose a one to one session, select a weekday and time, then send your details to confirm the booking request.</p></details>
              <details><summary>Do I need previous boxing experience?</summary><p>No. The coaching offer will support people at different starting points, with the right level confirmed before booking.</p></details>
              <details><summary>Where will sessions take place?</summary><p>Yousef will share the session details after your booking request has been received.</p></details>
            </div>
          </div>
          <div className="coaching-faq__visual">
            <img src="/images/coaching-faq-training.png" alt="Athlete training in a boxing gym" width={1440} height={1920} />
          </div>
        </section>

        <section className="booking-section" id="register-interest" aria-label="Book a one to one coaching session">
          <iframe
            src="https://podium-cal-staging.up.railway.app/embed/pheno"
            title="PHENO Sportswear booking"
            style={{ width: "100%", minHeight: 900, border: 0 }}
            loading="lazy"
          />
        </section>
      </div>
    </StorefrontPage>
  );
}
