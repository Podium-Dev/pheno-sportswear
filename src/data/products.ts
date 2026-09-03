export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "2XL"] as const;
export type Size = (typeof SIZE_OPTIONS)[number];

export const COLOUR_OPTIONS = ["Black", "White"] as const;
export type Colour = (typeof COLOUR_OPTIONS)[number];

export type ProductCategory =
  | "t-shirts"
  | "tanks"
  | "hoodies"
  | "shorts"
  | "joggers";

export type ProductVariant = {
  id: string;
  size: Size;
  colour: Colour;
  available: boolean;
};

export type ProductFeature = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type ProductEngineeredDetail = {
  number: number;
  title: string;
  description: string;
  marker?: {
    top: string;
    left: string;
    line: "left" | "right";
    lineLength: string;
  };
};

export type ProductEngineeredDetails = {
  title: string;
  image: string;
  imageAlt: string;
  details: ProductEngineeredDetail[];
  artworkHasEmbeddedCallouts?: boolean;
  markerSize?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  collection: "type-1";
  category: ProductCategory;
  price: number;
  currencyCode?: string;
  description: string;
  construction: string;
  features: string[];
  performanceFeatures: ProductFeature[];
  performanceFeaturesByColour?: Partial<Record<Colour, ProductFeature[]>>;
  engineeredDetails?: ProductEngineeredDetails;
  engineeredDetailsByColour?: Partial<Record<Colour, ProductEngineeredDetails>>;
  images: string[];
  colourImages: Partial<Record<Colour, string>>;
  galleryImagesByColour?: Partial<Record<Colour, string[]>>;
  colours: Colour[];
  sizes: Size[];
  variants: ProductVariant[];
  relatedProductSlugs: string[];
  completeTheLookSlugs: string[];
};

function createVariants(
  id: string,
  colours: Colour[],
  unavailable: Array<{ colour: Colour; size: Size }> = [],
): ProductVariant[] {
  return colours.flatMap((colour) =>
    SIZE_OPTIONS.map((size) => ({
      id: `${id}-${colour.toLowerCase()}-${size.toLowerCase()}`,
      size,
      colour,
      available: !unavailable.some(
        (item) => item.colour === colour && item.size === size,
      ),
    })),
  );
}

function createGalleryImages(directory: string, count: number) {
  return Array.from(
    { length: count },
    (_, index) => `${directory}/${String(index + 1).padStart(2, "0")}.jpg`,
  );
}

const galleries = {
  hoodie: createGalleryImages("/images/product-galleries/type-1-hoodie", 6),
  joggers: createGalleryImages("/images/product-galleries/type-1-joggers", 10),
  shorts: createGalleryImages("/images/product-galleries/type-1-shorts", 7),
  tshirt: {
    Black: createGalleryImages("/images/product-galleries/type-1-tshirt/black", 7),
    White: createGalleryImages("/images/product-galleries/type-1-tshirt/white", 7),
  },
  tank: {
    Black: createGalleryImages("/images/product-galleries/type-1-tank/black", 7),
    White: createGalleryImages("/images/product-galleries/type-1-tank/white", 7),
  },
} as const;

function createEngineeredDetails(
  image: string,
  imageAlt: string,
  details: ProductEngineeredDetail[],
  options: Pick<ProductEngineeredDetails, "artworkHasEmbeddedCallouts" | "markerSize"> = {},
): ProductEngineeredDetails {
  return {
    title: "ENGINEERED DETAILS",
    image,
    imageAlt,
    details,
    ...options,
  };
}

function createEmbeddedCalloutDetails(
  image: string,
  imageAlt: string,
  details: ProductEngineeredDetail[],
): ProductEngineeredDetails {
  return createEngineeredDetails(image, imageAlt, details, {
    artworkHasEmbeddedCallouts: true,
  });
}

const hoodieEngineeredDetails = createEmbeddedCalloutDetails(
  "/images/product-anatomies/type-1-hoodie-callouts.png",
  "Black PHENO Type 1 Hoodie with numbered engineered construction details",
  [
    {
      number: 1,
      title: "320 GSM FABRIC",
      description: "Heavyweight feel for warmth without compromising mobility.",
      marker: { top: "39%", left: "16%", line: "right", lineLength: "clamp(52px, 5vw, 86px)" },
    },
    {
      number: 2,
      title: "STRETCH COMFORT",
      description: "Engineered stretch for unrestricted movement.",
      marker: { top: "55%", left: "11%", line: "right", lineLength: "clamp(44px, 4.5vw, 72px)" },
    },
    {
      number: 3,
      title: "SHAPE RETENTION",
      description: "Keeps its shape, wear after wear.",
      marker: undefined,
    },
    {
      number: 4,
      title: "KANGAROO POCKET WITH ZIP ENTRY",
      description: "Secure storage with a clean, minimal look.",
      marker: { top: "72%", left: "87%", line: "left", lineLength: "clamp(72px, 9vw, 132px)" },
    },
    {
      number: 5,
      title: "RIBBED CUFFS",
      description: "Locked-in fit that holds its shape.",
      marker: { top: "93%", left: "11%", line: "right", lineLength: "clamp(32px, 4vw, 58px)" },
    },
    {
      number: 6,
      title: "PHENO PERFORMANCE LOGO",
      description: "Subtle, reflective detailing.",
      marker: { top: "50%", left: "86%", line: "left", lineLength: "clamp(28px, 3.5vw, 52px)" },
    },
    {
      number: 7,
      title: "ADJUSTABLE HOOD",
      description: "Coverage and comfort when you need it.",
      marker: { top: "22%", left: "76%", line: "left", lineLength: "clamp(54px, 6vw, 90px)" },
    },
  ],
);

