"use client";

import { useEffect, useMemo, useState } from "react";

type TrophyRank = "platinum" | "gold" | "silver" | "bronze";

export type Trophy = {
  id: string;
  name: string;
  description: string;
  rank: TrophyRank;
  image?: string;
  hidden?: boolean;
  requirements?: string;
  guide?: string;
  gallery?: string[];
};

type AchievementsArchiveProps = {
  initialTrophies?: Trophy[];
};

const RANKS: { value: "all" | TrophyRank; label: string }[] = [
  { value: "all", label: "همه درجات" },
  { value: "platinum", label: "پلاتینیوم" },
  { value: "gold", label: "طلایی" },
  { value: "silver", label: "نقره‌ای" },
  { value: "bronze", label: "برنزی" },
];

const RANK_LABELS: Record<TrophyRank, string> = {
  platinum: "Platinum",
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
};

const RANK_COLORS: Record<TrophyRank, string> = {
  platinum: "border-cyan-300/40 text-cyan-200 bg-cyan-300/10",
  gold: "border-amber-400/40 text-amber-300 bg-amber-400/10",
  silver: "border-slate-300/40 text-slate-200 bg-slate-300/10",
  bronze: "border-orange-500/40 text-orange-300 bg-orange-500/10",
};

const STORAGE_KEY = "souls-gate-ds3-achievements-collected-v1";

