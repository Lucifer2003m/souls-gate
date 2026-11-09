
"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildArmorSetsFromStorage,
  slots,
  type ArmorApiItem,
  type ArmorSet,
  type SlotId,
} from "./armor-data";

const ARMOR_API = "/games/dark-souls-3/armor-lab/api";
const RATINGS_API = "/games/dark-souls-3/armor-lab/ratings";
const VOTER_STORAGE_KEY = "souls-gate:armor-anonymous-voter-v1";
const GOLD = "#c8a15b";

type RatingSummary = { count: number; average: number };
type RatingMap = Record<string, RatingSummary>;
type SortMode = "popular" | "rating" | "name" | "votes";

function getVoterId(): string {
  try {
    const existing = window.localStorage.getItem(VOTER_STORAGE_KEY);
    if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;

    const created = window.crypto?.randomUUID?.();

    if (created) {
      window.localStorage.setItem(VOTER_STORAGE_KEY, created);
      return created;
    }
  } catch {
    // شناسهٔ موقت برای نشست فعلی
  }

  return `${Date.now().toString(16)}-${Math.random()
    .toString(16)
    .slice(2)}-${Math.random().toString(16).slice(2)}`;
}

function StarRating({
  value,
  interactive,
  onRate,
  disabled = false,
}: {
  value: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  disabled?: boolean;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || Math.round(value);

  return (
    <div
      className="flex items-center gap-0.5"
      dir="ltr"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((star) =>
        interactive ? (
          <button
            key={star}
            type="button"
            aria-label={`ثبت امتیاز ${star} از ۵`}
            title={`${star} از ۵`}
            disabled={disabled}
            onMouseEnter={() => setHover(star)}
            onFocus={() => setHover(star)}
            onBlur={() => setHover(0)}
            onClick={() => onRate?.(star)}
            className="rounded-sm text-xl leading-none transition hover:scale-110 disabled:cursor-wait disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8a15b]"
            style={{ color: star <= shown ? GOLD : "#4b4b4b" }}
          >
            ★
          </button>
        ) : (
          <span
            key={star}
            className="text-base leading-none"
            style={{ color: star <= shown ? GOLD : "#4b4b4b" }}
          >
            ★
          </span>
        ),
      )}
    </div>
  );
}

