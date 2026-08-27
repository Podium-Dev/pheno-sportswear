"use client";

import { FormEvent, useRef, useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

async function postForm(endpoint: string, payload: Record<string, string>) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as { message?: string };

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return data;
}

function FormMessage({ status, message }: { status: FormStatus; message: string }) {
  if (status === "idle" || !message) {
    return null;
  }

  return (
    <p
      className={`form-message form-message--${status === "error" ? "error" : "success"}`}
      role="status"
    >
      {message}
    </p>
  );
}

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current?.reportValidity()) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    setStatus("submitting");
    setMessage("");

    try {
      await postForm("/api/newsletter", {
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

  return (
    <form
      ref={formRef}
      className={`newsletter-form${compact ? " newsletter-form--compact" : ""}`}
      onSubmit={handleSubmit}
    >
      <label className="visually-hidden" htmlFor={compact ? "footer-newsletter-email" : "newsletter-email"}>
        Email address
      </label>
      <div className="newsletter-form__row">
        <input
          id={compact ? "footer-newsletter-email" : "newsletter-email"}
          name="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          required
        />
        <button className="button button--light" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "..." : "Join"}
        </button>
      </div>
      <FormMessage status={status} message={message} />
    </form>
  );
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current?.reportValidity()) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    setStatus("submitting");
    setMessage("");

    try {
      await postForm("/api/contact", {
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        subject: String(formData.get("subject") || ""),
        message: String(formData.get("message") || ""),
      });
      setStatus("success");
      setMessage("Thanks, your message has been sent.");
      formRef.current?.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
  };

  return (
    <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>
          Name
          <input name="name" type="text" autoComplete="name" required minLength={2} />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Phone <span>(optional)</span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
        <label>
          Subject
          <input name="subject" type="text" required minLength={2} />
        </label>
        <label className="form-grid__full">
          Message
          <textarea name="message" rows={6} required minLength={10} />
        </label>
      </div>
      <div className="form-actions">
        <button className="button button--dark" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending..." : "Send message"}
        </button>
        <FormMessage status={status} message={message} />
      </div>
    </form>
  );
}

export function InterestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current?.reportValidity()) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    setStatus("submitting");
    setMessage("");

    try {
      await postForm("/api/coaching-interest", {
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        goal: String(formData.get("goal") || ""),
      });
      setStatus("success");
      setMessage("Thanks, your interest has been noted.");
      formRef.current?.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
  };

  return (
    <form ref={formRef} className="interest-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>
          Name
          <input name="name" type="text" autoComplete="name" required minLength={2} />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="form-grid__full">
          What are you training for?
          <textarea name="goal" rows={5} required minLength={10} />
        </label>
      </div>
      <div className="form-actions">
        <button className="button button--dark" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending..." : "Register interest"}
        </button>
        <FormMessage status={status} message={message} />
      </div>
    </form>
  );
}

export function NotifyMeForm({
  productSlug,
  productName,
  colour,
  size,
}: {
  productSlug: string;
  productName: string;
  colour: string;
  size: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current?.reportValidity()) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    setStatus("submitting");
    setMessage("");

    try {
      await postForm("/api/back-in-stock", {
        email: String(formData.get("email") || ""),
        productSlug,
        productName,
        colour,
        size,
      });
      setStatus("success");
      setMessage("Thanks, we will be in touch when this size is available.");
      formRef.current?.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
  };

  return (
    <form ref={formRef} className="notify-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor={`notify-${productSlug}`}>Email address</label>
      <div className="notify-form__row">
        <input id={`notify-${productSlug}`} name="email" type="email" autoComplete="email" required />
        <button className="button button--dark" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "..." : "Notify me"}
        </button>
      </div>
      <FormMessage status={status} message={message} />
    </form>
  );
}
