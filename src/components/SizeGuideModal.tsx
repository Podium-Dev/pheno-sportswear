"use client";

import { useEffect } from "react";
import type { ProductCategory } from "@/data/products";
import { productSizeCharts, sizeGuideRows } from "@/data/site";

export function SizeGuideTable({ category }: { category?: ProductCategory } = {}) {
  const productChart = category ? productSizeCharts[category] : undefined;
  const columns = productChart?.columns ?? ["Size", "Chest", "Waist", "Hips"];
  const rows = productChart?.rows ?? sizeGuideRows;

  return (
    <div className="size-guide-table-wrap">
      <table className="size-guide-table">
        <caption>{productChart?.caption ?? "Garment measurements in centimetres"}</caption>
        <thead>
          <tr>
            {columns.map((column) => <th scope="col" key={column}>{column}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              <th scope="row">{row[0]}</th>
              {row.slice(1).map((value, index) => <td key={`${row[0]}-${index}`}>{value}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SizeGuideModal({
  open,
  onClose,
  category,
}: {
  open: boolean;
  onClose: () => void;
  category?: ProductCategory;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const productChart = category ? productSizeCharts[category] : undefined;

  return (
    <div className="overlay-layer overlay-layer--centered" role="presentation">
      <button className="overlay-layer__backdrop" type="button" aria-label="Close size guide" onClick={onClose} />
      <section className="size-guide-modal" role="dialog" aria-modal="true" aria-labelledby="size-guide-title">
        <header className="overlay-panel__header">
          <div>
            <p className="eyebrow">PHENO FIT</p>
            <h2 id="size-guide-title">{productChart?.title ?? "Size guide"}</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close size guide" onClick={onClose}>×</button>
        </header>
        <p>{productChart ? "Use the measurements for this product when selecting your size. If you are between sizes, contact PHENO before ordering." : "Use these body measurements as a guide. If you are between sizes, contact PHENO before ordering."}</p>
        <SizeGuideTable category={category} />
        <a className="text-link" href="/help/size-guide" onClick={onClose}>View the full size guide</a>
      </section>
    </div>
  );
}
