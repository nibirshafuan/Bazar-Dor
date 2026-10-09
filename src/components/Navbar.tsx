"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Category = {
  slug: string;
  name: string;
  emoji: string;
};

type TickerProduct = {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  unit: string;
  change: number;
  emoji: string;
};

type NavbarProps = {
  categories?: Category[];
};

const API_URLS = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

const defaultCategories: Category[] = [
  { slug: "chal", name: "চাল", emoji: "🍚" },
  { slug: "dal", name: "ডাল", emoji: "🫘" },
  { slug: "tel", name: "তেল", emoji: "🛢️" },
  { slug: "sobji", name: "সবজি", emoji: "🥬" },
  { slug: "mach", name: "মাছ", emoji: "🐟" },
  { slug: "mangsho", name: "মাংস", emoji: "🍗" },
  { slug: "dim-dui", name: "ডিম-দুধ", emoji: "🥛" },
  { slug: "mosla", name: "মসলা", emoji: "🌶️" },
];

const fallbackTicker: TickerProduct[] = [
  { id: "rice", slug: "sorno-machi-chal", name: "চাল", price: 148, unit: "কেজি", change: 2.1, emoji: "🍚" },
  { id: "dal", slug: "mosur-dal", name: "ডাল", price: 120, unit: "কেজি", change: -1.5, emoji: "🫘" },
  { id: "oil", slug: "soyabean-tel", name: "সয়াবিন তেল", price: 175, unit: "লিটার", change: 0.8, emoji: "🛢️" },
  { id: "fish", slug: "rui-mach", name: "রুই মাছ", price: 320, unit: "কেজি", change: 0, emoji: "🐟" },
];

const bnNumber = (value: number) =>
  new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 1 }).format(value);

function normalizeProducts(data: unknown): TickerProduct[] {
  const items = Array.isArray(data)
    ? data
    : data && typeof data === "object" && "products" in data && Array.isArray(data.products)
      ? data.products
      : [];

  return items
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item, index) => {
      const changeObject =
        item.change && typeof item.change === "object"
          ? (item.change as Record<string, unknown>)
          : null;

      const price = Number(item.today ?? item.price ?? 0);
      const rawChange = Number(changeObject?.pct ?? item.changePct ?? item.change ?? 0);
      const direction = String(changeObject?.dir ?? "");

      const change =
        direction === "down"
          ? -Math.abs(rawChange)
          : direction === "up"
            ? Math.abs(rawChange)
            : rawChange;

      const unitValue = String(item.unit ?? "কেজি");
      const unit =
        unitValue === "kg" ? "কেজি" :
        unitValue === "liter" || unitValue === "litre" ? "লিটার" :
        unitValue === "piece" ? "টি" :
        unitValue === "dozen" ? "ডজন" :
        unitValue;

      return {
        id: String(item.id ?? index),
        slug: String(item.slug ?? ""),
        name: String(item.nameBn ?? item.name ?? "পণ্য"),
        price: Number.isFinite(price) ? price : 0,
        unit,
        change: Number.isFinite(change) ? change : 0,
        emoji: String(item.image ?? item.emoji ?? item.categoryIcon ?? "🛒"),
      };
    })
    .filter((item) => item.price > 0);
}

