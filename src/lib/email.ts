type EmailMessage = {
  subject: string;
  text: string;
  replyTo?: string;
  to?: string;
};

export async function sendEmail(message: EmailMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = message.to || process.env.CONTACT_TO_EMAIL || "info@phenosportswear.com";

  if (!apiKey || !from) {
    return { sent: false, configured: false };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: message.subject,
      text: message.text,
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
    }),
  });

  return { sent: response.ok, configured: true };
}

export function formNotConfiguredMessage(kind: string) {
  return `${kind} delivery is not connected yet. Please email info@phenosportswear.com while the integration is being configured.`;
}
