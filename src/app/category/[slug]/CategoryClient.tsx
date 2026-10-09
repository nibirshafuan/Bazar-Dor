"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductCard, { type Product } from "@/components/ProductCard";
import { formatBengaliNumber } from "@/lib/formatters";

const API_BASES = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

type Category = {
  slug: string;
  name: string;
  emoji: string;
};

type SortOption = "default" | "low-high" | "high-low";

const CATEGORY_DETAILS: Record<string, Category> = {
  chal: { slug: "chal", name: "চাল", emoji: "🍚" },
  dal: { slug: "dal", name: "ডাল", emoji: "🫘" },
  tel: { slug: "tel", name: "তেল", emoji: "🛢️" },
  sobji: { slug: "sobji", name: "সবজি", emoji: "🥬" },
  mach: { slug: "mach", name: "মাছ", emoji: "🐟" },
  mangsho: { slug: "mangsho", name: "মাংস", emoji: "🍗" },
  "dim-dui": { slug: "dim-dui", name: "ডিম-দুধ", emoji: "🥚" },
  mosla: { slug: "mosla", name: "মসলা", emoji: "🌶️" },
};

const UNIT_NAMES: Record<string, string> = {
  kg: "কেজি",
  kilogram: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
  unit: "পিস",
};

function numberValue(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const digits = "০১২৩৪৫৬৭৮৯";
  const normalized = String(value ?? "").replace(/[০-৯]/g, (digit) =>
    String(digits.indexOf(digit))
  );

  return Number(normalized.replace(/[^\d.-]/g, "")) || 0;
}

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

