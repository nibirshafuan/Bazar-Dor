warning: in the working copy of 'src/app/page.tsx', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/src/app/page.tsx b/src/app/page.tsx[m
[1mindex c887311..38afe75 100644[m
[1m--- a/src/app/page.tsx[m
[1m+++ b/src/app/page.tsx[m
[36m@@ -1,69 +1,312 @@[m
[31m-import Image from "next/image";[m
[32m+[m[32m﻿"use client";[m
[32m+[m
[32m+[m[32mimport Link from "next/link";[m
[32m+[m[32mimport { useEffect, useState } from "react";[m
[32m+[m
[32m+[m[32mconst API = [[m
[32m+[m[32m  "https://api.api-store.workers.dev/api/bazardor",[m
[32m+[m[32m  "https://api.abcz.workers.dev/api/bazardor",[m
[32m+[m[32m];[m
[32m+[m
[32m+[m[32mconst categoryData: Record<string, { name: string; emoji: string }> = {[m
[32m+[m[32m  chal: { name: "চাল", emoji: "🍚" },[m
[32m+[m[32m  dal: { name: "ডাল", emoji: "🫘" },[m
[32m+[m[32m  tel: { name: "তেল", emoji: "🫙" },[m
[32m+[m[32m  sobji: { name: "সবজি", emoji: "🥬" },[m
[32m+[m[32m  mach: { name: "মাছ", emoji: "🐟" },[m
[32m+[m[32m  mangsho: { name: "মাংস", emoji: "🍗" },[m
[32m+[m[32m  "dim-dui": { name: "ডিম-দুধ", emoji: "🥚" },[m
[32m+[m[32m  mosla: { name: "মসলা", emoji: "🌶️" },[m
[32m+[m[32m};[m
[32m+[m
[32m+[m[32mtype Product = {[m
[32m+[m[32m  id: string | number;[m
[32m+[m[32m  slug: string;[m
[32m+[m[32m  name: string;[m
[32m+[m[32m  category: string;[m
[32m+[m[32m  unit: string;[m
[32m+[m[32m  price: number;[m
[32m+[m[32m  change: number;[m
[32m+[m[32m  emoji: string;[m
[32m+[m[32m};[m
[32m+[m
[32m+[m[32mconst demoProducts: Product[] = [[m
[32m+[m[32m  { id: 1, slug: "miniket-chal", name: "মিনিকেট চাল", category: "chal", unit: "কেজি", price: 78, change: 2.1, emoji: "🍚" },[m
[32m+[m[32m  { id: 2, slug: "mosur-dal", name: "মসুর ডাল", category: "dal", unit: "কেজি", price: 125, change: 1.4, emoji: "🫘" },[m
[32m+[m[32m  { id: 3, slug: "soybean-oil", name: "সয়াবিন তেল", category: "tel", unit: "লিটার", price: 172, change: 0, emoji: "🫙" },[m
[32m+[m[32m  { id: 4, slug: "alu", name: "আলু", category: "sobji", unit: "কেজি", price: 35, change: -3.2, emoji: "🥔" },[m
[32m+[m[32m  { id: 5, slug: "peyaj", name: "পেঁয়াজ", category: "sobji", unit: "কেজি", price: 64, change: 4.5, emoji: "🧅" },[m
[32m+[m[32m  { id: 6, slug: "begun", name: "বেগুন", category: "sobji", unit: "কেজি", price: 48, change: 2.8, emoji: "🍆" },[m
[32m+[m[32m  { id: 7, slug: "ilish", name: "ইলিশ মাছ", category: "mach", unit: "কেজি", price: 1250, change: 3.5, emoji: "🐟" },[m
[32m+[m[32m  { id: 8, slug: "broiler-murgi", name: "ব্রয়লার মুরগি", category: "mangsho", unit: "কেজি", price: 195, change: -1.8, emoji: "🍗" },[m
[32m+[m[32m  { id: 9, slug: "dim", name: "ডিম", category: "dim-dui", unit: "ডজন", price: 145, change: 0.8, emoji: "🥚" },[m
[32m+[m[32m  { id: 10, slug: "holud", name: "হলুদ গুঁড়া", category: "mosla", unit: "কেজি", price: 320, change: -0.6, emoji: "🌶️" },[m
[32m+[m[32m  { id: 11, slug: "atta", name: "আটা", category: "chal", unit: "কেজি", price: 58, change: -1.2, emoji: "🌾" },[m
[32m+[m[32m  { id: 12, slug: "roshun", name: "রসুন", category: "mosla", unit: "কেজি", price: 180, change: 2.7, emoji: "🧄" },[m
[32m+[m[32m];[m
[32m+[m
[32m+[m[32mfunction numberValue(value: unknown): number {[m
[32m+[m[32m  if (typeof value === "number") return value;[m
[32m+[m[32m  const digits = "০১২৩৪৫৬৭৮৯";[m
[32m+[m[32m  const text = String(value ?? "").replace(/[০-৯]/g, d => String(digits.indexOf(d)));[m
[32m+[m[32m  return Number(text.replace(/[^\d.-]/g, "")) || 0;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mfunction formatPrice(value: number) {[m
[32m+[m[32m  return new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 2 }).format(value);[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mfunction getProducts(payload: any): any[] {[m
[32m+[m[32m  if (Array.isArray(payload)) return payload;[m
[32m+[m[32m  if (Array.isArray(payload?.products)) return payload.products;[m
[32m+[m[32m  if (Array.isArray(payload?.data)) return payload.data;[m
[32m+[m[32m  if (Array.isArray(payload?.data?.products)) return payload.data.products;[m
[32m+[m[32m  if (Array.isArray(payload?.items)) return payload.items;[m
[32m+[m[32m  if (Array.isArray(payload?.results)) return payload.results;[m
[32m+[m[32m  return [];[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mfunction ProductCard({ product }: { product: Product }) {[m
[32m+[m[32m  const rising = product.change > 0;[m
[32m+[m[32m  const falling = product.change < 0;[m
[32m+[m
[32m+[m[32m  return ([m
[32m+[m[32m    <Link href={`/product/${encodeURIComponent(product.slug)}`}[m
[32m+[m[32m      className="rounded-2xl border border-[#e2ebe4] bg-white p-4 transition hover:-translate-y-1 hover:shadow-md">[m
[32m+[m[32m      <div className="flex items-center gap-3">[m
[32m+[m[32m        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff6ef] text-2xl">[m
[32m+[m[32m          {product.emoji}[m
[32m+[m[32m        </span>[m
[32m+[m[32m        <div>[m
[32m+[m[32m          <h3 className="font-bold text-[#27382b]">{product.name}</h3>[m
[32m+[m[32m          <p className="mt-1 text-xs text-gray-500">প্রতি {product.unit}</p>[m
[32m+[m[32m        </div>[m
[32m+[m[32m      </div>[m
[32m+[m[32m      <div className="mt-5 flex items-end justify-between gap-2">[m
[32m+[m[32m        <div>[m
[32m+[m[32m          <p className="text-xs text-gray-500">আজকের দাম</p>[m
[32m+[m[32m          <p className="mt-1 font-extrabold text-[#26372a]">{formatPrice(product.price)} টাকা</p>[m
[32m+[m[32m        </div>[m
[32m+[m[32m        <span className={`rounded-full px-2 py-1 text-xs font-bold ${[m
[32m+[m[32m          rising ? "bg-red-50 text-red-600" :[m
[32m+[m[32m          falling ? "bg-green-50 text-green-700" :[m
[32m+[m[32m          "bg-gray-100 text-gray-500"[m
[32m+[m[32m        }`}>[m
[32m+[m[32m          {rising ? "▲" : falling ? "▼" : "—"} {formatPrice(Math.abs(product.change))}%[m
[32m+[m[32m        </span>[m
[32m+[m[32m      </div>[m
[32m+[m[32m    </Link>[m
[32m+[m[32m  );[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mfunction ProductSection({ title, products, id }: {[m
[32m+[m[32m  title: string;[m
[32m+[m[32m  products: Product[];[m
[32m+[m[32m  id?: string;[m
[32m+[m[32m}) {[m
[32m+[m[32m  return ([m
[32m+[m[32m    <section id={id} className="scroll-mt-6">[m
[32m+[m[32m      <div className="mb-4 flex items-center justify-between gap-3">[m
[32m+[m[32m        <h2 className="text-xl font-extrabold text-[#27382b]">{title}</h2>[m
[32m+[m[32m        {id && <span className="text-xs text-gray-500">{formatPrice(products.length)}টি পণ্য</span>}[m
[32m+[m[32m      </div>[m
[32m+[m[32m      {products.length ? ([m
[32m+[m[32m        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">[m
[32m+[m[32m          {products.map(p => <ProductCard key={p.id} product={p} />)}[m
[32m+[m[32m        </div>[m
[32m+[m[32m      ) : ([m
[32m+[m[32m        <p className="rounded-xl bg-white p-5 text-sm text-gray-500">এই মুহূর্তে কোনো পণ্য পাওয়া যায়নি।</p>[m
[32m+[m[32m      )}[m
[32m+[m[32m    </section>[m
[32m+[m[32m  );[m
[32m+[m[32m}[m
 [m
 export default function Home() {[m
[32m+[m[32m  const [products, setProducts] = useState<Product[]>([]);[m
[32m+[m[32m  const [categories, setCategories] = useState<{ slug: string; name: string; emoji: string }[]>([]);[m
[32m+[m[32m  const [loading, setLoading] = useState(true);[m
[32m+[m[32m  const [apiError, setApiError] = useState(false);[m
[32m+[m[32m  const [date, setDate] = useState("");[m
[32m+[m
[32m+[m[32m  useEffect(() => {[m
[32m+[m[32m    setDate(new Intl.DateTimeFormat("bn-BD", {[m
[32m+[m[32m      dateStyle: "long",[m
[32m+[m[32m      timeZone: "Asia/Dhaka",[m
[32m+[m[32m    }).format(new Date()));[m
[32m+[m
[32m+[m[32m    let active = true;[m
[32m+[m
[32m+[m[32m    async function loadData() {[m
[32m+[m[32m      for (const base of API) {[m
[32m+[m[32m        try {[m
[32m+[m[32m          const [productResponse, categoryResponse] = await Promise.all([[m
[32m+[m[32m            fetch(`${base}/products`),[m
[32m+[m[32m            fetch(`${base}/categories`),[m
[32m+[m[32m          ]);[m
[32m+[m
[32m+[m[32m          if (!productResponse.ok) throw new Error("Products request failed");[m
[32m+[m
[32m+[m[32m          const rawProducts = getProducts(await productResponse.json());[m
[32m+[m[32m          if (!rawProducts.length) throw new Error("No products found");[m
[32m+[m
[32m+[m[32m          const mapped: Product[] = rawProducts.map((item: any, index: number) => {[m
[32m+[m[32m            const rawCategory = String([m
[32m+[m[32m              item.categorySlug ?? item.category?.slug ?? item.categoryId ??[m
[32m+[m[32m              item.category ?? "sobji"[m
[32m+[m[32m            ).toLowerCase();[m
[32m+[m
[32m+[m[32m            const category = categoryData[rawCategory] ? rawCategory : "sobji";[m
[32m+[m[32m            const name = String(item.nameBn ?? item.name_bn ?? item.name ?? item.title ?? "পণ্য");[m
[32m+[m[32m            const slug = String(item.slug ?? item.id ?? `product-${index}`);[m
[32m+[m
[32m+[m[32m            return {[m
[32m+[m[32m              id: item.id ?? slug,[m
[32m+[m[32m              slug,[m
[32m+[m[32m              name,[m
[32m+[m[32m              category,[m
[32m+[m[32m              unit: String(item.unitBn ?? item.unitName ?? item.unit ?? "কেজি").replace(/^প্রতি\s*/, ""),[m
[32m+[m[32m              price: numberValue(item.todayPrice ?? item.currentPrice ?? item.price ?? item.averagePrice ?? 0),[m
[32m+[m[32m              change: numberValue(item.changePercent ?? item.priceChangePercent ?? item.change ?? item.percentageChange ?? 0),[m
[32m+[m[32m              emoji: String(item.emoji ?? item.icon ?? categoryData[category].emoji),[m
[32m+[m[32m            };[m
[32m+[m[32m          });[m
[32m+[m
[32m+[m[32m          let mappedCategories = Object.entries(categoryData).map(([slug, value]) => ({[m
[32m+[m[32m            slug, name: value.name, emoji: value.emoji,[m
[32m+[m[32m          }));[m
[32m+[m
[32m+[m[32m          if (categoryResponse.ok) {[m
[32m+[m[32m            const rawCategories = getProducts(await categoryResponse.json());[m
[32m+[m[32m            if (rawCategories.length) {[m
[32m+[m[32m              mappedCategories = rawCategories.map((c: any) => ({[m
[32m+[m[32m                slug: String(c.slug ?? c.id ?? ""),[m
[32m+[m[32m                name: String(c.nameBn ?? c.name_bn ?? c.name ?? "বিভাগ"),[m
[32m+[m[32m                emoji: String(c.emoji ?? c.icon ?? "🛒"),[m
[32m+[m[32m              }));[m
[32m+[m[32m            }[m
[32m+[m[32m          }[m
[32m+[m
[32m+[m[32m          if (!active) return;[m
[32m+[m[32m          setProducts(mapped);[m
[32m+[m[32m          setCategories(mappedCategories);[m
[32m+[m[32m          setLoading(false);[m
[32m+[m[32m          return;[m
[32m+[m[32m        } catch {[m
[32m+[m[32m          // Try the alternative API.[m
[32m+[m[32m        }[m
[32m+[m[32m      }[m
[32m+[m
[32m+[m[32m      if (active) {[m
[32m+[m[32m        setProducts(demoProducts);[m
[32m+[m[32m        setCategories(Object.entries(categoryData).map(([slug, value]) => ({[m
[32m+[m[32m          slug, name: value.name, emoji: value.emoji,[m
[32m+[m[32m        })));[m
[32m+[m[32m        setApiError(true);[m
[32m+[m[32m        setLoading(false);[m
[32m+[m[32m      }[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    void loadData();[m
[32m+[m[32m    return () => { active = false; };[m
[32m+[m[32m  }, []);[m
[32m+[m
[32m+[m[32m  const risers = [...products].filter(p => p.change > 0).sort((a, b) => b.change - a.change).slice(0, 6);[m
[32m+[m[32m  const fallers = [...products].filter(p => p.change < 0).sort((a, b) => a.change - b.change).slice(0, 6);[m
[32m+[m
   return ([m
[31m-    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">[m
[31m-      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">[m
[31m-        <Image[m
[31m-          className="dark:invert h-5 w-[100px]"[m
[31m-          src="/next.svg"[m
[31m-          alt="Next.js logo"[m
[31m-          width={100}[m
[31m-          height={20}[m
[31m-          priority[m
[31m-        />[m
[31m-        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">[m
[31m-          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">[m
[31m-            To get started, edit the{" "}[m
[31m-            <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">[m
[31m-              page.tsx[m
[31m-            </code>{" "}[m
[31m-            file.[m
[31m-          </h1>[m
[31m-          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">[m
[31m-            Looking for a starting point or more instructions? Head over to{" "}[m
[31m-            <a[m
[31m-              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"[m
[31m-              className="font-medium text-zinc-950 dark:text-zinc-50"[m
[31m-            >[m
[31m-              Templates[m
[31m-            </a>{" "}[m
[31m-            or the{" "}[m
[31m-            <a[m
[31m-              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"[m
[31m-              className="font-medium text-zinc-950 dark:text-zinc-50"[m
[31m-            >[m
[31m-              Learning[m
[31m-            </a>{" "}[m
[31m-            center.[m
[31m-          </p>[m
[32m+[m[32m    <div className="min-h-screen bg-[#f0f5f0] text-[#26352a]">[m
[32m+[m[32m      <header className="border-b border-[#e1eae2] bg-white">[m
[32m+[m[32m        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">[m
[32m+[m[32m          <Link href="/" className="flex items-center gap-3">[m
[32m+[m[32m            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#078542] text-2xl text-white">🛒</span>[m
[32m+[m[32m            <span>[m
[32m+[m[32m              <span className="block text-xl font-extrabold">বাজার দর</span>[m
[32m+[m[32m              <span className="block text-[11px] text-gray-500">{date || "বাংলাদেশের বাজারদর"}</span>[m
[32m+[m[32m            </span>[m
[32m+[m[32m          </Link>[m
[32m+[m[32m          <div className="flex items-center gap-2">[m
[32m+[m[32m            <Link href="/signin" className="rounded-lg px-3 py-2 text-sm font-bold hover:bg-gray-100">সাইন ইন</Link>[m
[32m+[m[32m            <Link href="/signup" className="rounded-lg bg-[#078542] px-3 py-2 text-sm font-bold text-white hover:bg-[#066e37]">সাইন আপ</Link>[m
[32m+[m[32m          </div>[m
         </div>[m
[31m-        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">[m
[31m-          <a[m
[31m-            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] da