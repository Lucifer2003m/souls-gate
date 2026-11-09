
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SHIELD_CATEGORIES,
  type ShieldCategoryKey,
} from "./shieldReference";

type Shield = {
  id: string;
  name: string;
  fileName: string;
  category: ShieldCategoryKey | "other";
  image: string;
};

type CategoryFilter = "all" | ShieldCategoryKey | "other";

const STORAGE_KEY = "souls-gate-ds3-shield-ratings-v1";
const COLLECTION_KEY = "souls-gate-ds3-shields-collected-v1";

const categoryLabels: Record<string, string> = {
  small: "شیلد کوچک",
  standard: "شیلد استاندارد",
  great: "شیلد بزرگ",
  other: "دسته‌بندی نشده",
};

export default function ShieldsArchive() {
  const [shields, setShields] = useState<Shield[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [selected, setSelected] = useState<Shield | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [collected, setCollected] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadShields() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/games/dark-souls-3/Shields/api",
          { cache: "no-store" },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "دریافت شیلدها ناموفق بود.");
        }

        if (!cancelled) {
          setShields(Array.isArray(data.shields) ? data.shields : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "خطایی هنگام دریافت شیلدها رخ داد.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadShields();

    try {
      const savedRatings = localStorage.getItem(STORAGE_KEY);
      const savedCollection = localStorage.getItem(COLLECTION_KEY);

      if (savedRatings) {
        const parsed: unknown = JSON.parse(savedRatings);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          setRatings(parsed as Record<string, number>);
        }
      }

      if (savedCollection) {
        const parsed: unknown = JSON.parse(savedCollection);
        if (Array.isArray(parsed)) {
          setCollected(parsed.filter((item): item is string =>
            typeof item === "string"
          ));
        }
      }
    } catch {
      // داده ذخیره‌شده خراب نباید مانع اجرای صفحه شود.
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: shields.length,
      small: 0,
      standard: 0,
      great: 0,
      other: 0,
    };

    for (const shield of shields) {
      counts[shield.category] = (counts[shield.category] ?? 0) + 1;
    }

    return counts;
  }, [shields]);

  const filteredShields = useMemo(() => {
    const query = search.trim().toLowerCase();

    return shields.filter((shield) => {
      const matchesCategory =
        category === "all" || shield.category === category;

      const matchesSearch =
        !query ||
        shield.name.toLowerCase().includes(query) ||
        shield.fileName.toLowerCase().includes(query) ||
        (categoryLabels[shield.category] ?? "").toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [shields, search, category]);

  function setRating(shieldId: string, value: number) {
    setRatings((previous) => {
      const next = { ...previous, [shieldId]: value };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // امتیازدهی بدون ذخیره‌سازی نیز قابل استفاده است.
      }

      return next;
    });
  }

  function toggleCollected(shieldId: string) {
    setCollected((previous) => {
      const next = previous.includes(shieldId)
        ? previous.filter((id) => id !== shieldId)
        : [...previous, shieldId];

      try {
        localStorage.setItem(COLLECTION_KEY, JSON.stringify(next));
      } catch {
        // رابط کاربری همچنان فعال می‌ماند.
      }

      return next;
    });
  }

  function toggleCompare(shieldId: string) {
    setCompare((previous) => {
      if (previous.includes(shieldId)) {
        return previous.filter((id) => id !== shieldId);
      }

      if (previous.length >= 3) return previous;
      return [...previous, shieldId];
    });
  }

  const comparedShields = shields.filter((shield) =>
    compare.includes(shield.id),
  );

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#090a0c] px-4 py-8 text-[#e9e2d4] md:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <header className="relative mb-8 overflow-hidden rounded-2xl border border-[#6e572c]/60 bg-gradient-to-bl from-[#292116] via-[#151414] to-[#0b0c0e] p-6 md:p-10">
          <div className="pointer-events-none absolute -left-10 -top-16 h-56 w-56 rounded-full bg-[#c8a15b]/10 blur-3xl" />

          <p className="mb-3 text-xs tracking-[0.32em] text-[#c8a15b]">
            DARK SOULS III · ARMAMENT ARCHIVE
          </p>

          <h1 className="text-3xl font-black md:text-5xl">
            آرشیو شیلدها
          </h1>

          <p className="mt-3 max-w-2xl leading-8 text-[#b9b2a6]">
            سپرها را بررسی کن، دسته‌بندی موردنظرت را انتخاب کن و شیلدهای
            محبوبت را برای مقایسه یا جمع‌آوری مشخص کن.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Stat label="کل شیلدهای بارگذاری‌شده" value={shields.length} />
            <Stat label="شیلدهای جمع‌آوری‌شده" value={collected.length} />
            <Stat label="انتخاب برای مقایسه" value={compare.length} />
          </div>
        </header>

        <section className="mb-6 rounded-2xl border border-white/10 bg-[#111214] p-4 md:p-5">
          <label className="mb-2 block text-sm text-[#c8a15b]">
            جست‌وجو بین شیلدها
          </label>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="نام شیلد را وارد کن..."
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-[#c8a15b]/70"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <CategoryButton
              active={category === "all"}
              onClick={() => setCategory("all")}
              label="همه"
              count={categoryCounts.all}
            />

            {(Object.keys(SHIELD_CATEGORIES) as ShieldCategoryKey[]).map(
              (key) => (
                <CategoryButton
                  key={key}
                  active={category === key}
                  onClick={() => setCategory(key)}
                  label={SHIELD_CATEGORIES[key].label}
                  count={categoryCounts[key]}
                />
              ),
            )}

            {categoryCounts.other > 0 && (
              <CategoryButton
                active={category === "other"}
                onClick={() => setCategory("other")}
                label="دسته‌بندی نشده"
                count={categoryCounts.other}
              />
            )}
          </div>
        </section>

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-red-200">
            <p className="font-bold">بارگذاری تصاویر ناموفق بود</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-2xl border border-white/5 bg-white/[0.04]"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-zinc-400">
                نمایش {filteredShields.length} از {shields.length} شیلد
              </p>

              <button
                onClick={() => setShowCompare((value) => !value)}
                disabled={compare.length === 0}
                className="rounded-lg border border-[#c8a15b]/40 px-3 py-2 text-sm text-[#d9b878] transition hover:bg-[#c8a15b]/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {showCompare ? "بستن مقایسه" : `مقایسه (${compare.length}/3)`}
              </button>
            </div>

            {showCompare && comparedShields.length > 0 && (
              <section className="mb-6 rounded-2xl border border-[#c8a15b]/30 bg-[#171511] p-4">
                <h2 className="mb-4 text-lg font-bold text-[#d9b878]">
                  شیلدهای انتخاب‌شده برای مقایسه
                </h2>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {comparedShields.map((shield) => (
                    <div
                      key={shield.id}
                      className="flex items-center gap-3 rounded-xl border border-white/10 p-3"
                    >
                      <img
                        src={shield.image}
                        alt={shield.name}
                        className="h-16 w-16 object-contain"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{shield.name}</p>
                        <p className="mt-1 text-xs text-zinc-400">
                          {categoryLabels[shield.category] ?? "دسته‌بندی نشده"}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleCompare(shield.id)}
                        className="text-xs text-red-300 hover:text-red-200"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-xs leading-6 text-zinc-500">
                  مشخصات عددی دفاع و وزن تا زمان اتصال به داده معتبر، در این
                  مقایسه نمایش داده نمی‌شوند.
                </p>
              </section>
            )}

            {filteredShields.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#111214] p-12 text-center">
                <p className="text-lg font-bold">شیلدی پیدا نشد</p>
                <p className="mt-2 text-sm text-zinc-500">
                  عبارت جست‌وجو یا دسته‌بندی را تغییر بده.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                {filteredShields.map((shield) => {
                  const isCollected = collected.includes(shield.id);
                  const isCompared = compare.includes(shield.id);

                  return (
                    <article
                      key={shield.id}
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#1b1b1b] to-[#101113] transition duration-200 hover:-translate-y-1 hover:border-[#c8a15b]/60 hover:shadow-[0_12px_35px_rgba(0,0,0,0.35)]"
                    >
                      <button
                        onClick={() => setSelected(shield)}
                        className="block w-full text-right"
                        aria-label={`مشاهده جزئیات ${shield.name}`}
                      >
                        <div className="relative flex h-36 items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(200,161,91,0.12),transparent_70%)] p-4 sm:h-44">
                          <div className="pointer-events-none absolute inset-3 rounded-xl border border-white/[0.04]" />
                          <img
                            src={shield.image}
                            alt={shield.name}
                            loading="lazy"
                            className="relative h-full w-full object-contain p-1 transition duration-300 group-hover:scale-110"
                            onError={(event) => {
                              event.currentTarget.style.opacity = "0.2";
                            }}
                          />

                          {isCollected && (
                            <span className="absolute left-2 top-2 rounded-md border border-emerald-500/30 bg-emerald-950/80 px-2 py-1 text-[10px] text-emerald-300">
                              جمع‌آوری‌شده
                            </span>
                          )}
                        </div>

                        <div className="px-3 pb-2 pt-3">
                          <h2 className="min-h-10 text-sm font-bold leading-5 text-[#e9e2d4] transition group-hover:text-[#e1bd76]">
                            {shield.name}
                          </h2>
                          <p className="mt-1 text-xs text-zinc-500">
                            {categoryLabels[shield.category] ?? "دسته‌بندی نشده"}
                          </p>
                        </div>
                      </button>

                      <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-1">
                        <div
                          className="flex items-center gap-0.5"
                          aria-label={`امتیاز ${ratings[shield.id] ?? 0} از 5`}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(shield.id, star)}
                              title={`ثبت امتیاز ${star} از 5`}
                              className={`text-sm transition ${
                                star <= (ratings[shield.id] ?? 0)
                                  ? "text-[#e3b75e]"
                                  : "text-zinc-700 hover:text-[#c8a15b]"
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => toggleCompare(shield.id)}
                          disabled={!isCompared && compare.length >= 3}
                          title={isCompared ? "حذف از مقایسه" : "افزودن به مقایسه"}
                          className={`rounded-md border px-2 py-1 text-xs transition disabled:opacity-30 ${
                            isCompared
                              ? "border-[#c8a15b]/60 bg-[#c8a15b]/15 text-[#e3b75e]"
                              : "border-white/10 text-zinc-400 hover:border-[#c8a15b]/50"
                          }`}
                        >
                          {isCompared ? "✓ مقایسه" : "مقایسه"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={`جزئیات ${selected.name}`}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#8b6c35]/50 bg-[#111214] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs tracking-widest text-[#c8a15b]">
                  SHIELD PROFILE
                </p>
                <h2 className="mt-1 text-xl font-black">{selected.name}</h2>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-lg border border-white/10 px-3 py-2 text-zinc-300 hover:bg-white/5"
                aria-label="بستن پنل"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-5 p-5 md:grid-cols-2 md:p-7">
              <div className="flex min-h-64 items-center justify-center rounded-xl border border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(200,161,91,0.12),transparent_70%)] p-6">
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="max-h-72 w-full object-contain"
                />
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-zinc-500">دسته‌بندی</p>
                  <p className="mt-1 font-bold text-[#d9b878]">
                    {categoryLabels[selected.category] ?? "دسته‌بندی نشده"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-zinc-500">نام فایل تصویر</p>
                  <p className="mt-1 break-all text-sm">{selected.fileName}</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs text-zinc-500">امتیاز شخصی تو</p>
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(selected.id, star)}
                        className={`text-2xl ${
                          star <= (ratings[selected.id] ?? 0)
                            ? "text-[#e3b75e]"
                            : "text-zinc-700 hover:text-[#c8a15b]"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-sm leading-7 text-zinc-400">
                  اطلاعات عددی وزن، نیازمندی Strength و دفاع در برابر انواع
                  آسیب هنوز به این صفحه متصل نشده‌اند؛ تا زمان اتصال منبع
                  معتبر، مقدار ساختگی نمایش داده نمی‌شود.
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleCollected(selected.id)}
                    className="rounded-xl border border-emerald-700/50 px-4 py-3 text-sm text-emerald-300 transition hover:bg-emerald-950/40"
                  >
                    {collected.includes(selected.id)
                      ? "✓ در مجموعه من است"
                      : "＋ ثبت در مجموعه من"}
                  </button>

                  <button
                    onClick={() => toggleCompare(selected.id)}
                    disabled={
                      !compare.includes(selected.id) && compare.length >= 3
                    }
                    className="rounded-xl border border-[#c8a15b]/40 px-4 py-3 text-sm text-[#d9b878] transition hover:bg-[#c8a15b]/10 disabled:opacity-40"
                  >
                    {compare.includes(selected.id)
                      ? "حذف از مقایسه"
                      : "افزودن به مقایسه"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-32 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#d9b878]">{value}</p>
    </div>
  );
}

function CategoryButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-3 py-2 text-sm transition ${
        active
          ? "border-[#c8a15b]/70 bg-[#c8a15b]/15 text-[#e6c681]"
          : "border-white/10 bg-black/20 text-zinc-400 hover:border-[#c8a15b]/40 hover:text-white"
      }`}
    >
      {label}
      <span className="mr-2 text-xs opacity-70">{count}</span>
    </button>
  );
}
