import { NewsletterForm } from "@/components/Forms";

const footerGroups = [
  {
    title: "Shop",
    links: [
      ["Shop all", "/shop"],
      ["Type 1", "/shop/type-1"],
      ["Tops", "/shop/tops"],
      ["Bottoms", "/shop/bottoms"],
    ],
  },
  {
    title: "Our story",
    links: [
      ["Our philosophy", "/our-story"],
      ["Founder", "/our-story"],
      ["Values", "/our-story"],
      ["FAQs", "/help/faq"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Shipping & Delivery", "/help/shipping"],
      ["Refunds & Returns", "/help/returns"],
      ["Size guide", "/help/size-guide"],
      ["Contact", "/contact"],
    ],
  },
] as const;

function SocialIcons() {
  return (
    <nav className="retail-footer__socials" aria-label="Social media">
      <a href="https://www.facebook.com/phenosportswearni" aria-label="Facebook" target="_blank" rel="noreferrer">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13.5 21v-8h2.75l.45-3H13.5V8.1c0-.87.28-1.46 1.55-1.46h1.65V4a22 22 0 0 0-2.4-.13c-2.38 0-4 1.45-4 4.08V10H8v3h2.3v8h3.2Z" className="retail-footer__social-fill" />
        </svg>
      </a>
      <a href="https://www.instagram.com/phenosportswear/" aria-label="Instagram" target="_blank" rel="noreferrer">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17.5" cy="6.5" r=".8" className="retail-footer__social-dot" />
        </svg>
      </a>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="retail-footer">
      <div className="retail-footer__inner">
        <div className="retail-footer__top">
          <a className="retail-footer__brand" href="/" aria-label="PHENO home">
            <img src="/images/pheno-desktop-logo-wide.avif" alt="PHENO" />
            <span>Pursue the rise.</span>
          </a>

          {footerGroups.map((group) => (
            <div className="retail-footer__group" key={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {group.links.map(([label, href]) => (
                  <li key={`${group.title}-${label}`}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="retail-footer__social-column">
            <SocialIcons />
            <div className="retail-footer__newsletter">
              <NewsletterForm compact />
            </div>
          </div>
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
