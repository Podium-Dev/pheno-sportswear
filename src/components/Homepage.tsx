"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useCommerce } from "@/components/CommerceProvider";
import { getProductBySlug, type Product } from "@/data/products";
import { formatCurrency } from "@/lib/format";

const retailNavLinks = [
  ["Shop", "/shop"],
  ["Our story", "/our-story"],
  ["Train with Yousef", "/train-with-yousef"],
  ["Contact", "/contact"],
] as const;

const retailPickSlugs = [
  "pheno-type-1-t-shirt",
  "pheno-type-1-shorts",
  "pheno-type-1-hoodie",
  "pheno-type-1-joggers",
  "pheno-type-1-tank",
];

const retailSpotlightSlugs = [
  "pheno-type-1-hoodie",
  "pheno-type-1-joggers",
  "pheno-type-1-shorts",
  "pheno-type-1-t-shirt",
  "pheno-type-1-tank",
];

function ArrowIcon() {
  return (
    <svg className="retail-arrow" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M2 9h13M10 4l5 5-5 5" />
    </svg>
  );
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

function MenuIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 6h14M3 10h14M3 14h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h2l1.7 10.2a2 2 0 0 0 2 1.7h7.6a2 2 0 0 0 2-1.6L21 9H7" />
      <circle cx="10" cy="21" r="1" />
      <circle cx="18" cy="21" r="1" />
    </svg>
  );
}

function RetailCta({ href, children, dark = false }: { href: string; children: ReactNode; dark?: boolean }) {
  return (
    <a className={`retail-cta${dark ? " retail-cta--dark" : ""}`} href={href}>
      <span>{children}</span>
      <ArrowIcon />
    </a>
  );
}

function RetailHeader() {
  const { cartCount, setCartOpen, setSearchOpen } = useCommerce();
  const [mobileOpen, setMobileOpen] = useState(false);

  const openSearch = () => {
    setMobileOpen(false);
    setSearchOpen(true);
  };

  const openCart = () => {
    setMobileOpen(false);
    setCartOpen(true);
  };

  return (
    <header className="retail-header">

      <div className="retail-navigation">
        <a className="retail-navigation__brand" href="/" aria-label="PHENO home">
          <img src="/images/pheno-desktop-logo-wide.avif" alt="PHENO" />
        </a>

        <nav className="retail-navigation__links" aria-label="Primary navigation">
          {retailNavLinks.map(([label, href]) => (
            <a href={href} key={href}>{label}</a>
          ))}
        </nav>

        <div className="retail-navigation__tools" aria-label="Utility navigation">
          <button type="button" aria-label="Search" onClick={openSearch}>
            <SearchIcon />
            <span>Search</span>
          </button>
          <button type="button" aria-label={`Cart (${cartCount})`} onClick={openCart}>
            <CartIcon />
            <span>My cart ({cartCount})</span>
          </button>
        </div>

        <button className="retail-navigation__mobile-toggle" type="button" aria-expanded={mobileOpen} aria-controls="retail-mobile-menu" onClick={() => setMobileOpen((open) => !open)}>
          <span>{mobileOpen ? "Close" : "Menu"}</span>
          <MenuIcon />
        </button>
      </div>

      {mobileOpen ? (
        <nav id="retail-mobile-menu" className="retail-mobile-menu" aria-label="Mobile navigation">
          {retailNavLinks.map(([label, href]) => (
            <a href={href} key={href} onClick={() => setMobileOpen(false)}>{label}</a>
          ))}
          <button type="button" onClick={openSearch}>Search</button>
          <button type="button" onClick={openCart}>My cart ({cartCount})</button>
        </nav>
      ) : null}
    </header>
  );
}

function RetailHero() {
  return (
    <section className="retail-hero" aria-labelledby="retail-hero-title">
      <img className="retail-hero__backdrop" src="/images/campaign-athlete.jpg" alt="" aria-hidden="true" />
      <div className="retail-hero__wash" aria-hidden="true" />

      <div className="retail-hero__inner">
        <div className="retail-hero__copy">
          <p className="retail-eyebrow">New arrival</p>
          <h1 id="retail-hero-title"><span>Type 1</span><span>performance</span></h1>
          <p>Engineered for movement. Built for every session, every day.</p>
          <RetailCta href="/shop/type-1" dark>Shop the collection</RetailCta>
        </div>

        <div className="retail-hero__art" aria-hidden="true">
          <img className="retail-hero__mark" src="/images/pheno-hero-mark.png" alt="" />
          <img className="retail-hero__product retail-hero__product--hoodie" src="/images/type-1-hoodie.jpg" alt="" />
        </div>

        <div className="retail-hero__indicators" aria-label="Hero slide 1 of 4">
          <span className="is-active" />
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}

function RetailProductCard({ product }: { product: Product }) {
  return (
    <article className="retail-product-card">
      <a className="retail-product-card__media" href={`/product/${product.slug}`}>
        <img src={product.images[0]} alt={`${product.name}, PHENO Sportswear`} />
      </a>
      <a className="retail-product-card__details" href={`/product/${product.slug}`}>
        <span>{product.name}</span>
        <span>{formatCurrency(product.price)}</span>
      </a>
    </article>
  );
}

function RetailProductRail() {
  const products = retailPickSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is Product => Boolean(product));
  const [startIndex, setStartIndex] = useState(0);
  const visibleProducts = Array.from({ length: Math.min(3, products.length) }, (_, offset) =>
    products[(startIndex + offset) % products.length],
  );

  return (
    <>
      <div className="retail-picks__header">
        <h2>Top picks</h2>
        <div className="retail-picks__controls">
          <button type="button" aria-label="Previous top picks" onClick={() => setStartIndex((current) => (current - 1 + products.length) % products.length)}>‹</button>
          <button type="button" aria-label="Next top picks" onClick={() => setStartIndex((current) => (current + 1) % products.length)}>›</button>
        </div>
      </div>

      <div className="retail-product-grid">
        {visibleProducts.map((product) => <RetailProductCard product={product} key={product.slug} />)}
      </div>

      <div className="retail-picks__progress" aria-hidden="true">
        {products.slice(0, 3).map((product, index) => <span className={index === startIndex % 3 ? "is-active" : ""} key={product.slug} />)}
      </div>
    </>
  );
}

