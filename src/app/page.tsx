"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ProductSection, {
  ProductGrid,
} from "@/components/ProductSection";
import type { Product } from "@/components/ProductCard";

const API_URLS = [
  "https://api.api-store.workers.dev/api/bazardor/products",
  "https://api.abcz.workers.dev/api/bazardor/products",
];

const CATEGORY_EMOJI: Record<string, string> = {
  chal: "🍚",
  dal: "🫘",
  tel: "🫙",
  sobji: "🥔",
  mach: "🐟",
  mangsho: "🍗",
  "dim-dui": "🥚",
  mosla: "🌶️",
};

const UNIT_LABELS: Record<string, string> = {
  kg: "কেজি",
  kilogram: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  l: "লিটার",
  piece: "পিস",
  pcs: "পিস",
  dozen: "ডজন",
  gm: "গ্রাম",
  gram: "গ্রাম",
  g: "গ্রাম",
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

function getList(payload: unknown): any[] {
  if (Array.isArray(payload)) return payload;

  if (payload && typeof payload === "object") {
    const data = payload as Record<string, any>;

    if (Array.isArray(data.value)) return data.value;
    if (Array.isArray(data.products)) return data.products;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.results)) return data.results;
  }

  return [];
}

function getEmoji(item: any, category: string): string {
  const name = String(item?.nameBn ?? item?.name ?? "");

  if (name.includes("পেঁয়াজ") || name.includes("পেঁয়াজ")) return "🧅";
  if (name.includes("আলু")) return "🥔";
  if (name.includes("রসুন")) return "🧄";
  if (name.includes("আদা")) return "🫚";
  if (name.includes("বেগুন")) return "🍆";
  if (name.includes("মরিচ")) return "🌶️";
  if (name.includes("ডিম")) return "🥚";
  if (name.includes("দুধ")) return "🥛";
  if (name.includes("মাছ")) return "🐟";
  if (name.includes("মুরগি") || name.includes("মাংস")) return "🍗";
  if (name.includes("তেল")) return "🫙";

  return String(
    item?.image ||
      item?.categoryIcon ||
      CATEGORY_EMOJI[category] ||
      "🛒"
  );
}

function normalizeProduct(item: any, index: number): Product {
  const category = String(item?.category ?? "").toLowerCase();
  const name = String(item?.nameBn ?? item?.name ?? "নাম পাওয়া যায়নি");
  const slug = String(item?.slug ?? item?.id ?? `product-${index + 1}`);
  const rawUnit = String(item?.unit ?? "kg").toLowerCase();

  return {
    id: item?.id ?? slug,
    slug,
    name,
    category,
    unit: UNIT_LABELS[rawUnit] ?? String(item?.unit ?? "কেজি"),
    price: Number(item?.today ?? item?.price ?? 0) || 0,
    change: Number(item?.change?.pct ?? item?.changePct ?? 0) || 0,
    emoji: getEmoji(item, category),
  };
}

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border border-[#e2ebe4] bg-white p-4"
        >
          <div className="flex gap-3">
            <div className="h-11 w-11 rounded-xl bg-gray-100" />
            <div className="flex-1">
              <div className="h-3 w-3/4 rounded bg-gray-100" />
              <div className="mt-3 h-2 w-1/3 rounded bg-gray-100" />
            </div>
          </div>
          <div className="mt-5 h-4 w-1/2 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError("");

      for (const url of API_URLS) {
        try {
          const response = await fetch(url, {
            cache: "no-store",
          });

          if (!response.ok) continue;

          const payload = await response.json();
          const list = getList(payload);

          if (list.length === 0) continue;

          const normalized = list.map((item, index) =>
            normalizeProduct(item, index)
          );

          if (!cancelled) {
            setProducts(normalized);
            setLoading(false);
          }

          return;
        } catch {
          continue;
        }
      }

      if (!cancelled) {
        setError(
          "পণ্যের তথ্য লোড করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।"
        );
        setLoading(false);
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const risers = [...products]
    .filter((product) => product.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);

  const fallers = [...products]
    .filter((product) => product.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-[#f0f5f0] pb-16">
      <Navbar />
      <Hero />

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-5 sm:px-6">
        {loading ? (
          <>
            <section className="mb-8">
              <div className="mb-4 h-6 w-44 animate-pulse rounded bg-[#dfe9e0]" />
              <ProductSkeleton />
            </section>

            <section className="mb-8">
              <div className="mb-4 h-6 w-44 animate-pulse rounded bg-[#dfe9e0]" />
              <ProductSkeleton />
            </section>
          </>
        ) : error ? (
          <div className="rounded-xl border border-[#e2ebe4] bg-white p-6 text-sm text-gray-600">
            {error}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="ml-3 font-bold text-[#078542] underline"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : (
          <>
            <ProductSection
              title="আজ দাম বেড়েছে"
              products={risers}
              tone="up"
            />

            <ProductSection
              title="আজ দাম কমেছে"
              products={fallers}
              tone="down"
            />

            <section id="all-products" className="scroll-mt-36">
              <h2 className="text-lg font-extrabold text-[#26352a]">
                সব পণ্য
              </h2>

              <p className="mb-4 mt-1 text-xs text-gray-500">
                মোট {formatPrice(products.length)}টি পণ্যের বাজারদর দেখুন
              </p>

              <ProductGrid products={products} />
            </section>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
