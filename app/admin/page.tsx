"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Game = {
  id: number;
  slug: string;
  title: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminAndLoadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("games")
        .select("id, slug, title")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error loading games:", error);
      } else {
        setGames(data || []);
      }

      setLoading(false);
      setCheckingAuth(false);
    }

    checkAdminAndLoadData();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070707] text-white">
        <p className="text-xs tracking-[0.4em] text-[#c8a15b]">
          CHECKING THE GATE...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs tracking-[0.4em] text-[#c8a15b]">
              SOULS GATE
            </p>

            <h1 className="mt-3 text-4xl font-black md:text-5xl">
              ADMIN PANEL
            </h1>

            <p className="mt-3 text-sm text-white/40">
              مدیریت کامل دنیای Souls Gate
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="border border-white/10 px-5 py-3 text-xs tracking-[0.15em] text-white/60 transition hover:border-[#c8a15b] hover:text-[#c8a15b]"
            >
              VIEW WEBSITE
            </Link>

            <button
              onClick={logout}
              className="border border-red-500/30 px-5 py-3 text-xs tracking-[0.15em] text-red-400 transition hover:bg-red-500 hover:text-white"
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* DASHBOARD CARDS */}
        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/games"
            className="group border border-[#c8a15b]/30 bg-[#0d0d0d] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#c8a15b]"
          >
            <p className="text-xs tracking-[0.3em] text-[#c8a15b]">
              01 / WORLDS
            </p>

            <h2 className="mt-8 text-3xl font-black">GAMES</h2>

            <p className="mt-3 text-sm leading-7 text-white/40">
              افزودن، ویرایش و حذف بازی‌ها
            </p>

            <div className="mt-8 flex items-end justify-between">
              <span className="text-xs tracking-[0.2em] text-[#c8a15b]">
                MANAGE →
              </span>

              {loading ? (
                <span className="text-3xl font-black text-white/20">...</span>
              ) : (
                <span className="text-4xl font-black text-white/20">
                  {games.length}
                </span>
              )}
            </div>
          </Link>

          <Link
            href="/admin/lore"
            className="group border border-white/10 bg-[#0d0d0d] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#c8a15b]/60"
          >
            <p className="text-xs tracking-[0.3em] text-[#c8a15b]">
              02 / HISTORY
            </p>

            <h2 className="mt-8 text-3xl font-black">LORE</h2>

            <p className="mt-3 text-sm leading-7 text-white/40">
              مدیریت داستان، تاریخ و اسرار هر دنیا
            </p>

            <span className="mt-8 block text-xs tracking-[0.2em] text-[#c8a15b]">
              MANAGE →
            </span>
          </Link>

          <Link
  href="/admin/characters"
  className="block border border-white/10 bg-[#0d0d0d] p-6 transition hover:border-[#c8a15b]/50 hover:bg-[#111]"
>
  <p className="text-xs tracking-[0.3em] text-[#c8a15b]">
    CHARACTERS
  </p>

  <h2 className="mt-3 text-2xl font-black">
    شخصیت‌ها
  </h2>

  <p className="mt-3 text-sm leading-7 text-white/40">
    مدیریت شخصیت‌های دنیای بازی‌ها
  </p>
</Link>

          <Link
  href="/admin/bosses"
  className="block border border-white/10 bg-[#0d0d0d] p-6 transition hover:border-[#c8a15b]/50 hover:bg-[#111]"
>
  <p className="text-xs tracking-[0.3em] text-[#c8a15b]">
    BOSSES
  </p>

  <h2 className="mt-3 text-2xl font-black">
    Bossها
  </h2>

  <p className="mt-3 text-sm leading-7 text-white/40">
    مدیریت باس‌های بازی‌ها
  </p>
</Link>


          <Link
            href="/admin/guides"
            className="group border border-white/10 bg-[#0d0d0d] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#c8a15b]/60"
          >
            <p className="text-xs tracking-[0.3em] text-[#c8a15b]">
              05 / KNOWLEDGE
            </p>

            <h2 className="mt-8 text-3xl font-black">GUIDES</h2>

            <p className="mt-3 text-sm leading-7 text-white/40">
              ساخت و مدیریت راهنماهای کامل بازی‌ها
            </p>

            <span className="mt-8 block text-xs tracking-[0.2em] text-[#c8a15b]">
              MANAGE →
            </span>
          </Link>
        </section>

        {/* GAMES PREVIEW */}
        <section className="mt-12 border border-white/10 bg-[#0d0d0d]">
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <div>
              <p className="text-xs tracking-[0.3em] text-[#c8a15b]">
                CURRENT WORLDS
              </p>

              <h2 className="mt-2 text-2xl font-black">
                بازی‌های موجود
              </h2>
            </div>

            <Link
              href="/admin/games"
              className="text-xs tracking-[0.15em] text-[#c8a15b] transition hover:text-white"
            >
              MANAGE GAMES →
            </Link>
          </div>

          {loading ? (
            <p className="p-6 text-sm text-white/40">
              در حال بارگذاری...
            </p>
          ) : games.length === 0 ? (
            <p className="p-6 text-sm text-white/40">
              هنوز هیچ بازی‌ای وجود ندارد.
            </p>
          ) : (
            <div className="divide-y divide-white/5">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between px-6 py-4 transition hover:bg-white/[0.02]"
                >
                  <div>
                    <p className="font-bold">{game.title}</p>

                    <p className="mt-1 text-xs text-white/30">
                      /games/{game.slug}
                    </p>
                  </div>

                  <Link
                    href={`/games/${game.slug}`}
                    className="text-xs text-[#c8a15b] transition hover:text-white"
                  >
                    VIEW →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}