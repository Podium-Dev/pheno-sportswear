import { Homepage } from "@/components/Homepage";
import { getCatalogProducts } from "@/lib/commerce/catalog";

export default async function HomePage() {
  const catalogProducts = await getCatalogProducts();
  return <Homepage products={catalogProducts} />;
}
