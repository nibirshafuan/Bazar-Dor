import ProductCard, { type Product } from "@/components/ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
return (
<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {products.map((product) => (
  <ProductCard key={`${product.id}-${product.slug}`} product={product} />
  ))}
</div>
);
}

export default function ProductSection({
title,
products,
tone,
}: {
title: string;
products: Product[];
tone?: "up" | "down";
}) {
return (
<section className="mb-8">
  <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-[#26352a]">
    {tone === "up" && (
    <span className="text-sm text-red-500">▲</span>
    )}

    {tone === "down" && (
    <span className="text-sm text-[#078542]">▼</span>
    )}

    {title}
  </h2>

  {products.length > 0 ? (
  <ProductGrid products={products} />
  ) : (
  <p className="rounded-xl border border-[#e2ebe4] bg-white p-4 text-sm text-gray-500">
    এই মুহূর্তে দেখানোর মতো পণ্যের তথ্য পাওয়া যায়নি।
  </p>
  )}
</section>
);
}
