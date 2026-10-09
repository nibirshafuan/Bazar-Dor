"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin?callbackURL=%2Fprofile");
    }
  }, [isPending, session, router]);

  async function handleSignOut() {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি।");
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে।");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  if (isPending || !session?.user) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-3xl animate-pulse px-4 py-16">
          <div className="mb-6 h-8 w-48 rounded bg-gray-200" />
          <div className="h-56 rounded-2xl bg-gray-200" />
        </div>
      </main>
    );
  }

  const user = session.user;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          আমার প্রোফাইল
        </h1>
        <p className="mb-8 text-gray-600">
          আপনার অ্যাকাউন্টের তথ্য দেখুন ও আপডেট করুন।
        </p>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-700">
              {(user.name || user.email || "U").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <h2 className="break-words text-xl font-semibold text-gray-900">
                {user.name || "নাম দেওয়া হয়নি"}
              </h2>
              <p className="break-all text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-5">
            <div>
              <p className="text-sm text-gray-500">নাম</p>
              <p className="mt-1 font-medium text-gray-900">
                {user.name || "নাম দেওয়া হয়নি"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">ইমেইল</p>
              <p className="mt-1 break-all font-medium text-gray-900">
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/profile/update"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Update Information
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="min-h-11 rounded-lg border border-red-200 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