function TopPicks() {
  return (
    <section className="retail-section retail-picks" aria-labelledby="retail-picks-title">
      <div className="retail-section__inner">
        <span className="visually-hidden" id="retail-picks-title">Top picks</span>
        <RetailProductRail />
      </div>
    </section>
  );
}

function RetailFeatureIcon({ name }: { name: "fabric" | "fit" | "build" | "shipping" | "returns" }) {
  if (name === "fabric") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 3c2 4 7 5 9 9 3 5-1 12-7 13-7 2-14-3-13-10 1-5 7-7 11-12Z" />
        <path d="M8 20c4-1 8-4 10-9M12 26c1-3 3-6 6-8" />
      </svg>
    );
  }

  if (name === "fit") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M8 24c4-7 9-10 16-11M16 7c1 2 3 3 6 3M7 17c3 1 5 0 7-3" />
        <path d="m21 9 3-3 2 3" />
      </svg>
    );
  }

  if (name === "build") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="m16 3 10 4v8c0 7-4 11-10 14C10 26 6 22 6 15V7l10-4Z" />
        <path d="m16 9 1.5 3.4 3.5.4-2.6 2.3.8 3.5-3.2-1.8-3.2 1.8.8-3.5-2.6-2.3 3.5-.4L16 9Z" />
      </svg>
    );
  }

  if (name === "shipping") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M3 8h16v13H3zM19 13h5l5 5v3H19z" />
        <circle cx="9" cy="24" r="2.5" />
        <circle cx="25" cy="24" r="2.5" />
        <path d="M22 13v5h7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M25 9a10 10 0 1 0 1 10" />
      <path d="M25 4v6h-6M7 23v-6h6" />
    </svg>
  );
}

const retailFeatures = [
  ["fabric", "Premium fabrics"],
  ["fit", "Performance fit"],
  ["build", "Durable construction"],
  ["shipping", "Fast & reliable shipping"],
  ["returns", "Easy returns"],
] as const;

function RetailFeatureStrip() {
  return (
    <section className="retail-features" aria-label="Why shop PHENO">
      <div className="retail-features__inner">
        {retailFeatures.map(([icon, label]) => (
          <article className="retail-feature" key={label}>
            <span className="retail-feature__icon">
              <RetailFeatureIcon name={icon} />
            </span>
            <h2>{label}</h2>
          </article>
        ))}
      </div>
    </section>
  );
}

function CampaignTile({ href, image, alt, label, title }: { href: string; image: string; alt: string; label: string; title: string }) {
  return (
    <a className="retail-campaign-tile" href={href}>
      <img src={image} alt={alt} />
      <span className="retail-campaign-tile__shade" aria-hidden="true" />
      <span className="retail-campaign-tile__copy">
        <span>{label}</span>
        <strong>{title}</strong>
      </span>
    </a>
  );
}

