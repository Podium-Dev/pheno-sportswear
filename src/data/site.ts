export const shippingConfig = {
  uk: "Free UK shipping on orders over £75. Orders are aimed to ship within 1 working day.",
  international:
    "European and international delivery rules are being confirmed. We will publish the final destinations, charges, and timings here before launch.",
  returns:
    "Returns information will be confirmed with the final PHENO commerce setup. Contact info@phenosportswear.com if you need help with an existing order.",
};

export const sizeGuideRows = [
  ["XS", "86–91", "71–76", "86–91"],
  ["S", "91–96", "76–81", "91–96"],
  ["M", "96–101", "81–86", "96–101"],
  ["L", "101–106", "86–91", "101–106"],
  ["XL", "106–111", "91–96", "106–111"],
  ["2XL", "111–116", "96–101", "111–116"],
] as const;

export const faqGroups = [
  {
    title: "Orders & Shipping",
    items: [
      [
        "When will my order ship?",
        "PHENO aims to process and ship orders within 1 working day. You will receive tracking information once an order is handed to the carrier.",
      ],
      [
        "Do you offer free shipping?",
        shippingConfig.uk,
      ],
      [
        "Do you ship internationally?",
        shippingConfig.international,
      ],
    ],
  },
  {
    title: "Returns & Exchanges",
    items: [
      [
        "How do I contact PHENO about a return?",
        shippingConfig.returns,
      ],
      [
        "Can I exchange an item?",
        "Exchange arrangements depend on the final fulfilment setup. Email info@phenosportswear.com with your order details before sending anything back.",
      ],
    ],
  },
  {
    title: "Sizing & Fit",
    items: [
      [
        "How do I choose a size?",
        "Use the measurements in the Size Guide and choose the closest match. If you are between sizes, contact PHENO before ordering for help.",
      ],
      [
        "Where can I find the Size Guide?",
        "The full Size Guide is available at /help/size-guide and from every product page.",
      ],
    ],
  },
  {
    title: "Products & Restocks",
    items: [
      [
        "What is the Type 1 range?",
        "Type 1 is PHENO's current performance range, including tops, bottoms, and training combinations.",
      ],
      [
        "Can I be notified when a size returns?",
        "Select a sold-out size on a product page and use Notify Me to register interest. Email delivery will be connected once the notification provider is configured.",
      ],
    ],
  },
  {
    title: "Account & Contact",
    items: [
      [
        "Do I need an account to shop?",
        "No account is required for the current preview storefront. Customer accounts will be connected once the authentication choice is confirmed.",
      ],
      [
        "How do I contact PHENO?",
        "Email info@phenosportswear.com or use the contact form on the Contact page.",
      ],
    ],
  },
] as const;
