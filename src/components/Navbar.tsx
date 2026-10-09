"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Category = {
  slug: string;
  name: string;
  emoji: string;
};

type NavbarProps = {
  categories?: Category[];
};

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

export default function Navbar({ categories = defaultCategories }: NavbarProps) {
  const pathname = usePathname();
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(
      new Intl.DateTimeFormat("bn-BD", {
        dateStyle: "long",
        timeZone: "Asia/Dhaka",
      }).format(new Date())
    );
  }, []);

  function isCategoryActive(slug: string) {
    return pathname === `/category/${slug}`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#e1eae2] bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
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

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/signin"
            className="rounded-lg px-3 py-2 text-sm font-bold text-[#26352a] transition hover:bg-gray-100"
          >
            সাইন ইন
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-[#078542] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#066e37]"
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
    </header>
  );
}