async function fetchFromApi(path: string): Promise<any> {
  let lastError: unknown;

  for (const base of API_BASES) {
    try {
      const response = await fetch(`${base}${path}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("পণ্যের তথ্য আনা যায়নি।");
}

function normalizeProduct(item: any): Product {
  const category =
    typeof item.category === "object"
      ? String(item.category?.slug ?? item.category?.id ?? "")
      : String(item.category ?? item.categorySlug ?? "");

  const rawUnit = String(item.unit ?? "kg").toLowerCase();

  return {
    id: item.id ?? item.slug ?? "",
    slug: String(item.slug ?? item.id ?? ""),
    name: String(item.nameBn ?? item.name ?? "নাম পাওয়া যায়নি"),
    category,
    unit: UNIT_NAMES[rawUnit] ?? String(item.unit ?? "কেজি"),
    price: numberValue(item.today ?? item.price),
    change: numberValue(item.change?.pct ?? item.changePct ?? 0),
    emoji: String(
      item.categoryIcon ??
        item.image ??
        item.category?.icon ??
        CATEGORY_DETAILS[category]?.emoji ??
        "🛒"
    ),
  };
}

function CategoryPageContent() {
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(String(params.slug ?? "")).toLowerCase();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(
    Object.values(CATEGORY_DETAILS)
  );
  const [sort, setSort] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setLoadError(false);

      try {
        const [productsPayload, categoriesPayload] = await Promise.all([
          fetchFromApi("/products"),
          fetchFromApi("/categories").catch(() => []),
        ]);

        const loadedProducts = getArray(productsPayload).map(normalizeProduct);
        const categoryItems = getArray(categoriesPayload);

        if (cancelled) return;

        setProducts(loadedProducts);

        if (categoryItems.length > 0) {
          setCategories(
            categoryItems.map((item: any) => {
              const categorySlug = String(item.slug ?? item.id ?? "");

              return {
                slug: categorySlug,
                name: String(
                  item.nameBn ??
                    item.name ??
                    CATEGORY_DETAILS[categorySlug]?.name ??
                    "অন্যান্য"
                ),
                emoji: String(
                  item.icon ??
                    item.emoji ??
                    CATEGORY_DETAILS[categorySlug]?.emoji ??
                    "🛒"
                ),
              };
            })
          );
        }
      } catch {
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const category = categories.find((item) => item.slug === slug);
  const fallbackCategory = CATEGORY_DETAILS[slug];
  const categoryInfo = category ?? fallbackCategory;

  const categoryProducts = useMemo(
    () => products.filter((product) => product.category === slug),
    [products, slug]
  );

  const sortedProducts = useMemo(() => {
    const result = [...categoryProducts];

    if (sort === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [categoryProducts, sort]);

  const invalidCategory =
    !loading && !loadError && (!categoryInfo || categoryProducts.length === 0);

  return (
    <div className="min-h-screen bg-[#f0f5f0]">
      <Navbar categories={categories} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {loading ? (
          <section aria-label="পণ্য লোড হচ্ছে">
            <div className="h-8 w-56 animate-pulse rounded-lg bg-gray-200" />
            <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-gray-200" />

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-xl border border-[#e2ebe4] bg-white"
                />
              ))}
            </div>
          </section>
        ) : loadError ? (
          <section className="rounded-3xl border border-[#e2ebe4] bg-white px-5 py-12 text-center">
            <p className="text-4xl">📡</p>
            <h1 className="mt-4 text-xl font-extrabold text-[#26352a]">
              তথ্য লোড করা যায়নি
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করো।
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-[#078542] px-5 py-3 font-bold text-white hover:bg-[#066e37]"
            >
              আবার চেষ্টা করুন
            </button>
          </section>
        ) : invalidCategory ? (
          <section className="rounded-3xl border border-[#e2ebe4] bg-white px-5 py-12 text-center">
            <p className="text-5xl">🔎</p>
            <h1 className="mt-4 text-2xl font-extrabold text-[#26352a]">
              ক্যাটাগরি পাওয়া যায়নি
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              এই ক্যাটাগরিতে কোনো পণ্য নেই, অথবা ঠিকানাটি সঠিক নয়।
            </p>
            <Link
              href="/"
              className="mt-5 inline-block rounded-xl bg-[#078542] px-5 py-3 font-bold text-white hover:bg-[#066e37]"
            >
              হোম পেজে ফিরে যান
            </Link>
          </section>
        ) : (
          <>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#078542]">
                  🛒 বাজার দর · ক্যাটাগরি
                </p>
                <h1 className="mt-2 text-3xl font-extrabold text-[#26352a] sm:text-4xl">
                  {categoryInfo?.emoji} {categoryInfo?.name}
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  এই ক্যাটাগরির সব পণ্যের আজকের বাজারদর
                </p>
              </div>

              <div className="w-full sm:w-auto">
                <label
                  htmlFor="category-sort"
                  className="mb-2 block text-sm font-semibold text-gray-600"
                >
                  সাজান
                </label>
                <div className="relative">
                  <select
                    id="category-sort"
                    value={sort}
                    onChange={(event) =>
                      setSort(event.target.value as SortOption)
                    }
                    className="w-full appearance-none rounded-xl border border-[#dce7dd] bg-white py-3 pl-4 pr-10 text-sm font-semibold text-[#26352a] outline-none focus:border-[#078542] sm:min-w-64"
                  >
                    <option value="default">ডিফল্ট</option>
                    <option value="low-high">দাম: কম থেকে বেশি</option>
                    <option value="high-low">দাম: বেশি থেকে কম</option>
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    ▾
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-b border-[#dfe9e0] pb-3">
              <p className="text-sm text-gray-500">
                মোট {formatBengaliNumber(sortedProducts.length)}টি পণ্য
              </p>
              {sort !== "default" && (
                <button
                  onClick={() => setSort("default")}
                  className="text-xs font-bold text-[#078542] hover:underline"
                >
                  সাজানো মুছুন
                </button>
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen animate-pulse bg-[#f0f5f0] p-8">
          <div className="h-8 w-56 rounded-lg bg-gray-200" />
          <div className="mt-6 h-40 rounded-2xl bg-white" />
        </main>
      }
    >
      <CategoryPageContent />
    </Suspense>
  );
}