const joggersEngineeredDetails = createEmbeddedCalloutDetails(
  "/images/product-anatomies/type-1-joggers-callouts.png",
  "Black PHENO Type 1 Joggers with numbered engineered construction details",
  [
    {
      number: 1,
      title: "4-WAY STRETCH FABRIC",
      description: "High-stretch woven fabric for total movement.",
      marker: { top: "16%", left: "24%", line: "right", lineLength: "clamp(42px, 5vw, 70px)" },
    },
    {
      number: 2,
      title: "ARTICULATED KNEES",
      description: "Shaped for natural movement and mobility.",
      marker: { top: "59%", left: "24%", line: "right", lineLength: "clamp(48px, 5.5vw, 78px)" },
    },
    {
      number: 3,
      title: "SECURE ZIP POCKETS",
      description: "Zipped side pockets keep essentials safe.",
      marker: { top: "23%", left: "24%", line: "right", lineLength: "clamp(46px, 5.5vw, 74px)" },
    },
    {
      number: 4,
      title: "CARGO POCKETS",
      description: "Spacious side pockets for everyday storage.",
      marker: { top: "41%", left: "24%", line: "right", lineLength: "clamp(26px, 4vw, 52px)" },
    },
    {
      number: 5,
      title: "TAPERED PERFORMANCE FIT",
      description: "Tapers through the leg for a clean, athletic silhouette.",
      marker: { top: "51%", left: "72%", line: "left", lineLength: "clamp(28px, 4vw, 52px)" },
    },
    {
      number: 6,
      title: "RIBBED CUFFS",
      description: "Lock-in fit at the ankle for comfort and focus.",
      marker: { top: "88%", left: "72%", line: "left", lineLength: "clamp(42px, 5vw, 70px)" },
    },
    {
      number: 7,
      title: "PHENO PERFORMANCE LOGO",
      description: "Subtle, reflective branding for a premium finish.",
      marker: { top: "32%", left: "71%", line: "left", lineLength: "clamp(42px, 5vw, 68px)" },
    },
  ],
);

