import { getProductBySlug, type Product } from "@/data/products";
import { faqGroups, productSizeCharts } from "@/data/site";

const sizeGuideCharts = [
  {
    category: "hoodies",
    title: "Pheno Hoodie Size Chart (Chest, Length & Sleeve)",
    garmentSlugs: ["pheno-type-1-hoodie"],
  },
  {
    category: "joggers",
    title: "Pheno Jogger Full Size Chart (Waist, Inseam & Outseam)",
    garmentSlugs: ["pheno-type-1-joggers"],
  },
  {
    category: "t-shirts",
    title: "Pheno Tee And Tank Size Chart (With Cm + Inches)",
    garmentSlugs: ["pheno-type-1-t-shirt-black", "pheno-type-1-tank-black"],
  },
  {
    category: "shorts",
    title: "Pheno Shorts Full Size Chart (Waist, Liner & Shell Inseam)",
    garmentSlugs: ["pheno-type-1-shorts"],
  },
] as const;

function getSizeGuideGarments(slugs: readonly string[]) {
  return slugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is Product => Boolean(product));
}

export function FaqAccordions() {
  return (
    <div className="faq-groups">
      {faqGroups.map((group) => (
        <section className="faq-group" key={group.title}>
          <h2>{group.title}</h2>
          <div className="faq-group__items">
            {group.items.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function SizeGuideContent() {
  return (
    <div className="full-size-guide">
      <div className="full-size-guide__brand" aria-label="PHENO size charts">
        <span aria-hidden="true">PHENO</span>
        <span aria-hidden="true">SIZE CHARTS</span>
      </div>
      <div className="full-size-guide__charts">
        {sizeGuideCharts.map(({ category, title, garmentSlugs }) => {
          const chart = productSizeCharts[category];
          const garments = getSizeGuideGarments(garmentSlugs);
          const chartId = `size-chart-${category}`;

          return (
            <section className="full-size-guide__chart" key={category} aria-labelledby={chartId}>
              <div className={`full-size-guide__garments full-size-guide__garments--${garments.length}`} aria-label={`${title} garments`}>
                {garments.map((product) => (
                  <a className="full-size-guide__garment" href={`/product/${product.slug}`} key={product.slug}>
                    <div className="full-size-guide__garment-image">
                      <img src={product.images[0]} alt={`${product.name}, ${product.colours[0]} colour`} />
                    </div>
                    <div className="full-size-guide__garment-meta">
                      <strong>{product.name}</strong>
                      <span>{product.colours[0]}</span>
                    </div>
                  </a>
                ))}
              </div>
              <div className="full-size-guide__scroll" role="region" aria-label={title} tabIndex={0}>
                <table className="full-size-guide__table">
                  <caption id={chartId}>{title}</caption>
                  <thead>
                    <tr>
                      <th scope="col" aria-label="Row" />
                      {chart.columns.map((column) => <th scope="col" key={column}>{column}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {chart.rows.map((row, index) => (
                      <tr key={row[0]}>
                        <td className="full-size-guide__index">{index + 1}</td>
                        <th scope="row">{row[0] === "2XL" ? "XXL" : row[0]}</th>
                        {row.slice(1).map((value, cell) => <td key={cell}>{value}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
