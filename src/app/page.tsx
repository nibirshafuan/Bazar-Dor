import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f0f5f0]">
      <Navbar />
      <Hero />

      <section
        id="সব-পণ্য"
        className="mx-auto max-w-6xl scroll-mt-40 px-4 py-8 sm:px-6"
      >
        <h2 className="text-xl font-extrabold text-[#26352a]">
          সব পণ্য
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          পরবর্তী ধাপে এখানে API থেকে পণ্যের তালিকা দেখানো হবে।
        </p>
      </section>
    </main>
  );
}