function createPerformanceTopEngineeredDetails(
  productName: "T-Shirt" | "Tank",
  colour: Colour,
): ProductEngineeredDetails {
  const imagePath =
    productName === "T-Shirt"
      ? `/images/product-anatomies/type-1-tshirt-${colour.toLowerCase()}-callouts.png`
      : `/images/product-anatomies/type-1-tank-${colour.toLowerCase()}-callouts.png`;
  const markerPositions =
    productName === "T-Shirt"
      ? colour === "White"
        ? [
            { top: "21%", left: "13%", line: "right", lineLength: "clamp(56px, 6.5vw, 88px)" },
            { top: "48%", left: "16%", line: "right", lineLength: "clamp(36px, 5vw, 64px)" },
            { top: "58%", left: "77%", line: "left", lineLength: "clamp(38px, 5vw, 64px)" },
            { top: "71%", left: "77%", line: "left", lineLength: "clamp(38px, 5vw, 64px)" },
            { top: "81%", left: "16%", line: "right", lineLength: "clamp(36px, 5vw, 64px)" },
            { top: "30%", left: "87%", line: "left", lineLength: "clamp(38px, 5vw, 64px)" },
            { top: "86%", left: "77%", line: "left", lineLength: "clamp(48px, 5.5vw, 78px)" },
          ] as const
        : [
            { top: "23%", left: "11%", line: "right", lineLength: "clamp(72px, 8vw, 112px)" },
            { top: "48%", left: "14%", line: "right", lineLength: "clamp(48px, 5.5vw, 78px)" },
            { top: "55%", left: "73%", line: "left", lineLength: "clamp(42px, 5vw, 68px)" },
            { top: "71%", left: "74%", line: "left", lineLength: "clamp(44px, 5vw, 72px)" },
            { top: "83%", left: "13%", line: "right", lineLength: "clamp(54px, 6vw, 86px)" },
            { top: "29%", left: "86%", line: "left", lineLength: "clamp(54px, 6vw, 86px)" },
            { top: "84%", left: "74%", line: "left", lineLength: "clamp(64px, 7vw, 100px)" },
          ] as const
      : colour === "White"
        ? [
            { top: "16%", left: "15%", line: "right", lineLength: "clamp(70px, 8vw, 108px)" },
            { top: "44%", left: "12%", line: "right", lineLength: "clamp(44px, 5.5vw, 72px)" },
            { top: "42%", left: "82%", line: "left", lineLength: "clamp(32px, 4.5vw, 58px)" },
            { top: "60%", left: "82%", line: "left", lineLength: "clamp(28px, 4vw, 54px)" },
            { top: "76%", left: "12%", line: "right", lineLength: "clamp(38px, 5vw, 64px)" },
            { top: "10%", left: "80%", line: "left", lineLength: "clamp(50px, 6vw, 80px)" },
            { top: "80%", left: "84%", line: "left", lineLength: "clamp(42px, 5vw, 70px)" },
          ] as const
        : [
            { top: "16%", left: "16%", line: "right", lineLength: "clamp(70px, 8vw, 108px)" },
            { top: "45%", left: "11%", line: "right", lineLength: "clamp(44px, 5.5vw, 72px)" },
            { top: "47%", left: "84%", line: "left", lineLength: "clamp(32px, 4.5vw, 58px)" },
            { top: "62%", left: "84%", line: "left", lineLength: "clamp(28px, 4vw, 54px)" },
            { top: "81%", left: "12%", line: "right", lineLength: "clamp(38px, 5vw, 64px)" },
            { top: "8%", left: "79%", line: "left", lineLength: "clamp(50px, 6vw, 80px)" },
            { top: "82%", left: "85%", line: "left", lineLength: "clamp(42px, 5vw, 70px)" },
          ] as const;

  return createEmbeddedCalloutDetails(
    imagePath,
    `${colour} PHENO Type 1 ${productName} with numbered engineered construction details`,
    [
      {
        number: 1,
        title: "BREATHABLE FABRIC",
        description: "Advanced knit material allows airflow to keep you cool.",
        marker: { ...markerPositions[0] },
      },
      {
        number: 2,
        title: "MESH SIDE PANELS",
        description: "Strategic mesh panels enhance ventilation where you need it.",
        marker: { ...markerPositions[1] },
      },
      {
        number: 3,
        title: "QUICK DRY",
        description: "Moisture-wicking technology pulls sweat away fast.",
        marker: { ...markerPositions[2] },
      },
      {
        number: 4,
        title: "COOLING ZONES",
        description: "Engineered zones help regulate heat during intense training.",
        marker: { ...markerPositions[3] },
      },
      {
        number: 5,
        title: "STRETCH JERSEY",
        description: "4-way stretch fabric moves with you in every direction.",
        marker: { ...markerPositions[4] },
      },
      {
        number: 6,
        title: "LIGHTWEIGHT",
        description: "Minimal weight, maximum performance.",
        marker: { ...markerPositions[5] },
      },
      {
        number: 7,
        title: "REFLECTIVE DETAIL",
        description: "Subtle reflective branding for visibility in low light.",
        marker: { ...markerPositions[6] },
      },
    ],
  );
}

