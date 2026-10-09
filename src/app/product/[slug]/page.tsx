"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

const API_BASES = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

type Market = {
  name: string;
  division: string;
  min: number;
  max: number;
};

type Product = {
  id: string | number;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  unit: string;
  image: string;
  emoji: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: number;
  markets: Market[];
};

type Category = {
  slug: string;
  name: string;
  emoji: string;
};

const CATEGORY_ICONS: Record<string, string> = {
  chal: "🍚",
  dal: "🫘",
  tel: "🛢️",
  sobji: "🥬",
  mach: "🐟",
  mangsho: "🍗",
  "dim-dui": "🥛",
  mosla: "🌶️",
};

const CATEGORY_NAMES: Record<string, string> = {
  chal: "চাল",
  dal: "ডাল",
  tel: "তেল",
  sobji: "সবজি",
  mach: "মাছ",
  mangsho: "মাংস",
  "dim-dui": "ডিম-দুধ",
  mosla: "মসলা",
};

function numberValue(value: unknown): number {
  if (typeof value === "number") return value;

  const digits = "০১২৩৪৫৬৭৮৯";
  const normalized = String(value ?? "").replace(/[০-৯]/g, (digit) =>
    String(digits.indexOf(digit))
  );

  return Number(normalized.replace(/[^\d.-]/g, "")) || 0;
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
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

function normalizeProduct(item: any): Product {
  const category = String(
    item.category?.slug ??
    item.category?.id ??
    item.category ??
    item.categorySlug ??
    ""
  );

  const image = typeof item.image === "string" ? item.image : "";

  const rawMarkets = Array.isArray(item.markets) ? item.markets : [];

  return {
    id: item.id ?? item.slug ?? "",
    slug: String(item.slug ?? item.id ?? ""),
    name: String(item.nameBn ?? item.name ?? "নাম পাওয়া যায়নি"),
    category,
    categoryName: String(
      item.categoryNameBn ??
      item.category?.nameBn ??
      CATEGORY_NAMES[category] ??
      "অন্যান্য"
    ),
    unit: String(item.unit ?? "কেজি"),
    image,
    emoji: String(
      item.categoryIcon ??
      item.category?.icon ??
      CATEGORY_ICONS[category] ??
      "🛒"
    ),
    today: numberValue(item.today ?? item.price),
    yesterday: numberValue(item.yesterday),
    lastWeek: numberValue(item.lastWeek),
    lastMonth: numberValue(item.lastMonth),
    change: numberValue(item.change?.pct ?? item.changePct ?? 0),
    markets: rawMarkets.map((market: any) => ({
      name: String(market.nameBn ?? market.name ?? market.marketName ?? "স্থানীয় বাজার"),
      division: String(market.division ?? market.location ?? ""),
      min: numberValue(market.min ?? market.minPrice ?? market.min_price),
      max: numberValue(market.max ?? market.maxPrice ?? market.max_price),
    })),
  };
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
    : new Error("API থেকে তথ্য আনা যায়নি।");
}

function PriceBox({
  title,
  value,
  unit,
}: {
  title: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e2ebe4] bg-white p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-xl font-extrabold text-[#26372a]">
        {formatPrice(value)} টাকা
      </p>
      <p className="mt-1 text-xs text-gray-500">প্রতি {unit}</p>
    </div>
  );
}

function ProductDetailsContent() {
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(String(params.slug ?? ""));

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError("");

      try {
        const [productsPayload, categoriesPayload] = await Promise.all([
          fetchFromApi("/products"),
          fetchFromApi("/categories").catch(() => []),
        ]);

        const products = getArray(productsPayload).map(normalizeProduct);
        const found = products.find((item) => item.slug === slug);

        if (cancelled) return;

        if (!found) {
          setProduct(null);
          setError("এই পণ্যটি পাওয়া যায়নি।");
        } else {
          setProduct(found);
        }

        const categoryItems = getArray(categoriesPayload);

        setCategories(
          categoryItems.map((item: any) => ({
            slug: String(item.slug ?? item.id ?? ""),
            name: String(item.nameBn ?? item.name ?? ""),
            emoji: String(item.icon ?? item.emoji ?? "🛒"),
          }))
        );
      } catch {
        if (!cancelled) {
          setError("পণ্যের তথ্য লোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করো।");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (slug) loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const rising = (product?.change ?? 0) > 0;
  const falling = (product?.change ?? 0) < 0;

  return (
    <div className="min-h-screen bg-[#f0f5f0]">
      <Navbar categories={categories} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#087c40] shadow-sm hover:bg-[#e5f4e9]"
        >
          ← সব পণ্যে ফিরে যাও
        </Link>

        {loading ? (
          <div className="mt-6 animate-pulse space-y-5">
            <div className="h-48 rounded-3xl bg-white" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-28 rounded-2xl bg-white" />
              ))}
            </div>
            <div className="h-64 rounded-3xl bg-white" />
          </div>
        ) : error ? (
          <div className="mt-6 rounded-3xl border border-red-100 bg-white p-8 text-center">
            <p className="text-5xl">🔎</p>
            <h1 className="mt-4 text-xl font-extrabold text-gray-800">
              পণ্য পাওয়া যায়নি
            </h1>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <Link
              href="/"
              className="mt-5 inline-block rounded-xl bg-[#078542] px-5 py-3 font-bold text-white"
            >
              হোমপেজে ফিরে যাও
            </Link>
          </div>
        ) : product ? (
          <>
            <section className="mt-6 overflow-hidden rounded-3xl border border-[#e2ebe4] bg-white">
              <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_1.5fr] md:items-center">
                <div className="flex min-h-48 items-center justify-center rounded-2xl bg-[#eff6ef] p-6">
                  {product.image.startsWith("http") ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-48 w-full object-contain"
                    />
                  ) : (
                    <span className="text-8xl">{product.emoji}</span>
                  )}
                </div>

                <div>
                  <span className="inline-flex rounded-full bg-[#e5f4e9] px-3 py-1 text-sm font-bold text-[#087c40]">
                    {product.emoji} {product.categoryName}
                  </span>

                  <h1 className="mt-4 text-3xl font-extrabold text-[#26372a] sm:text-4xl">
                    {product.name}
                  </h1>

                  <p className="mt-2 text-gray-500">
                    প্রতি {product.unit} বাজারদর
                  </p>

                  <p className="mt-5 text-sm text-gray-500">আজকের দাম</p>
                  <p className="mt-1 text-4xl font-extrabold text-[#078542]">
                    {formatPrice(product.today)}{" "}
                    <span className="text-lg">টাকা</span>
                  </p>

                  <div
                    className={`mt-4 inline-flex rounded-xl px-4 py-2 text-sm font-bold ${
                      rising
                        ? "bg-red-50 text-red-600"
                        : falling
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {rising ? "▲ দাম বেড়েছে" : falling ? "▼ দাম কমেছে" : "— দামে পরিবর্তন নেই"}
                    {" "}
                    {product.change > 0 ? "+" : ""}
                    {formatPrice(product.change)}%
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-extrabold text-[#26372a]">
                📊 দামের ইতিহাস
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                বিভিন্ন সময়ের দাম তুলনা করো
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <PriceBox title="আজকের দাম" value={product.today} unit={product.unit} />
                <PriceBox title="গতকালের দাম" value={product.yesterday} unit={product.unit} />
                <PriceBox title="গত সপ্তাহের দাম" value={product.lastWeek} unit={product.unit} />
                <PriceBox title="গত মাসের দাম" value={product.lastMonth} unit={product.unit} />
              </div>
            </section>

            <section className="mt-8">
              <div>
                <h2 className="text-xl font-extrabold text-[#26372a]">
                  🏪 বিভিন্ন বাজারের দাম
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  বাজারভেদে সর্বনিম্ন ও সর্বোচ্চ দামের তুলনা
                </p>
              </div>

              {product.markets.length > 0 ? (
                <div className="mt-4 overflow-hidden rounded-2xl border border-[#e2ebe4] bg-white">
                  <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-3 bg-[#e5f4e9] px-4 py-3 text-sm font-bold text-[#245536] sm:px-6">
                    <span>বাজার</span>
                    <span>সর্বনিম্ন দাম</span>
                    <span>সর্বোচ্চ দাম</span>
                  </div>

                  {product.markets.map((market, index) => (
                    <div
                      key={`${market.name}-${market.division}-${index}`}
                      className="grid grid-cols-[1.2fr_1fr_1fr] gap-3 border-t border-gray-100 px-4 py-4 text-sm sm:px-6"
                    >
                      <div>
                        <p className="font-bold text-gray-800">{market.name}</p>
                        {market.division && (
                          <p className="mt-1 text-xs text-gray-500">
                            {market.division}
                          </p>
                        )}
                      </div>
                      <p className="font-bold text-green-700">
                        {formatPrice(market.min)} ৳
                      </p>
                      <p className="font-bold text-red-600">
                        {formatPrice(market.max)} ৳
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-[#e2ebe4] bg-white p-6 text-sm text-gray-500">
                  এই পণ্যের জন্য আলাদা বাজারভিত্তিক দামের তথ্য API-তে পাওয়া যায়নি।
                </div>
              )}
            </section>

            <section className="mt-8 rounded-2xl bg-[#e5f4e9] p-5 text-sm text-[#31543a]">
              <p className="font-bold">ℹ️ বাজারদর সম্পর্কে</p>
              <p className="mt-2 leading-6">
                এখানে প্রদর্শিত দাম API থেকে সংগ্রহ করা হয়েছে। বাস্তবে বাজার,
                মান ও এলাকার ভিত্তিতে দাম ভিন্ন হতে পারে।
              </p>
            </section>
          </>
        ) : null}
      </main>

      <footer className="mt-12 border-t border-[#e1eae2] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-gray-500 sm:px-6">
          <p className="font-bold text-[#078542]">🛒 বাজার দর</p>
          <p className="mt-2">বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর</p>
        </div>
      </footer>
    </div>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f0f5f0] p-8" />}>
      <ProductDetailsContent />
    </Suspense>
  );
}
