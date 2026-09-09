export type CartLine = {
  id: string;
  productId?: string;
  productSlug: string;
  variantId: string;
  name: string;
  colour: string;
  size: string;
  price: number;
  currencyCode?: string;
  image: string;
  quantity: number;
};
