"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
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

// موقعیت بازی‌ها روی دایره (مختصات داخل صحنه‌ی ۱۱۰۰×۱۱۰۰)
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

const STAGE = 1100;
const NODE = 180;
const RUNES = "ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᛟ ";

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`sg-reveal ${shown ? "sg-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

function Letters({ text, className, start }: { text: string; className: string; start: number }) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={`sg-letter ${className}`}
          style={{ animationDelay: `${start + i * 90}ms` }}
        >
          {char}
        </span>
      ))}
    </>
  );
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [gateOpen, setGateOpen] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [stageScale, setStageScale] = useState<number | null>(null);

  const gateRef = useRef<HTMLElement>(null);
  const autoOpened = useRef(false);

  useEffect(() => {
    function updateScale() {
      setStageScale(Math.min(1, (window.innerWidth - 24) / STAGE));
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    async function getGames() {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
console.error("Supabase Error:", error);        setLoadError("دریافت لیست بازی‌ها ممکن نشد. صفحه را دوباره بارگذاری کنید.");
      } else {
        setGames(data || []);
      }
      setLoadingGames(false);
    }
    getGames();
  }, []);

  // اولین بار که گیت به صفحه می‌رسد، خودش باز می‌شود
  useEffect(() => {
    const el = gateRef.current;
    if (!el || loadingGames || stageScale === null) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !autoOpened.current) {
          autoOpened.current = true;
          setGateOpen(true);
          setPulse((p) => p + 1);
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadingGames, stageScale]);

  function toggleGate() {
    autoOpened.current = true;
    setGateOpen((open) => !open);
    setPulse((p) => p + 1);
  }

  function onMove(event: React.MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--mx", x.toFixed(3));
    event.currentTarget.style.setProperty("--my", y.toFixed(3));
  }

  const visibleGames = games
    .filter((game) => gameImages[game.slug] || game.image_url)
    .slice(0, positions.length);

  return (
    <main className="sg min-h-screen bg-[#060606] text-white">
      <style>{css}</style>

      {/* ───────── Hero ───────── */}
      <section
        id="home"
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-32 text-center"
      >
        <div
          className="sg-zoom absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="sg-fog sg-fog-a" />
        <div className="sg-fog sg-fog-b" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#060606] to-transparent" />

        {Array.from({ length: 34 }).map((_, i) => (
          <span
            key={i}
            className="sg-ember"
            style={{
              left: `${(i * 29) % 100}%`,
              width: 2 + (i % 4),
              height: 2 + (i % 4),
              animationDuration: `${7 + (i % 6) * 2}s`,
              animationDelay: `${(i * 0.9) % 9}s`,
              ["--dx" as string]: `${((i % 7) - 3) * 24}px`,
            }}
          />
        ))}

        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="sg-fade text-sm text-[#c8a15b]" style={{ animationDelay: "200ms" }}>
            به دروازه خوش آمدید
          </p>

          <h1 dir="ltr" className="sg-title mt-6 text-6xl font-black leading-none sm:text-8xl md:text-[9.5rem]">
            <span className="sr-only">Souls Gate</span>
            <span aria-hidden className="block">
              <Letters text="SOULS" className="sg-white" start={500} />
            </span>
            <span aria-hidden className="block">
              <Letters text="GATE" className="sg-gold" start={1000} />
            </span>
          </h1>

          <div className="sg-line mx-auto mt-8 h-px w-40 bg-gradient-to-r from-transparent via-[#c8a15b] to-transparent" />

          <p
            className="sg-fade mx-auto mt-8 max-w-xl text-sm leading-8 text-white/70 md:text-base"
            style={{ animationDelay: "1900ms" }}
          >
            مقصد عاشقان دنیای تاریک، چالش‌برانگیز و فراموش‌نشدنی بازی‌های Soulslike.
          </p>

          <div
            className="sg-fade mt-10 flex flex-wrap justify-center gap-4"
            style={{ animationDelay: "2200ms" }}
          >
            <a href="#games" className="sg-btn bg-[#c8a15b] px-8 py-4 text-sm font-bold text-black">
              ورود به دنیای Souls
            </a>
            <a
              href="#stream"
              className="border border-white/30 bg-black/30 px-8 py-4 text-sm backdrop-blur-sm transition duration-300 hover:border-[#c8a15b] hover:text-[#c8a15b]"
            >
              مشاهده استریم
            </a>
          </div>
        </div>

        <a
          href="#games"
          aria-label="رفتن به بخش بازی‌ها"
          className="sg-bob absolute bottom-8 left-1/2 z-10 h-10 w-6 -translate-x-1/2 rounded-full border border-[#c8a15b]/60"
        >
          <span className="sg-wheel" />
        </a>
      </section>

      {/* ───────── Gate ───────── */}
      <section
        id="games"
        ref={gateRef}
        onMouseMove={onMove}
        className={`relative overflow-hidden border-t border-white/5 bg-[#080808] px-4 py-20 md:py-28 ${gateOpen ? "sg-open" : ""}`}
      >
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-6 text-right md:mb-10">
            <p className="text-xs tracking-[0.3em] text-[#c8a15b]">دنیای خود را انتخاب کنید</p>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl md:text-6xl">Souls Gate Games</h2>
            <p className="mt-5 max-w-xl text-sm leading-8 text-white/45">
              جهان‌هایی که در آن شکست پایان نیست؛ بلکه بخشی از مسیر است.
            </p>
          </Reveal>

          {loadingGames || stageScale === null ? (
            <div className="sg-blink py-32 text-center text-sm tracking-[0.3em] text-[#c8a15b]/70">
              LOADING WORLDS...
            </div>
          ) : loadError ? (
            <p role="alert" className="py-24 text-center text-sm text-red-300">
              {loadError}
            </p>
          ) : (
            <>
              <div
                className="relative mx-auto w-full"
                style={{ height: STAGE * stageScale }}
              >
                <div
                  className="absolute left-1/2 top-0"
                  style={{
                    width: STAGE,
                    height: STAGE,
                    transform: `translateX(-50%) scale(${stageScale})`,
                    transformOrigin: "top center",
                  }}
                >
                  {/* لایه‌ی حلقه‌ها (با حرکت ماوس کمی جابه‌جا می‌شود) */}
                  <div className="sg-parallax absolute inset-0">
                    <div className="sg-halo" />
                    <div className="sg-rays" />

                    <svg className="sg-ring sg-spin-rev" width="1000" height="1000" viewBox="0 0 400 400" aria-hidden>
                      {Array.from({ length: 96 }).map((_, i) => (
                        <line
                          key={i}
                          x1="200"
                          y1="4"
                          x2="200"
                          y2={i % 8 === 0 ? 16 : 10}
                          stroke="#c8a15b"
                          strokeOpacity={i % 8 === 0 ? 0.7 : 0.3}
                          strokeWidth={i % 8 === 0 ? 1.2 : 0.7}
                          transform={`rotate(${(i * 360) / 96} 200 200)`}
                        />
                      ))}
                    </svg>

                    <svg className="sg-ring sg-spin" width="840" height="840" viewBox="0 0 100 100" aria-hidden>
                      <circle cx="50" cy="50" r="49.5" fill="none" stroke="#c8a15b" strokeOpacity="0.35" strokeWidth="0.15" strokeDasharray="0.8 1.6" />
                    </svg>

                    <svg className="sg-ring sg-spin-rev" width="620" height="620" viewBox="0 0 200 200" aria-hidden>
                      <defs>
                        <path id="sg-rune-path" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
                      </defs>
                      <text fill="#c8a15b" fillOpacity="0.55" fontSize="9" letterSpacing="3.2">
                        <textPath href="#sg-rune-path">{RUNES.repeat(2)}</textPath>
                      </text>
                    </svg>

                    {/* خطوط اتصال: هنگام باز شدن کشیده می‌شوند */}
                    <svg className="absolute inset-0" width={STAGE} height={STAGE} viewBox={`0 0 ${STAGE} ${STAGE}`} aria-hidden>
                      {visibleGames.map((game, i) => (
                        <line
                          key={game.id}
                          x1={STAGE / 2}
                          y1={STAGE / 2}
                          x2={STAGE / 2 + positions[i].x}
                          y2={STAGE / 2 + positions[i].y}
                          pathLength={1}
                          stroke="#c8a15b"
                          strokeOpacity="0.35"
                          strokeWidth="1"
                          style={{
                            strokeDasharray: 1,
                            strokeDashoffset: gateOpen ? 0 : 1,
                            transition: `stroke-dashoffset 1000ms ease ${300 + i * 80}ms`,
                          }}
                        />
                      ))}
                    </svg>
                  </div>

                  {/* موج انفجار هنگام باز و بسته شدن */}
                  {pulse > 0 && (
                    <div key={pulse} className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2">
                      <span className="sg-ping inset-0" />
                      <span className="sg-ping inset-0" style={{ animationDelay: "250ms" }} />
                    </div>
                  )}

                  {/* بازی‌ها: از مرکز روی مسیر مارپیچ بیرون می‌آیند */}
                  {visibleGames.map((game, i) => {
                    const image = gameImages[game.slug] || game.image_url;
                    const { x, y } = positions[i];

                    return (
                      <div
                        key={game.id}
                        className="absolute left-1/2 top-1/2 z-20 h-0 w-0"
                        style={{
                          transform: gateOpen ? "rotate(0deg) scale(1)" : "rotate(-200deg) scale(0)",
                          opacity: gateOpen ? 1 : 0,
                          transition: "transform 1200ms cubic-bezier(0.22,1,0.36,1), opacity 600ms ease",
                          transitionDelay: gateOpen ? `${i * 90}ms` : "0ms",
                        }}
                      >
                        <Link
                          href={`/games/${game.slug}`}
                          tabIndex={gateOpen ? 0 : -1}
                          aria-hidden={!gateOpen}
                          aria-label={game.title}
                          className="sg-node-link absolute"
                          style={{
                            left: x - NODE / 2,
                            top: y - NODE / 2,
                            width: NODE,
                            height: NODE,
                            pointerEvents: gateOpen ? "auto" : "none",
                          }}
                        >
                          <div
                            className="sg-float h-full w-full"
                            style={{ animationDelay: `${i * -0.7}s` }}
                          >
                            <div className="sg-node group relative h-full w-full overflow-hidden rounded-full border border-white/20 bg-black">
                              <img
                                src={image ?? ""}
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-125"
                              />
                              <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-transparent" />
                              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent" />
                              <span className="absolute inset-x-0 bottom-4 px-3 text-center text-[13px] font-bold leading-tight text-white transition-colors duration-300 group-hover:text-[#c8a15b]">
                                {game.title}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}

                  {/* هسته‌ی گیت */}
                  <div className="sg-core-wrap absolute left-1/2 top-1/2 z-30 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2">
                    <button
                      type="button"
                      onClick={toggleGate}
                      aria-expanded={gateOpen}
                      aria-label={gateOpen ? "بستن گیت" : "باز کردن گیت"}
                      className="sg-core flex flex-col items-center justify-center text-center"
                    >
                      <span className="text-xs tracking-[0.5em] text-[#c8a15b]">ENTER THE</span>
                      <span className="mt-4 text-5xl font-black text-white">SOULS</span>
                      <span className="sg-gold text-5xl font-black">GATE</span>
                      <span className={`mt-5 text-base font-bold ${gateOpen ? "text-[#f0d89a]" : "text-white/45"}`}>
                        {gateOpen ? "GATE IS OPEN" : "GATE IS CLOSED"}
                      </span>
                      <span className="mt-5 h-px w-24 bg-[#c8a15b]/50" />
                      <span className="mt-5 text-[10px] tracking-[0.3em] text-white/45">
                        {gateOpen ? "CHOOSE YOUR WORLD" : "TAP TO OPEN"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* لیست ساده‌ی بازی‌ها: برای موبایل و کیبورد */}
              <ul className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3">
                {visibleGames.map((game) => (
                  <li key={game.id}>
                    <Link
                      href={`/games/${game.slug}`}
                      className="block border border-white/15 px-4 py-2 text-xs text-white/65 transition hover:border-[#c8a15b] hover:text-[#c8a15b]"
                    >
                      {game.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* ───────── About ───────── */}
      <section id="about" className="relative overflow-hidden border-t border-white/5 px-6 py-32">
        <Reveal className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-black md:text-6xl">اینجا جایی برای تسلیم شدن نیست</h2>
          <p className="mx-auto mt-8 max-w-2xl text-sm leading-9 text-white/45">
            Souls Gate برای کسانی ساخته شده که از دنیای تاریک، باس‌های سخت، داستان‌های عمیق و کشف
            رازهای پنهان بازی‌های Soulslike لذت می‌برند.
          </p>
          <div className="mx-auto mt-12 h-px w-24 bg-[#c8a15b]" />
          <p className="mt-8 text-lg text-[#c8a15b]">«هر شکست، بخشی از داستان توست.»</p>
        </Reveal>
      </section>

      {/* ───────── Stream ───────── */}
      <section id="stream" className="border-y border-white/5 bg-[#080808] px-6 py-28">
        <Reveal className="mx-auto max-w-5xl">
          <div className="sg-frame">
            <div className="relative bg-[#0b0b0b] p-8 md:p-16">
              <div className="flex items-center gap-3 text-xs tracking-[0.3em] text-red-400">
                <span className="sg-blink h-2 w-2 rounded-full bg-red-500" />
                LIVE STREAM
              </div>
              <h2 className="mt-6 text-4xl font-black md:text-6xl">آماده‌ای وارد گیت بشی؟</h2>
              <p className="mt-5 max-w-xl text-sm leading-8 text-white/45">
                گیم‌پلی، چالش‌ها، باس‌فایت‌ها و ماجراجویی در تاریک‌ترین دنیاهای بازی.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#" className="sg-btn bg-[#c8a15b] px-7 py-3 text-sm font-bold text-black">
                  کانال استریم
                </a>
                <a
                  href="#"
                  className="border border-white/15 px-7 py-3 text-sm text-white/65 transition hover:border-[#c8a15b] hover:text-[#c8a15b]"
                >
                  Discord
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row">
          <div>
            <div className="font-black tracking-[0.25em]">
              SOULS <span className="text-[#c8a15b]">GATE</span>
            </div>
            <p className="mt-2 text-xs text-white/30">ENTER THE DARKNESS</p>
          </div>
          <p className="text-xs text-white/30">© 2026 Souls Gate — All Rights Reserved</p>
        </div>
      </footer>
    </main>
  );
}

const css = `
.sg{--gold:#c8a15b;--gold-2:#f0d89a;--mx:0;--my:0}
.sg a:focus-visible,.sg button:focus-visible{outline:2px solid var(--gold-2);outline-offset:4px}

/* ورود عنوان */
.sg-title{font-family:"Cinzel","Trajan Pro","Palatino Linotype",Georgia,serif;letter-spacing:.06em;perspective:800px;text-shadow:0 6px 40px rgba(0,0,0,.8)}
.sg-letter{display:inline-block;opacity:0;animation:sg-rise 1.2s cubic-bezier(.22,1,.36,1) forwards}
.sg-white{color:#f3ead8}
.sg-gold{background:linear-gradient(100deg,#8d6a32 0%,#f0d89a 40%,#c8a15b 55%,#8d6a32 100%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:sg-rise 1.2s cubic-bezier(.22,1,.36,1) forwards,sg-shine 5s linear 2.5s infinite}
.sg-core .sg-gold{opacity:1;animation:sg-shine 5s linear infinite}
.sg-fade{opacity:0;animation:sg-fadeup 1.1s ease forwards}
.sg-line{transform:scaleX(0);animation:sg-grow 1.4s ease 1.7s forwards}

/* پس‌زمینه‌ی هیرو */
.sg-zoom{animation:sg-zoom 32s ease-in-out infinite alternate}
.sg-fog{position:absolute;inset:-20% -30%;pointer-events:none;opacity:.5;filter:blur(40px)}
.sg-fog-a{background:radial-gradient(ellipse at 30% 60%,rgba(200,161,91,.16),transparent 55%);animation:sg-drift 22s ease-in-out infinite alternate}
.sg-fog-b{background:radial-gradient(ellipse at 70% 70%,rgba(120,130,150,.14),transparent 55%);animation:sg-drift 28s ease-in-out infinite alternate-reverse}
.sg-ember{position:absolute;bottom:-12px;border-radius:50%;background:radial-gradient(circle,#ffe2a0,#c8a15b 50%,transparent 72%);opacity:0;animation:sg-ember linear infinite}

/* دکمه و اسکرول */
.sg-btn{position:relative;overflow:hidden;transition:transform .3s}
.sg-btn:hover{transform:scale(1.05)}
.sg-btn::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.55) 50%,transparent 70%);transform:translateX(-120%)}
.sg-btn:hover::after{transition:transform .8s ease;transform:translateX(120%)}
.sg-bob{animation:sg-bob 2s ease-in-out infinite}
.sg-wheel{position:absolute;left:50%;top:8px;width:3px;height:8px;margin-left:-1.5px;border-radius:2px;background:var(--gold);animation:sg-wheel 2s ease-in-out infinite}
.sg-blink{animation:sg-blink 1.6s ease-in-out infinite}

/* ظاهر شدن بخش‌ها هنگام اسکرول */
.sg-reveal{opacity:0;transform:translateY(30px);transition:opacity .9s ease,transform .9s cubic-bezier(.22,1,.36,1)}
.sg-reveal.sg-in{opacity:1;transform:none}

/* گیت */
.sg-parallax{transform:translate(calc(var(--mx)*-14px),calc(var(--my)*-14px));transition:transform .4s ease-out}
.sg-halo{position:absolute;left:50%;top:50%;width:620px;height:620px;margin:-310px 0 0 -310px;border-radius:50%;background:radial-gradient(circle,rgba(200,161,91,.28),transparent 68%);filter:blur(30px);opacity:.35;transform:scale(.8);transition:opacity 1.2s,transform 1.2s}
.sg-open .sg-halo{opacity:1;transform:scale(1.35);animation:sg-pulse 4s ease-in-out infinite}
.sg-rays{position:absolute;left:50%;top:50%;width:1000px;height:1000px;margin:-500px 0 0 -500px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(200,161,91,.2) 0 3deg,transparent 3deg 14deg);-webkit-mask:radial-gradient(circle,transparent 24%,#000 36%,transparent 62%);mask:radial-gradient(circle,transparent 24%,#000 36%,transparent 62%);opacity:0;transform:scale(.6);transition:opacity 1.4s,transform 1.4s;animation:sg-spin 70s linear infinite}
.sg-open .sg-rays{opacity:.9;transform:scale(1)}
.sg-ring{position:absolute;left:50%;top:50%;transform-origin:center;opacity:.55;transition:opacity 1s,filter 1s}
.sg-open .sg-ring{opacity:1;filter:drop-shadow(0 0 6px rgba(200,161,91,.5))}
.sg-ring.sg-spin{margin:-420px 0 0 -420px;animation:sg-spin 120s linear infinite}
.sg-ring.sg-spin-rev{animation:sg-spin 90s linear infinite reverse}
svg.sg-ring[width="1000"]{margin:-500px 0 0 -500px}
svg.sg-ring[width="620"]{margin:-310px 0 0 -310px;animation-duration:60s}
.sg-ping{position:absolute;border:2px solid var(--gold);border-radius:50%;opacity:0;animation:sg-ping 1.9s cubic-bezier(.2,.6,.3,1) forwards}
.sg-node-link{display:block;border-radius:50%}
.sg-node{box-shadow:0 0 30px rgba(0,0,0,.85);transition:transform .5s,border-color .5s,box-shadow .5s}
.sg-node-link:hover .sg-node,.sg-node-link:focus-visible .sg-node{transform:scale(1.14);border-color:var(--gold);box-shadow:0 0 60px rgba(200,161,91,.45)}
.sg-float{animation:sg-float 6s ease-in-out infinite}

/* هسته */
.sg-core-wrap{border-radius:50%;box-shadow:0 0 60px rgba(200,161,91,.15);transition:box-shadow .8s,transform .6s}
.sg-open .sg-core-wrap{box-shadow:0 0 110px rgba(200,161,91,.42)}
.sg-core-wrap::before{content:"";position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,transparent 0,var(--gold) 18%,transparent 40%,var(--gold-2) 66%,transparent 86%);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 2px));mask:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 2px));animation:sg-spin 6s linear infinite}
.sg-core{position:relative;width:calc(100% - 6px);height:calc(100% - 6px);margin:3px;border-radius:50%;cursor:pointer;background:radial-gradient(circle at 50% 38%,#1a140a 0%,#0a0a09 62%,#050505 100%);transition:transform .5s}
.sg-core:hover{transform:scale(1.04)}
.sg-core:active{transform:scale(.96)}

/* قاب استریم */
.sg-frame{position:relative;padding:1px;overflow:hidden}
.sg-frame::before{content:"";position:absolute;inset:-60%;background:conic-gradient(from 0deg,transparent 0,rgba(200,161,91,.7) 12%,transparent 30%);animation:sg-spin 8s linear infinite}
.sg-frame>div{position:relative}

@keyframes sg-rise{from{opacity:0;transform:translateY(70px) rotateX(-80deg);filter:blur(14px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes sg-shine{to{background-position:-250% 0}}
@keyframes sg-fadeup{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes sg-grow{to{transform:scaleX(1)}}
@keyframes sg-zoom{from{transform:scale(1.05)}to{transform:scale(1.2) translate(-1.5%,-1%)}}
@keyframes sg-drift{from{transform:translateX(-6%)}to{transform:translateX(6%)}}
@keyframes sg-ember{0%{transform:translate3d(0,0,0) scale(1);opacity:0}12%{opacity:1}100%{transform:translate3d(var(--dx),-105vh,0) scale(.3);opacity:0}}
@keyframes sg-bob{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,8px)}}
@keyframes sg-wheel{0%{opacity:0;transform:translateY(0)}30%{opacity:1}100%{opacity:0;transform:translateY(14px)}}
@keyframes sg-blink{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes sg-spin{to{transform:rotate(360deg)}}
@keyframes sg-pulse{0%,100%{opacity:.75}50%{opacity:1}}
@keyframes sg-ping{from{transform:scale(.4);opacity:.85}to{transform:scale(3);opacity:0}}
@keyframes sg-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}

@media (prefers-reduced-motion:reduce){
  .sg *,.sg *::before,.sg *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
  .sg-ember{display:none}
}
`;
