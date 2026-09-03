const performanceFeatures = [
  {
    title: "Breathable ventilation",
    description: "Targeted mesh panels keep air moving through demanding sessions.",
    image: "/images/shop-performance/breathable-ventilation.png",
    alt: "Close-up of PHENO Type 1 Shorts breathable fabric",
    product: "Type 1 Shorts",
  },
  {
    title: "Quick-dry",
    description: "A lightweight performance knit helps moisture move away from the skin.",
    image: "/images/shop-performance/quick-dry.png",
    alt: "Close-up of PHENO Type 1 T-Shirt quick-dry fabric",
    product: "Type 1 T-Shirt",
  },
  {
    title: "Cooling zones",
    description: "Breathable side panels release heat when the intensity rises.",
    image: "/images/shop-performance/cooling-zones.png",
    alt: "Close-up of PHENO Type 1 Tank cooling-zone fabric",
    product: "Type 1 Tank",
  },
] as const;

export function ShopPerformanceBanner() {
  return (
    <section className="shop-performance-banner" aria-labelledby="shop-performance-title">
      <span className="shop-performance-banner__stripe shop-performance-banner__stripe--wide" aria-hidden="true" />
      <span className="shop-performance-banner__stripe shop-performance-banner__stripe--fine" aria-hidden="true" />

      <div className="shop-performance-banner__inner">
        <div className="shop-performance-banner__copy">
          <p className="shop-performance-banner__eyebrow">TYPE 1 / PERFORMANCE SYSTEM</p>
          <h2 id="shop-performance-title">Function in every layer.</h2>
          <p>
            Built around the details that keep you moving, from warm-up to the last round.
          </p>
          <a className="shop-performance-banner__cta" href="/shop/type-1">
            Explore Type 1 <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="shop-performance-banner__cards">
          {performanceFeatures.map((feature) => (
            <article className="shop-performance-card" key={feature.product}>
              <span className="shop-performance-card__media">
                <img
                  src={feature.image}
                  alt={feature.alt}
                />
              </span>
              <span className="shop-performance-card__copy">
                <span>{feature.product}</span>
                <strong>{feature.title}</strong>
                <small>{feature.description}</small>
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
