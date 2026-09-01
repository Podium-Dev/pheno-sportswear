"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { postForm } from "@/components/Forms";

type ModalStatus = "idle" | "submitting" | "success" | "error";

const EARLY_ACCESS_STORAGE_KEY = "pheno-early-access-seen-v1";

function markAsSeen() {
  try {
    window.sessionStorage.setItem(EARLY_ACCESS_STORAGE_KEY, "1");
  } catch {
    // The modal can still be used when browser storage is unavailable.
  }
}

function hasBeenSeen() {
  try {
    return window.sessionStorage.getItem(EARLY_ACCESS_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function EarlyAccessModal() {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<ModalStatus>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (hasBeenSeen()) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      markAsSeen();
      setIsOpen(true);
    }, 850);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstNameRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = () => {
    markAsSeen();
    setIsOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    setStatus("submitting");
    setMessage("");

    try {
      await postForm("/api/newsletter", {
        firstName: String(formData.get("firstName") || ""),
        email: String(formData.get("email") || ""),
      });
      setStatus("success");
      setMessage("You are on the list.");
      formRef.current?.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="early-access-overlay" role="presentation">
      <button
        className="early-access-overlay__backdrop"
        type="button"
        aria-label="Close early access signup"
        onClick={handleClose}
      />
      <section
        className="early-access-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="early-access-title"
      >
        <button
          className="early-access-modal__close"
          type="button"
          aria-label="Close early access signup"
          onClick={handleClose}
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="early-access-modal__header">
          <h2 id="early-access-title">Sign up for early access &amp; special offers</h2>
          <p>Complete the form to sign up and be the first to know about exclusives &amp; new products!</p>
        </div>

        <form ref={formRef} className="early-access-modal__form" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="early-access-first-name">
            First name
          </label>
          <input
            ref={firstNameRef}
            id="early-access-first-name"
            name="firstName"
            type="text"
            placeholder="First name"
            autoComplete="given-name"
            required
          />

          <label className="visually-hidden" htmlFor="early-access-email">
            Email address
          </label>
          <input
            id="early-access-email"
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
          />

          <button className="early-access-modal__button" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Joining..." : status === "success" ? "Joined" : "Join now"}
          </button>

          {message ? (
            <p className={`early-access-modal__message early-access-modal__message--${status}`} role="status">
              {message}
            </p>
          ) : null}

          <p className="early-access-modal__consent">
            By signing up, you agree to receive marketing emails. View our{" "}
            <a href="/privacy">privacy policy</a> and <a href="/privacy">terms of service</a> for more info.
          </p>
        </form>
      </section>
    </div>
  );
}