const sourceProducts: Product[] = [
  {
    id: "pheno-type-1-hoodie",
    slug: "pheno-type-1-hoodie",
    name: "PHENO Type 1 Hoodie",
    collection: "type-1",
    category: "hoodies",
    price: 59,
    description:
      "A performance fleece hoodie built from a 320 GSM knit that balances warmth, stretch, and durability for warm-up, cooldown, and active recovery.",
    construction: "42% cotton, 54% polyester, 4% spandex",
    features: [
      "320 GSM fabric",
      "Stretch comfort",
      "Shape retention",
      "Secure storage",
      "Ribbed finish",
      "Reflective detail",
      "Adjustable hood",
    ],
    performanceFeatures: [
      {
        id: "fabric-weight",
        title: "320 GSM FABRIC",
        description: "Warmth without the bulk.",
        image: "/images/type-1-hoodie-features/fabric.png",
        imageAlt: "Close-up of the 320 GSM fabric on the black PHENO Type 1 Hoodie",
      },
      {
        id: "stretch-comfort",
        title: "STRETCH COMFORT",
        description: "Built to move with you.",
        image: "/images/type-1-hoodie-features/stretch-comfort.png",
        imageAlt: "Stretch fabric detail on the black PHENO Type 1 Hoodie",
      },
      {
        id: "shape-retention",
        title: "SHAPE RETENTION",
        description: "Keeps its shape, wear after wear.",
        image: "/images/type-1-hoodie-features/shape-retention.png",
        imageAlt: "Shape retention fabric detail on the black PHENO Type 1 Hoodie",
      },
      {
        id: "secure-storage",
        title: "SECURE STORAGE",
        description: "Hidden zip pocket for essentials.",
        image: "/images/type-1-hoodie-features/secure-storage.png",
        imageAlt: "Zipped pocket detail on the black PHENO Type 1 Hoodie",
      },
      {
        id: "ribbed-finish",
        title: "RIBBED FINISH",
        description: "Locked-in fit, made to last.",
        image: "/images/type-1-hoodie-features/ribbed-finish.png",
        imageAlt: "Ribbed cuff detail on the black PHENO Type 1 Hoodie",
      },
      {
        id: "reflective-detail",
        title: "REFLECTIVE DETAIL",
        description: "Subtle branding, premium finish.",
        image: "/images/type-1-hoodie-features/reflective-detail.png",
        imageAlt: "Reflective PHENO branding detail on the black PHENO Type 1 Hoodie",
      },
      {
        id: "adjustable-hood",
        title: "ADJUSTABLE HOOD",
        description: "Custom coverage, all day comfort.",
        image: "/images/type-1-hoodie-features/adjustable-hood.png",
        imageAlt: "Adjustable hood detail on the black PHENO Type 1 Hoodie",
      },
    ],
    engineeredDetails: hoodieEngineeredDetails,
    images: [
      ...galleries.hoodie,
    ],
    colourImages: { Black: galleries.hoodie[0] },
    colours: ["Black"],
    sizes: [...SIZE_OPTIONS],
    variants: createVariants("pheno-type-1-hoodie", ["Black"], [
      { colour: "Black", size: "XS" },
    ]),
    relatedProductSlugs: ["pheno-type-1-joggers"],
    completeTheLookSlugs: ["pheno-type-1-joggers"],
  },
  {
    id: "pheno-type-1-joggers",
    slug: "pheno-type-1-joggers",
    name: "PHENO Type 1 Joggers",
    collection: "type-1",
    category: "joggers",
    price: 65,
    description:
      "High-stretch woven joggers engineered for mobility, with a smooth matte surface, articulated knees, and a tapered leg for technical everyday movement.",
    construction: "77% nylon, 23% spandex",
    features: [
      "4-way stretch fabric",
      "Articulated knees",
      "Smooth matte fabric",
      "Tapered performance fit",
      "Secure storage",
      "High-stretch construction",
    ],
    performanceFeatures: [
      {
        id: "stretch",
        title: "4-WAY STRETCH FABRIC",
        description: "Moves without restriction.",
        image: "/images/type-1-joggers-features/4-way-stretch-fabric.png",
        imageAlt: "Close-up of the 4-way stretch fabric on the black PHENO Type 1 Joggers",
      },
      {
        id: "articulated-knees",
        title: "ARTICULATED KNEES",
        description: "Built for natural movement.",
        image: "/images/type-1-joggers-features/articulated-knees.png",
        imageAlt: "Articulated knee detail on the black PHENO Type 1 Joggers",
      },
      {
        id: "smooth-matte-fabric",
        title: "SMOOTH MATTE FABRIC",
        description: "Premium technical feel.",
        image: "/images/type-1-joggers-features/smooth-matte-fabric.png",
        imageAlt: "Smooth matte fabric detail on the black PHENO Type 1 Joggers",
      },
      {
        id: "tapered-fit",
        title: "TAPERED PERFORMANCE FIT",
        description: "Designed to move cleanly.",
        image: "/images/type-1-joggers-features/tapered-performance-fit.png",
        imageAlt: "Tapered leg detail on the black PHENO Type 1 Joggers",
      },
      {
        id: "secure-storage",
        title: "SECURE STORAGE",
        description: "Keep essentials close.",
        image: "/images/type-1-joggers-features/secure-storage.png",
        imageAlt: "Secure zip pocket detail on the black PHENO Type 1 Joggers",
      },
      {
        id: "high-stretch-construction",
        title: "HIGH-STRETCH CONSTRUCTION",
        description: "Flexible through every session.",
        image: "/images/type-1-joggers-features/high-stretch-construction.png",
        imageAlt: "High-stretch construction detail on the black PHENO Type 1 Joggers",
      },
    ],
    engineeredDetails: joggersEngineeredDetails,
    images: [
      ...galleries.joggers,
    ],
    colourImages: { Black: galleries.joggers[0] },
    colours: ["Black"],
    sizes: [...SIZE_OPTIONS],
    variants: createVariants("pheno-type-1-joggers", ["Black"]),
    relatedProductSlugs: ["pheno-type-1-hoodie"],
    completeTheLookSlugs: ["pheno-type-1-hoodie"],
  },
  {
    id: "pheno-type-1-shorts",
    slug: "pheno-type-1-shorts",
    name: "PHENO Type 1 Shorts",
    collection: "type-1",
    category: "shorts",
    price: 45,
    description:
      "A 2-in-1 training short combining a lightweight stretch woven shell with a supportive compression liner and ventilated mesh zones for high-output sessions.",
    construction:
      "Shell: 90% polyester, 10% spandex. Liner: 90% polyester, 10% spandex jersey and mesh zones",
    features: [
      "4-way stretch",
      "Compression liner",
      "Breathable ventilation",
      "Moisture wicking",
      "Secure pockets",
      "Lightweight shell",
    ],
    performanceFeatures: [
      {
        id: "stretch",
        title: "4-WAY STRETCH",
        description: "Moves with you.",
        image: "/images/type-1-shorts-features/stretch.png",
        imageAlt: "Black PHENO Type 1 Shorts stretch shell",
      },
      {
        id: "compression-liner",
        title: "COMPRESSION LINER",
        description: "Support and stability.",
        image: "/images/type-1-shorts-features/compression-liner.png",
        imageAlt: "White integrated compression liner in PHENO Type 1 Shorts",
      },
      {
        id: "breathable",
        title: "BREATHABLE",
        description: "Enhanced ventilation.",
        image: "/images/type-1-shorts-features/breathable.png",
        imageAlt: "Ventilation detail on black PHENO Type 1 Shorts",
      },
      {
        id: "moisture-wicking",
        title: "MOISTURE WICKING",
        description: "Keeps you dry.",
        image: "/images/type-1-shorts-features/moisture-wicking.png",
        imageAlt: "Technical outer material on PHENO Type 1 Shorts",
      },
      {
        id: "secure-pockets",
        title: "SECURE POCKETS",
        description: "Essentials stay safe.",
        image: "/images/type-1-shorts-features/secure-pockets.png",
        imageAlt: "Zipped pocket detail on PHENO Type 1 Shorts",
      },
      {
        id: "lightweight",
        title: "LIGHTWEIGHT",
        description: "Maximum performance.",
        image: "/images/type-1-shorts-features/lightweight.png",
        imageAlt: "Lightweight shell of PHENO Type 1 Shorts",
      },
    ],
    engineeredDetails: {
      title: "ENGINEERED DETAILS",
      image: "/images/type-1-shorts-detail.jpg",
      imageAlt: "Black PHENO Type 1 Shorts with numbered engineered construction details",
      details: [
        {
          number: 1,
          title: "ELASTIC WAISTBAND & INTERNAL DRAWCORD",
          description: "Secure, adjustable fit that moves with you.",
          marker: { top: "23%", left: "11%", line: "right", lineLength: "clamp(64px, 7.5vw, 112px)" },
        },
        {
          number: 2,
          title: "ZIPPED POCKETS",
          description: "Secure storage for your essentials.",
          marker: { top: "39%", left: "10%", line: "right", lineLength: "clamp(52px, 6.5vw, 96px)" },
        },
        {
          number: 3,
          title: "LASER-CUT VENTILATION",
          description: "Strategic perforations for enhanced airflow and cooling.",
          marker: { top: "44%", left: "89%", line: "left", lineLength: "clamp(44px, 6vw, 86px)" },
        },
        {
          number: 4,
          title: "4-WAY STRETCH OUTER SHELL",
          description: "Lightweight and flexible fabric for unrestricted movement.",
          marker: { top: "61%", left: "10%", line: "right", lineLength: "clamp(40px, 5vw, 70px)" },
        },
        {
          number: 5,
          title: "2-IN-1 COMPRESSION LINER",
          description: "Built-in support reduces chafing and enhances performance.",
          marker: { top: "72%", left: "88%", line: "left", lineLength: "clamp(50px, 6.5vw, 96px)" },
        },
        {
          number: 6,
          title: "SPLIT HEM DESIGN",
          description: "Increased range of motion for explosive training.",
          marker: { top: "78%", left: "63%", line: "right", lineLength: "clamp(28px, 3.5vw, 52px)" },
        },
        {
          number: 7,
          title: "PHENO PERFORMANCE LOGO",
          description: "Reflective detailing for a premium, athletic finish.",
          marker: { top: "61%", left: "83%", line: "left", lineLength: "clamp(45px, 5.5vw, 80px)" },
        },
      ],
    },
    images: [
      ...galleries.shorts,
    ],
    colourImages: { Black: galleries.shorts[0] },
    colours: ["Black"],
    sizes: [...SIZE_OPTIONS],
    variants: createVariants("pheno-type-1-shorts", ["Black"]),
    relatedProductSlugs: ["pheno-type-1-t-shirt", "pheno-type-1-tank"],
    completeTheLookSlugs: ["pheno-type-1-t-shirt", "pheno-type-1-tank"],
  },
  {
    id: "pheno-type-1-t-shirt",
    slug: "pheno-type-1-t-shirt",
    name: "PHENO Type 1 T-Shirt",
    collection: "type-1",
    category: "t-shirts",
    price: 36,
    description:
      "A lightweight performance top combining smooth jersey knit with micro-perforated mesh side panels for airflow and heat regulation during high-intensity training.",
    construction: "90% polyester, 10% spandex knit with mesh side panels",
    features: [
      "Breathable fabric",
      "Mesh side panels",
      "Quick dry",
      "Cooling zones",
      "Stretch jersey",
      "Lightweight",
      "Reflective detail",
    ],
    performanceFeatures: [
      {
        id: "breathable",
        title: "BREATHABLE FABRIC",
        description: "Built to breathe, keeps you cool.",
        image: "/images/type-1-tshirt-features/breathable-fabric.png",
        imageAlt: "Breathable knit fabric detail on the black PHENO Type 1 T-Shirt",
      },
      {
        id: "mesh-side-panels",
        title: "MESH SIDE PANELS",
        description: "Enhanced airflow where it counts.",
        image: "/images/type-1-tshirt-features/mesh-side-panels.png",
        imageAlt: "Mesh side panel fabric detail on the black PHENO Type 1 T-Shirt",
      },
      {
        id: "quick-dry",
        title: "QUICK DRY",
        description: "Sweat-wicking, fast drying.",
        image: "/images/type-1-tshirt-features/quick-dry.png",
        imageAlt: "Quick-dry fabric detail on the black PHENO Type 1 T-Shirt",
      },
      {
        id: "cooling-zones",
        title: "COOLING ZONES",
        description: "Ventilation engineered for performance.",
        image: "/images/type-1-tshirt-features/cooling-zones.png",
        imageAlt: "Laser-cut cooling zone detail on the black PHENO Type 1 T-Shirt",
      },
      {
        id: "stretch-jersey",
        title: "STRETCH JERSEY",
        description: "Moves with you in every rep.",
        image: "/images/type-1-tshirt-features/stretch-jersey.png",
        imageAlt: "Stretch jersey fabric detail on the black PHENO Type 1 T-Shirt",
      },
      {
        id: "lightweight",
        title: "LIGHTWEIGHT",
        description: "Minimal weight, maximum output.",
        image: "/images/type-1-tshirt-features/lightweight.png",
        imageAlt: "Lightweight knit fabric detail on the black PHENO Type 1 T-Shirt",
      },
      {
        id: "reflective-detail",
        title: "REFLECTIVE DETAIL",
        description: "Train safely, day or night.",
        image: "/images/type-1-tshirt-features/reflective-detail.png",
        imageAlt: "Reflective PHENO label detail on the black PHENO Type 1 T-Shirt",
      },
    ],
    performanceFeaturesByColour: {
      White: [
        {
          id: "breathable",
          title: "BREATHABLE FABRIC",
          description: "Built to breathe, keeps you cool.",
          image: "/images/type-1-tshirt-features/white/breathable-fabric.png",
          imageAlt: "Breathable knit fabric detail on the white PHENO Type 1 T-Shirt",
        },
        {
          id: "mesh-side-panels",
          title: "MESH SIDE PANELS",
          description: "Enhanced airflow where it counts.",
          image: "/images/type-1-tshirt-features/white/mesh-side-panels.png",
          imageAlt: "Mesh side panel fabric detail on the white PHENO Type 1 T-Shirt",
        },
        {
          id: "quick-dry",
          title: "QUICK DRY",
          description: "Sweat-wicking, fast drying.",
          image: "/images/type-1-tshirt-features/white/quick-dry.png",
          imageAlt: "Quick-dry fabric detail on the white PHENO Type 1 T-Shirt",
        },
        {
          id: "cooling-zones",
          title: "COOLING ZONES",
          description: "Ventilation engineered for performance.",
          image: "/images/type-1-tshirt-features/white/cooling-zones.png",
          imageAlt: "Laser-cut cooling zone detail on the white PHENO Type 1 T-Shirt",
        },
        {
          id: "stretch-jersey",
          title: "STRETCH JERSEY",
          description: "Moves with you in every rep.",
          image: "/images/type-1-tshirt-features/white/stretch-jersey.png",
          imageAlt: "Stretch jersey fabric detail on the white PHENO Type 1 T-Shirt",
        },
        {
          id: "lightweight",
          title: "LIGHTWEIGHT",
          description: "Minimal weight, maximum output.",
          image: "/images/type-1-tshirt-features/white/lightweight.png",
          imageAlt: "Lightweight knit fabric detail on the white PHENO Type 1 T-Shirt",
        },
        {
          id: "reflective-detail",
          title: "REFLECTIVE DETAIL",
          description: "Train safely, day or night.",
          image: "/images/type-1-tshirt-features/white/reflective-detail.png",
          imageAlt: "Reflective PHENO label detail on the white PHENO Type 1 T-Shirt",
        },
      ],
    },
    engineeredDetailsByColour: {
      Black: createPerformanceTopEngineeredDetails(
        "T-Shirt",
        "Black",
      ),
      White: createPerformanceTopEngineeredDetails(
        "T-Shirt",
        "White",
      ),
    },
    images: [
      ...galleries.tshirt.Black,
    ],
    colourImages: {
      Black: galleries.tshirt.Black[0],
      White: galleries.tshirt.White[0],
    },
    galleryImagesByColour: galleries.tshirt,
    colours: ["Black", "White"],
    sizes: [...SIZE_OPTIONS],
    variants: createVariants("pheno-type-1-t-shirt", ["Black", "White"]),
    relatedProductSlugs: ["pheno-type-1-shorts"],
    completeTheLookSlugs: ["pheno-type-1-shorts"],
  },
  {
    id: "pheno-type-1-tank",
    slug: "pheno-type-1-tank",
    name: "PHENO Type 1 Tank",
    collection: "type-1",
    category: "tanks",
    price: 32,
    description:
      "A lightweight training tank made with a smooth stretch knit and mesh side panels to keep airflow moving through demanding sessions.",
    construction: "90% polyester, 10% spandex knit with mesh side panels",
    features: [
      "Breathable fabric",
      "Mesh side panels",
      "Quick dry",
      "Cooling zones",
      "Stretch jersey",
      "Lightweight",
      "Reflective detail",
    ],
    performanceFeatures: [
      {
        id: "breathable",
        title: "BREATHABLE FABRIC",
        description: "Built to breathe, keeps you cool.",
        image: "/images/type-1-tank-features/black/breathable-fabric.png",
        imageAlt: "Breathable fabric detail on the black PHENO Type 1 Tank",
      },
      {
        id: "mesh-side-panels",
        title: "MESH SIDE PANELS",
        description: "Enhanced airflow where it counts.",
        image: "/images/type-1-tank-features/black/mesh-side-panels.png",
        imageAlt: "Mesh side panel detail on the black PHENO Type 1 Tank",
      },
      {
        id: "quick-dry",
        title: "QUICK DRY",
        description: "Sweat-wicking, fast drying.",
        image: "/images/type-1-tank-features/black/quick-dry.png",
        imageAlt: "Quick-dry fabric detail on the black PHENO Type 1 Tank",
      },
      {
        id: "cooling-zones",
        title: "COOLING ZONES",
        description: "Laser-cut ventilation zones regulate body temperature.",
        image: "/images/type-1-tank-features/black/cooling-zones.png",
        imageAlt: "Cooling zone detail on black PHENO Type 1 Tank",
      },
      {
        id: "stretch-jersey",
        title: "STRETCH JERSEY",
        description: "4-way stretch fabric allows full range of motion.",
        image: "/images/type-1-tank-features/black/lightweight-stretch.png",
        imageAlt: "Stretch jersey fabric detail on the black PHENO Type 1 Tank",
      },
      {
        id: "lightweight",
        title: "LIGHTWEIGHT",
        description: "Ultra-light construction for unrestricted performance.",
        image: "/images/type-1-tank-features/black/performance-fit.png",
        imageAlt: "Lightweight fabric detail on the black PHENO Type 1 Tank",
      },
      {
        id: "reflective-detail",
        title: "REFLECTIVE DETAIL",
        description: "Subtle reflective details keep you visible in low light.",
        image: "/images/type-1-tank-features/black/reflective-detail.png",
        imageAlt: "Reflective PHENO label detail on the black PHENO Type 1 Tank",
      },
    ],
    performanceFeaturesByColour: {
      Black: [
        {
          id: "breathable",
          title: "BREATHABLE FABRIC",
          description: "Built to breathe, keeps you cool.",
          image: "/images/type-1-tank-features/black/breathable-fabric.png",
          imageAlt: "Breathable fabric detail on the black PHENO Type 1 Tank",
        },
        {
          id: "mesh-side-panels",
          title: "MESH SIDE PANELS",
          description: "Enhanced airflow where it counts.",
          image: "/images/type-1-tank-features/black/mesh-side-panels.png",
          imageAlt: "Mesh side panel detail on the black PHENO Type 1 Tank",
        },
        {
          id: "quick-dry",
          title: "QUICK DRY",
          description: "Sweat-wicking, fast drying.",
          image: "/images/type-1-tank-features/black/quick-dry.png",
          imageAlt: "Quick-dry fabric detail on the black PHENO Type 1 Tank",
        },
        {
          id: "cooling-zones",
          title: "COOLING ZONES",
          description: "Laser-cut ventilation zones regulate body temperature.",
          image: "/images/type-1-tank-features/black/cooling-zones.png",
          imageAlt: "Cooling zone detail on the black PHENO Type 1 Tank",
        },
        {
          id: "stretch-jersey",
          title: "STRETCH JERSEY",
          description: "4-way stretch fabric allows full range of motion.",
          image: "/images/type-1-tank-features/black/lightweight-stretch.png",
          imageAlt: "Stretch jersey fabric detail on the black PHENO Type 1 Tank",
        },
        {
          id: "lightweight",
          title: "LIGHTWEIGHT",
          description: "Ultra-light construction for unrestricted performance.",
          image: "/images/type-1-tank-features/black/performance-fit.png",
          imageAlt: "Lightweight fabric detail on the black PHENO Type 1 Tank",
        },
        {
          id: "reflective-detail",
          title: "REFLECTIVE DETAIL",
          description: "Train safely, day or night.",
          image: "/images/type-1-tank-features/black/reflective-detail.png",
          imageAlt: "Reflective PHENO label detail on the black PHENO Type 1 Tank",
        },
      ],
      White: [
        {
          id: "breathable",
          title: "BREATHABLE FABRIC",
          description: "Built to breathe, keeps you cool.",
          image: "/images/type-1-tank-features/white/breathable-fabric.png",
          imageAlt: "Breathable fabric detail on the white PHENO Type 1 Tank",
        },
        {
          id: "mesh-side-panels",
          title: "MESH SIDE PANELS",
          description: "Enhanced airflow where it counts.",
          image: "/images/type-1-tank-features/white/mesh-side-panels.png",
          imageAlt: "Mesh side panel detail on the white PHENO Type 1 Tank",
        },
        {
          id: "quick-dry",
          title: "QUICK DRY",
          description: "Sweat-wicking, fast drying.",
          image: "/images/type-1-tank-features/white/quick-dry.png",
          imageAlt: "Quick-dry fabric detail on the white PHENO Type 1 Tank",
        },
        {
          id: "cooling-zones",
          title: "COOLING ZONES",
          description: "Laser-cut ventilation zones regulate body temperature.",
          image: "/images/type-1-tank-features/white/cooling-zones.png",
          imageAlt: "Cooling zone detail on the white PHENO Type 1 Tank",
        },
        {
          id: "stretch-jersey",
          title: "STRETCH JERSEY",
          description: "4-way stretch fabric allows full range of motion.",
          image: "/images/type-1-tank-features/white/stretch-jersey.png",
          imageAlt: "Stretch jersey fabric detail on the white PHENO Type 1 Tank",
        },
        {
          id: "lightweight",
          title: "LIGHTWEIGHT",
          description: "Ultra-light construction for unrestricted performance.",
          image: "/images/type-1-tank-features/white/lightweight.png",
          imageAlt: "Lightweight fabric detail on the white PHENO Type 1 Tank",
        },
        {
          id: "reflective-detail",
          title: "REFLECTIVE DETAIL",
          description: "Train safely, day or night.",
          image: "/images/type-1-tank-features/white/reflective-detail.png",
          imageAlt: "Reflective PHENO label detail on the white PHENO Type 1 Tank",
        },
      ],
    },
    engineeredDetailsByColour: {
      Black: createPerformanceTopEngineeredDetails(
        "Tank",
        "Black",
      ),
      White: createPerformanceTopEngineeredDetails(
        "Tank",
        "White",
      ),
    },
    images: [
      ...galleries.tank.Black,
    ],
    colourImages: {
      Black: galleries.tank.Black[0],
      White: galleries.tank.White[0],
    },
    galleryImagesByColour: galleries.tank,
    colours: ["Black", "White"],
    sizes: [...SIZE_OPTIONS],
    variants: createVariants("pheno-type-1-tank", ["Black", "White"]),
    relatedProductSlugs: ["pheno-type-1-shorts"],
    completeTheLookSlugs: ["pheno-type-1-shorts"],
  },
];

