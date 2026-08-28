import { NewsletterForm } from "@/components/Forms";

const footerGroups = [
  {
    title: "Shop",
    links: [
      ["Shop All", "/shop"],
      ["Type 1", "/shop/type-1"],
      ["Tops", "/shop/tops"],
      ["Bottoms", "/shop/bottoms"],
      ["Sets", "/shop/sets"],
    ],
  },
  {
    title: "Help",
    links: [
      ["FAQ", "/help/faq"],
      ["Size Guide", "/help/size-guide"],
      ["Shipping", "/help/shipping"],
      ["Returns", "/help/returns"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "PHENO",
    links: [
      ["Our Story", "/our-story"],
      ["Train With Yousef", "/train-with-yousef"],
      ["Pursue The Rise", "/our-story"],
      ["Privacy", "/privacy"],
    ],
  },
] as const;

function SocialLinks() {
  return (
    <nav className="footer-social" aria-label="Social media">
      <a href="https://www.instagram.com/" aria-label="Instagram">
        ◎
      </a>
      <a href="https://www.facebook.com/" aria-label="Facebook">
        f
      </a>
      <a href="https://www.youtube.com/" aria-label="YouTube">
        ▶
      </a>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <a className="footer-brand" href="/" aria-label="PHENO home">
            <img src="/images/pheno-logo.png" alt="PHENO" />
          </a>

          {footerGroups.map((group) => (
            <div className="footer-group" key={group.title}>
              <h2 className="footer-group__title">{group.title}</h2>
              <ul className="footer-group__links">
                {group.links.map(([label, href]) => (
                  <li key={`${group.title}-${label}`}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-newsletter">
            <p className="footer-group__title">Stay in the loop</p>
            <p className="footer-newsletter__copy">Training notes and collection updates.</p>
            <NewsletterForm compact />
          </div>

          <SocialLinks />
        </div>

        <div className="site-footer__bottom">
          <p>© 2026 PHENO Sportswear<br />All rights reserved</p>
          <a href="/privacy">Privacy &amp; Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}
