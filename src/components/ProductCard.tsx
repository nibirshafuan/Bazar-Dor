import Link from "next/link";
import { formatBengaliNumber } from "@/lib/formatters";

export type Product = {
  id: string | number;
  slug: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  change: number;
  emoji: string;
};

export function ChangeBadge({ change }: { change: number }) {
  if (change > 0) {
    return (
      <span className="inline-flex shrink-0 items-center rounded-full bg-[#e9f7ed] px-2 py-1 text-[11px] font-bold text-[#078542]">
        ▲ {formatBengaliNumber(change)}%
      </span>
    );
  }

  if (change < 0) {
    return (
      <span className="inline-flex shrink-0 items-center rounded-full bg-[#fff0ef] px-2 py-1 text-[11px] font-bold text-[#dc4545]">
        ▼ {formatBengaliNumber(Math.abs(change))}%
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-[#f0f3f0] px-2 py-1 text-[11px] font-bold text-gray-500">
      — ০%
    </span>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug)}`}
      aria-label={`${product.name}, দাম ${formatBengaliNumber(product.price)} টাকা`}
      className="block rounded-xl border border-[#e2ebe4] bg-[#fbfdfb] p-3 transition hover:-translate-y-0.5 hover:border-[#b8d8c0] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 sm:p-4"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eff5ef] text-2xl"
        >
          {product.emoji}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-[#26352a]">
            {product.name}
          </h3>
          <p className="mt-1 text-[11px] text-gray-500">
            প্রতি {product.unit}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] text-gray-500">আজকের দাম</p>
          <p className="mt-1 text-sm font-extrabold text-[#26352a]">
            {formatBengaliNumber(product.price)} টাকা
          </p>
        </div>

        <ChangeBadge change={product.change} />
      </div>
    </Link>
  );
}
