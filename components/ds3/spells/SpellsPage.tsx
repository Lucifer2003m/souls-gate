
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  spells,
  spellCategories,
  type Spell,
  type SpellCategory,
} from "@/lib/ds3/spells/data";

type SpellImage = {
  file: string;
  url: string | null;
  error?: string | null;
};

type ViewMode = "grid" | "list";
type TrophyFilter = "all" | "trophy" | "no-trophy";
type CollectionFilter = "all" | "collected" | "missing";

const STORAGE_KEY = "souls-gate-ds3-spells-v1";

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function getImageForSpell(spell: Spell, images: SpellImage[]) {
  const spellId = normalize(spell.id);
  const spellName = normalize(spell.name);

  return images.find((image) => {
    const filename = normalize(image.file.replace(/\.[^.]+$/, ""));
    return (
      filename === spellId ||
      filename === spellName ||
      filename.includes(spellId) ||
      spellId.includes(filename)
    );
  })?.url ?? null;
}

export default function SpellsPage() {
  const [category, setCategory] = useState<SpellCategory>("sorcery");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [trophyFilter, setTrophyFilter] = useState<TrophyFilter>("all");
  const [collectionFilter, setCollectionFilter] =
    useState<CollectionFilter>("all");
  const [sortOrder, setSortOrder] = useState<"az" | "za">("az");
  const [images, setImages] = useState<SpellImage[]>([]);
  const [collected, setCollected] = useState<string[]>([]);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [loadingImages, setLoadingImages] = useState(true);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.every((item) => typeof item === "string")
        ) {
          setCollected(parsed);
        }
      }
    } catch {
      // Ignore invalid local storage data.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collected));
    } catch {
      // Collection remains usable for this session if storage is unavailable.
    }
  }, [collected]);

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      setLoadingImages(true);
      setImageError("");

      try {
        const response = await fetch("/games/dark-souls-3/spells", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Could not load spell images.");
        }

        const data: { spells?: SpellImage[] } = await response.json();

        if (!cancelled) {
          setImages(Array.isArray(data.spells) ? data.spells : []);
        }
      } catch {
        if (!cancelled) {
          setImageError(
            "تصاویر بارگذاری نشدند؛ مسیر API و تنظیمات Supabase را بررسی کن."
          );
        }
      } finally {
        if (!cancelled) setLoadingImages(false);
      }
    }

    loadImages();

    return () => {
      cancelled = true;
    };
  }, []);

  const categorySpells = useMemo(() => {
    let result = spells.filter((spell) => spell.category === category);

    const query = normalize(search.trim());

    if (query) {
      result = result.filter((spell) => {
        const searchable = normalize(
          `${spell.name} ${spell.description} ${spell.location} ${spell.source}`
        );
        return searchable.includes(query);
      });
    }

    if (trophyFilter === "trophy") {
      result = result.filter((spell) => spell.trophyRequired);
    } else if (trophyFilter === "no-trophy") {
      result = result.filter((spell) => !spell.trophyRequired);
    }

    if (collectionFilter === "collected") {
      result = result.filter((spell) => collected.includes(spell.id));
    } else if (collectionFilter === "missing") {
      result = result.filter((spell) => !collected.includes(spell.id));
    }

    result.sort((a, b) =>
      sortOrder === "az"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    return result;
  }, [
    category,
    search,
    trophyFilter,
    collectionFilter,
    collected,
    sortOrder,
  ]);

  const totalInCategory = spells.filter(
    (spell) => spell.category === category
  ).length;

  const collectedInCategory = spells.filter(
    (spell) =>
      spell.category === category && collected.includes(spell.id)
  ).length;

  const overallCollected = spells.filter((spell) =>
    collected.includes(spell.id)
  ).length;

  const progress =
    spells.length > 0
      ? Math.round((overallCollected / spells.length) * 100)
      : 0;

  function toggleCollected(id: string) {
    setCollected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <section className="relative isolate min-h-[700px] overflow-hidden rounded-3xl border border-amber-100/10 bg-[#090a0d] text-stone-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="spell-orb spell-orb-one" />
        <div className="spell-orb spell-orb-two" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,112,35,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.35)_100%)]" />
      </div>

      <style jsx>{`
        .spell-orb {
          position: absolute;
          width: 20rem;
          height: 20rem;
          border-radius: 9999px;
          filter: blur(80px);
          opacity: 0.14;
          animation: spell-float 12s ease-in-out infinite alternate;
        }

        .spell-orb-one {
          top: 8%;
          left: -8rem;
          background: #b98232;
        }

        .spell-orb-two {
          right: -8rem;
          bottom: 8%;
          background: #5140a0;
          animation-delay: -5s;
        }

        @keyframes spell-float {
          from {
            transform: translate3d(0, -12px, 0) scale(0.95);
          }
          to {
            transform: translate3d(24px, 18px, 0) scale(1.08);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .spell-orb {
            animation: none;
          }
        }
      `}</style>

      <div className="relative space-y-7 p-4 sm:p-6 lg:p-8">
        <header className="border-b border-amber-100/10 pb-6 text-center">
          <p className="mb-3 text-xs tracking-[0.45em] text-amber-300/70">
            DARK SOULS III · ARCHIVE
          </p>
          <h1 className="text-3xl font-black tracking-[0.16em] text-amber-100 sm:text-5xl">
            SPELLS
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-stone-400">
            دانش ممنوعه، نیروی ایمان و شعله‌های آشوب؛ مجموعه‌ی جادوهای لردران را
            بررسی کن و پیشرفت جمع‌آوری خودت را ثبت کن.
          </p>

          <div className="mx-auto mt-6 max-w-xl">
            <div className="mb-2 flex items-center justify-between text-xs text-stone-400">
              <span>OVERALL COLLECTION</span>
              <span className="text-amber-200">
                {overallCollected} / {spells.length} · {progress}%
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label="Overall spell collection progress"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-700 via-amber-300 to-yellow-100 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {spellCategories.map((item) => {
            const active = category === item.id;
            const count = spells.filter(
              (spell) => spell.category === item.id
            ).length;
            const owned = spells.filter(
              (spell) =>
                spell.category === item.id && collected.includes(spell.id)
            ).length;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 ${
                  active
                    ? "border-amber-300/60 bg-amber-200/[0.09] shadow-[0_0_35px_rgba(202,158,70,0.09)]"
                    : "border-white/10 bg-black/20 hover:border-amber-100/30"
                }`}
                aria-pressed={active}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold tracking-[0.18em] text-amber-100 sm:text-base">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm text-stone-400">{item.fa}</p>
                  </div>
                  <span className="text-3xl text-amber-200/80 transition-transform duration-300 group-hover:scale-125">
                    {item.symbol}
                  </span>
                </div>
                <p className="mt-4 text-xs leading-6 text-stone-500">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                  <span className="text-stone-400">{count} spells</span>
                  <span className="text-amber-200">
                    {owned} / {count} collected
                  </span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-amber-300/80 transition-all duration-500"
                    style={{
                      width: `${count ? (owned / count) * 100 : 0}%`,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-black/25 p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="flex-1">
              <span className="mb-2 block text-xs tracking-widest text-stone-400">
                SEARCH SPELLS
              </span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, effect, source, or location..."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition focus:border-amber-300/50"
              />
            </label>

            <label className="lg:w-48">
              <span className="mb-2 block text-xs tracking-widest text-stone-400">
                TROPHY
              </span>
              <select
                value={trophyFilter}
                onChange={(event) =>
                  setTrophyFilter(event.target.value as TrophyFilter)
                }
                className="w-full rounded-xl border border-white/10 bg-[#111216] px-3 py-3 text-sm outline-none focus:border-amber-300/50"
              >
                <option value="all">All spells</option>
                <option value="trophy">Trophy required</option>
                <option value="no-trophy">Not required</option>
              </select>
            </label>

            <label className="lg:w-48">
              <span className="mb-2 block text-xs tracking-widest text-stone-400">
                COLLECTION
              </span>
              <select
                value={collectionFilter}
                onChange={(event) =>
                  setCollectionFilter(
                    event.target.value as CollectionFilter
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-[#111216] px-3 py-3 text-sm outline-none focus:border-amber-300/50"
              >
                <option value="all">Everything</option>
                <option value="collected">Collected</option>
                <option value="missing">Missing</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <p className="text-sm text-stone-400">
              Showing{" "}
              <span className="font-semibold text-amber-200">
                {categorySpells.length}
              </span>{" "}
              of {totalInCategory} · {collectedInCategory} collected
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSortOrder((value) => value === "az" ? "za" : "az")}
                className="rounded-lg border border-white/10 px-3 py-2 text-xs text-stone-300 transition hover:border-amber-200/40 hover:text-amber-100"
              >
                Sort: {sortOrder === "az" ? "A–Z" : "Z–A"}
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
                className={`rounded-lg border px-3 py-2 text-xs transition ${
                  view === "grid"
                    ? "border-amber-200/50 bg-amber-200/10 text-amber-100"
                    : "border-white/10 text-stone-400"
                }`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
                className={`rounded-lg border px-3 py-2 text-xs transition ${
                  view === "list"
                    ? "border-amber-200/50 bg-amber-200/10 text-amber-100"
                    : "border-white/10 text-stone-400"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {imageError && (
          <p className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-200">
            {imageError}
          </p>
        )}

        {loadingImages && (
          <p className="animate-pulse py-3 text-center text-sm text-stone-500">
            Gathering spell images from the archive...
          </p>
        )}

        {categorySpells.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 px-5 py-16 text-center">
            <div className="text-4xl text-amber-200/60">✧</div>
            <h3 className="mt-4 text-lg font-bold text-stone-200">
              No spells found
            </h3>
            <p className="mt-2 text-sm text-stone-500">
              هنوز جادویی برای این دسته وارد دیتابیس نشده یا با فیلترهای فعلی
              موردی پیدا نشد.
            </p>
          </div>
        ) : (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "flex flex-col gap-3"
            }
          >
            {categorySpells.map((spell) => {
              const image = getImageForSpell(spell, images);
              const isCollected = collected.includes(spell.id);

              return (
                <article
                  key={spell.id}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#101115]/85 transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] ${
                    view === "list"
                      ? "flex flex-row items-center gap-4 p-3 sm:p-4"
                      : "flex flex-col"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedSpell(spell)}
                    className={`relative block overflow-hidden bg-black/30 ${
                      view === "list"
                        ? "h-24 w-24 shrink-0 rounded-xl sm:h-28 sm:w-28"
                        : "aspect-square w-full"
                    }`}
                    aria-label={`View details for ${spell.name}`}
                  >
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image}
                        alt={spell.name}
                        loading="lazy"
                        className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl text-amber-200/50">
                        {spellCategories.find((item) => item.id === spell.category)?.symbol ?? "✧"}
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
                  </button>

                  <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {spell.trophyRequired && (
                        <span className="rounded-md border border-amber-200/20 bg-amber-200/10 px-2 py-1 text-[9px] font-bold tracking-wider text-amber-200">
                          TROPHY
                        </span>
                      )}
                      {spell.dlc && (
                        <span className="rounded-md border border-violet-300/20 bg-violet-300/10 px-2 py-1 text-[9px] tracking-wider text-violet-200">
                          DLC
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedSpell(spell)}
                      className="text-left text-sm font-bold leading-5 text-stone-100 transition hover:text-amber-200 sm:text-base"
                    >
                      {spell.name}
                    </button>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-stone-500">
                      {spell.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-stone-400">
                      {spell.fpCost !== null && <span>FP {spell.fpCost}</span>}
                      {spell.slots !== null && <span>Slots {spell.slots}</span>}
                      {spell.intelligence !== null && (
                        <span>INT {spell.intelligence}</span>
                      )}
                      {spell.faith !== null && spell.faith > 0 && (
                        <span>FTH {spell.faith}</span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                      <label className="flex cursor-pointer items-center gap-2 text-xs text-stone-400">
                        <input
                          type="checkbox"
                          checked={isCollected}
                          onChange={() => toggleCollected(spell.id)}
                          className="accent-amber-300"
                        />
                        <span>{isCollected ? "Collected" : "Collect"}</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => setSelectedSpell(spell)}
                        className="text-xs text-amber-200/80 transition hover:text-amber-100"
                      >
                        Details ↗
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {selectedSpell && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedSpell(null)}
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="spell-modal-title"
            className="relative my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-200/20 bg-[#101115] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
            <button
              type="button"
              onClick={() => setSelectedSpell(null)}
              className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-black/50 px-3 py-2 text-sm text-stone-300 hover:text-white"
              aria-label="Close spell details"
            >
              ✕
            </button>

            <div className="grid sm:grid-cols-[200px_1fr]">
              <div className="flex min-h-48 items-center justify-center bg-black/30 p-6">
                {getImageForSpell(selectedSpell, images) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getImageForSpell(selectedSpell, images) ?? ""}
                    alt={selectedSpell.name}
                    className="max-h-48 w-full object-contain"
                  />
                ) : (
                  <span className="text-6xl text-amber-200/50">
                    {spellCategories.find((item) => item.id === selectedSpell.category)?.symbol ?? "✧"}
                  </span>
                )}
              </div>

              <div className="p-6 sm:p-7">
                <p className="text-xs tracking-[0.25em] text-amber-300/70">
                  {spellCategories.find((item) => item.id === selectedSpell.category)?.title}
                </p>
                <h2
                  id="spell-modal-title"
                  className="mt-2 pr-8 text-2xl font-black text-amber-100"
                >
                  {selectedSpell.name}
                </h2>
                <p className="mt-4 text-sm leading-7 text-stone-300">
                  {selectedSpell.description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {[
                    ["FP COST", selectedSpell.fpCost],
                    ["ATTUNEMENT SLOTS", selectedSpell.slots],
                    ["INTELLIGENCE", selectedSpell.intelligence],
                    ["FAITH", selectedSpell.faith],
                  ].map(([label, value]) => (
                    <div
                      key={String(label)}
                      className="rounded-xl border border-white/10 bg-black/20 p-3"
                    >
                      <p className="text-[10px] tracking-wider text-stone-500">
                        {label}
                      </p>
                      <p className="mt-1 text-sm font-bold text-amber-100">
                        {value === null || value === 0 ? "—" : value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <div>
                    <p className="text-xs tracking-wider text-stone-500">
                      SOURCE
                    </p>
                    <p className="mt-1 text-stone-200">
                      {selectedSpell.source || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs tracking-wider text-stone-500">
                      LOCATION / REQUIREMENTS
                    </p>
                    <p className="mt-1 leading-6 text-stone-300">
                      {selectedSpell.location || "Details not entered yet."}
                    </p>
                  </div>
                  {selectedSpell.notes && (
                    <div>
                      <p className="text-xs tracking-wider text-stone-500">
                        NOTES
                      </p>
                      <p className="mt-1 leading-6 text-stone-300">
                        {selectedSpell.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <span
                    className={`rounded-lg border px-3 py-2 text-xs ${
                      selectedSpell.trophyRequired
                        ? "border-amber-200/20 bg-amber-200/10 text-amber-200"
                        : "border-white/10 text-stone-400"
                    }`}
                  >
                    {selectedSpell.trophyRequired
                      ? "Required for spell trophy"
                      : "Not required for spell trophy"}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleCollected(selectedSpell.id)}
                    className="rounded-xl border border-amber-200/30 bg-amber-200/10 px-4 py-2 text-sm text-amber-100 transition hover:bg-amber-200/20"
                  >
                    {collected.includes(selectedSpell.id)
                      ? "✓ Collected"
                      : "+ Mark as collected"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
