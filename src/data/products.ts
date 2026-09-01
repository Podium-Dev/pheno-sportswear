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
  marker: {
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
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  collection: "type-1";
  category: ProductCategory;
  price: number;
  description: string;
  construction: string;
  features: string[];
  performanceFeatures: ProductFeature[];
  performanceFeaturesByColour?: Partial<Record<Colour, ProductFeature[]>>;
  engineeredDetails?: ProductEngineeredDetails;
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

export const products: Product[] = [
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
    features: ["Supportive compression", "Moisture-wicking", "Targeted ventilation"],
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
    features: ["Breathable ventilation", "Quick-dry", "Cooling zones"],
    performanceFeatures: [
      {
        id: "breathable",
        title: "BREATHABLE",
        description: "Enhanced airflow.",
        image: "/images/type-1-tank-black.jpg",
        imageAlt: "Black PHENO Type 1 Tank breathable fabric",
      },
      {
        id: "mesh-side-panels",
        title: "MESH SIDE PANELS",
        description: "Ventilation where you need it.",
        image: "/images/type-1-tank-black.jpg",
        imageAlt: "Mesh side panel detail on black PHENO Type 1 Tank",
      },
      {
        id: "quick-dry",
        title: "QUICK DRY",
        description: "Built for repeat sessions.",
        image: "/images/type-1-tank-black.jpg",
        imageAlt: "Black PHENO Type 1 Tank performance fabric",
      },
      {
        id: "cooling-zones",
        title: "COOLING ZONES",
        description: "Helps manage heat.",
        image: "/images/type-1-tank-black.jpg",
        imageAlt: "Cooling zone detail on black PHENO Type 1 Tank",
      },
      {
        id: "lightweight-stretch",
        title: "LIGHTWEIGHT STRETCH",
        description: "Freedom to move.",
        image: "/images/type-1-tank-black.jpg",
        imageAlt: "Lightweight stretch fabric on black PHENO Type 1 Tank",
      },
      {
        id: "performance-fit",
        title: "PERFORMANCE FIT",
        description: "Made for training.",
        image: "/images/type-1-tank-black.jpg",
        imageAlt: "Black PHENO Type 1 Tank performance fit",
      },
    ],
    performanceFeaturesByColour: {
      Black: [
        {
          id: "breathable-fabric",
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
          description: "Ventilation engineered for performance.",
          image: "/images/type-1-tank-features/black/cooling-zones.png",
          imageAlt: "Cooling zone detail on the black PHENO Type 1 Tank",
        },
        {
          id: "lightweight-stretch",
          title: "LIGHTWEIGHT STRETCH",
          description: "Moves with you in every rep.",
          image: "/images/type-1-tank-features/black/lightweight-stretch.png",
          imageAlt: "Lightweight stretch fabric detail on the black PHENO Type 1 Tank",
        },
        {
          id: "performance-fit",
          title: "PERFORMANCE FIT",
          description: "Athletic fit, built to move.",
          image: "/images/type-1-tank-features/black/performance-fit.png",
          imageAlt: "Performance fit detail on the black PHENO Type 1 Tank",
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
          id: "breathable-fabric",
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
          description: "Ventilation engineered for performance.",
          image: "/images/type-1-tank-features/white/cooling-zones.png",
          imageAlt: "Cooling zone detail on the white PHENO Type 1 Tank",
        },
        {
          id: "stretch-jersey",
          title: "STRETCH JERSEY",
          description: "Moves with you in every rep.",
          image: "/images/type-1-tank-features/white/stretch-jersey.png",
          imageAlt: "Stretch jersey fabric detail on the white PHENO Type 1 Tank",
        },
        {
          id: "lightweight",
          title: "LIGHTWEIGHT",
          description: "Minimal weight, maximum output.",
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
  return products.find((product) => product.slug === slug);
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
