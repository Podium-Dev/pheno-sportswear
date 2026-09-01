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
    features: ["Quick-dry", "Enhanced mobility"],
    performanceFeatures: [
      {
        id: "fabric-weight",
        title: "320 GSM FABRIC",
        description: "Substantial comfort.",
        image: "/images/type-1-hoodie.jpg",
        imageAlt: "Black PHENO Type 1 Hoodie fabric",
      },
      {
        id: "stretch-comfort",
        title: "STRETCH COMFORT",
        description: "Built to move.",
        image: "/images/type-1-hoodie-detail.jpg",
        imageAlt: "PHENO Type 1 Hoodie worn for movement",
      },
      {
        id: "shape-retention",
        title: "SHAPE RETENTION",
        description: "Keeps its structure.",
        image: "/images/type-1-hoodie.jpg",
        imageAlt: "Black PHENO Type 1 Hoodie holding its shape",
      },
      {
        id: "warmth",
        title: "WARMTH",
        description: "Made for warm-up and recovery.",
        image: "/images/type-1-hoodie-detail.jpg",
        imageAlt: "PHENO Type 1 Hoodie built for warm-up",
      },
      {
        id: "quick-dry",
        title: "QUICK-DRY PERFORMANCE",
        description: "Ready for repeat sessions.",
        image: "/images/type-1-hoodie.jpg",
        imageAlt: "Black PHENO Type 1 Hoodie performance fabric",
      },
      {
        id: "mobility",
        title: "MOBILITY",
        description: "Movement without restriction.",
        image: "/images/type-1-hoodie-detail.jpg",
        imageAlt: "PHENO Type 1 Hoodie sleeves and body for mobility",
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
    features: ["4-way stretch"],
    performanceFeatures: [
      {
        id: "stretch",
        title: "4-WAY STRETCH",
        description: "Moves without restriction.",
        image: "/images/type-1-joggers.jpg",
        imageAlt: "Black PHENO Type 1 Joggers stretch woven fabric",
      },
      {
        id: "articulated-knees",
        title: "ARTICULATED KNEES",
        description: "Built for mobility.",
        image: "/images/type-1-joggers.jpg",
        imageAlt: "Articulated knee construction on PHENO Type 1 Joggers",
      },
      {
        id: "smooth-matte-fabric",
        title: "SMOOTH MATTE FABRIC",
        description: "Premium technical feel.",
        image: "/images/type-1-joggers-detail.jpg",
        imageAlt: "Smooth matte technical fabric on PHENO Type 1 Joggers",
      },
      {
        id: "tapered-fit",
        title: "TAPERED PERFORMANCE FIT",
        description: "Designed to move cleanly.",
        image: "/images/type-1-joggers.jpg",
        imageAlt: "Tapered leg construction on PHENO Type 1 Joggers",
      },
      {
        id: "secure-storage",
        title: "SECURE STORAGE",
        description: "Keep essentials close.",
        image: "/images/type-1-joggers-detail.jpg",
        imageAlt: "Zipped and cargo pocket detail on PHENO Type 1 Joggers",
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
    features: ["Breathable ventilation", "Quick-dry", "Cooling zones"],
    performanceFeatures: [
      {
        id: "breathable",
        title: "BREATHABLE",
        description: "Built to release heat.",
        image: "/images/type-1-tshirt.jpg",
        imageAlt: "Black PHENO Type 1 T-Shirt breathable fabric",
      },
      {
        id: "mesh-side-panels",
        title: "MESH SIDE PANELS",
        description: "Targeted airflow.",
        image: "/images/type-1-tshirt.jpg",
        imageAlt: "Mesh side panel detail on black PHENO Type 1 T-Shirt",
      },
      {
        id: "quick-dry",
        title: "QUICK DRY",
        description: "Ready for hard sessions.",
        image: "/images/type-1-tshirt.jpg",
        imageAlt: "Black PHENO Type 1 T-Shirt performance fabric",
      },
      {
        id: "cooling-zones",
        title: "COOLING ZONES",
        description: "Ventilation where it matters.",
        image: "/images/type-1-tshirt.jpg",
        imageAlt: "Cooling zone detail on black PHENO Type 1 T-Shirt",
      },
      {
        id: "stretch-jersey",
        title: "STRETCH JERSEY",
        description: "Moves with you.",
        image: "/images/type-1-tshirt.jpg",
        imageAlt: "Stretch jersey fabric on black PHENO Type 1 T-Shirt",
      },
      {
        id: "lightweight",
        title: "LIGHTWEIGHT",
        description: "Minimal distraction.",
        image: "/images/type-1-tshirt.jpg",
        imageAlt: "Lightweight black PHENO Type 1 T-Shirt",
      },
    ],
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
