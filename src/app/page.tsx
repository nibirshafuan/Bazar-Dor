"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

const categoryData: Record<string, { name: string; emoji: string }> = {
  chal: { name: "চাল", emoji: "🍚" },
  dal: { name: "ডাল", emoji: "🫘" },
  tel: { name: "তেল", emoji: "🫙" },
  sobji: { name: "সবজি", emoji: "🥬" },
  mach: { name: "মাছ", emoji: "🐟" },
  mangsho: { name: "মাংস", emoji: "🍗" },
  "dim-dui": { name: "ডিম-দুধ", emoji: "🥚" },
  mosla: { name: "মসলা", emoji: "🌶️" },
};

type Product = {
  id: string | number;
  slug: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  change: number;
  emoji: string;
};

const demoProducts: Product[] = [
  { id: 1, slug: "miniket-chal", name: "মিনিকেট চাল", category: "chal", unit: "কেজি", price: 78, change: 2.1, emoji: "🍚" },
  { id: 2, slug: "mosur-dal", name: "মসুর ডাল", category: "dal", unit: "কেজি", price: 125, change: 1.4, emoji: "🫘" },
  { id: 3, slug: "soybean-oil", name: "সয়াবিন তেল", category: "tel", unit: "লিটার", price: 172, change: 0, emoji: "🫙" },
  { id: 4, slug: "alu", name: "আলু", category: "sobji", unit: "কেজি", price: 35, change: -3.2, emoji: "🥔" },
  { id: 5, slug: "peyaj", name: "পেঁয়াজ", category: "sobji", unit: "কেজি", price: 64, change: 4.5, emoji: "🧅" },
  { id: 6, slug: "begun", name: "বেগুন", category: "sobji", unit: "কেজি", price: 48, change: 2.8, emoji: "🍆" },
  { id: 7, slug: "ilish", name: "ইলিশ মাছ", category: "mach", unit: "কেজি", price: 1250, change: 3.5, emoji: "🐟" },
  { id: 8, slug: "broiler-murgi", name: "ব্রয়লার মুরগি", category: "mangsho", unit: "কেজি", price: 195, change: -1.8, emoji: "🍗" },
  { id: 9, slug: "dim", name: "ডিম", category: "dim-dui", unit: "ডজন", price: 145, change: 0.8, emoji: "🥚" },
  { id: 10, slug: "holud", name: "হলুদ গুঁড়া", category: "mosla", unit: "কেজি", price: 320, change: -0.6, emoji: "🌶️" },
  { id: 11, slug: "atta", name: "আটা", category: "chal", unit: "কেজি", price: 58, change: -1.2, emoji: "🌾" },
  { id: 12, slug: "roshun", name: "রসুন", category: "mosla", unit: "কেজি", price: 180, change: 2.7, emoji: "🧄" },
];

function numberValue(value: unknown): number {
  if (typeof value === "number") return value;
  const digits = "০১২৩৪৫৬৭৮৯";
  const text = String(value ?? "").replace(/[০-৯]/g, d => String(digits.indexOf(d)));
  return Number(text.replace(/[^\d.-]/g, "")) || 0;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 2 }).format(value);
}

function getProducts(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.products)) return payload.products;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.products)) return payload.data.products;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

