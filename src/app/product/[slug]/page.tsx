import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";

const API_BASES = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

function getArray(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.value)) return payload.value;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.products)) return payload.data.products;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

async function fetchProducts(): Promise<{ ok: boolean; products: any[] }> {
  for (const base of API_BASES) {
    try {
      const response = await fetch(`${base}/products`, { cache: "no-store" });
      if (!response.ok) continue;
      return { ok: true, products: getArray(await response.json()) };
    } catch {
      // Try the next API endpoint.
    }
  }
  return { ok: false, products: [] };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  let slug = rawSlug;

  try {
    slug = decodeURIComponent(rawSlug);
  } catch {
    notFound();
  }

  const result = await fetchProducts();

  if (result.ok) {
    const found = result.products.some(
      (item) => String(item.slug ?? item.id ?? "") === slug
    );

    if (!found) {
      notFound();
    }
  }

  return <ProductDetailsClient />;
}
