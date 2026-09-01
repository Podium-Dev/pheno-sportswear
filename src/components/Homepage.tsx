"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { useEffect, useState, type ReactNode } from "react";
import { getProductBySlug, type Product } from "@/data/products";
import { formatCurrency } from "@/lib/format";

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

function RetailCta({ href, children, dark = false }: { href: string; children: ReactNode; dark?: boolean }) {
  return (
    <a className={`retail-cta${dark ? " retail-cta--dark" : ""}`} href={href}>
      <span>{children}</span>
      <ArrowIcon />
    </a>
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
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M19.25 4.75C12.68 5.08 6 8.11 6 14.1c0 3.1 2.18 5.15 5.18 5.15 5.45 0 8.43-5.24 8.07-14.5Z" />
        <path d="M4.75 20.25c2.7-4.8 6.37-8.09 11.32-10.65" />
      </svg>
    );
  }

  if (name === "fit") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M3.5 15.25c3.95-.05 6.28-1.38 7.63-3.86 1.06-1.93 2.58-2.64 4.62-2.64h4.75" />
        <path d="m17 5.25 3.5 3.5-3.5 3.5M3.5 19.25c2.25-.1 4.1-.76 5.52-2.14" />
      </svg>
    );
  }

  if (name === "build") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 3.25 19.5 6v5.5c0 4.5-2.4 7.54-7.5 9.25-5.1-1.71-7.5-4.75-7.5-9.25V6L12 3.25Z" />
        <path d="m12 7.7 1.2 2.42 2.68.39-1.94 1.89.46 2.67L12 13.8l-2.4 1.27.46-2.67-1.94-1.89 2.68-.39L12 7.7Z" />
      </svg>
    );
  }

  if (name === "shipping") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M3.5 7.5h10.25v8.75H3.5zM13.75 10.5h3.9l2.85 3.1v2.65h-6.75" />
        <circle cx="7.5" cy="18" r="1.7" />
        <circle cx="17.8" cy="18" r="1.7" />
        <path d="M20.5 13.6h-3.45v-3.1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M19.1 8.5A7.5 7.5 0 1 0 18.75 16" />
      <path d="m19.1 3.8v4.7h-4.7M4.9 20.2v-4.7h4.7" />
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
      <SiteHeader />
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