function ProductCard({ product }: { product: Product }) {
  const rising = product.change > 0;
  const falling = product.change < 0;

  return (
    <Link href={`/product/${encodeURIComponent(product.slug)}`}
      className="rounded-2xl border border-[#e2ebe4] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff6ef] text-2xl">
          {product.emoji}
        </span>
        <div>
          <h3 className="font-bold text-[#27382b]">{product.name}</h3>
          <p className="mt-1 text-xs text-gray-500">প্রতি {product.unit}</p>
        </div>
      </div>
      <div className="mt-5 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <p className="mt-1 font-extrabold text-[#26372a]">{formatPrice(product.price)} টাকা</p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-bold ${
          rising ? "bg-red-50 text-red-600" :
          falling ? "bg-green-50 text-green-700" :
          "bg-gray-100 text-gray-500"
        }`}>
          {rising ? "▲" : falling ? "▼" : "—"} {formatPrice(Math.abs(product.change))}%
        </span>
      </div>
    </Link>
  );
}

function ProductSection({ title, products, id }: {
  title: string;
  products: Product[];
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold text-[#27382b]">{title}</h2>
        {id && <span className="text-xs text-gray-500">{formatPrice(products.length)}টি পণ্য</span>}
      </div>
      {products.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <p className="rounded-xl bg-white p-5 text-sm text-gray-500">এই মুহূর্তে কোনো পণ্য পাওয়া যায়নি।</p>
      )}
    </section>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ slug: string; name: string; emoji: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Intl.DateTimeFormat("bn-BD", {
      dateStyle: "long",
      timeZone: "Asia/Dhaka",
    }).format(new Date()));

    let active = true;

    async function loadData() {
      for (const base of API) {
        try {
          const [productResponse, categoryResponse] = await Promise.all([
            fetch(`${base}/products`),
            fetch(`${base}/categories`),
          ]);

          if (!productResponse.ok) throw new Error("Products request failed");

          const rawProducts = getProducts(await productResponse.json());
          if (!rawProducts.length) throw new Error("No products found");

          const mapped: Product[] = rawProducts.map((item: any, index: number) => {
            const rawCategory = String(
              item.categorySlug ?? item.category?.slug ?? item.categoryId ??
              item.category ?? "sobji"
            ).toLowerCase();

            const category = categoryData[rawCategory] ? rawCategory : "sobji";
            const name = String(item.nameBn ?? item.name_bn ?? item.name ?? item.title ?? "পণ্য");
            const slug = String(item.slug ?? item.id ?? `product-${index}`);

            return {
              id: item.id ?? slug,
              slug,
              name,
              category,
              unit: String(item.unitBn ?? item.unitName ?? item.unit ?? "কেজি").replace(/^প্রতি\s*/, ""),
              price: numberValue(item.todayPrice ?? item.currentPrice ?? item.price ?? item.averagePrice ?? 0),
              change: numberValue(item.changePercent ?? item.priceChangePercent ?? item.change ?? item.percentageChange ?? 0),
              emoji: String(item.emoji ?? item.icon ?? categoryData[category].emoji),
            };
          });

          let mappedCategories = Object.entries(categoryData).map(([slug, value]) => ({
            slug, name: value.name, emoji: value.emoji,
          }));

          if (categoryResponse.ok) {
            const rawCategories = getProducts(await categoryResponse.json());
            if (rawCategories.length) {
              mappedCategories = rawCategories.map((c: any) => ({
                slug: String(c.slug ?? c.id ?? ""),
                name: String(c.nameBn ?? c.name_bn ?? c.name ?? "বিভাগ"),
                emoji: String(c.emoji ?? c.icon ?? "🛒"),
              }));
            }
          }

          if (!active) return;
          setProducts(mapped);
          setCategories(mappedCategories);
          setLoading(false);
          return;
        } catch {
          // Try the alternative API.
        }
      }

      if (active) {
        setProducts(demoProducts);
        setCategories(Object.entries(categoryData).map(([slug, value]) => ({
          slug, name: value.name, emoji: value.emoji,
        })));
        setApiError(true);
        setLoading(false);
      }
    }

    void loadData();
    return () => { active = false; };
  }, []);

  const risers = [...products].filter(p => p.change > 0).sort((a, b) => b.change - a.change).slice(0, 6);
  const fallers = [...products].filter(p => p.change < 0).sort((a, b) => a.change - b.change).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#f0f5f0] text-[#26352a]">
      <header className="border-b border-[#e1eae2] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#078542] text-2xl text-white">🛒</span>
            <span>
              <span className="block text-xl font-extrabold">বাজার দর</span>
              <span className="block text-[11px] text-gray-500">{date || "বাংলাদেশের বাজারদর"}</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/signin" className="rounded-lg px-3 py-2 text-sm font-bold hover:bg-gray-100">সাইন ইন</Link>
            <Link href="/signup" className="rounded-lg bg-[#078542] px-3 py-2 text-sm font-bold text-white hover:bg-[#066e37]">সাইন আপ</Link>
          </div>
        </div>

        <nav className="border-t border-gray-100">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
            <Link href="/" className="shrink-0 rounded-full bg-[#e5f4e9] px-3 py-2 text-xs font-bold text-green-800">🏠 সব পণ্য</Link>
            {categories.map(category => (
              <Link key={category.slug} href={`/category/${encodeURIComponent(category.slug)}`}
                className="shrink-0 rounded-full px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-[#e5f4e9]">
                {category.emoji} {category.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <div className="overflow-hidden border-b border-[#e1eae2] bg-white py-2">
        <div className="market-ticker flex w-max gap-8">
          {[...products, ...products].map((p, i) => (
            <span key={`${p.id}-${i}`} className="flex items-center gap-2 whitespace-nowrap text-xs">
              {p.emoji} <b>{p.name}</b> {formatPrice(p.price)} টাকা/{p.unit}
              <span className={p.change > 0 ? "font-bold text-red-600" : p.change < 0 ? "font-bold text-green-700" : "text-gray-500"}>
                {p.change > 0 ? "▲" : p.change < 0 ? "▼" : "—"} {formatPrice(Math.abs(p.change))}%
              </span>
            </span>
          ))}
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-9 px-4 py-6 sm:px-6 sm:py-8">
        <section className="overflow-hidden rounded-3xl border border-[#e0eae1] bg-[#fbfdfb] px-5 py-8 sm:px-8 sm:py-10 lg:flex lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="rounded-full bg-[#e4f4e9] px-3 py-1 text-xs font-bold text-green-800">প্রতিদিনের বাজারদর</span>
            <h1 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">আজকের বাজারের দাম এক নজরে</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস ও নিত্যপ্রয়োজনীয় পণ্যের বাজারদর সহজেই দেখুন।
            </p>
            <a href="#sob-panno" className="mt-5 inline-flex rounded-lg bg-[#078542] px-5 py-3 text-sm font-bold text-white hover:bg-[#066e37]">
              সব পণ্য দেখুন ↓
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center text-7xl sm:text-8xl lg:mt-0 lg:w-64" aria-hidden="true">
            🧺🥕
          </div>
        </section>

        {apiError && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            API সংযোগ পাওয়া যায়নি। আপাতত প্রদর্শনী data দেখানো হচ্ছে; এগুলো live বাজারদর নয়।
          </p>
        )}

        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map(section => (
              <section key={section}>
                <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <>
            <ProductSection title="আজ দাম বেড়েছে ▲" products={risers} />
            <ProductSection title="আজ দাম কমেছে ▼" products={fallers} />
            <ProductSection id="sob-panno" title="সব পণ্য" products={products} />
          </>
        )}
      </main>

      <footer className="mt-8 border-t border-[#e1eae2] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-gray-500 sm:flex-row sm:justify-between sm:px-6">
          <p className="font-bold text-gray-700">বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
          <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
        </div>
      </footer>
    </div>
  );
}
