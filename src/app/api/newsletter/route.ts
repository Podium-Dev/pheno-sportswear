import { NextResponse } from "next/server";
import { formNotConfiguredMessage, sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const email = String(body.email || "").trim();

  if (!email.includes("@")) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const result = await sendEmail({
    to: process.env.NEWSLETTER_TO_EMAIL || undefined,
    subject: "New PHENO newsletter interest",
    text: `Newsletter signup: ${email}`,
    replyTo: email,
  });

  if (!result.configured) {
    return NextResponse.json(
      { ok: false, message: formNotConfiguredMessage("Newsletter") },
      { status: 503 },
    );
  }

  if (!result.sent) {
    return NextResponse.json(
      { ok: false, message: "We could not save your email. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
