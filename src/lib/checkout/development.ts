export const checkoutDevelopment = {
  contact: "Guest checkout is enabled for this isolated preview. No customer account is required.",
  shipping: {
    label: "Development shipping",
    description:
      "Temporary manual shipping option for preview only. Final delivery rules and rates remain a client decision.",
  },
  payment: {
    providerId: "pp_system_default",
    label: "Development manual payment",
    description:
      "Temporary Medusa system payment for preview only. No third-party payment is processed or charged.",
  },
  tax: {
    description:
      "Temporary basic tax configuration for preview only. Final UK VAT treatment remains a client decision.",
  },
  review:
    "This will complete a development cart in the isolated preview database and create a development order. It does not touch production.",
} as const;
