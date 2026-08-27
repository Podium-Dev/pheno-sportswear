import { NextResponse } from "next/server";
import { formNotConfiguredMessage, sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const email = String(body.email || "").trim();
  const productName = String(body.productName || "").trim();
  const productSlug = String(body.productSlug || "").trim();
  const colour = String(body.colour || "").trim();
  const size = String(body.size || "").trim();

  if (!email.includes("@") || !productName || !productSlug || !colour || !size) {
    return NextResponse.json(
      { ok: false, message: "Please enter your email before requesting a stock notification." },
      { status: 400 },
    );
  }

  const result = await sendEmail({
    subject: `PHENO restock interest: ${productName}`,
    replyTo: email,
    text: `Email: ${email}\nProduct: ${productName} (${productSlug})\nColour: ${colour}\nSize: ${size}`,
  });

  if (!result.configured) {
    return NextResponse.json(
      { ok: false, message: formNotConfiguredMessage("Restock notifications") },
      { status: 503 },
    );
  }

  if (!result.sent) {
    return NextResponse.json(
      { ok: false, message: "We could not save your request. Please email info@phenosportswear.com." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
