"use client";

import { useEffect } from "react";
import { sizeGuideRows } from "@/data/site";

export function SizeGuideTable() {
  return (
    <div className="size-guide-table-wrap">
      <table className="size-guide-table">
        <caption>Garment measurements in centimetres</caption>
        <thead>
          <tr>
            <th scope="col">Size</th>
            <th scope="col">Chest</th>
            <th scope="col">Waist</th>
            <th scope="col">Hips</th>
          </tr>
        </thead>
        <tbody>
          {sizeGuideRows.map(([size, chest, waist, hips]) => (
            <tr key={size}>
              <th scope="row">{size}</th>
              <td>{chest}</td>
              <td>{waist}</td>
              <td>{hips}</td>
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
}: {
  open: boolean;
  onClose: () => void;
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

  return (
    <div className="overlay-layer" role="presentation">
      <button className="overlay-layer__backdrop" type="button" aria-label="Close size guide" onClick={onClose} />
      <section className="size-guide-modal" role="dialog" aria-modal="true" aria-labelledby="size-guide-title">
        <header className="overlay-panel__header">
          <div>
            <p className="eyebrow">PHENO FIT</p>
            <h2 id="size-guide-title">Size guide</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close size guide" onClick={onClose}>×</button>
        </header>
        <p>Use these body measurements as a guide. If you are between sizes, contact PHENO before ordering.</p>
        <SizeGuideTable />
        <a className="text-link" href="/help/size-guide" onClick={onClose}>View the full size guide</a>
      </section>
    </div>
  );
}
