"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Game = {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
};

const gameImages: Record<string, string> = {
  sekiro: "/images/sekiro.png",
  "dark-souls-1": "/images/darksouls1.png",
  "dark-souls-2": "/images/darksouls2.png",
  "dark-souls-3": "/images/darksouls3.png",
  "elden-ring": "/images/eldenring.png",
  bloodborne: "/images/bloodborne.png",
  "demons-souls": "/images/demonsouls.png",
  "lies-of-p": "/images/liesofp.png",
  "elden-ring-nightreign": "/images/eldenringnightreign.png",
};

export default function Home() {
  const [gateOpen, setGateOpen] = useState(false);

  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);

  useEffect(() => {
    async function getGames() {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Supabase Error:", error.message);
        console.error("Supabase Code:", error.code);
        console.error("Supabase Details:", error.details);
        console.error("Supabase Hint:", error.hint);
      } else {
        console.log("Games loaded:", data);
        setGames(data || []);
      }

      setLoadingGames(false);
    }

    getGames();
  }, []);

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      {/* Hero */}
      <section
        id="home"
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 pt-20"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero.png')",
          }}
        />

        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#070707] via-black/30 to-transparent" />

        <div className="relative z-10 mx-auto max-w-5xl pt-72 text-center">
          <p className="mb-8 animate-pulse text-xs tracking-[0.5em] text-[#c8a15b]">
            WELCOME TO THE GATE
          </p>

          <div className="h-28 md:h-40" />

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-white/65 md:text-base">
            مقصد عاشقان دنیای تاریک، چالش‌برانگیز و فراموش‌نشدنی بازی‌های
            Soulslike.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#games"
              className="bg-[#c8a15b] px-8 py-4 text-sm font-bold text-black transition duration-300 hover:scale-105"
            >
              ورود به دنیای Souls
            </a>

            <a
              href="#stream"
              className="border border-white/30 bg-black/20 px-8 py-4 text-sm text-white backdrop-blur-sm transition duration-300 hover:border-[#c8a15b] hover:text-[#c8a15b]"
            >
              مشاهده استریم
            </a>
          </div>
        </div>
      </section>

      {/* Games */}
<section
  id="games"
  className="border-t border-white/5 bg-[#090909] px-4 py-20 sm:px-6 md:py-28"
