import { faqGroups, productSizeCharts } from "@/data/site";

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
  const charts = [
    ["hoodies", "Pheno Hoodie Size Chart (Chest, Length & Sleeve)"],
    ["joggers", "Pheno Jogger Full Size Chart (Waist, Inseam & Outseam)"],
    ["t-shirts", "Pheno Tee And Tank Size Chart (With Cm + Inches)"],
    ["shorts", "Pheno Shorts Full Size Chart (Waist, Liner & Shell Inseam)"],
  ] as const;

  return (
    <div className="full-size-guide">
      <div className="full-size-guide__brand" aria-label="PHENO size charts">
        <span aria-hidden="true">PHENO</span>
        <span aria-hidden="true">SIZE CHARTS</span>
      </div>
      <div className="full-size-guide__charts">
        {charts.map(([category, title]) => {
          const chart = productSizeCharts[category];
          return (
            <div className="full-size-guide__scroll" key={category} role="region" aria-label={title} tabIndex={0}>
              <table className="full-size-guide__table">
                <caption>{title}</caption>
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
          );
        })}
      </div>
    </div>
  );
}