function TrendingCampaign() {
  return (
    <section className="retail-section retail-trending" aria-labelledby="retail-trending-title">
      <div className="retail-section__inner">
        <h2 className="retail-section__title" id="retail-trending-title">Trending now</h2>
        <a className="retail-campaign-feature" href="/shop/type-1">
          <img src="/images/pheno-banner.jpg" alt="Athlete training on the field in PHENO sportswear" />
          <span className="retail-campaign-feature__shade" aria-hidden="true" />
          <span className="retail-campaign-feature__copy">
            <span className="retail-eyebrow">New collection</span>
            <strong>Type 1 training</strong>
            <span>Performance pieces for the work ahead.</span>
            <span className="retail-campaign-feature__cta">Shop <ArrowIcon /></span>
          </span>
        </a>
        <div className="retail-campaign-grid">
          <CampaignTile href="/shop/bottoms" image="/images/editorial-left.jpg" alt="Runners moving together outdoors" label="Move every day" title="Bottoms that keep up." />
          <CampaignTile href="/train-with-yousef" image="/images/editorial-right.jpg" alt="Athlete preparing for a workout" label="Built for the work" title="Train with intent." />
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="social-proof" aria-labelledby="social-proof-title">
      <div className="retail-section__inner">
        <div className="social-proof__intro">
          <div>
          <p className="retail-eyebrow">THE PHENO COMMUNITY</p>
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

function ProductSpotlight() {
  const products = retailSpotlightSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is Product => Boolean(product));
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);

  useEffect(() => {
    if (isSliderPaused || products.length < 2) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % products.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [isSliderPaused, products.length]);

  if (!products.length) return null;

  const spotlightSlides = [-1, 0, 1].map((offset) => {
    const index = (activeIndex + offset + products.length) % products.length;
    return {
      product: products[index],
      index,
      position: offset === 0 ? "active" : offset < 0 ? "previous" : "next",
    } as const;
  });

  return (
    <section className="retail-spotlight" aria-labelledby="retail-spotlight-title">
      <div className="retail-spotlight__inner">
        <div className="retail-spotlight__copy">
          <p className="retail-eyebrow">Come and shop</p>
          <h2 id="retail-spotlight-title">Type 1 by PHENO</h2>
          <p>Build your rotation with technical layers made for the session and everything after it.</p>
          <RetailCta href="/shop/type-1" dark>Shop now</RetailCta>
        </div>
        <div className="retail-spotlight__art">
          <img className="retail-spotlight__mark" src="/images/pheno-hero-mark.png" alt="" aria-hidden="true" />
          <div
            className="retail-spotlight__slider"
            role="region"
            aria-roledescription="carousel"
            aria-label="Type 1 products"
            onMouseEnter={() => setIsSliderPaused(true)}
            onMouseLeave={() => setIsSliderPaused(false)}
            onFocus={() => setIsSliderPaused(true)}
            onBlur={() => setIsSliderPaused(false)}
          >
            <div className="retail-spotlight__slider-stage" aria-live="polite">
              {spotlightSlides.map(({ product, index, position }) => (
                <a
                  className={`retail-spotlight__slide retail-spotlight__slide--${position}`}
                  href={`/product/${product.slug}`}
                  aria-label={`${position === "active" ? "View" : "Show"} ${product.name}`}
                  aria-current={position === "active" ? "true" : undefined}
                  onClick={(event) => {
                    if (position !== "active") {
                      event.preventDefault();
                      setActiveIndex(index);
                    }
                  }}
                  key={`${product.slug}-${position}`}
                >
                  <span className="retail-spotlight__slide-media">
                    <img src={product.images[0]} alt={`${product.name}, PHENO Sportswear`} />
                  </span>
                </a>
              ))}
            </div>

            <div className="retail-spotlight__dots" role="tablist" aria-label="Choose a Type 1 product">
              {products.map((product, index) => (
                <button
                  type="button"
                  role="tab"
                  aria-label={`Show ${product.name}`}
                  aria-selected={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                  key={product.slug}
                >
                  <span className={index === activeIndex ? "is-active" : ""} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const retailFooterGroups = [
  { title: "Shop", links: [["Shop all", "/shop"], ["Type 1", "/shop/type-1"], ["Tops", "/shop/tops"], ["Bottoms", "/shop/bottoms"]] },
  { title: "Our story", links: [["Our philosophy", "/our-story"], ["Founder", "/our-story"], ["Values", "/our-story"], ["FAQs", "/help/faq"]] },
  { title: "Support", links: [["Shipping", "/help/shipping"], ["Returns", "/help/returns"], ["Size guide", "/help/size-guide"], ["Contact", "/contact"]] },
] as const;

function SocialIcons() {
  return (
    <div className="retail-footer__socials" aria-label="Social media">
      <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a>
      <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok">♪</a>
      <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube">▶</a>
      <a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X">×</a>
    </div>
  );
}

function RetailFooter() {
  return (
    <footer className="retail-footer">
      <div className="retail-footer__inner">
        <div className="retail-footer__top">
          <a className="retail-footer__brand" href="/" aria-label="PHENO home">
            <img src="/images/pheno-desktop-logo-wide.avif" alt="PHENO" />
            <span>Pursue the rise.</span>
          </a>
          {retailFooterGroups.map((group) => (
            <div className="retail-footer__group" key={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {group.links.map(([label, href]) => <li key={`${group.title}-${label}`}><a href={href}>{label}</a></li>)}
              </ul>
            </div>
          ))}
          <SocialIcons />
        </div>
        <div className="retail-footer__bottom">
          <span>© 2026 PHENO Sportswear. All rights reserved.</span>
          <div>
            <a href="/privacy">Privacy policy</a>
            <a href="/privacy">Terms &amp; conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Homepage() {
  return (
    <div className="retail-home">
      <RetailHeader />
        <main>
          <RetailHero />
          <TopPicks />
          <RetailFeatureStrip />
          <TrendingCampaign />
          <ProductSpotlight />
          <SocialProof />
      </main>
      <RetailFooter />
    </div>
  );
}
