import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function RoutePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  return <PlaceholderPage segments={slug} />;
}
