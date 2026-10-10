export default function Footer() {
return (
<footer
  className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e2ebe4] bg-[#fbfdfb] shadow-[0_-2px_8px_rgba(0,0,0,0.03)]">
  <div
    className="mx-auto flex min-h-12 max-w-6xl flex-col items-start justify-between gap-1 px-4 py-3 text-xs text-[#26352a] sm:flex-row sm:items-center sm:gap-4 sm:px-6">
    <p className="shrink-0">
      বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে
    </p>
    <p className="text-gray-600 sm:text-right">
      সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
    </p>
  </div>
</footer>
);
}
