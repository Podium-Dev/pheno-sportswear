import { NextResponse } from "next/server";
import { formNotConfiguredMessage, sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const goal = String(body.goal || "").trim();

  if (name.length < 2 || !email.includes("@") || goal.length < 10) {
    return NextResponse.json(
      { ok: false, message: "Please complete your name, email, and training goal." },
      { status: 400 },
    );
  }

  const result = await sendEmail({
    subject: "PHENO coaching register interest",
    replyTo: email,
    text: `Name: ${name}\nEmail: ${email}\n\nTraining goal:\n${goal}`,
  });

  if (!result.configured) {
    return NextResponse.json(
      { ok: false, message: formNotConfiguredMessage("Coaching interest") },
      { status: 503 },
    );
  }

  if (!result.sent) {
    return NextResponse.json(
      { ok: false, message: "We could not send your interest form. Please email info@phenosportswear.com." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
