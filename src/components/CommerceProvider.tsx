"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Product, ProductVariant } from "@/data/products";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchOverlay } from "@/components/SearchOverlay";
import type { CartProvider as CartProviderMode } from "@/lib/commerce/types";
import {
  addMedusaCartLine,
  createMedusaCart,
  MEDUSA_CART_ID_STORAGE_KEY,
  MEDUSA_CART_MIGRATION_KEY,
  MedusaCartRequestError,
  mapMedusaCart,
  removeMedusaCartLine,
  retrieveMedusaCart,
  updateMedusaCartLine,
  type MedusaCart,
} from "@/lib/commerce/cart/medusa-client";
import type { CartLine } from "@/lib/commerce/cart/types";
import { findCatalogProduct } from "@/lib/commerce/catalog-utils";

export type { CartLine } from "@/lib/commerce/cart/types";

type CommerceContextValue = {
  catalogProducts: Product[];
  cartProvider: CartProviderMode;
  checkoutEnabled: boolean;
  cart: CartLine[];
  cartCount: number;
  cartSubtotal: number;
  cartOpen: boolean;
  searchOpen: boolean;
  wishlist: string[];
  cartMessage: string;
  checkoutMessage: string;
  addToCart: (
    product: Product,
    variant: ProductVariant,
    quantity?: number,
    openDrawer?: boolean,
  ) => Promise<boolean>;
  updateCartLine: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  toggleWishlist: (productSlug: string) => void;
  isWishlisted: (productSlug: string) => boolean;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setCartMessage: (message: string) => void;
  setCheckoutMessage: (message: string) => void;
};

const CART_STORAGE_KEY = "pheno-cart-v1";
const WISHLIST_STORAGE_KEY = "pheno-wishlist-v1";

const CommerceContext = createContext<CommerceContextValue | null>(null);

function cartErrorMessage(error: unknown) {
  if (error instanceof MedusaCartRequestError && error.status === 404) {
    return "Your Medusa cart has expired. Add the item again to start a new cart.";
  }

  if (error instanceof MedusaCartRequestError && error.status === 400) {
    return "Medusa could not update this cart. The selected variant may no longer be available.";
  }

  return "We could not update your cart. Please try again.";
}

function readLocalCartSnapshot() {
  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCart) return [];
    const parsedCart = JSON.parse(storedCart) as unknown;
    return Array.isArray(parsedCart) ? (parsedCart as CartLine[]) : [];
  } catch {
    return [];
  }
}

function findMigrationVariant(
  products: Product[],
  line: CartLine,
): { product: Product; variant: ProductVariant } | undefined {
  const product = findCatalogProduct(products, line.productSlug);
  const variant = product?.variants.find(
    (item) =>
      item.id === line.variantId &&
      item.colour === line.colour &&
      item.size === line.size,
  );
  return product && variant ? { product, variant } : undefined;
}

export function useCommerce() {
  const context = useContext(CommerceContext);

  if (!context) {
    throw new Error("useCommerce must be used inside CommerceProvider");
  }

  return context;
}

