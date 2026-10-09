"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { authClient } from "@/lib/auth-client";
import { formatBengaliNumber } from "@/lib/formatters";

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
  "dim-dui": "🥚",
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
    unit: String(item.unit ?? "kg"),
    image: typeof item.image === "string" ? item.image : "",
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
      name: String(
        market.market ??
          market.nameBn ??
          market.name ??
          market.marketName ??
          "স্থানীয় বাজার"
      ),
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

function unitLabel(unit: string): string {
  const normalized = unit.trim().toLowerCase();
  return UNIT_NAMES[normalized] ?? unit;
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
    <div className="rounded-2xl border border-[#e2ebe4] bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-extrabold text-[#26372a]">
        {formatPrice(value)} <span className="text-sm">টাকা</span>
      </p>
      <p className="mt-1 text-xs text-gray-500">প্রতি {unit}</p>
    </div>
  );
}

function ProductDetailsContent() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = decodeURIComponent(String(params.slug ?? ""));
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionPending) return;

    if (!session) {
      const callbackURL = `/product/${encodeURIComponent(slug)}`;
      router.replace(`/signin?callbackURL=${encodeURIComponent(callbackURL)}`);
    }
  }, [session, sessionPending, slug, router]);

  useEffect(() => {
    if (sessionPending || !session || !slug) return;

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
          setError("NOT_FOUND");
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

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [session, sessionPending, slug]);

  const priceSummary = useMemo(() => {
    const markets = product?.markets ?? [];

    if (markets.length === 0) return null;

    const minValues = markets.map((market) => market.min);
    const maxValues = markets.map((market) => market.max);
    const marketAverages = markets.map(
      (market) => (market.min + market.max) / 2
    );

    return {
      min: Math.min(...minValues),
      max: Math.max(...maxValues),
      average:
        marketAverages.reduce((sum, value) => sum + value, 0) /
        marketAverages.length,
    };
  }, [product]);

  const rising = (product?.change ?? 0) > 0;
  const falling = (product?.change ?? 0) < 0;
  const unit = product ? unitLabel(product.unit) : "";

  if (sessionPending || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f0f5f0]">
        <p className="animate-pulse font-semibold text-[#087c40]">
          লগইন যাচাই করা হচ্ছে...
        </p>
      </main>
    );
  }

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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-28 rounded-2xl bg-white" />
              ))}
            </div>
            <div className="h-64 rounded-3xl bg-white" />
          </div>
        ) : error === "NOT_FOUND" ? (
          <div className="mt-6 rounded-3xl border border-[#e2ebe4] bg-white p-8 text-center">
            <p className="text-5xl">🔎</p>
            <h1 className="mt-4 text-2xl font-extrabold text-gray-800">
              পণ্য পাওয়া যায়নি
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              এই ঠিকানায় কোনো পণ্য পাওয়া যায়নি।
            </p>
            <Link
              href="/"
              className="mt-5 inline-block rounded-xl bg-[#078542] px-5 py-3 font-bold text-white"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        ) : error ? (
          <div className="mt-6 rounded-3xl bg-white p-8 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-[#078542] px-5 py-3 font-bold text-white"
            >
              আবার চেষ্টা করুন
            </button>
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
                    <span className="text-8xl">
                      {product.image || product.emoji}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex rounded-full bg-[#e5f4e9] px-3 py-1 text-sm font-bold text-[#087c40]">
                      {product.emoji} {product.categoryName}
                    </span>
                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                      প্রতি {unit}
                    </span>
                  </div>

                  <h1 className="mt-4 text-3xl font-extrabold text-[#26372a] sm:text-4xl">
                    {product.name}
                  </h1>

                  <p className="mt-2 leading-7 text-gray-500">
                    বিভিন্ন বাজারে {product.name}-এর বর্তমান দাম ও
                    বাজারভিত্তিক সর্বনিম্ন-সর্বোচ্চ দামের তুলনা দেখুন।
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
                    {rising
                      ? "▲ দাম বেড়েছে"
                      : falling
                        ? "▼ দাম কমেছে"
                        : "— দামে পরিবর্তন নেই"}{" "}
                    {product.change > 0 ? "+" : ""}
                    {formatPrice(product.change)}%
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-extrabold text-[#26372a]">
                ⚖️ বাজারভিত্তিক মূল্যসারাংশ
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                সব বাজারের দেওয়া সর্বনিম্ন ও সর্বোচ্চ দাম থেকে হিসাব করা
              </p>

              {priceSummary ? (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <PriceBox
                    title="সর্বনিম্ন দাম"
                    value={priceSummary.min}
                    unit={unit}
                  />
                  <PriceBox
                    title="সর্বোচ্চ দাম"
                    value={priceSummary.max}
                    unit={unit}
                  />
                  <PriceBox
                    title="গড় বাজারদর"
                    value={priceSummary.average}
                    unit={unit}
                  />
                </div>
              ) : (
                <div className="mt-4 rounded-2xl bg-white p-5 text-sm text-gray-500">
                  এই পণ্যের বাজারভিত্তিক দাম পাওয়া যায়নি; তাই মূল্যসারাংশ
                  হিসাব করা সম্ভব নয়।
                </div>
              )}
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-extrabold text-[#26372a]">
                📊 দামের ইতিহাস
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                বিভিন্ন সময়ের দাম তুলনা করো
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <PriceBox title="আজকের দাম" value={product.today} unit={unit} />
                <PriceBox
                  title="গতকালের দাম"
                  value={product.yesterday}
                  unit={unit}
                />
                <PriceBox
                  title="গত সপ্তাহের দাম"
                  value={product.lastWeek}
                  unit={unit}
                />
                <PriceBox
                  title="গত মাসের দাম"
                  value={product.lastMonth}
                  unit={unit}
                />
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-extrabold text-[#26372a]">
                🏪 বাজারভিত্তিক আজকের দাম
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                প্রতিটি বাজারের সর্বনিম্ন ও সর্বোচ্চ দামের তুলনা
              </p>

              {product.markets.length > 0 ? (
                <div className="mt-4 overflow-x-auto rounded-2xl border border-[#e2ebe4] bg-white">
                  <div className="min-w-[520px]">
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
                          <p className="font-bold text-gray-800">
                            {market.name}
                          </p>
                          {market.division && (
                            <p className="mt-1 text-xs text-gray-500">
                              {market.division}
                            </p>
                          )}
                        </div>
                        <p className="font-bold text-green-700">
                          {formatPrice(market.min)} টাকা
                        </p>
                        <p className="font-bold text-red-600">
                          {formatPrice(market.max)} টাকা
                        </p>
                      </div>
                    ))}
                  </div>
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
                প্রদর্শিত দাম API থেকে সংগ্রহ করা হয়েছে। বাস্তবে বাজার, মান ও
                এলাকার ভিত্তিতে দাম ভিন্ন হতে পারে। গড় বাজারদর প্রতিটি বাজারের
                সর্বনিম্ন ও সর্বোচ্চ দামের মধ্যবিন্দুর গড়।
              </p>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen animate-pulse bg-[#f0f5f0] p-8" />
      }
    >
      <ProductDetailsContent />
    </Suspense>
  );
}