function splitProductColours(product: Product): Product[] {
  if (product.colours.length < 2) {
    return [product];
  }

  return product.colours.map((colour) => {
    const galleryImages = product.galleryImagesByColour?.[colour] ?? [
      product.colourImages[colour] ?? product.images[0],
    ];
    const performanceFeatures =
      product.performanceFeaturesByColour?.[colour] ?? product.performanceFeatures;

    return {
      ...product,
      id: `${product.id}-${colour.toLowerCase()}`,
      slug: `${product.slug}-${colour.toLowerCase()}`,
      images: galleryImages,
      colourImages: { [colour]: galleryImages[0] },
      galleryImagesByColour: { [colour]: galleryImages },
      colours: [colour],
      variants: product.variants.filter((variant) => variant.colour === colour),
      performanceFeatures,
      performanceFeaturesByColour: undefined,
      engineeredDetails: product.engineeredDetailsByColour?.[colour] ?? product.engineeredDetails,
      engineeredDetailsByColour: undefined,
    };
  });
}

export const products: Product[] = sourceProducts.flatMap(splitProductColours);

const legacyProductSlugAliases: Record<string, string> = {
  "pheno-type-1-t-shirt": "pheno-type-1-t-shirt-black",
  "pheno-type-1-tank": "pheno-type-1-tank-black",
};

