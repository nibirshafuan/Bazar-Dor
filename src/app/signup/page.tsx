
"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email(
        {
          name: name.trim(),
          email: email.trim(),
          password,
          callbackURL: "/",
        },
        {
          onError: (ctx) => {
            setError(ctx.error.message);
          },
        }
      );

      if (error) {
        setError(error.message ?? "Sign up failed. Please try again.");
        return;
      }

      if (data) {
        window.location.href = "/";
      }
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
        <Link href="/" className="font-semibold text-emerald-400">
          â† BazarDor
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Create an Account</h1>
        <p className="mt-2 text-sm text-gray-400">
          Join BazarDor today.
        </p>

        <form onSubmit={handleSignup} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 outline-none focus:border-emerald-500"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-950 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-gray-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}

