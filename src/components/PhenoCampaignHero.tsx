import Image from "next/image";

const campaignLooks = [
  {
    id: "look-1",
    src: "/images/pheno-campaign/look-1.png",
    alt: "PHENO athlete wearing the white Type 1 tank and black joggers",
    objectPosition: "50% 22%",
  },
  {
    id: "look-2",
    src: "/images/pheno-campaign/look-2.png",
    alt: "PHENO athlete wearing the black Type 1 hoodie and shorts",
    objectPosition: "50% 22%",
  },
  {
    id: "look-3",
    src: "/images/pheno-campaign/look-3-studio.png",
    alt: "PHENO athlete wearing the white Type 1 t-shirt and black joggers",
    objectPosition: "50% 23%",
  },
] as const;

export function PhenoCampaignHero() {
  return (
    <section className="pheno-campaign" aria-labelledby="pheno-campaign-title">
      <div className="pheno-campaign__stage">
        <div className="pheno-campaign__columns">
          {campaignLooks.map((look, index) => (
            <figure className="pheno-campaign__look" key={look.id}>
              <Image
                src={look.src}
                alt={look.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 901px) 33vw, 100vw"
                style={{ objectPosition: look.objectPosition }}
              />
            </figure>
          ))}
        </div>

        <div className="pheno-campaign__copy">
          <Image
            className="pheno-campaign__copy-mark"
            src="/images/pheno-logo.png"
            alt="PHENO"
            width={160}
            height={18}
          />
          <h1 id="pheno-campaign-title">PHENO SPORTSWEAR</h1>
          <p className="pheno-campaign__collection">TYPE 1 COLLECTION</p>
          <p className="pheno-campaign__tagline">ENGINEERED FOR PERFORMANCE. DESIGNED TO RISE.</p>
          <a className="pheno-campaign__cta" href="/shop/type-1">
            <span>Shop Type 1</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <span className="pheno-campaign__torn-edge" aria-hidden="true" />
      </div>
    </section>
  );
}