export function CommerceProvider({
  children,
  catalogProducts,
  cartProvider = "local",
  checkoutEnabled = false,
}: {
  children: React.ReactNode;
  catalogProducts: Product[];
  cartProvider?: CartProviderMode;
  checkoutEnabled?: boolean;
}) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [medusaSubtotal, setMedusaSubtotal] = useState(0);
  const [hasHydrated, setHasHydrated] = useState(false);
  const medusaCartIdRef = useRef<string | null>(null);
  const medusaInitializationRef = useRef<Promise<void> | null>(null);
  const medusaMutationQueueRef = useRef<Promise<void>>(Promise.resolve());

  const applyMedusaCart = useCallback(
    (remoteCart: MedusaCart) => {
      const snapshot = mapMedusaCart(remoteCart, catalogProducts);
      medusaCartIdRef.current = snapshot.id;
      setCart(snapshot.lines);
      setMedusaSubtotal(snapshot.subtotal);
      window.localStorage.setItem(MEDUSA_CART_ID_STORAGE_KEY, snapshot.id);
    },
    [catalogProducts],
  );

  const initializeMedusaCart = useCallback(async () => {
    if (typeof window === "undefined") return;

    let remoteCart: MedusaCart | null = null;
    const storedCartId = window.localStorage.getItem(MEDUSA_CART_ID_STORAGE_KEY);

    if (storedCartId) {
      try {
        remoteCart = await retrieveMedusaCart(storedCartId);
      } catch (error) {
        if (error instanceof MedusaCartRequestError && error.status === 404) {
          window.localStorage.removeItem(MEDUSA_CART_ID_STORAGE_KEY);
        } else {
          throw error;
        }
      }
    }

    remoteCart ||= await createMedusaCart();
    applyMedusaCart(remoteCart);

    if (window.localStorage.getItem(MEDUSA_CART_MIGRATION_KEY)) {
      return;
    }

    const skipped: string[] = [];
    let currentCart = remoteCart;
    const localCart = readLocalCartSnapshot();

    for (const line of localCart) {
      const match = findMigrationVariant(catalogProducts, line);
      if (!match) {
        skipped.push(line.name + " (" + line.colour + " / " + line.size + ")");
        continue;
      }

      if (!match.variant.available) {
        skipped.push(line.name + " (" + line.colour + " / " + line.size + ", unavailable)");
        continue;
      }

      const alreadyInCart = currentCart.items?.some(
        (item) => item.variant_id === match.variant.id,
      );
      if (alreadyInCart) continue;

      currentCart = await addMedusaCartLine(
        currentCart.id,
        match.variant.id,
        Math.max(1, Math.floor(line.quantity)),
      );
      applyMedusaCart(currentCart);
    }

    window.localStorage.setItem(
      MEDUSA_CART_MIGRATION_KEY,
      JSON.stringify({
        completedAt: new Date().toISOString(),
        skipped,
      }),
    );

    if (skipped.length) {
      setCartMessage(
        "Some saved local-cart items were not migrated: " + skipped.join(", "),
      );
    }
  }, [applyMedusaCart, catalogProducts]);

  const ensureMedusaCart = useCallback(async () => {
    if (!medusaInitializationRef.current && !medusaCartIdRef.current) {
      const initialization = initializeMedusaCart().catch((error) => {
        medusaInitializationRef.current = null;
        throw error;
      });
      medusaInitializationRef.current = initialization;
    }

    if (medusaInitializationRef.current) {
      await medusaInitializationRef.current;
    }

    if (!medusaCartIdRef.current) {
      throw new Error("Medusa cart was not created.");
    }

    return medusaCartIdRef.current;
  }, [initializeMedusaCart]);

  useEffect(() => {
    if (cartProvider === "local") {
      try {
        const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
        const storedWishlist = window.localStorage.getItem(WISHLIST_STORAGE_KEY);

        if (storedCart) {
          const parsedCart = JSON.parse(storedCart) as CartLine[];
          if (Array.isArray(parsedCart)) {
            setCart(parsedCart);
          }
        }

        if (storedWishlist) {
          const parsedWishlist = JSON.parse(storedWishlist) as string[];
          if (Array.isArray(parsedWishlist)) {
            setWishlist(parsedWishlist);
          }
        }
      } catch {
        window.localStorage.removeItem(CART_STORAGE_KEY);
        window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
      } finally {
        setHasHydrated(true);
      }

      return;
    }

    let active = true;
    void ensureMedusaCart()
      .then(() => {
        if (active) setHasHydrated(true);
      })
      .catch((error) => {
        if (active) {
          setCartMessage(cartErrorMessage(error));
          setHasHydrated(true);
        }
      });

    return () => {
      active = false;
    };
  }, [cartProvider, ensureMedusaCart]);

  useEffect(() => {
    if (hasHydrated && cartProvider === "local") {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, cartProvider, hasHydrated]);

  useEffect(() => {
    if (hasHydrated) {
      window.localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlist),
      );
    }
  }, [hasHydrated, wishlist]);

  const runMedusaMutation = useCallback((operation: () => Promise<void>) => {
    const next = medusaMutationQueueRef.current.then(operation, operation);
    medusaMutationQueueRef.current = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }, []);

  const addToCart = useCallback(
    async (
      product: Product,
      variant: ProductVariant,
      quantity = 1,
      openDrawer = true,
    ) => {
      if (!variant.available || quantity < 1) {
        return false;
      }

      if (cartProvider === "local") {
        const lineId = product.slug + "-" + variant.colour + "-" + variant.size;
        const cartLine: CartLine = {
          id: lineId,
          productId: product.id,
          productSlug: product.slug,
          variantId: variant.id,
          name: product.name,
          colour: variant.colour,
          size: variant.size,
          price: product.price,
          currencyCode: product.currencyCode,
          image: product.colourImages[variant.colour] ?? product.images[0],
          quantity,
        };

        setCart((currentCart) => {
          const existingLine = currentCart.find((line) => line.id === lineId);

          if (existingLine) {
            return currentCart.map((line) =>
              line.id === lineId
                ? { ...line, quantity: line.quantity + quantity }
                : line,
            );
          }

          return [...currentCart, cartLine];
        });

        if (openDrawer) {
          setCartOpen(true);
        }

        return true;
      }

      try {
        await runMedusaMutation(async () => {
          const cartId = await ensureMedusaCart();
          const updatedCart = await addMedusaCartLine(
            cartId,
            variant.id,
            Math.floor(quantity),
          );
          applyMedusaCart(updatedCart);
        });
        setCartMessage("");
        if (openDrawer) setCartOpen(true);
        return true;
      } catch (error) {
        setCartMessage(cartErrorMessage(error));
        return false;
      }
    },
    [
      applyMedusaCart,
      cartProvider,
      ensureMedusaCart,
      runMedusaMutation,
    ],
  );

  const updateCartLine = useCallback(
    async (lineId: string, quantity: number) => {
      const nextQuantity = Number.isFinite(quantity)
        ? Math.max(0, Math.floor(quantity))
        : 0;

      if (cartProvider === "local") {
        setCart((currentCart) =>
          currentCart
            .map((line) =>
              line.id === lineId
                ? { ...line, quantity: nextQuantity }
                : line,
            )
            .filter((line) => line.quantity > 0),
        );
        return;
      }

      try {
        await runMedusaMutation(async () => {
          const cartId = await ensureMedusaCart();
          const updatedCart = nextQuantity > 0
            ? await updateMedusaCartLine(cartId, lineId, nextQuantity)
            : await removeMedusaCartLine(cartId, lineId);
          applyMedusaCart(updatedCart);
        });
        setCartMessage("");
      } catch (error) {
        setCartMessage(cartErrorMessage(error));
      }
    },
    [
      applyMedusaCart,
      cartProvider,
      ensureMedusaCart,
      runMedusaMutation,
    ],
  );

  const removeFromCart = useCallback(
    async (lineId: string) => {
      if (cartProvider === "local") {
        setCart((currentCart) => currentCart.filter((line) => line.id !== lineId));
        return;
      }

      try {
        await runMedusaMutation(async () => {
          const cartId = await ensureMedusaCart();
          const updatedCart = await removeMedusaCartLine(cartId, lineId);
          applyMedusaCart(updatedCart);
        });
        setCartMessage("");
      } catch (error) {
        setCartMessage(cartErrorMessage(error));
      }
    },
    [
      applyMedusaCart,
      cartProvider,
      ensureMedusaCart,
      runMedusaMutation,
    ],
  );

  const toggleWishlist = useCallback((productSlug: string) => {
    setWishlist((currentWishlist) =>
      currentWishlist.includes(productSlug)
        ? currentWishlist.filter((slug) => slug !== productSlug)
        : [...currentWishlist, productSlug],
    );
  }, []);

  const isWishlisted = useCallback(
    (productSlug: string) => wishlist.includes(productSlug),
    [wishlist],
  );

  const localCartSubtotal = cart.reduce(
    (total, line) => total + line.price * line.quantity,
    0,
  );
  const cartSubtotal = cartProvider === "medusa" ? medusaSubtotal : localCartSubtotal;

  const value = useMemo<CommerceContextValue>(
    () => ({
      catalogProducts,
      cartProvider,
      checkoutEnabled,
      cart,
      cartCount: cart.reduce((total, line) => total + line.quantity, 0),
      cartSubtotal,
      cartOpen,
      searchOpen,
      wishlist,
      cartMessage,
      checkoutMessage,
      addToCart,
      updateCartLine,
      removeFromCart,
      toggleWishlist,
      isWishlisted,
      setCartOpen,
      setSearchOpen,
      setCartMessage,
      setCheckoutMessage,
    }),
    [
      addToCart,
      cart,
      cartMessage,
      cartOpen,
      cartProvider,
      checkoutEnabled,
      cartSubtotal,
      catalogProducts,
      checkoutMessage,
      isWishlisted,
      removeFromCart,
      searchOpen,
      toggleWishlist,
      updateCartLine,
      wishlist,
    ],
  );

  return (
    <CommerceContext.Provider value={value}>
      {children}
      <CartDrawer />
      <SearchOverlay />
    </CommerceContext.Provider>
  );
}