export default function Navbar({ categories = defaultCategories }: NavbarProps) {
  const pathname = usePathname();
  const [date, setDate] = useState("");
  const [tickerProducts, setTickerProducts] = useState<TickerProduct[]>(fallbackTicker);

  useEffect(() => {
    setDate(
      new Intl.DateTimeFormat("bn-BD", {
        dateStyle: "long",
        timeZone: "Asia/Dhaka",
      }).format(new Date())
    );

    let cancelled = false;

    async function loadTicker() {
      for (const baseUrl of API_URLS) {
        try {
          const response = await fetch(`${baseUrl}/products`);
          if (!response.ok) continue;

          const data: unknown = await response.json();
          const products = normalizeProducts(data);

          if (!cancelled && products.length > 0) {
            setTickerProducts(products);
          }

          if (products.length > 0) return;
        } catch {
          // Try the next API endpoint.
        }
      }
    }

    void loadTicker();

    return () => {
      cancelled = true;
    };
  }, []);

  function isCategoryActive(slug: string) {
    return pathname === `/category/${slug}`;
  }

  const tickerItems = [...tickerProducts, ...tickerProducts];

  return (
    <header className="sticky top-0 z-50 border-b border-[#e1eae2] bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#078542] text-2xl text-white">
            🛒
          </span>
          <span>
            <span className="block text-xl font-extrabold text-[#26352a]">
              বাজার দর
            </span>
            <span className="block text-[11px] text-gray-500">
              {date || "বাংলাদেশের বাজারদর"}
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/signin"
            className="rounded-lg px-2 py-2 text-xs font-bold text-[#26352a] transition hover:bg-gray-100 sm:px-3 sm:text-sm"
          >
            সাইন ইন
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-[#078542] px-2 py-2 text-xs font-bold text-white transition hover:bg-[#066e37] sm:px-3 sm:text-sm"
          >
            সাইন আপ
          </Link>
        </div>
      </div>

      <nav className="border-t border-gray-100">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          <Link
            href="/"
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
              pathname === "/"
                ? "bg-[#078542] text-white"
                : "text-gray-600 hover:bg-[#e5f4e9]"
            }`}
          >
            🏠 সব পণ্য
          </Link>

          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${encodeURIComponent(category.slug)}`}
              className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition ${
                isCategoryActive(category.slug)
                  ? "bg-[#078542] text-white"
                  : "text-gray-600 hover:bg-[#e5f4e9]"
              }`}
            >
              {category.emoji} {category.name}
            </Link>
          ))}
        </div>
      </nav>

      <div
        className="overflow-hidden border-t border-[#e1eae2] bg-[#f0f8f1]"
        aria-label="চলমান বাজারদর"
      >
        <div className="flex h-10 items-center">
          <span className="z-10 flex h-full shrink-0 items-center bg-[#078542] px-3 text-xs font-extrabold text-white shadow-sm sm:px-4">
            <span className="mr-1.5">📊</span>
            লাইভ বাজারদর
          </span>

          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="bazardor-ticker-track flex w-max items-center">
              {tickerItems.map((product, index) => (
                <Link
                  key={`${product.id}-${index}`}
                  href={product.slug ? `/product/${encodeURIComponent(product.slug)}` : "/"}
                  className="flex shrink-0 items-center gap-2 px-4 text-xs font-semibold text-[#26352a] transition hover:text-[#078542] sm:px-5 sm:text-sm"
                  aria-label={`${product.name}, প্রতি ${product.unit} ${bnNumber(product.price)} টাকা`}
                >
                  <span>{product.emoji}</span>
                  <span className="whitespace-nowrap">{product.name}</span>
                  <span className="whitespace-nowrap font-extrabold">
                    ৳{bnNumber(product.price)}/{product.unit}
                  </span>
                  <span
                    className={`whitespace-nowrap text-[11px] font-bold ${
                      product.change > 0
                        ? "text-red-600"
                        : product.change < 0
                          ? "text-green-700"
                          : "text-gray-500"
                    }`}
                  >
                    {product.change > 0
                      ? "▲ "
                      : product.change < 0
                        ? "▼ "
                        : "● "}
                    {bnNumber(Math.abs(product.change))}%
                  </span>
                  <span className="ml-2 text-[#c7d8ca]">•</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bazardor-ticker-track {
          animation: bazardor-scroll 45s linear infinite;
          will-change: transform;
        }

        .bazardor-ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes bazardor-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bazardor-ticker-track {
            animation: none;
          }
        }
      `}</style>
    </header>
  );
}