export default function AchievementsArchive({
  initialTrophies = [],
}: AchievementsArchiveProps) {
  const [search, setSearch] = useState("");
  const [rankFilter, setRankFilter] = useState<"all" | TrophyRank>("all");
  const [showHidden, setShowHidden] = useState(true);
  const [selectedTrophy, setSelectedTrophy] = useState<Trophy | null>(null);
  const [collected, setCollected] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCollected(parsed.filter((item): item is string => typeof item === "string"));
        }
      }
    } catch {
      // If local storage is unavailable or contains invalid data, use an empty collection.
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collected));
    } catch {
      // The archive remains usable for this session if storage is unavailable.
    }
  }, [collected, storageReady]);

  const filteredTrophies = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    return initialTrophies.filter((trophy) => {
      const matchesSearch =
        !normalizedSearch ||
        trophy.name.toLocaleLowerCase().includes(normalizedSearch) ||
        trophy.description.toLocaleLowerCase().includes(normalizedSearch);
      const matchesRank = rankFilter === "all" || trophy.rank === rankFilter;
      const matchesHidden = showHidden || !trophy.hidden;
      return matchesSearch && matchesRank && matchesHidden;
    });
  }, [initialTrophies, search, rankFilter, showHidden]);

  const collectedCount = initialTrophies.filter((trophy) =>
    collected.includes(trophy.id),
  ).length;
  const totalCount = initialTrophies.length;
  const progress = totalCount > 0 ? (collectedCount / totalCount) * 100 : 0;

  function toggleCollected(id: string) {
    setCollected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <main dir="rtl" className="min-h-screen text-stone-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="relative mb-8 overflow-hidden rounded-2xl border border-[#c8a15b]/25 bg-gradient-to-br from-[#211b14] via-[#151311] to-[#0c0b0a] p-6 sm:p-9">
          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-[#c8a15b]/10 blur-3xl" />
          <div className="relative">
            <div className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-[#c8a15b]">
              <span className="h-px w-8 bg-[#c8a15b]/70" /> DARK SOULS III
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#f1dfbd] sm:text-4xl">
              دستاوردها و تروفی‌ها
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-400 sm:text-base">
              آرشیو کامل تروفی‌های بازی؛ شرایط دریافت، راهنماها و میزان پیشرفت خودت را در یک مکان دنبال کن.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-stone-300">پیشرفت مجموعه</span>
                  <span className="font-bold tabular-nums text-[#e2bd78]">
                    {collectedCount} / {totalCount}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-[#e4c17e] to-[#98713a] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="rounded-xl border border-[#c8a15b]/25 bg-black/20 px-5 py-3 text-center">
                <div className="text-2xl font-black text-[#e2bd78]">{Math.round(progress)}٪</div>
                <div className="mt-1 text-xs text-stone-500">تکمیل‌شده</div>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#171513] px-4 py-3 focus-within:border-[#c8a15b]/60">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-stone-500" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="جست‌وجوی نام یا توضیحات تروفی..."
              className="w-full bg-transparent text-sm text-stone-100 outline-none placeholder:text-stone-600"
            />
          </label>
          <select
            value={rankFilter}
            onChange={(event) => setRankFilter(event.target.value as "all" | TrophyRank)}
            className="rounded-xl border border-white/10 bg-[#171513] px-4 py-3 text-sm text-stone-200 outline-none focus:border-[#c8a15b]/60"
          >
            {RANKS.map((rank) => (
              <option key={rank.value} value={rank.value} className="bg-[#171513]">
                {rank.label}
              </option>
            ))}
          </select>
        </section>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-stone-500">
            نمایش <span className="font-semibold text-stone-300">{filteredTrophies.length}</span> تروفی
          </p>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-stone-400">
            <input
              type="checkbox"
              checked={showHidden}
              onChange={(event) => setShowHidden(event.target.checked)}
              className="accent-[#c8a15b]"
            />
            نمایش تروفی‌های مخفی
          </label>
        </div>

        {filteredTrophies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#c8a15b]/25 bg-[#151311]/80 px-5 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c8a15b]/20 bg-[#c8a15b]/5 text-3xl text-[#c8a15b]">
              🏆
            </div>
            <h2 className="text-lg font-bold text-[#e8d5b2]">
              {initialTrophies.length === 0 ? "هنوز تروفی‌ای ثبت نشده است" : "تروفی‌ای پیدا نشد"}
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-stone-500">
              {initialTrophies.length === 0
                ? "پس از اتصال اطلاعات تروفی‌ها، کارت‌ها و تصاویر آن‌ها در این قسمت نمایش داده می‌شوند."
                : "عبارت جست‌وجو یا فیلتر درجه تروفی را تغییر بده."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTrophies.map((trophy) => {
              const isCollected = collected.includes(trophy.id);
              return (
                <article
                  key={trophy.id}
                  className={`group overflow-hidden rounded-2xl border bg-[#171513] transition duration-200 hover:-translate-y-0.5 hover:border-[#c8a15b]/45 ${
                    isCollected ? "border-[#c8a15b]/35" : "border-white/10"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedTrophy(trophy)}
                    className="block w-full text-right"
                    aria-label={`نمایش جزئیات ${trophy.name}`}
                  >
                    <div className="relative flex min-h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-[#292116] to-[#100f0d] p-5">
                      {trophy.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={trophy.image} alt={trophy.name} className="h-24 w-24 object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.5)]" />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#c8a15b]/30 bg-black/20 text-4xl text-[#c8a15b]/80">
                          🏆
                        </div>
                      )}
                      {trophy.hidden && (
                        <span className="absolute right-3 top-3 rounded-full border border-violet-300/20 bg-violet-300/10 px-2.5 py-1 text-[10px] text-violet-200">
                          مخفی
                        </span>
                      )}
                      <span className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${RANK_COLORS[trophy.rank]}`}>
                        {RANK_LABELS[trophy.rank]}
                      </span>
                    </div>
                    <div className="p-4">
                      <h2 className="font-bold text-[#ead8b7] transition group-hover:text-[#e2bd78]">
                        {trophy.name}
                      </h2>
                      <p className="mt-2 line-clamp-2 min-h-12 text-xs leading-6 text-stone-500">
                        {trophy.description}
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center justify-between border-t border-white/5 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedTrophy(trophy)}
                      className="text-xs font-semibold text-[#c8a15b] hover:text-[#f0d49f]"
                    >
                      مشاهده جزئیات ←
                    </button>
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-stone-400">
                      <input
                        type="checkbox"
                        checked={isCollected}
                        onChange={() => toggleCollected(trophy.id)}
                        className="h-4 w-4 accent-[#c8a15b]"
                      />
                      دریافت شده
                    </label>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {selectedTrophy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedTrophy(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="trophy-dialog-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#c8a15b]/30 bg-[#171513] shadow-2xl shadow-black/50"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <span className="text-xs font-semibold tracking-[0.2em] text-[#c8a15b]">TROPHY DETAILS</span>
              <button
                type="button"
                onClick={() => setSelectedTrophy(null)}
                className="rounded-lg px-3 py-1 text-xl text-stone-400 hover:bg-white/5 hover:text-white"
                aria-label="بستن"
              >
                ×
              </button>
            </div>
            <div className="p-5 sm:p-7">
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-[#c8a15b]/20 bg-gradient-to-br from-[#302719] to-[#100f0d] text-5xl">
                  {selectedTrophy.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={selectedTrophy.image} alt={selectedTrophy.name} className="h-20 w-20 object-contain" />
                  ) : "🏆"}
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-right">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold ${RANK_COLORS[selectedTrophy.rank]}`}>
                    {RANK_LABELS[selectedTrophy.rank]}
                  </span>
                  <h2 id="trophy-dialog-title" className="mt-3 text-2xl font-black text-[#ead8b7]">
                    {selectedTrophy.name}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-stone-400">{selectedTrophy.description}</p>
                </div>
              </div>

              {selectedTrophy.requirements && (
                <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
                  <h3 className="mb-2 text-sm font-bold text-[#d9b979]">شرایط دریافت</h3>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-stone-300">{selectedTrophy.requirements}</p>
                </div>
              )}
              {selectedTrophy.guide && (
                <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
                  <h3 className="mb-2 text-sm font-bold text-[#d9b979]">راهنمای دریافت</h3>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-stone-300">{selectedTrophy.guide}</p>
                </div>
              )}
              {selectedTrophy.gallery && selectedTrophy.gallery.length > 0 && (
                <div className="mt-5">
                  <h3 className="mb-3 text-sm font-bold text-[#d9b979]">تصاویر مرتبط</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {selectedTrophy.gallery.map((image, index) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={`${image}-${index}`} src={image} alt={`${selectedTrophy.name} - ${index + 1}`} className="aspect-video w-full rounded-lg border border-white/10 object-cover" />
                    ))}
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => toggleCollected(selectedTrophy.id)}
                className={`mt-6 w-full rounded-xl border px-4 py-3 text-sm font-bold transition ${
                  collected.includes(selectedTrophy.id)
                    ? "border-[#c8a15b]/40 bg-[#c8a15b]/10 text-[#e2bd78] hover:bg-[#c8a15b]/15"
                    : "border-[#c8a15b] bg-[#c8a15b] text-[#17120a] hover:bg-[#dfbd7d]"
                }`}
              >
                {collected.includes(selectedTrophy.id) ? "لغو وضعیت دریافت تروفی" : "علامت‌گذاری به‌عنوان دریافت‌شده"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
