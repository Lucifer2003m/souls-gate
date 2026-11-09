"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Trade = {
  id: string;
  give: string;
  giveFa: string;
  receive: string;
  receiveFa: string;
  note: string;
  category: string;
};

const TRADES: Trade[] = [
  { id: "sieg", give: "Siegbrau", giveFa: "زیگ‌برو", receive: "Armor of the Sun", receiveFa: "زره خورشید", note: "یک‌بار در هر چرخه بازی", category: "مصرفی" },
  { id: "bone", give: "Homeward Bone", giveFa: "استخوان بازگشت", receive: "Iron Bracelets", receiveFa: "دستبند آهنی", note: "یک‌بار در هر چرخه بازی", category: "مصرفی" },
  { id: "seed", give: "Seed of a Tree of Giants", giveFa: "بذر درخت غول‌ها", receive: "Iron Leggings", receiveFa: "شلوار آهنی", note: "یک‌بار در هر چرخه بازی", category: "مصرفی" },
  { id: "shard", give: "Undead Bone Shard", giveFa: "تکه استخوان نامرده", receive: "Porcine Shield", receiveFa: "سپر گراز", note: "یک‌بار در هر چرخه بازی", category: "ارتقا" },
  { id: "fragment", give: "Coiled Sword Fragment", giveFa: "تکه شمشیر مارپیچ", receive: "Titanite Slab", receiveFa: "تایتانایت اسلب", note: "جایزه ویژه؛ یک‌بار در هر چرخه بازی", category: "ارتقا" },
  { id: "divine", give: "Divine Blessing", giveFa: "برکت الهی", receive: "Soothing Sunlight", receiveFa: "معجزه Soothing Sunlight", note: "یک‌بار در هر چرخه بازی", category: "مصرفی" },
  { id: "hidden", give: "Hidden Blessing", giveFa: "برکت پنهان", receive: "Filianore's Sacred Chime", receiveFa: "زنگ مقدس فیلیانور", note: "یک‌بار در هر چرخه بازی", category: "مصرفی" },
  { id: "blackbomb", give: "Black Firebomb", giveFa: "بمب آتشین سیاه", receive: "Titanite Chunk", receiveFa: "تکه تایتانایت", note: "تبادل مواد ارتقا", category: "مصرفی" },
  { id: "firebomb", give: "Firebomb", giveFa: "بمب آتشین", receive: "Large Titanite Shard", receiveFa: "تکه بزرگ تایتانایت", note: "تبادل مواد ارتقا", category: "مصرفی" },
  { id: "alluring", give: "Alluring Skull", giveFa: "جمجمه فریبنده", receive: "Hello Carving", receiveFa: "کنده‌کاری سلام", note: "برای دریافت پیام صوتی ویژه", category: "مصرفی" },
  { id: "prism", give: "Prism Stone", giveFa: "سنگ منشوری", receive: "Twinkling Titanite", receiveFa: "تایتانایت چشمک‌زن", note: "تبادل مواد ارتقا", category: "متفرقه" },
  { id: "hammer", give: "Blacksmith Hammer", giveFa: "چکش آهنگر", receive: "Titanite Scale", receiveFa: "مقیاس تایتانایت", note: "تبادل مواد ارتقا", category: "سلاح" },
];

const STORAGE_KEY = "souls-gate-ds3-crow-trades-v1";
const APPROACH_SOUNDS = ["/audio/crow-approach-v1.mp3", "/audio/crow-approach-v2.mp3"] as const;
const CORRECT_SOUNDS = ["/audio/crow-correct-v1.mp3", "/audio/crow-correct-v2.mp3"] as const;