export type ProductBundle = {
  id: string;
  slug: string;
  name: string;
  description: string;
  productSlugs: string[];
};

export const bundles: ProductBundle[] = [
  {
    id: "type-1-training-set",
    slug: "type-1-training-set",
    name: "Type 1 Training Set",
    description: "A focused training combination, Type 1 T-Shirt with Type 1 Shorts.",
    productSlugs: ["pheno-type-1-t-shirt", "pheno-type-1-shorts"],
  },
  {
    id: "type-1-track-set",
    slug: "type-1-track-set",
    name: "Type 1 Track Set",
    description: "A clean warm-up combination, Type 1 Hoodie with Type 1 Joggers.",
    productSlugs: ["pheno-type-1-hoodie", "pheno-type-1-joggers"],
  },
];

export const collectionLabels: Record<string, string> = {
  all: "Shop all",
  "type-1": "Type 1",
  tops: "Tops",
  bottoms: "Bottoms",
  sets: "Sets",
  "t-shirts": "T-Shirts",
  tanks: "Tanks",
  hoodies: "Hoodies",
  shorts: "Shorts",
  joggers: "Joggers",
};

export function getProductBySlug(slug: string) {
  const resolvedSlug = legacyProductSlugAliases[slug] ?? slug;
  return products.find((product) => product.slug === resolvedSlug);
}

export function getBundleProducts(bundle: ProductBundle) {
  return bundle.productSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is Product => Boolean(product));
}

export function getProductsForCollection(collection: string) {
  if (collection === "all" || collection === "type-1") {
    return products;
  }

  if (collection === "tops") {
    return products.filter((product) =>
      ["t-shirts", "tanks", "hoodies"].includes(product.category),
    );
  }

  if (collection === "bottoms") {
    return products.filter((product) =>
      ["shorts", "joggers"].includes(product.category),
    );
  }

  return products.filter((product) => product.category === collection);
}

export function searchProducts(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return products.filter((product) =>
    [
      product.name,
      product.category,
      product.collection,
      product.description,
      product.construction,
      ...product.features,
      ...product.colours,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export function getVariant(
  product: Product,
  colour: Colour,
  size: Size,
) {
  return product.variants.find(
    (variant) => variant.colour === colour && variant.size === size,
  );
}

export function getProductImage(product: Product, colour?: Colour) {
  return (colour && product.colourImages[colour]) || product.images[0];
}
