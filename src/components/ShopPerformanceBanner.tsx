const performanceFeatures = [
  {
    number: "01",
    title: "Breathable ventilation",
    description: "Targeted mesh panels keep air moving through demanding sessions.",
    image: "/images/type-1-shorts.jpg",
    alt: "PHENO Type 1 Shorts",
    href: "/product/pheno-type-1-shorts",
    product: "Type 1 Shorts",
  },
  {
    number: "02",
    title: "Quick-dry",
    description: "A lightweight performance knit helps moisture move away from the skin.",
    image: "/images/type-1-tshirt.jpg",
    alt: "PHENO Type 1 T-Shirt",
    href: "/product/pheno-type-1-t-shirt",
    product: "Type 1 T-Shirt",
  },
  {
    number: "03",
    title: "Cooling zones",
    description: "Breathable side panels release heat when the intensity rises.",
    image: "/images/type-1-tank-black.jpg",
    alt: "PHENO Type 1 Tank",
    href: "/product/pheno-type-1-tank",
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
            <a className="shop-performance-card" href={feature.href} key={feature.number}>
              <span className="shop-performance-card__media">
                <img
                  src={feature.image}
                  alt={feature.alt}
                />
              </span>
              <span className="shop-performance-card__number">{feature.number}</span>
              <span className="shop-performance-card__copy">
                <span>{feature.product}</span>
                <strong>{feature.title}</strong>
                <small>{feature.description}</small>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
