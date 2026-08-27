"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product, ProductVariant } from "@/data/products";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchOverlay } from "@/components/SearchOverlay";

export type CartLine = {
  id: string;
  productSlug: string;
  variantId: string;
  name: string;
  colour: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
};

type CommerceContextValue = {
  cart: CartLine[];
  cartCount: number;
  cartSubtotal: number;
  cartOpen: boolean;
  searchOpen: boolean;
  wishlist: string[];
  checkoutMessage: string;
  addToCart: (
    product: Product,
    variant: ProductVariant,
    quantity?: number,
    openDrawer?: boolean,
  ) => boolean;
  updateCartLine: (lineId: string, quantity: number) => void;
  removeFromCart: (lineId: string) => void;
  toggleWishlist: (productSlug: string) => void;
  isWishlisted: (productSlug: string) => boolean;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setCheckoutMessage: (message: string) => void;
};

const CART_STORAGE_KEY = "pheno-cart-v1";
const WISHLIST_STORAGE_KEY = "pheno-wishlist-v1";

const CommerceContext = createContext<CommerceContextValue | null>(null);

export function useCommerce() {
  const context = useContext(CommerceContext);

  if (!context) {
    throw new Error("useCommerce must be used inside CommerceProvider");
  }

  return context;
}

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (hasHydrated) {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, hasHydrated]);

  useEffect(() => {
    if (hasHydrated) {
      window.localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlist),
      );
    }
  }, [hasHydrated, wishlist]);

  const addToCart = useCallback(
    (
      product: Product,
      variant: ProductVariant,
      quantity = 1,
      openDrawer = true,
    ) => {
      if (!variant.available || quantity < 1) {
        return false;
      }

      const lineId = `${product.slug}-${variant.colour}-${variant.size}`;
      const cartLine: CartLine = {
        id: lineId,
        productSlug: product.slug,
        variantId: variant.id,
        name: product.name,
        colour: variant.colour,
        size: variant.size,
        price: product.price,
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
    },
    [],
  );

  const updateCartLine = useCallback((lineId: string, quantity: number) => {
    setCart((currentCart) =>
      currentCart
        .map((line) =>
          line.id === lineId ? { ...line, quantity: Math.max(0, quantity) } : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((lineId: string) => {
    setCart((currentCart) => currentCart.filter((line) => line.id !== lineId));
  }, []);

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

  const value = useMemo<CommerceContextValue>(
    () => ({
      cart,
      cartCount: cart.reduce((total, line) => total + line.quantity, 0),
      cartSubtotal: cart.reduce(
        (total, line) => total + line.price * line.quantity,
        0,
      ),
      cartOpen,
      searchOpen,
      wishlist,
      checkoutMessage,
      addToCart,
      updateCartLine,
      removeFromCart,
      toggleWishlist,
      isWishlisted,
      setCartOpen,
      setSearchOpen,
      setCheckoutMessage,
    }),
    [
      addToCart,
      cart,
      cartOpen,
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
