"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070707] px-6 text-white">
      <div className="w-full max-w-md border border-[#c8a15b]/20 bg-[#0d0d0d] p-8 shadow-[0_0_60px_rgba(200,161,91,0.08)]">
        <div className="mb-8 text-center">
          <p className="text-xs tracking-[0.4em] text-[#c8a15b]">
            SOULS GATE
          </p>

          <h1 className="mt-4 text-3xl font-black">
            ADMIN LOGIN
          </h1>

          <p className="mt-3 text-sm text-white/40">
            ورود به پنل مدیریت
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="ایمیل مدیر"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#c8a15b]"
          />

          <input
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#c8a15b]"
          />

          {errorMessage && (
            <p className="text-center text-sm text-red-400">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#c8a15b] px-6 py-3 font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "در حال ورود..." : "ورود به پنل"}
          </button>
        </form>
      </div>
    </main>
  );
}