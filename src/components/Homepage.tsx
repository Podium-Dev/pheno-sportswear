import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const topPicks = [
  {
    name: "Type 1 Shorts",
    price: "£45.00",
    image: "/images/type-1-shorts.jpg",
    href: "/shop/type-1",
  },
  {
    name: "Type 1 Joggers",
    price: "£65.00",
    image: "/images/type-1-joggers.jpg",
    href: "/shop/type-1",
  },
  {
    name: "Type 1 T-Shirt",
    price: "£36.00",
    image: "/images/type-1-tshirt.jpg",
    href: "/shop/tops",
  },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="section-heading">{children}</h2>;
}

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
      <div className="section-heading-row">
        <SectionHeading>
          <span id="top-picks-title">Top picks</span>
        </SectionHeading>
        <div className="carousel-controls" aria-label="Top picks carousel controls">
          <button type="button" aria-label="Previous top picks">
            ‹
          </button>
          <button type="button" aria-label="Next top picks">
            ›
          </button>
        </div>
      </div>

      <div className="product-grid">
        {topPicks.map((product) => (
          <article className="product-card" key={product.name}>
            <a className="product-card__link" href={product.href}>
              <span className="product-card__media">
                <img src={product.image} alt={`${product.name}, PHENO Sportswear`} />
              </span>
              <span className="product-card__details">
                <span className="product-card__name">{product.name}</span>
                <span className="product-card__price">{product.price}</span>
              </span>
            </a>
          </article>
        ))}
      </div>

      <div className="carousel-progress" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}

function Editorial() {
  return (
    <section className="editorial" aria-labelledby="editorial-title">
      <SectionHeading>
        <span id="editorial-title">The rise</span>
      </SectionHeading>

      <div className="editorial__main">
        <a className="editorial-card editorial-card--main" href="/our-story">
          <img src="/images/editorial-main.jpg" alt="Athlete training in a bright gym" />
          <span className="editorial-card__shade" aria-hidden="true" />
          <span className="editorial-card__copy">
            <span className="eyebrow">THE PHENO MINDSET</span>
            <strong>Built for the work</strong>
            <span>Performance pieces for every hard-earned rep.</span>
            <span className="editorial-card__cta">Discover</span>
          </span>
        </a>
      </div>

      <div className="editorial__subgrid">
        <a className="editorial-card" href="/shop/type-1">
          <img src="/images/editorial-left.jpg" alt="Athlete running outdoors" />
          <span className="editorial-card__shade" aria-hidden="true" />
          <span className="editorial-card__copy">
            <strong>Type 1 collection</strong>
            <span className="editorial-card__cta">Shop now</span>
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
    </section>
  );
}

function Campaign() {
  return (
    <section className="campaign" aria-labelledby="campaign-title">
      <span className="campaign__slash" aria-hidden="true" />
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
    </section>
  );
}

export function Homepage() {
  return (
    <div className="page-board">
      <div className="page-board__intro" aria-hidden="true">
        <span className="page-board__index">05</span>
        <span className="page-board__title">Home page</span>
      </div>

      <div className="site-shell">
        <SiteHeader />
        <main>
          <Hero />
          <TopPicks />
          <Editorial />
          <Campaign />
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
