import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#f4f8f4] px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-[#e1eae2] bg-white px-6 py-12 text-center shadow-sm sm:px-10">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#e5f4e9] text-5xl">
          🔍
        </div>

        <p className="mt-7 text-sm font-extrabold uppercase tracking-[0.2em] text-[#078542]">
          Error 404
        </p>

        <h1 className="mt-3 text-3xl font-extrabold text-[#26352a] sm:text-4xl">
          পেজটি খুঁজে পাওয়া যায়নি!
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-gray-600 sm:text-base">
          দুঃখিত! আপনি যে পেজটি খুঁজছেন সেটি নেই অথবা ঠিকানাটি ভুল হয়েছে।
          বাজারদর দেখতে হোম পেজে ফিরে যান।
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#078542] px-6 py-3 font-bold text-white transition hover:bg-[#066e37] focus:outline-none focus:ring-2 focus:ring-[#078542] focus:ring-offset-2"
        >
          <span>🏠</span>
          <span>হোম পেজে ফিরে যান</span>
        </Link>

        <div className="mt-8 border-t border-gray-100 pt-5">
          <Link
            href="/"
            className="text-sm font-semibold text-gray-500 transition hover:text-[#078542]"
          >
            🛒 বাজার দর
          </Link>
        </div>
      </div>
    </main>
  );
}
