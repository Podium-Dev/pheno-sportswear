import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export function StorefrontPage({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`storefront-page ${className}`.trim()}>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function Breadcrumbs({ current }: { current: string }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}

export function EditorialPageIntro({
  eyebrow,
  title,
  headingLevel = "h1",
  children,
}: {
  eyebrow: string;
  title: string;
  headingLevel?: "h1" | "h2";
  children?: React.ReactNode;
}) {
  const Heading = headingLevel;

  return (
    <header className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <Heading>{title}</Heading>
      {children ? <p className="page-intro__summary">{children}</p> : null}
    </header>
  );
}