>
  <div className="mx-auto max-w-7xl">
    {/* عنوان */}
    <div className="mb-12 text-right md:mb-16">
      <p className="text-xs tracking-[0.25em] text-[#c8a15b] sm:tracking-[0.4em]">
        دنیای خود را انتخاب کنید
      </p>

      <h2 className="mt-4 text-3xl font-black sm:text-4xl md:text-6xl">
        Souls Gate Games
      </h2>

      <p className="mt-5 max-w-xl text-sm leading-8 text-white/40">
        جهان‌هایی که در آن شکست پایان نیست؛ بلکه بخشی از مسیر است.
      </p>
    </div>

    {loadingGames ? (
      <div className="py-20 text-center text-sm tracking-[0.3em] text-[#c8a15b]/60">
        LOADING WORLDS...
      </div>
    ) : (
      <div
        className="
          relative mx-auto
          h-[500px] w-full max-w-[430px]
          sm:h-[650px] sm:max-w-[650px]
          md:h-[1050px] md:max-w-[1200px]
        "
      >
        {/* نور پشت Gate */}
        <div
          className={`
            absolute left-1/2 top-1/2
            h-[240px] w-[240px]
            sm:h-[350px] sm:w-[350px]
            md:h-[550px] md:w-[550px]
            -translate-x-1/2 -translate-y-1/2
            rounded-full bg-[#c8a15b]/5 blur-[60px]
            md:blur-[100px]
            transition-all duration-1000
            ${gateOpen ? "scale-125 opacity-100" : "scale-75 opacity-40"}
          `}
        />

        {/* حلقه داخلی */}
        <div
          className={`
            absolute left-1/2 top-1/2
            h-[280px] w-[280px]
            sm:h-[400px] sm:w-[400px]
            md:h-[600px] md:w-[600px]
            -translate-x-1/2 -translate-y-1/2
            rounded-full border border-[#c8a15b]/10
            transition-all duration-1000
            ${gateOpen ? "scale-110" : "scale-100"}
          `}
        />

        {/* حلقه خارجی */}
        <div
          className={`
            absolute left-1/2 top-1/2
            h-[400px] w-[400px]
            sm:h-[560px] sm:w-[560px]
            md:h-[850px] md:w-[850px]
            -translate-x-1/2 -translate-y-1/2
            rounded-full border border-white/5
            transition-all duration-1000
            ${gateOpen ? "scale-105" : "scale-100"}
          `}
        />

        {/* بازی‌ها */}
        {games.map((game, index) => {
          const image = gameImages[game.slug] || game.image_url;
          if (!image) return null;

          /*
           * موقعیت اصلی دسکتاپ
           */
          const positions = [
            { x: 0, y: -420 },
            { x: 270, y: -320 },
            { x: 410, y: -70 },
            { x: 355, y: 220 },
            { x: 145, y: 395 },
            { x: -145, y: 395 },
            { x: -355, y: 220 },
            { x: -410, y: -70 },
            { x: -270, y: -320 },
          ];

          const position = positions[index] || { x: 0, y: 0 };

          return (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="
                absolute left-1/2 top-1/2 z-20
                h-[78px] w-[78px]
                sm:h-[120px] sm:w-[120px]
                md:h-[180px] md:w-[180px]
              "
              style={{
                transform: gateOpen
                  ? `translate(calc(-50% + ${position.x * 0.42}px), calc(-50% + ${position.y * 0.42}px))`
                  : "translate(-50%, -50%)",

                opacity: gateOpen ? 1 : 0,

                pointerEvents: gateOpen ? "auto" : "none",

                transition:
                  "transform 800ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease",

                transitionDelay: gateOpen
                  ? `${index * 70}ms`
                  : "0ms",
              }}
            >
              <div className="group relative h-full w-full overflow-hidden rounded-full border border-white/20 bg-black shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all duration-500 hover:scale-110 hover:border-[#c8a15b] hover:shadow-[0_0_50px_rgba(200,161,91,0.35)]">
                <img
                  src={image}
                  alt={game.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/25 transition-all duration-500 group-hover:bg-black/5" />

                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2 text-center sm:p-3 md:p-5">
                  <span className="text-[7px] font-bold leading-tight tracking-wide text-white transition-colors duration-300 group-hover:text-[#c8a15b] sm:text-[9px] md:text-[11px]">
                    {game.title}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}

        {/* SOULS GATE */}
        <button
          type="button"
          onClick={() => setGateOpen((current) => !current)}
          className={`
            absolute left-1/2 top-1/2 z-30
            flex
            h-[165px] w-[165px]
            sm:h-[240px] sm:w-[240px]
            md:h-[380px] md:w-[380px]
            -translate-x-1/2 -translate-y-1/2
            flex-col items-center justify-center
            rounded-full border-2 border-[#c8a15b]
            bg-[#090909] text-center
            cursor-pointer transition-all duration-700
            hover:scale-105 active:scale-95
            ${
              gateOpen
                ? "shadow-[0_0_100px_rgba(200,161,91,0.4)]"
                : "shadow-[0_0_60px_rgba(200,161,91,0.15)]"
            }
          `}
        >
          <p className="text-[7px] tracking-[0.25em] text-[#c8a15b] sm:text-[10px] sm:tracking-[0.4em] md:text-xs md:tracking-[0.5em]">
            ENTER THE
          </p>

          <h3 className="mt-2 text-xl font-black text-white sm:text-3xl md:mt-4 md:text-5xl">
            SOULS
          </h3>

          <h3 className="text-xl font-black text-[#c8a15b] sm:text-3xl md:text-5xl">
            GATE
          </h3>

          <div className="mt-2 text-[7px] font-bold text-red-500 sm:text-[10px] md:mt-4 md:text-base">
            {gateOpen ? "GATE IS OPEN" : "GATE IS CLOSED"}
          </div>

          <div className="mt-3 h-px w-12 bg-[#c8a15b]/50 sm:w-16 md:mt-6 md:w-24" />

          <p className="mt-3 text-[6px] tracking-[0.15em] text-white/40 sm:text-[8px] sm:tracking-[0.25em] md:mt-6 md:text-[10px] md:tracking-[0.3em]">
            {gateOpen ? "CHOOSE YOUR WORLD" : "ENTER THE GATE"}
          </p>
        </button>
      </div>
    )}
  </div>
</section>
      <section
        id="about"
        className="relative overflow-hidden border-t border-white/5 px-6 py-32"
      >
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-xs tracking-[0.4em] text-[#c8a15b]">
            ABOUT THE GATE
          </p>

          <h2 className="mt-5 text-4xl font-black md:text-6xl">
            اینجا جایی برای تسلیم شدن نیست
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-9 text-white/40">
            Souls Gate برای کسانی ساخته شده که از دنیای تاریک، باس‌های سخت،
            داستان‌های عمیق و کشف رازهای پنهان بازی‌های Soulslike لذت می‌برند.
          </p>

          <div className="mx-auto mt-12 h-px w-24 bg-[#c8a15b]" />

          <p className="mt-8 text-lg text-[#c8a15b]">
            «هر شکست، بخشی از داستان توست.»
          </p>
        </div>
      </section>

      {/* Stream */}
      <section
        id="stream"
        className="border-y border-white/5 bg-[#090909] px-6 py-28"
      >
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden border border-[#c8a15b]/20 bg-[#0d0d0d] p-8 md:p-16">
            <div className="relative">
              <div className="flex items-center gap-3 text-xs tracking-[0.3em] text-red-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                LIVE STREAM
              </div>

              <h2 className="mt-6 text-4xl font-black md:text-6xl">
                آماده‌ای وارد گیت بشی؟
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-8 text-white/40">
                گیم‌پلی، چالش‌ها، باس‌فایت‌ها و ماجراجویی در تاریک‌ترین دنیاهای
                بازی.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#"
                  className="bg-[#c8a15b] px-7 py-3 text-sm font-bold text-black transition hover:scale-105"
                >
                  کانال استریم
                </a>

                <a
                  href="#"
                  className="border border-white/10 px-7 py-3 text-sm text-white/60 transition hover:border-[#c8a15b] hover:text-[#c8a15b]"
                >
                  Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row">
          <div>
            <div className="font-black tracking-[0.25em]">
              SOULS <span className="text-[#c8a15b]">GATE</span>
            </div>

            <p className="mt-2 text-xs text-white/25">
              ENTER THE DARKNESS
            </p>
          </div>

          <p className="text-xs text-white/25">
            © 2026 Souls Gate — All Rights Reserved
          </p>
        </div>
      </footer>
    </main>
  );
}