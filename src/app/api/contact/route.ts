import { NextResponse } from "next/server";
import { formNotConfiguredMessage, sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();

  if (name.length < 2 || !email.includes("@") || subject.length < 2 || message.length < 10) {
    return NextResponse.json(
      { ok: false, message: "Please complete every required field before sending your message." },
      { status: 400 },
    );
  }

  const result = await sendEmail({
    subject: `PHENO contact: ${subject}`,
    replyTo: email,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\n\n${message}`,
  });

  if (!result.configured) {
    return NextResponse.json(
      { ok: false, message: formNotConfiguredMessage("Contact form") },
      { status: 503 },
    );
  }

  if (!result.sent) {
    return NextResponse.json(
      { ok: false, message: "We could not send your message. Please email info@phenosportswear.com." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
