import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { HomepageProductRail } from "@/components/HomepageProductRail";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="section-heading">{children}</h2>;
}

const socialProofPosts = [
  {
    href: "https://www.instagram.com/p/DatW9PiuPDx/",
    src: "/videos/social-01.mp4",
    label: "Built for the work",
  },
  {
    href: "https://www.instagram.com/p/DZOB_3WsrKw/",
    src: "/videos/social-02.mp4",
    label: "First session",
  },
  {
    href: "https://www.instagram.com/p/DY_rYNJu9nq/",
    src: "/videos/social-03.mp4",
    label: "Keep showing up",
  },
  {
    href: "https://www.instagram.com/p/DaLfFyat3JO/",
    src: "/videos/social-04.mp4",
    label: "Made to move",
  },
  {
    href: "https://www.instagram.com/p/DaI_gp0uHWF/",
    src: "/videos/social-05.mp4",
    label: "Pursue the rise",
  },
] as const;

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img
        className="hero__background"
        src="/images/pheno-banner.jpg"
        alt=""
        aria-hidden="true"
      />
      <div className="hero__slash" aria-hidden="true" />
      <div className="hero__graphic" aria-hidden="true">
        RISE
      </div>
      <div className="hero__inner">
        <div className="hero__content">
          <p className="eyebrow">PHENO SPORTSWEAR</p>
          <h1 id="hero-title">Pursue the rise</h1>
          <p className="hero__summary">
            Performance sportswear built for those who refuse to stay down.
          </p>
          <a className="button button--dark" href="/shop">
            Shop the collection
          </a>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <img src="/images/type-1-shorts.jpg" alt="" />
          <span className="hero__visual-word">PHENO</span>
        </div>

        <div className="hero__indicators" aria-label="Hero slide 1 of 5">
          <span className="hero__indicator hero__indicator--active" />
          <span className="hero__indicator" />
          <span className="hero__indicator" />
          <span className="hero__indicator" />
          <span className="hero__indicator" />
        </div>
      </div>
    </section>
  );
}

function TopPicks() {
  return (
    <section className="top-picks" id="top-picks" aria-labelledby="top-picks-title">
      <div className="homepage-section-inner">
        <HomepageProductRail />
      </div>
    </section>
  );
}

function Editorial() {
  return (
    <section className="editorial" aria-labelledby="editorial-title">
      <div className="homepage-section-inner">
        <SectionHeading>
          <span id="editorial-title">Trending now</span>
        </SectionHeading>

        <div className="editorial__main">
          <a className="editorial-card editorial-card--main" href="/shop/type-1">
            <img src="/images/editorial-main.jpg" alt="Athlete training in a bright gym" />
            <span className="editorial-card__shade" aria-hidden="true" />
            <span className="editorial-card__copy">
              <span className="eyebrow">PHENO</span>
              <strong>Train in the present</strong>
              <span>Technical pieces for the session in front of you.</span>
              <span className="editorial-card__cta">Shop now</span>
            </span>
          </a>
        </div>

        <div className="editorial__subgrid">
          <a className="editorial-card" href="/shop/type-1">
            <img src="/images/editorial-left.jpg" alt="Athlete running outdoors" />
            <span className="editorial-card__shade" aria-hidden="true" />
            <span className="editorial-card__copy">
              <strong>Type 1 training</strong>
              <span className="editorial-card__cta">Explore</span>
            </span>
          </a>
          <a className="editorial-card" href="/our-story">
            <img src="/images/editorial-right.jpg" alt="Athlete preparing for a workout" />
            <span className="editorial-card__shade" aria-hidden="true" />
            <span className="editorial-card__copy">
              <strong>Pursue the rise</strong>
              <span className="editorial-card__cta">Our story</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Campaign() {
  return (
    <section className="campaign" aria-labelledby="campaign-title">
      <span className="campaign__slash" aria-hidden="true" />
      <div className="homepage-section-inner campaign__inner">
        <div className="campaign__content">
          <p className="eyebrow">THE PHENO STORY</p>
          <h2 id="campaign-title">Rise different</h2>
          <p>
            Your starting point does not define where you finish. Build the next
            version of you, one session at a time.
          </p>
          <a className="button button--dark" href="/our-story">
            Discover PHENO
          </a>
        </div>
        <div className="campaign__visual">
          <img src="/images/type-1-joggers.jpg" alt="PHENO Type 1 performance joggers" />
          <span className="campaign__visual-label" aria-hidden="true">
            TYPE 1
          </span>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="social-proof" aria-labelledby="social-proof-title">
      <div className="homepage-section-inner">
        <div className="social-proof__intro">
          <div>
            <p className="eyebrow">THE PHENO COMMUNITY</p>
            <h2 id="social-proof-title">The rise, in motion</h2>
          </div>
          <p className="social-proof__intro-copy">
            Real sessions from the people who wear PHENO. Follow @phenosportswear on Instagram and be part of the next one.
          </p>
        </div>

        <div className="social-proof__grid">
          {socialProofPosts.map((post, index) => (
            <a
              className="social-proof-card"
              href={post.href}
              key={post.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open PHENO Instagram post ${index + 1}`}
            >
              <video
                className="social-proof-card__video"
                src={post.src}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
              <span className="social-proof-card__shade" aria-hidden="true" />
              <span className="social-proof-card__badge" aria-hidden="true">
                Instagram
              </span>
              <span className="social-proof-card__meta">
                <strong>{post.label}</strong>
                <span>View post ↗</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Homepage() {
  return (
    <div className="homepage">
      <SiteHeader />
      <main>
        <Hero />
        <TopPicks />
        <Editorial />
        <Campaign />
        <SocialProof />
      </main>
      <SiteFooter />
    </div>
  );
}
