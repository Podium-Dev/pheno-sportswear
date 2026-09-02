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
      <a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noreferrer">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17.5" cy="6.5" r=".8" className="retail-footer__social-dot" />
        </svg>
      </a>
      <a href="https://www.tiktok.com/" aria-label="TikTok" target="_blank" rel="noreferrer">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 4v10.2a3.8 3.8 0 1 1-3-3.7" />
          <path d="M14 4c1.1 2.7 2.7 4 5.5 4" />
        </svg>
      </a>
      <a href="https://www.youtube.com/" aria-label="YouTube" target="_blank" rel="noreferrer">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="6.5" width="18" height="11" rx="3" />
          <path d="m10 9 5 3-5 3V9Z" className="retail-footer__social-fill" />
        </svg>
      </a>
      <a href="https://x.com/" aria-label="X" target="_blank" rel="noreferrer">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m5 4 14 16M19 4 5 20" />
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
