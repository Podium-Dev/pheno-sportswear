"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type ParallaxTarget = {
  selector: string;
  depth: number;
  scale?: number;
};

const parallaxTargets: ParallaxTarget[] = [
  { selector: ".retail-hero__backdrop", depth: 26, scale: 1.07 },
  { selector: ".retail-hero__mark", depth: 18 },
  { selector: ".retail-hero__product--hoodie", depth: 12 },
  { selector: ".retail-campaign-feature img", depth: 16, scale: 1.06 },
  { selector: ".retail-campaign-tile img", depth: 12, scale: 1.05 },
  { selector: ".retail-spotlight__mark", depth: 20 },
  { selector: ".retail-spotlight__slide-media", depth: 8 },
  { selector: ".hero__background", depth: 20, scale: 1.06 },
  { selector: ".hero__graphic", depth: 14 },
  { selector: ".hero__visual img", depth: 12, scale: 1.05 },
  { selector: ".editorial-card > img", depth: 14, scale: 1.05 },
  { selector: ".campaign__visual img", depth: 14, scale: 1.05 },
  { selector: ".coaching-hero__visual img", depth: 14, scale: 1.05 },
  { selector: ".story-hero__mark", depth: 8 },
  { selector: ".founder-section__placeholder", depth: 7 },
  { selector: ".product-gallery__main img", depth: 10, scale: 1.025 },
  { selector: ".product-gallery__thumb img", depth: 6 },
  { selector: ".product-card__media img", depth: 8 },
  { selector: ".bundle-card__media img", depth: 8 },
  { selector: ".page-intro", depth: 8 },
  { selector: ".story-principles article", depth: 6 },
  { selector: ".coaching-audience article", depth: 6 },
  { selector: ".coaching-faq__items", depth: 6 },
  { selector: ".faq-groups", depth: 6 },
  { selector: ".help-content", depth: 6 },
  { selector: ".contact-page__aside", depth: 6 },
  { selector: ".account-page__panel", depth: 6 },
  { selector: ".cart-page__summary", depth: 6 },
  { selector: ".search-page__results", depth: 6 },
  { selector: ".empty-state", depth: 6 },
];

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function ParallaxEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = new Map<HTMLElement, ParallaxTarget>();

    for (const target of parallaxTargets) {
      document.querySelectorAll<HTMLElement>(target.selector).forEach((element) => {
        if (!targets.has(element)) targets.set(element, target);
      });
    }

    if (!targets.size || motionPreference.matches) return;

    const update = () => {
      const viewportHeight = window.innerHeight;

      targets.forEach((target, element) => {
        const bounds = element.getBoundingClientRect();
        const progress = clamp(
          (viewportHeight - bounds.top) / (viewportHeight + bounds.height),
          0,
          1,
        );
        const offset = (progress - 0.5) * target.depth;

        element.dataset.parallax = "true";
        element.style.setProperty("--parallax-offset", `${offset.toFixed(2)}px`);
        element.style.setProperty("--parallax-scale", String(target.scale ?? 1));
      });
    };

    let frameId: number | null = null;
    const requestUpdate = () => {
      if (frameId !== null) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        update();
      });
    };

    const handleMotionPreferenceChange = () => {
      if (motionPreference.matches) {
        targets.forEach((_, element) => {
          element.style.removeProperty("--parallax-offset");
          element.style.removeProperty("--parallax-scale");
          delete element.dataset.parallax;
        });
      } else {
        requestUpdate();
      }
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    motionPreference.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      motionPreference.removeEventListener("change", handleMotionPreferenceChange);

      if (frameId !== null) window.cancelAnimationFrame(frameId);

      targets.forEach((_, element) => {
        element.style.removeProperty("--parallax-offset");
        element.style.removeProperty("--parallax-scale");
        delete element.dataset.parallax;
      });
    };
  }, [pathname]);

  return null;
}