export default function CrowTrade() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Trade>(TRADES[0]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [notice, setNotice] = useState("یک آیتم از کارت‌ها انتخاب کن و داخل لانه رها کن.");
  const [isDropping, setIsDropping] = useState(false);
  const [audioVolume, setAudioVolume] = useState(60);
  const [audioMuted, setAudioMuted] = useState(false);
  const audioVolumeRef = useRef(0.6);
  const audioMutedRef = useRef(false);
  const approachAudioRefs = useRef<HTMLAudioElement[]>([]);
  const correctAudioRefs = useRef<HTMLAudioElement[]>([]);
  const approachIndexRef = useRef(0);
  const correctIndexRef = useRef(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCompleted(JSON.parse(saved) as string[]);
    } catch (error) {
      console.error("Could not load crow trade history", error);
    }

    approachAudioRefs.current = APPROACH_SOUNDS.map((path) => {
      const audio = new Audio(path);
      audio.preload = "auto";
      audio.volume = audioVolumeRef.current;
      audio.muted = audioMutedRef.current;
      return audio;
    });
    correctAudioRefs.current = CORRECT_SOUNDS.map((path) => {
      const audio = new Audio(path);
      audio.preload = "auto";
      audio.volume = audioVolumeRef.current;
      audio.muted = audioMutedRef.current;
      return audio;
    });

    // Play one of the two arrival sounds whenever this section mounts.
    const arrivalSounds = approachAudioRefs.current;
    if (arrivalSounds.length > 0) {
      const audio = arrivalSounds[Math.floor(Math.random() * arrivalSounds.length)];
      audio.currentTime = 0;
      audio.volume = audioVolumeRef.current;
      audio.muted = audioMutedRef.current;
      void audio.play().catch(() => {
        // Some browsers block autoplay until the visitor interacts with the page.
      });
    }

    return () => {
      approachAudioRefs.current.forEach((audio) => audio.pause());
      correctAudioRefs.current.forEach((audio) => audio.pause());
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TRADES;
    return TRADES.filter((trade) =>
      `${trade.give} ${trade.giveFa} ${trade.receive} ${trade.receiveFa} ${trade.category}`.toLowerCase().includes(q)
    );
  }, [query]);

  function playNextCorrectSound() {
    const sounds = correctAudioRefs.current;
    if (sounds.length === 0) return;
    const index = correctIndexRef.current % sounds.length;
    correctIndexRef.current = (correctIndexRef.current + 1) % sounds.length;
    const audio = sounds[index];
    audio.pause();
    audio.currentTime = 0;
    audio.volume = audioVolumeRef.current;
    audio.muted = audioMutedRef.current;
    void audio.play().catch(() => {
      // Browsers may require user interaction before audio playback.
    });
  }

  function updateAudioVolume(value: number) {
    const normalized = Math.max(0, Math.min(100, value));
    setAudioVolume(normalized);
    audioVolumeRef.current = normalized / 100;
    [...approachAudioRefs.current, ...correctAudioRefs.current].forEach((audio) => {
      audio.volume = audioVolumeRef.current;
    });
  }

  function toggleAudioMuted() {
    const nextMuted = !audioMutedRef.current;
    audioMutedRef.current = nextMuted;
    setAudioMuted(nextMuted);
    [...approachAudioRefs.current, ...correctAudioRefs.current].forEach((audio) => {
      audio.muted = nextMuted;
    });
  }

  function resetTrades() {
    const confirmed = window.confirm("همه معامله‌های ثبت‌شده پاک شوند و بتوانی دوباره همه آیتم‌ها را انتخاب کنی؟");
    if (!confirmed) return;

    setCompleted([]);
    setSelected(TRADES[0]);
    setIsDropping(false);
    setNotice("تاریخچه معامله‌ها پاک شد؛ می‌توانی دوباره از ابتدا شروع کنی.");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Could not reset crow trade history", error);
    }
  }

  function performTrade(trade: Trade) {
    if (completed.includes(trade.id)) {
      setNotice(`این معامله قبلاً ثبت شده: ${trade.receiveFa}. در هر چرخه بازی فقط یک‌بار قابل دریافت است.`);
      return;
    }
    setSelected(trade);
    setIsDropping(true);
    setNotice(`کلاغ آیتم را بررسی می‌کند...`);
    playNextCorrectSound();
    window.setTimeout(() => {
      setCompleted((previous) => {
        const next = [...previous, trade.id];
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (error) {
          console.error("Could not save crow trade history", error);
        }
        return next;
      });
      setNotice(`معامله انجام شد! جایزه تو: ${trade.receiveFa} (${trade.receive})`);
      setIsDropping(false);
    }, 900);
  }

  return (
    <div dir="ltr" className="mt-7 text-[#eee6d5]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-[#c8a15b]/25 pb-5">
        <div>
          <p className="text-[10px] tracking-[.3em] text-[#c8a15b]">PICKLE-PEE · PUMP-A-RUM</p>
          <h3 className="mt-2 font-serif text-3xl text-[#ead8b0]">Crow&apos;s Trade</h3>
          <p dir="rtl" className="mt-2 text-sm text-white/55">آیتم بده، هدیه کلاغ رو بگیر.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={resetTrades} className="border border-red-400/35 bg-red-950/20 px-3 py-2 text-xs text-red-200/85 transition hover:border-red-300/60 hover:bg-red-900/30">ریست همه انتخاب‌ها</button>
          <div className="border border-[#c8a15b]/30 bg-black/40 px-4 py-3 text-right">
            <p dir="rtl" className="text-xs text-white/45">معامله‌های ثبت‌شده</p>
            <p className="mt-1 font-serif text-2xl text-[#d9b76d]">{completed.length}<span className="text-sm text-white/40"> / {TRADES.length}</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)_minmax(0,1fr)]">
        <section className="order-3 border border-[#c8a15b]/20 bg-black/35 p-4 xl:order-1">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h4 dir="rtl" className="font-serif text-lg text-[#d8b66e]">دفترچه مبادلات</h4>
            <span className="text-[10px] tracking-widest text-white/35">TRADE LOG</span>
          </div>
          <p dir="rtl" className="mb-4 text-xs leading-6 text-white/45">هر معامله‌ای که در این صفحه انجام بدهی اینجا می‌ماند. این فهرست، موجودی واقعی بازی را تغییر نمی‌دهد.</p>
          <div className="space-y-2">
            {completed.length === 0 ? <div dir="rtl" className="border border-dashed border-white/10 px-3 py-8 text-center text-xs leading-7 text-white/35">هنوز معامله‌ای انجام نشده.<br />اولین آیتم را به لانه بینداز.</div> : completed.map((id) => {
              const trade = TRADES.find((item) => item.id === id);
              if (!trade) return null;
              return <div key={id} className="flex items-center gap-3 border border-[#c8a15b]/15 bg-[#11120f] p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-emerald-500/30 bg-emerald-950/30 text-emerald-400">✓</span>
                <div className="min-w-0 flex-1"><p className="truncate text-xs text-white/80">{trade.give}</p><p dir="rtl" className="mt-1 truncate text-[11px] text-[#c8a15b]">دریافت: {trade.receiveFa}</p></div>
              </div>;
            })}
          </div>
        </section>

        <section className="order-1 flex min-w-0 flex-col items-center border border-[#c8a15b]/30 bg-[radial-gradient(ellipse_at_center,rgba(125,84,35,.16),rgba(0,0,0,.58)_68%)] p-4 sm:p-6 xl:order-2">
          <p className="text-[10px] tracking-[.28em] text-[#c8a15b]">THE CROW&apos;S NEST</p>
          <div dir="rtl" className="mt-3 flex w-full max-w-[430px] items-center gap-3 border border-[#c8a15b]/25 bg-black/65 px-3 py-2.5 shadow-[0_4px_14px_rgba(0,0,0,.4)]">
            <button type="button" onClick={toggleAudioMuted} aria-pressed={audioMuted} className={`shrink-0 border px-3 py-2 text-xs transition ${audioMuted ? "border-red-400/50 bg-red-950/40 text-red-200" : "border-[#c8a15b]/35 text-[#e3d3ad] hover:bg-[#c8a15b]/10"}`}>
              {audioMuted ? "🔇 صدا قطع است" : "🔊 قطع صدا"}
            </button>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between gap-2 text-[10px] text-white/65"><label htmlFor="crow-audio-volume">بلندی صدا</label><span>{audioMuted ? "بی‌صدا" : `${audioVolume}%`}</span></div>
              <input id="crow-audio-volume" type="range" min="0" max="100" step="5" value={audioVolume} onChange={(event) => updateAudioVolume(Number(event.target.value))} aria-label="تنظیم بلندی صدای کلاغ" className="w-full cursor-pointer accent-[#c8a15b]" />
            </div>
          </div>
          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const id = event.dataTransfer.getData("text/crow-trade-id");
              const trade = TRADES.find((item) => item.id === id);
              if (trade) {
                performTrade(trade);
              } else {
                setNotice("کلاغ این آیتم را نمی‌خواهد! یک آیتم معتبر از فهرست انتخاب کن.");
              }
            }}
            className={`relative mt-3 flex aspect-square w-full max-w-[430px] flex-col items-center justify-center overflow-hidden border-0 bg-transparent px-5 py-8 text-center transition duration-300 ${isDropping ? "scale-[1.025] drop-shadow-[0_0_24px_rgba(200,161,91,.45)]" : "drop-shadow-[0_12px_22px_rgba(0,0,0,.65)]"}`}
            aria-label="لانه کلاغ؛ آیتم را اینجا رها کن"
          >
            <img
              src="/images/crow-nest.png"
              alt="لانه‌ای بزرگ از شاخه‌های تیره و درهم‌تنیده"
              draggable={false}
              className={`pointer-events-none absolute inset-0 h-full w-full select-none object-contain transition-transform duration-300 ${isDropping ? "scale-[1.035] rotate-1" : ""}`}
            />
            <div className={`relative z-10 mt-5 flex max-w-[66%] flex-col items-center transition-transform duration-300 ${isDropping ? "-translate-y-2 scale-105" : ""}`}>
              <div className="border border-[#c8a15b]/35 bg-black/75 px-4 py-2 shadow-[0_4px_18px_rgba(0,0,0,.85)] backdrop-blur-[2px]">
                <p dir="rtl" className="text-xs leading-6 text-[#e3d3ad]">{isDropping ? "جیک‌جیک! کلاغ دارد آیتم را بررسی می‌کند..." : "آیتم را در مرکز لانه رها کن"}</p>
              </div>
            </div>
            <div className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${isDropping ? "opacity-100" : "opacity-0"}`}>
              <div className="absolute left-1/2 top-[48%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c8a15b]/15 blur-2xl" />
            </div>
          </div>
          <p dir="rtl" aria-live="polite" className="mt-4 min-h-12 text-center text-xs leading-6 text-[#d5bd8b]">{notice}</p>
          <div className="mt-2 flex w-full max-w-[390px] items-center gap-3 border-t border-[#c8a15b]/20 pt-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#c8a15b]/30 bg-black/45 text-2xl">✦</div>
            <div className="min-w-0 flex-1"><p className="text-[9px] tracking-[.2em] text-white/40">REWARD</p><p className="mt-1 truncate text-sm text-[#e2c27e]">{selected.receive}</p><p dir="rtl" className="mt-1 text-xs text-white/55">{selected.receiveFa}</p></div>
          </div>
          <p dir="rtl" className="mt-4 text-center text-[10px] leading-6 text-white/35">برای آزمایش در سایت؛ دریافت جایزه در خود بازی انجام نمی‌شود.</p>
        </section>

        <section className="order-2 min-w-0 border border-[#c8a15b]/20 bg-black/35 p-4 xl:order-3">
          <div className="mb-4 flex items-center justify-between gap-2"><h4 dir="rtl" className="font-serif text-lg text-[#d8b66e]">آیتم‌های معامله</h4><span className="text-[10px] tracking-widest text-white/35">OFFER → GIFT</span></div>
          <label className="mb-4 flex items-center gap-2 border border-white/15 bg-black/45 px-3"><span className="text-[#c8a15b]">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search item..." className="min-w-0 flex-1 bg-transparent py-3 text-xs outline-none placeholder:text-white/35" /></label>
          <div className="max-h-[760px] space-y-3 overflow-y-auto pr-1">
            {filtered.map((trade) => {
              const done = completed.includes(trade.id);
              return <div key={trade.id} className={`border p-3 transition ${selected.id === trade.id ? "border-[#c8a15b]/65 bg-[#c8a15b]/[.07]" : "border-white/10 bg-[#0c0d0b]/80 hover:border-[#c8a15b]/35"}`}>
                <div className="grid grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)] items-center gap-2">
                  <button type="button" draggable={!done} onDragStart={(event) => { event.dataTransfer.setData("text/crow-trade-id", trade.id); event.dataTransfer.effectAllowed = "move"; }} onClick={() => setSelected(trade)} className="min-w-0 text-left disabled:cursor-not-allowed" title="Select and drag into the nest">
                    <span className="mb-2 flex aspect-square items-center justify-center border border-[#c8a15b]/20 bg-[radial-gradient(circle,rgba(200,161,91,.13),rgba(0,0,0,.5))] text-3xl">{trade.category === "ارتقا" ? "◆" : trade.category === "سلاح" ? "⚒" : "✧"}</span>
                    <span className="block truncate text-[10px] font-semibold text-white/85">{trade.give}</span><span dir="rtl" className="mt-1 block truncate text-[10px] text-white/45">{trade.giveFa}</span>
                  </button>
                  <div className="flex flex-col items-center gap-1 text-[#c8a15b]"><span className="text-lg">→</span><span className="text-[8px]">TRADE</span></div>
                  <div className="min-w-0"><span className="mb-2 flex aspect-square items-center justify-center border border-[#c8a15b]/20 bg-[radial-gradient(circle,rgba(200,161,91,.13),rgba(0,0,0,.5))] text-3xl">✦</span><span className="block truncate text-[10px] font-semibold text-[#d9b76d]">{trade.receive}</span><span dir="rtl" className="mt-1 block truncate text-[10px] text-white/45">{trade.receiveFa}</span></div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-2"><span dir="rtl" className="text-[9px] text-white/35">{trade.note}</span><button type="button" disabled={done || isDropping} onClick={() => performTrade(trade)} className="shrink-0 border border-[#c8a15b]/45 px-2 py-1.5 text-[9px] text-[#d9b76d] transition hover:bg-[#c8a15b]/15 disabled:cursor-not-allowed disabled:opacity-40">{done ? "✓ ثبت شد" : "رها در لانه"}</button></div>
              </div>;
            })}
            {filtered.length === 0 && <p dir="rtl" className="py-8 text-center text-xs text-white/40">آیتمی پیدا نشد.</p>}
          </div>
        </section>
      </div>
      <p dir="rtl" className="mt-5 border border-amber-500/20 bg-amber-950/10 p-3 text-[11px] leading-6 text-amber-100/60">یادآوری: این ابزار راهنمای معامله است و آیتمی را به سیو بازی منتقل نمی‌کند. تاریخچه در مرورگر همین دستگاه ذخیره می‌شود. فهرست معاملات را قبل از انتشار نهایی با جدول دقیق نسخه و DLC بازی تطبیق بده.</p>
    </div>
  );
}
