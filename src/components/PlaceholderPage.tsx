const pageDetails: Record<string, { title: string; body: string }> = {
  "/shop": {
    title: "Shop PHENO",
    body: "The Phase 1 shop shell is ready for the approved collection experience.",
  },
  "/shop/type-1": {
    title: "Type 1 collection",
    body: "The Type 1 collection route is prepared for the future product grid.",
  },
  "/shop/tops": {
    title: "Tops",
    body: "Tops will be added once the homepage structure is approved.",
  },
  "/shop/bottoms": {
    title: "Bottoms",
    body: "Bottoms will be added once the homepage structure is approved.",
  },
  "/shop/sets": {
    title: "Sets",
    body: "Sets will be added once the homepage structure is approved.",
  },
  "/our-story": {
    title: "Our story",
    body: "The PHENO story page is scaffolded for the next phase.",
  },
  "/train-with-yousef": {
    title: "Train with Yousef",
    body: "The coaching route is scaffolded separately from the sportswear shop.",
  },
  "/contact": {
    title: "Contact",
    body: "Contact details and support content will be added after Phase 1.",
  },
  "/help/faq": {
    title: "FAQ",
    body: "Frequently asked questions will be added after the homepage is approved.",
  },
  "/help/size-guide": {
    title: "Size guide",
    body: "The size guide route is ready for the approved product data.",
  },
  "/help/shipping": {
    title: "Shipping",
    body: "Shipping information will be added alongside the commerce build.",
  },
  "/help/returns": {
    title: "Returns",
    body: "Returns information will be added alongside the commerce build.",
  },
};

export function PlaceholderPage({ segments }: { segments: string[] }) {
  const pathname = `/${segments.join("/")}`;
  const details = pageDetails[pathname] ?? {
    title: pathname.slice(1).replaceAll("/", " / "),
    body: "This route is reserved for a later PHENO phase.",
  };

  return (
    <div className="placeholder-page">
      <header className="placeholder-page__header">
        <a className="brand" href="/" aria-label="PHENO home">
          <img className="brand__image" src="/images/pheno-logo.png" alt="PHENO" />
        </a>
        <a className="placeholder-page__back" href="/">
          Back to home
        </a>
      </header>
      <main className="placeholder-page__main">
        <p className="eyebrow">PHENO SPORTSWEAR</p>
        <h1>{details.title}</h1>
        <p>{details.body}</p>
        <a className="button button--dark" href="/">
          Return home
        </a>
      </main>
    </div>
  );
}
