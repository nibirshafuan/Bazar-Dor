"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

export default function Hero() {
  const [date, setDate] = useState("");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setDate(
      new Intl.DateTimeFormat("bn-BD", {
        dateStyle: "full",
        timeZone: "Asia/Dhaka",
      }).format(new Date())
    );
  }, []);

  const handleScroll = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const target =
      document.getElementById("all-products") ??
      document.getElementById("সব-পণ্য") ??
      sectionRef.current?.nextElementSibling;

    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section ref={sectionRef} className="bg-[#f0f5f0] px-4 py-4 sm:px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-2 rounded-2xl border border-[#e2ebe4] bg-[#fbfdfb] px-4 py-4 sm:px-6 md:min-h-[258px] md:grid-cols-[1.5fr_0.5fr] md:px-7 md:py-4">
        <div>
          <p
            className={`flex w-fit rounded-full bg-[#e5f4e9] px-3 py-1 text-xs font-semibold text-[#078542] ${
              date ? "" : "invisible"
            }`}
          >
            {date || "শুক্রবার, ৯ অক্টোবর, ২০২৬"}
          </p>

          <h1 className="mt-3 text-2xl font-bold leading-tight text-[#26352a] sm:text-[30px]">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-3 max-w-xl text-xs leading-5 text-gray-500 sm:text-sm sm:leading-5">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <a
            href="#all-products"
            onClick={handleScroll}
            className="mt-4 inline-flex items-center rounded-md bg-[#078542] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#066e37]"
          >
            সব পণ্য দেখুন
          </a>
        </div>

        <div className="flex items-center justify-center md:justify-end md:pr-5">
          <svg
            viewBox="0 0 250 230"
            role="img"
            aria-label="সবজির ঝুড়ি"
            className="h-44 w-full max-w-[205px] sm:h-48 md:h-[190px] md:max-w-[215px]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="125" cy="209" rx="119" ry="8" fill="#e4eae5" />

            <path d="M154 28 C186 28 196 60 190 88 C184 112 164 118 154 116 C138 118 118 110 114 86 C110 58 126 28 154 28Z" fill="#20bb63" />
            <ellipse cx="133" cy="72" rx="8" ry="18" fill="#7ee3a1" opacity="0.65" transform="rotate(8 133 72)" />
            <path d="M138 31 Q154 22 170 31 Q154 38 138 31Z" fill="#078542" />
            <path d="M153 28 C150 18 152 10 161 6" fill="none" stroke="#078542" strokeWidth="4" strokeLinecap="round" />

            <ellipse cx="81" cy="82" rx="34" ry="37" fill="#ef4452" />
            <ellipse cx="66" cy="78" rx="8" ry="15" fill="#ff8f8f" transform="rotate(15 66 78)" />
            <path d="M68 46 Q81 33 94 46 Q81 42 68 46Z" fill="#078542" />
            <path d="M81 40 C78 28 84 20 94 19" fill="none" stroke="#078542" strokeWidth="4" strokeLinecap="round" />

            <ellipse cx="53" cy="108" rx="22" ry="18" fill="#a24be8" />
            <ellipse cx="45" cy="104" rx="5" ry="7" fill="#c98cf5" opacity="0.7" />

            <ellipse cx="121" cy="99" rx="23" ry="19" fill="#ff7a1a" />

            <ellipse cx="196" cy="103" rx="25" ry="22" fill="#f7a712" />
            <path d="M200 83 C198 70 206 64 214 64" fill="none" stroke="#078542" strokeWidth="3" strokeLinecap="round" />

            <path d="M32 123 L218 123 L205 196 Q203 202 196 202 L58 202 Q51 202 49 196 Z" fill="#b45f1c" />
            <rect x="28" y="120" width="194" height="14" rx="3" fill="#8d4716" />
            <path d="M66 140 L70 192 M96 140 L98 194 M125 140 L125 195 M154 140 L152 194 M184 140 L180 192" stroke="#8a4416" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
