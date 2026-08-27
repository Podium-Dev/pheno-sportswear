import { StorefrontPage } from "@/components/StorefrontPage";

export default function NotFound() {
  return (
    <StorefrontPage className="storefront-page--not-found">
      <section className="not-found-page" aria-labelledby="not-found-title">
        <p className="eyebrow">PHENO / 404</p>
        <h1 id="not-found-title">This piece is not here.</h1>
        <p>The page or product you were looking for does not exist, or it has moved.</p>
        <div className="not-found-page__actions">
          <a className="button button--dark" href="/shop">Shop all</a>
          <a className="text-link" href="/">Return home</a>
        </div>
      </section>
    </StorefrontPage>
  );
}