function PieceThumb({
  src,
  label,
}: {
  src?: string | null;
  label: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return (
    <div className="flex aspect-[4/5] min-w-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black/35">
      {src && !failed ? (
        <img
          src={src}
          alt={label}
          loading="lazy"
          className="h-full w-full object-contain p-1"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="px-1 text-center text-[10px] text-gray-600">
          تصویر موجود نیست
        </span>
      )}
    </div>
  );
}

function getPieceCount(set: ArmorSet): number {
  return slots.filter((slot) =>
    Boolean(set.pieces[slot.id]?.image?.trim()),
  ).length;
}

/**
 * تصویر اولیهٔ کارت همان ترتیب قبلی را حفظ می‌کند:
 * زره بدن، کلاه‌خود، شلوار و سپس دستکش.
 */
function getDefaultCoverSlot(set: ArmorSet): SlotId | null {
  const priority: SlotId[] = [
    "chest",
    "helmet",
    "leggings",
    "gauntlets",
  ];

  return (
    priority.find((slot) => Boolean(set.pieces[slot]?.image?.trim())) ??
    null
  );
}

function getCardTone(pieceCount: number): string {
  if (pieceCount >= 4) {
    return "border-[#c8a15b]/65 bg-[#c8a15b]/[0.055] hover:border-[#e2bd76] hover:shadow-[0_18px_50px_rgba(200,161,91,.10)]";
  }

  if (pieceCount === 3) {
    return "border-emerald-700/60 bg-emerald-950/20 hover:border-emerald-500/80";
  }

  if (pieceCount === 2) {
    return "border-sky-800/60 bg-sky-950/20 hover:border-sky-500/80";
  }

  return "border-white/15 bg-[#101419] hover:border-white/35";
}

function getCountBadgeTone(pieceCount: number): string {
  if (pieceCount >= 4) {
    return "border-[#c8a15b]/50 text-[#f0d49b]";
  }

  if (pieceCount === 3) {
    return "border-emerald-600/50 text-emerald-300";
  }

  if (pieceCount === 2) {
    return "border-sky-600/50 text-sky-300";
  }

  return "border-white/20 text-gray-300";
}

export default function ArmorArchive() {
  const [sets, setSets] = useState<ArmorSet[]>([]);
  const [ratings, setRatings] = useState<RatingMap>({});
  const [myVotes, setMyVotes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("popular");
  const [completeness, setCompleteness] = useState<
    "all" | "complete" | "incomplete"
  >("all");
  const [selected, setSelected] = useState<ArmorSet | null>(null);
  const [votingFor, setVotingFor] = useState<string | null>(null);
  const [voteMessage, setVoteMessage] = useState("");
  const [voterId, setVoterId] = useState("");

  // قطعهٔ انتخاب‌شده برای هر کارت، جداگانه نگهداری می‌شود.
  const [selectedPieces, setSelectedPieces] = useState<
    Record<string, SlotId>
  >({});

  function selectPiece(set: ArmorSet, slotId: SlotId) {
    const piece = set.pieces[slotId];

    // قطعه‌ای که تصویر ندارد انتخاب نمی‌شود.
    if (!piece?.image?.trim()) return;

    setSelectedPieces((current) => ({
      ...current,
      [set.id]: slotId,
    }));
  }

  useEffect(() => {
    setVoterId(getVoterId());

    try {
      const raw = window.localStorage.getItem("souls-gate:armor-votes-v1");

      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, number>;
        if (parsed && typeof parsed === "object") setMyVotes(parsed);
      }
    } catch {
      // دادهٔ محلی خراب است؛ اطلاعات سرور همچنان معتبرند.
    }
  }, []);

  const loadRatings = useCallback(async () => {
    try {
      const response = await fetch(RATINGS_API, {
        cache: "no-store",
      });
      const body = await response.json();

      if (!response.ok || body?.success !== true) {
        throw new Error(body?.error || "دریافت امتیازها ناموفق بود.");
      }

      setRatings(body.ratings ?? {});
    } catch (error) {
      setVoteMessage(
        error instanceof Error
          ? error.message
          : "امتیازها بارگذاری نشدند.",
      );
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadArchive() {
      setLoading(true);
      setLoadError("");

      try {
        const response = await fetch(ARMOR_API, {
          cache: "no-store",
        });
        const body = await response.json();

        if (
          !response.ok ||
          body?.success !== true ||
          !Array.isArray(body.armor)
        ) {
          throw new Error(
            body?.details ||
              body?.error ||
              "دریافت آرشیو زره ناموفق بود.",
          );
        }

        const grouped = buildArmorSetsFromStorage(
          body.armor as ArmorApiItem[],
        );

        if (!grouped.length) {
          throw new Error(
            "از فایل‌های دریافتی، هیچ ست قابل نمایشی ساخته نشد.",
          );
        }

        if (!cancelled) {
          setSets(grouped);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "خطای ناشناخته در بارگذاری آرشیو.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadArchive();
    void loadRatings();

    return () => {
      cancelled = true;
    };
  }, [loadRatings]);

  const filteredSets = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    const result = sets.filter((set) => {
      const searchable = [
        set.name,
        set.english,
        ...Object.values(set.pieces).map(
          (piece) => piece?.english ?? "",
        ),
        ...(set.alternatives ?? []).map(
          (item) => item.fileName || item.name || "",
        ),
      ]
        .join(" ")
        .toLocaleLowerCase();

      const matchesQuery = !query || searchable.includes(query);
      const pieceCount = getPieceCount(set);
      const complete = pieceCount === 4;

      const matchesCompleteness =
        completeness === "all" ||
        (completeness === "complete" ? complete : !complete);

      return matchesQuery && matchesCompleteness;
    });

    result.sort((a, b) => {
      const ar = ratings[a.id] ?? { average: 0, count: 0 };
      const br = ratings[b.id] ?? { average: 0, count: 0 };

      if (sort === "rating") {
        return (
          br.average - ar.average ||
          br.count - ar.count ||
          a.name.localeCompare(b.name)
        );
      }

      if (sort === "votes") {
        return br.count - ar.count || br.average - ar.average;
      }

      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }

      return (
        br.average * Math.log2(br.count + 1) -
          ar.average * Math.log2(ar.count + 1) ||
        br.count - ar.count ||
        a.name.localeCompare(b.name)
      );
    });

    return result;
  }, [sets, ratings, search, sort, completeness]);

  async function submitVote(set: ArmorSet, rating: number) {
    if (!voterId) {
      setVoteMessage(
        "شناسه رأی‌دهی آماده نیست؛ صفحه را یک بار تازه‌سازی کن.",
      );
      return;
    }

    setVotingFor(set.id);
    setVoteMessage("");

    try {
      const response = await fetch(RATINGS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          setId: set.id,
          rating,
          voterId,
        }),
      });

      const body = await response.json();

      if (!response.ok || body?.success !== true) {
        throw new Error(body?.error || "ثبت رأی انجام نشد.");
      }

      const nextVotes = { ...myVotes, [set.id]: rating };
      setMyVotes(nextVotes);

      try {
        window.localStorage.setItem(
          "souls-gate:armor-votes-v1",
          JSON.stringify(nextVotes),
        );
      } catch {
        // رأی روی سرور ثبت شده است.
      }

      if (body.summary) {
        setRatings((current) => ({
          ...current,
          [set.id]: body.summary,
        }));
      } else {
        await loadRatings();
      }

      setVoteMessage(
        `امتیاز ${rating} از ۵ برای «${set.name}» ثبت شد. می‌توانی رأی خودت را تغییر بدهی.`,
      );
    } catch (error) {
      setVoteMessage(
        error instanceof Error
          ? error.message
          : "خطا هنگام ثبت رأی.",
      );
    } finally {
      setVotingFor(null);
    }
  }

  const totalVotes = Object.values(ratings).reduce(
    (sum, item) => sum + item.count,
    0,
  );

  const ratedSets = Object.values(ratings).filter(
    (item) => item.count > 0,
  ).length;

  return (
    <section
      id="armor-archive"
      dir="rtl"
      className="relative border-t border-[#c8a15b]/25 bg-[#080a0d] px-4 py-16 text-[#e9dfce] sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#c8a15b]/[0.07] to-transparent" />

      <div className="relative mx-auto max-w-[1500px]">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-xs tracking-[0.35em] text-[#c8a15b]">
            DARK SOULS III · COMMUNITY ARMORY
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-wide sm:text-5xl">
            آرشیو زره‌ها
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-gray-400 sm:text-base">
            مجموعهٔ زره‌های لوردِران را مرور کن، جزئیات هر ست را ببین و بدون ساخت حساب به ست‌های محبوبت امتیاز بده.
          </p>

          <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.025] px-2 py-4">
              <strong className="block text-2xl text-[#d6ad64]">
                {sets.length || "—"}
              </strong>
              <span className="mt-1 block text-xs text-gray-500">
                گروه زره
              </span>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.025] px-2 py-4">
              <strong className="block text-2xl text-[#d6ad64]">
                {totalVotes.toLocaleString("fa-IR")}
              </strong>
              <span className="mt-1 block text-xs text-gray-500">
                رأی ثبت‌شده
              </span>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.025] px-2 py-4">
              <strong className="block text-2xl text-[#d6ad64]">
                {ratedSets.toLocaleString("fa-IR")}
              </strong>
              <span className="mt-1 block text-xs text-gray-500">
                ست امتیازگرفته
              </span>
            </div>
          </div>
        </div>

        <div className="mb-7 grid gap-3 rounded-2xl border border-[#a47b40]/25 bg-[#101419] p-3 sm:grid-cols-[minmax(0,1fr)_190px_170px] sm:p-4">
          <label className="block">
            <span className="sr-only">جست‌وجوی زره</span>
            <div className="flex h-12 items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-4">
              <span className="text-[#c8a15b]">⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="جست‌وجوی نام ست یا قطعه..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-600"
              />
            </div>
          </label>

          <label className="flex h-12 items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-3 text-xs text-gray-400">
            <span className="shrink-0">مرتب‌سازی</span>
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as SortMode)
              }
              className="min-w-0 flex-1 bg-transparent text-sm text-gray-200 outline-none"
            >
              <option value="popular">محبوب‌ترین</option>
              <option value="rating">بالاترین امتیاز</option>
              <option value="votes">بیشترین رأی</option>
              <option value="name">نام ست</option>
            </select>
          </label>

          <label className="flex h-12 items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-3 text-xs text-gray-400">
            <span className="shrink-0">نمایش</span>
            <select
              value={completeness}
              onChange={(event) =>
                setCompleteness(
                  event.target.value as typeof completeness,
                )
              }
              className="min-w-0 flex-1 bg-transparent text-sm text-gray-200 outline-none"
            >
              <option value="all">همهٔ ست‌ها</option>
              <option value="complete">چهار قطعه کامل</option>
              <option value="incomplete">ست‌های ناقص</option>
            </select>
          </label>
        </div>

        {loadError && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-amber-700/40 bg-amber-950/20 p-4 text-sm leading-7 text-amber-200"
          >
            آرشیو بارگذاری نشد: {loadError}
            <p className="mt-1 text-xs text-amber-100/70">
              آدرس API: {ARMOR_API}
            </p>
          </div>
        )}

        {voteMessage && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-[#c8a15b]/30 bg-[#c8a15b]/[0.07] p-3 text-sm leading-7 text-[#e7cb91]"
          >
            {voteMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#101419] p-12 text-center text-[#d6ad64]">
            در حال ساخت آرشیو زره‌ها...
          </div>
        ) : filteredSets.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#101419] p-12 text-center">
            <p className="text-lg font-bold">ست موردنظر پیدا نشد</p>
            <p className="mt-2 text-sm text-gray-500">
              عبارت جست‌وجو یا فیلترها را تغییر بده.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredSets.map((set, index) => {
              const summary = ratings[set.id] ?? {
                average: 0,
                count: 0,
              };

              const pieceCount = getPieceCount(set);
              const complete = pieceCount === 4;

              // انتخاب قبلی همین کارت؛ در غیر این صورت تصویر پیش‌فرض.
              const activeSlot =
                selectedPieces[set.id] ?? getDefaultCoverSlot(set);

              const activePiece = activeSlot
                ? set.pieces[activeSlot]
                : undefined;

              const cover = activePiece?.image ?? null;

              return (
                <article
                  key={set.id}
                  className={`group flex min-w-0 flex-col overflow-hidden rounded-2xl border transition duration-300 hover:-translate-y-1 ${getCardTone(pieceCount)}`}
                >
                  <button
                    type="button"
                    onClick={() => setSelected(set)}
                    aria-label={`مشاهدهٔ جزئیات ${set.name}`}
                    className="relative block h-48 overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_50%_65%,rgba(200,161,91,.13),transparent_65%),linear-gradient(135deg,#151a20,#080a0d)] text-right focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c8a15b]"
                  >
                    {cover ? (
                      <img
                        key={`${set.id}-${activeSlot}-${cover}`}
                        src={cover}
                        alt={activePiece?.english || set.english}
                        loading="lazy"
                        className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-600">
                        تصویر موجود نیست
                      </div>
                    )}

                    <span
                      className={`absolute right-3 top-3 rounded-full border bg-black/75 px-3 py-1 text-[10px] ${getCountBadgeTone(pieceCount)}`}
                    >
                      {complete
                        ? "۴ قطعه کامل"
                        : `${pieceCount.toLocaleString("fa-IR")} از ۴ قطعه`}
                    </span>

                    {activePiece?.english && (
                      <span className="absolute bottom-3 right-3 max-w-[65%] truncate rounded-full border border-[#c8a15b]/25 bg-black/80 px-3 py-1 text-[10px] text-[#ead8b6]">
                        {activePiece.english}
                      </span>
                    )}

                    <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-xs text-gray-300">
                      مشاهده جزئیات ←
                    </span>
                  </button>

                  <div className="flex flex-1 flex-col p-4">
                    <h3
                      className="line-clamp-1 text-lg font-bold text-[#ead8b6]"
                      title={set.name}
                    >
                      {set.name}
                    </h3>

                    <p
                      className="mt-1 line-clamp-1 text-xs tracking-wide text-gray-500"
                      title={set.english}
                    >
                      {set.english}
                    </p>

                    {/* چهار قطعهٔ پایین کارت، هر کدام قابل انتخاب‌اند. */}
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {slots.map((slot) => {
                        const piece = set.pieces[slot.id];
                        const thumbSrc = piece?.thumb || piece?.image;
                        const hasImage = Boolean(piece?.image?.trim());
                        const isActive = activeSlot === slot.id;

                        return (
                          <div key={slot.id} className="min-w-0">
                            <button
                              type="button"
                              disabled={!hasImage}
                              onClick={() => selectPiece(set, slot.id)}
                              aria-label={
                                hasImage
                                  ? `نمایش ${slot.label}: ${piece?.english || set.english}`
                                  : `${slot.label} برای این ست موجود نیست`
                              }
                              aria-pressed={isActive}
                              title={
                                hasImage
                                  ? `نمایش ${piece?.english || slot.label}`
                                  : `${slot.label}: تصویر موجود نیست`
                              }
                              className={`block w-full rounded-lg transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8a15b] ${
                                isActive
                                  ? "ring-2 ring-[#c8a15b] ring-offset-2 ring-offset-[#101419]"
                                  : "hover:ring-1 hover:ring-[#c8a15b]/60"
                              } ${
                                hasImage
                                  ? "cursor-pointer"
                                  : "cursor-not-allowed opacity-40"
                              }`}
                            >
                              <PieceThumb
                                src={thumbSrc}
                                label={`${slot.label} ${piece?.english || set.english}`}
                              />
                            </button>

                            <button
                              type="button"
                              disabled={!hasImage}
                              onClick={() => selectPiece(set, slot.id)}
                              className={`mt-1 block w-full truncate text-center text-[10px] transition focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#c8a15b] disabled:cursor-not-allowed disabled:opacity-40 ${
                                isActive
                                  ? "font-bold text-[#e8c77e]"
                                  : "text-gray-500 hover:text-[#e8c77e]"
                              }`}
                            >
                              {slot.label}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/[0.07] pt-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold tabular-nums text-[#e8d0a0]">
                            {summary.count
                              ? summary.average.toLocaleString("fa-IR", {
                                  maximumFractionDigits: 1,
                                })
                              : "—"}
                          </span>
                          <StarRating value={summary.average} />
                        </div>
                        <p className="mt-1 text-[10px] text-gray-500">
                          {summary.count.toLocaleString("fa-IR")} رأی
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelected(set)}
                        className="rounded-lg border border-[#c8a15b]/35 px-3 py-2 text-xs text-[#d6ad64] transition hover:bg-[#c8a15b]/10"
                      >
                        امتیاز و جزئیات
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-black/25 px-3 py-2">
                      <span className="text-xs text-gray-400">
                        {myVotes[set.id]
                          ? `رأی شما: ${myVotes[set.id]} از ۵`
                          : "به این ست امتیاز بده"}
                      </span>

                      <StarRating
                        value={myVotes[set.id] ?? 0}
                        interactive
                        onRate={(rating) => void submitVote(set, rating)}
                        disabled={votingFor === set.id || !voterId}
                      />
                    </div>

                    {votingFor === set.id && (
                      <p className="mt-2 text-xs text-[#d6ad64]">
                        در حال ثبت رأی...
                      </p>
                    )}

                    <span className="sr-only">ردیف {index + 1}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-gray-500">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm border border-[#c8a15b] bg-[#c8a15b]/30" />
            چهار قطعه
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm border border-emerald-600 bg-emerald-900/50" />
            سه قطعه
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm border border-sky-600 bg-sky-900/50" />
            دو قطعه
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm border border-white/30 bg-white/10" />
            یک قطعه
          </span>
        </div>

        <p className="mt-6 text-center text-xs leading-6 text-gray-600">
          رأی‌دهی بدون حساب کاربری فعال است. برای هر مرورگر یک شناسه
          ناشناس نگه‌داری می‌شود؛ این روش جلوی همهٔ روش‌های دور زدن رأی
          تکراری را نمی‌گیرد.
        </p>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="armor-detail-title"
            className="max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-2xl border border-[#c8a15b]/30 bg-[#0d1116] p-4 shadow-2xl sm:rounded-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] tracking-[0.3em] text-[#c8a15b]">
                  ARMOR ARCHIVE RECORD
                </p>
                <h3
                  id="armor-detail-title"
                  className="mt-2 text-2xl font-black text-[#ead8b6]"
                >
                  {selected.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {selected.english}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  {getPieceCount(selected).toLocaleString("fa-IR")} از ۴ قطعه
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="بستن جزئیات"
                className="rounded-lg border border-white/10 px-3 py-2 text-gray-300 hover:border-[#c8a15b]"
              >
                ✕
              </button>
            </div>

            {selected.description && (
              <p className="mt-4 text-sm leading-7 text-gray-400">
                {selected.description}
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {slots.map((slot: { id: SlotId; label: string }) => (
                <div
                  key={slot.id}
                  className="rounded-xl border border-white/10 bg-black/20 p-3"
                >
                  <div className="mb-2 text-xs text-[#d6ad64]">
                    {slot.label}
                  </div>

                  <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg bg-black/25">
                    {selected.pieces[slot.id]?.image ? (
                      <img
                        src={selected.pieces[slot.id].image}
                        alt={selected.pieces[slot.id].english}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-600">
                        تصویر موجود نیست
                      </span>
                    )}
                  </div>

                  <p className="mt-2 break-words text-center text-xs text-gray-300">
                    {selected.pieces[slot.id]?.english || "قطعه نامشخص"}
                  </p>

                  {(selected.pieces[slot.id]?.alternatives?.length ?? 0) >
                    0 && (
                    <details className="mt-3 border-t border-white/10 pt-2">
                      <summary className="cursor-pointer text-xs text-[#d6ad64]">
                        نسخه‌های دیگر این قطعه (
                        {selected.pieces[slot.id].alternatives!.length})
                      </summary>

                      <div className="mt-2 space-y-2">
                        {selected.pieces[slot.id].alternatives!.map(
                          (alternative, alternativeIndex) => (
                            <div
                              key={`${alternative.fileName ?? alternative.english}-${alternativeIndex}`}
                              className="rounded-md bg-black/30 p-2"
                            >
                              {alternative.image ? (
                                <img
                                  src={alternative.image}
                                  alt={alternative.english}
                                  loading="lazy"
                                  className="mx-auto h-24 w-full object-contain"
                                />
                              ) : null}
                              <p className="break-words text-center text-[11px] text-gray-400">
                                {alternative.english}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>

            {(selected.alternatives?.length ?? 0) > 0 && (
              <details className="mt-5 rounded-xl border border-white/10 bg-black/20 p-3">
                <summary className="cursor-pointer text-sm text-gray-300">
                  فایل‌های اضافی این گروه (
                  {selected.alternatives!.length})
                </summary>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {selected.alternatives!.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="break-words rounded-lg bg-black/30 p-3 text-xs text-gray-400"
                    >
                      {item.fileName || item.name || item.id}
                    </div>
                  ))}
                </div>
              </details>
            )}

            <div className="mt-6 rounded-xl border border-[#c8a15b]/25 bg-[#c8a15b]/[0.045] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[#ead8b6]">امتیاز جامعه</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {(ratings[selected.id]?.count ?? 0).toLocaleString("fa-IR")} رأی ثبت‌شده
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <strong className="text-2xl text-[#d6ad64]">
                    {ratings[selected.id]?.count
                      ? ratings[selected.id].average.toLocaleString("fa-IR", {
                          maximumFractionDigits: 1,
                        })
                      : "—"}
                    <span className="text-sm">/۵</span>
                  </strong>
                  <StarRating
                    value={ratings[selected.id]?.average ?? 0}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <div>
                  <p className="text-sm text-gray-300">
                    {myVotes[selected.id]
                      ? `رأی فعلی شما ${myVotes[selected.id]} از ۵ است`
                      : "نظر تو دربارهٔ این ست چیست؟"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    برای تغییر رأی، ستارهٔ دیگری را انتخاب کن.
                  </p>
                </div>

                <StarRating
                  value={myVotes[selected.id] ?? 0}
                  interactive
                  onRate={(rating) => void submitVote(selected, rating)}
                  disabled={votingFor === selected.id || !voterId}
                />
              </div>

              {votingFor === selected.id && (
                <p className="mt-3 text-xs text-[#d6ad64]">
                  در حال ثبت رأی...
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
