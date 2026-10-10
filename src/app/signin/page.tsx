"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LoginPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
  const { data, error } = await authClient.signIn.email(
  {
  email: email.trim(),
  password,
  callbackURL: "/",
  rememberMe: true,
  },
  {
  onError: (ctx) => {
  setError(ctx.error.message);
  },
  }
  );

  if (error) {
  const message = error.message || "সাইন ইন করা যায়নি। আবার চেষ্টা করুন।";
  setError(message);
  toast.error(message);
  return;
  }

  if (data) {
  toast.success("সফলভাবে সাইন ইন হয়েছে");
  window.setTimeout(() => {
  window.location.href = "/";
  }, 700);
  }
  } catch {
  const message = "সাইন ইন করা যায়নি। আবার চেষ্টা করুন।";
  setError(message);
  toast.error(message);
  } finally {
  setLoading(false);
  }
  }

  return (
  <main className="min-h-screen bg-[#f0f5f0]">
    <Navbar />

    <section className="flex justify-center px-4 pb-24 pt-5 sm:px-6 sm:pt-7">
      <div className="w-full max-w-sm">
        <div className="mb-3 text-center">
          <h1 className="text-base font-extrabold text-[#26352a]">
            সাইন ইন
          </h1>
          <p className="mt-1 text-[11px] text-gray-500">
            ফিরে আসুন, বাজার দর ও প্রয়োজনীয় পণ্যের আপডেট দেখুন।
          </p>
        </div>

        <div className="rounded-xl border border-[#e2ebe4] bg-[#fbfdfb] p-4 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-2">
            <div>
              <label htmlFor="signin-email" className="mb-1 block text-[10px] font-semibold text-[#26352a]">
                ইমেইল
              </label>
              <input id="signin-email" type="email" autoComplete="email" value={email} onChange={(e)=>
              setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-md border border-[#e2ebe4] bg-white px-2.5 py-2 text-[11px] text-[#26352a]
              outline-none transition placeholder:text-gray-400 focus:border-[#078542] focus:ring-2
              focus:ring-[#078542]/10"
              />
            </div>

            <div>
              <label htmlFor="signin-password" className="mb-1 block text-[10px] font-semibold text-[#26352a]">
                পাসওয়ার্ড
              </label>
              <input id="signin-password" type="password" autoComplete="current-password" value={password}
                onChange={(e)=> setPassword(e.target.value)}
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              required
              className="w-full rounded-md border border-[#e2ebe4] bg-white px-2.5 py-2 text-[11px] text-[#26352a]
              outline-none transition placeholder:text-gray-400 focus:border-[#078542] focus:ring-2
              focus:ring-[#078542]/10"
              />
            </div>

            {error && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full rounded-md bg-[#078542] px-3 py-2.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#066e37] disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
            </button>
          </form>

          <div className="my-3 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#e2ebe4]" />
            <span className="text-[10px] text-gray-500">অথবা</span>
            <div className="h-px flex-1 bg-[#e2ebe4]" />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button type="button" onClick={()=>
              toast.info("Google sign-in শেষ authentication ধাপে চালু করা হবে।")
              }
              className="flex items-center justify-center gap-2 rounded-md border border-[#e2ebe4] bg-white px-2 py-2
              text-[10px] font-semibold text-[#26352a] transition hover:bg-[#f0f5f0]"
              >
              <span className="font-extrabold text-blue-600">G</span>
              Google দিয়ে সাইন ইন
            </button>

            <button type="button" onClick={()=>
              toast.info("GitHub sign-in শেষ authentication ধাপে চালু করা হবে।")
              }
              className="flex items-center justify-center gap-2 rounded-md border border-[#e2ebe4] bg-white px-2 py-2
              text-[10px] font-semibold text-[#26352a] transition hover:bg-[#f0f5f0]"
              >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-current">
                <path
                  d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.23.93.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.51 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.06 1.14a10.63 10.63 0 0 1 5.57 0c2.12-1.44 3.06-1.14 3.06-1.14.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.28-2.62 5.22-5.11 5.5.4.35.75 1.02.75 2.06v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
              </svg>
              GitHub দিয়ে সাইন ইন
            </button>
          </div>

          <p className="mt-3 text-center text-[11px] text-gray-500">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/signup" className="font-bold text-[#078542] hover:underline">
            সাইন আপ করুন
            </Link>
          </p>
        </div>

        <p className="mt-3 text-center text-[11px] text-gray-400">
          <Link href="/" className="hover:text-[#078542]">
          ← বাজার দর-এ ফিরে যান
          </Link>
        </p>
      </div>
    </section>
  </main>
  );
  }
