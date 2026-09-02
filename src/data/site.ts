import type { ProductCategory } from "@/data/products";

export const shippingConfig = {
  uk: "Royal Mail Tracked 48 costs £4.95, with free UK delivery on orders over £75. Delivery takes 2–3 working days after dispatch, and orders are dispatched within 1 working day excluding weekends.",
  international:
    "We currently ship to selected EU countries, North America, the Middle East, Australia, and New Zealand. Rates and delivery windows vary by region; see Shipping & Delivery for the full policy.",
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

export const productSizeCharts: Record<
  ProductCategory,
  {
    title: string;
    caption: string;
    columns: readonly string[];
    rows: readonly (readonly string[])[];
  }
> = {
  hoodies: {
    title: "PHENO Hoodie Size Chart",
    caption: "Chest, length & sleeve",
    columns: ["Size", "Chest", "Length", "Sleeve length"],
    rows: [
      ["XS", "48\" / 120.7 cm", "26\" / 66.0 cm", "23.3\" / 59.1 cm"],
      ["S", "49\" / 125.7 cm", "27\" / 68.6 cm", "23.7\" / 60.3 cm"],
      ["M", "51\" / 130.8 cm", "28\" / 71.1 cm", "24.3\" / 61.6 cm"],
      ["L", "54\" / 135.9 cm", "29\" / 73.7 cm", "24.8\" / 62.9 cm"],
      ["XL", "56\" / 141.0 cm", "30\" / 76.8 cm", "25.2\" / 64.1 cm"],
      ["2XL", "58\" / 146.1 cm", "31\" / 80.0 cm", "25.7\" / 65.4 cm"],
    ],
  },
  joggers: {
    title: "PHENO Jogger Size Chart",
    caption: "Waist, inseam & outseam",
    columns: ["Size", "Recommended waist", "Inseam", "Outseam"],
    rows: [
      ["XS", "26–28\" / 66–71 cm", "24.9\" / 63.2 cm", "35.2\" / 89.5 cm"],
      ["S", "28–30\" / 71–76 cm", "25.2\" / 64.1 cm", "36.0\" / 91.4 cm"],
      ["M", "30–32\" / 76–81 cm", "25.9\" / 65.7 cm", "37.0\" / 94.0 cm"],
      ["L", "32–34\" / 81–86 cm", "26.3\" / 66.7 cm", "38.0\" / 96.5 cm"],
      ["XL", "34–36\" / 86–91 cm", "26.6\" / 67.6 cm", "39.3\" / 99.7 cm"],
      ["2XL", "36–38\" / 91–97 cm", "26.7\" / 67.9 cm", "40.5\" / 102.9 cm"],
    ],
  },
  shorts: {
    title: "PHENO Shorts Size Chart",
    caption: "Waist, liner & shell inseam",
    columns: ["Size", "Recommended waist", "Liner inseam", "Shell inseam"],
    rows: [
      ["XS", "26–28\" / 66–71 cm", "7\" / 17.8 cm", "4\" / 10.2 cm"],
      ["S", "28–30\" / 71–76 cm", "7\" / 17.8 cm", "4\" / 10.2 cm"],
      ["M", "30–32\" / 76–81 cm", "7\" / 17.8 cm", "4\" / 10.2 cm"],
      ["L", "32–34\" / 81–86 cm", "7\" / 17.8 cm", "4\" / 10.2 cm"],
      ["XL", "34–36\" / 86–91 cm", "7\" / 17.8 cm", "4\" / 10.2 cm"],
      ["2XL", "36–38\" / 91–97 cm", "7\" / 17.8 cm", "4\" / 10.2 cm"],
    ],
  },
  "t-shirts": {
    title: "PHENO Tee & Tank Size Chart",
    caption: "Tee and tank chest + length",
    columns: ["Size", "Tee chest", "Tee length", "Tank chest", "Tank length"],
    rows: [
      ["XS", "36\" / 91.4 cm", "27\" / 68.6 cm", "36\" / 91.4 cm", "27\" / 68.6 cm"],
      ["S", "38\" / 96.5 cm", "28\" / 71.1 cm", "38\" / 96.5 cm", "28\" / 71.1 cm"],
      ["M", "40\" / 101.6 cm", "29\" / 73.7 cm", "40\" / 101.6 cm", "29\" / 73.7 cm"],
      ["L", "42\" / 106.7 cm", "30\" / 76.2 cm", "42\" / 106.7 cm", "30\" / 76.2 cm"],
      ["XL", "44\" / 111.8 cm", "31\" / 78.7 cm", "44\" / 111.8 cm", "31\" / 78.7 cm"],
      ["2XL", "46\" / 116.8 cm", "32\" / 81.3 cm", "46\" / 116.8 cm", "32\" / 81.3 cm"],
    ],
  },
  tanks: {
    title: "PHENO Tee & Tank Size Chart",
    caption: "Tee and tank chest + length",
    columns: ["Size", "Tee chest", "Tee length", "Tank chest", "Tank length"],
    rows: [
      ["XS", "36\" / 91.4 cm", "27\" / 68.6 cm", "36\" / 91.4 cm", "27\" / 68.6 cm"],
      ["S", "38\" / 96.5 cm", "28\" / 71.1 cm", "38\" / 96.5 cm", "28\" / 71.1 cm"],
      ["M", "40\" / 101.6 cm", "29\" / 73.7 cm", "40\" / 101.6 cm", "29\" / 73.7 cm"],
      ["L", "42\" / 106.7 cm", "30\" / 76.2 cm", "42\" / 106.7 cm", "30\" / 76.2 cm"],
      ["XL", "44\" / 111.8 cm", "31\" / 78.7 cm", "44\" / 111.8 cm", "31\" / 78.7 cm"],
      ["2XL", "46\" / 116.8 cm", "32\" / 81.3 cm", "46\" / 116.8 cm", "32\" / 81.3 cm"],
    ],
  },
};

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
