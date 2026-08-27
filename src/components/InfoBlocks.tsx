import { faqGroups } from "@/data/site";
import { SizeGuideTable } from "@/components/SizeGuideModal";

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
    <div className="help-content">
      <p>
        Use the measurements below as a guide when selecting your PHENO size. They are body measurements in centimetres, not garment measurements.
      </p>
      <SizeGuideTable />
      <p>
        If you are between sizes or need help choosing a fit, email <a className="text-link" href="mailto:info@phenosportswear.com">info@phenosportswear.com</a> before ordering.
      </p>
    </div>
  );
}
