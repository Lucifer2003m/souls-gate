

"use client";

import { useEffect, useMemo, useState } from "react";

import { spellDetails, type SpellCategory } from "./data";

type Spell = {

  id: string;

  name: string;

  category: SpellCategory;

  description: string;

  location: string;

  source: string;

  trophyRequired: boolean;

  dlc: boolean;

  fpCost: number | null;

  slots: number | null;

  intelligence: number | null;

  faith: number | null;

  notes?: string;

};

type SpellImage = {

  file: string;

  url: string | null;

  spellId: string;

  spellName: string;

};

type ViewMode = "grid" | "list";

type TrophyFilter = "all" | "trophy" | "no-trophy";

type CollectionFilter = "all" | "collected" | "missing";

const STORAGE_KEY = "souls-gate-ds3-spells-v1";

const spellCategories: {

  id: SpellCategory;

  title: string;

  fa: string;

  description: string;

}[] = [

  {

    id: "sorcery",

    title: "SORCERIES",

    fa: "جادوهای جادوگری",

    description: "جادوهای مبتنی بر هوش، روح و نیروی جادویی",

  },

  {

    id: "pyromancy",

    title: "PYROMANCIES",

    fa: "آتش‌افسون‌ها",

    description: "جادوهای آتش و قدرت پیرومانسی",

  },

  {

    id: "miracle",

    title: "MIRACLES",

    fa: "معجزه‌ها",

    description: "معجزه‌های نور، درمان و نیروی ایمان",

  },

];

function asRecord(value: unknown): Record<string, unknown> {

  return value !== null && typeof value === "object"

    ? (value as Record<string, unknown>)

    : {};

}

function asText(value: unknown, fallback = ""): string {

  return typeof value === "string" ? value : fallback;

}

function asNumber(value: unknown): number | null {

  if (typeof value === "number" && Number.isFinite(value)) {

    return value;

  }

  if (typeof value === "string" && value.trim() !== "") {

    const result = Number(value);

    return Number.isFinite(result) ? result : null;

  }

  return null;

}

function normalize(value: string): string {

  return value

    .toLocaleLowerCase()

    .normalize("NFD")

    .replace(/[\u0300-\u036f]/g, "")

    .replace(/[ي]/g, "ی")

    .replace(/[ك]/g, "ک")

    .replace(/[\u064b-\u065f\u0670\u0640]/g, "")

    .replace(/[^a-z0-9\u0600-\u06ff]/g, "");

}

function getRequirement(

  requirement: unknown,

  keys: string[],

): number | null {

  const record = asRecord(requirement);

  for (const key of keys) {

    const value = asNumber(record[key]);

    if (value !== null) return value;

  }

  if (typeof requirement === "string") {

    for (const key of keys) {

      const match = requirement.match(

        new RegExp(`${key}\\s*[:=]?\\s*(\\d+)`, "i"),

      );

      if (match) return Number(match[1]);

    }

  }

  return null;

}

const spells: Spell[] = Object.entries(spellDetails).map(

  ([key, value]) => {

    const info = asRecord(value);

    const dlcValue = info.dlc;

    const isDlc =

      typeof dlcValue === "string"

        ? dlcValue.trim() !== "" &&

          dlcValue.toLowerCase() !== "none" &&

          dlcValue.toLowerCase() !== "false"

        : Boolean(dlcValue);

    return {

      id: key,

      name: asText(info.name, key),

      category: info.category as SpellCategory,

      description: asText(

        info.effect,

        asText(info.notes, "توضیحی ثبت نشده است."),

      ),

      location: asText(

        info.source,

        "محل به‌دست‌آوردن ثبت نشده است.",

      ),

      source: asText(info.source),

      trophyRequired: !isDlc,

      dlc: isDlc,

      fpCost: asNumber(info.fp),

      slots: asNumber(info.slots),

      intelligence: getRequirement(info.requirement, [

        "intelligence",

        "int",

        "INT",

      ]),

      faith: getRequirement(info.requirement, [

        "faith",

        "fth",

        "FTH",

      ]),

      notes: asText(info.notes),

    };

  },

);

/* آیکون‌های اصلی هر دسته از Supabase Storage */

function CategoryIcon({

  category,

  className = "",

}: {

  category: SpellCategory;

  className?: string;

}) {

  const icons: Record<SpellCategory, { src: string; alt: string }> = {

    sorcery: {

      src: "https://ldoormzbkujckuggklty.supabase.co/storage/v1/object/public/game-assets/ds3/spells/Sorcerie.png",

      alt: "Sorceries - Silver Icon",

    },

    pyromancy: {

      src: "https://ldoormzbkujckuggklty.supabase.co/storage/v1/object/public/game-assets/ds3/spells/Pyromancie.png",

      alt: "Pyromancies - Brown Icon",

    },

    miracle: {

      src: "https://ldoormzbkujckuggklty.supabase.co/storage/v1/object/public/game-assets/ds3/spells/Miracle.png",

      alt: "Miracles - Golden Icon",

    },

  };

  const icon = icons[category];

  return (

    <img

      src={icon.src}

      alt={icon.alt}

      draggable={false}

      className={`object-contain ${className}`}

    />

  );

}

/* تطبیق تصویر: ابتدا شناسه، سپس نام فایل و نام اسپل */

function getImageForSpell(

  spell: Spell,

  images: SpellImage[],

): string | null {

  const spellId = normalize(spell.id);

  const spellName = normalize(spell.name);

  const directMatch = images.find(

    (image) =>

      image.url &&

      image.spellId &&

      normalize(image.spellId) === spellId,

  );

  if (directMatch?.url) return directMatch.url;

  const exactMatch = images.find((image) => {

    if (!image.url) return false;

    const filename = normalize(

      image.file.split("/").pop()?.replace(/\.[^.]+$/, "") ?? "",

    );

    return filename === spellId || filename === spellName;

  });

  if (exactMatch?.url) return exactMatch.url;

  const nameMatch = images.find(

    (image) =>

      image.url &&

      image.spellName &&

      normalize(image.spellName) === spellName,

  );

  return nameMatch?.url ?? null;

}

export default function SpellsPage() {

  const [category, setCategory] =

    useState<SpellCategory>("sorcery");

  const [search, setSearch] = useState("");

  const [view, setView] = useState<ViewMode>("grid");

  const [trophyFilter, setTrophyFilter] =

    useState<TrophyFilter>("all");

  const [collectionFilter, setCollectionFilter] =

    useState<CollectionFilter>("all");

  const [sortOrder, setSortOrder] = useState<"az" | "za">("az");

  const [images, setImages] = useState<SpellImage[]>([]);

  const [collected, setCollected] = useState<string[]>([]);

  const [selectedSpell, setSelectedSpell] =

    useState<Spell | null>(null);

  const [loadingImages, setLoadingImages] = useState(true);

  const [imageError, setImageError] = useState("");

  /* بازیابی مجموعه ذخیره‌شده */

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

      // ذخیره نامعتبر نادیده گرفته می‌شود.

    }

  }, []);

  /* ذخیره مجموعه */

  useEffect(() => {

    try {

      localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(collected),

      );

    } catch {

      // صفحه بدون localStorage هم کار می‌کند.

    }

  }, [collected]);

  /* دریافت تصاویر از API */

  useEffect(() => {

    let cancelled = false;

    async function loadImages() {

      setLoadingImages(true);

      setImageError("");

      try {

        const response = await fetch(

          "/games/dark-souls-3/spells",

          { cache: "no-store" },

        );

        if (!response.ok) {

          throw new Error(`HTTP ${response.status}`);

        }

        const data: unknown = await response.json();

        const record = asRecord(data);

        if (record.success === false) {

          throw new Error(

            asText(record.error, "دریافت تصاویر ناموفق بود."),

          );

        }

        const rawImages = record.spells;

        const imageList: SpellImage[] = Array.isArray(rawImages)

          ? rawImages

              .map((item): SpellImage | null => {

                const image = asRecord(item);

                const url =

                  asText(image.imageUrl) ||

                  asText(image.image) ||

                  asText(image.url);

                const file =

                  asText(image.imageFile) ||

                  asText(image.file) ||

                  asText(image.imagePath) ||

                  asText(image.name) ||

                  asText(image.key) ||

                  asText(image.id);

                if (!file) return null;

                return {

                  file,

                  url: url || null,

                  spellId:

                    asText(image.key) || asText(image.id),

                  spellName: asText(image.name),

                };

              })

              .filter(

                (item): item is SpellImage => item !== null,

              )

          : [];

        if (!cancelled) {

          setImages(imageList);

          const usableImages = imageList.filter(

            (item) => item.url,

          ).length;

          if (usableImages === 0) {

            setImageError(

              `هیچ آدرس تصویری دریافت نشد. تعداد رکوردهای API: ${imageList.length}`,

            );

          } else {

            setImageError("");

          }

        }

      } catch (error) {

        console.error("DS3 spells image loading error:", error);

        if (!cancelled) {

          setImages([]);

          setImageError(

            "دریافت تصاویر ناموفق بود؛ اطلاعات جادوها همچنان قابل مشاهده است.",

          );

        }

      } finally {

        if (!cancelled) setLoadingImages(false);

      }

    }

    void loadImages();

    return () => {

      cancelled = true;

    };

  }, []);

  /* بستن پنجره جزئیات با Escape */

  useEffect(() => {

    if (!selectedSpell) return;

    function handleKeyDown(event: KeyboardEvent) {

      if (event.key === "Escape") setSelectedSpell(null);

    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {

      window.removeEventListener("keydown", handleKeyDown);

    };

  }, [selectedSpell]);

  const categorySpells = useMemo(() => {

    let result = spells.filter(

      (spell) => spell.category === category,

    );

    const query = normalize(search.trim());

    if (query) {

      result = result.filter((spell) =>

        normalize(

          `${spell.name} ${spell.description} ${spell.location} ${spell.source} ${spell.id}`,

        ).includes(query),

      );

    }

    if (trophyFilter === "trophy") {

      result = result.filter((spell) => spell.trophyRequired);

    } else if (trophyFilter === "no-trophy") {

      result = result.filter((spell) => !spell.trophyRequired);

    }

    if (collectionFilter === "collected") {

      result = result.filter((spell) =>

        collected.includes(spell.id),

      );

    } else if (collectionFilter === "missing") {

      result = result.filter(

        (spell) => !collected.includes(spell.id),

      );

    }

    result.sort((a, b) =>

      sortOrder === "az"

        ? a.name.localeCompare(b.name)

        : b.name.localeCompare(a.name),

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

    (spell) => spell.category === category,

  ).length;

  const collectedInCategory = spells.filter(

    (spell) =>

      spell.category === category &&

      collected.includes(spell.id),

  ).length;

  const overallCollected = spells.filter((spell) =>

    collected.includes(spell.id),

  ).length;

  const progress =

    spells.length > 0

      ? Math.round((overallCollected / spells.length) * 100)

      : 0;

  function toggleCollected(id: string) {

    setCollected((current) =>

      current.includes(id)

        ? current.filter((item) => item !== id)

        : [...current, id],

    );

  }

  function clearFilters() {

    setSearch("");

    setTrophyFilter("all");

    setCollectionFilter("all");

    setSortOrder("az");

  }

  const selectedImage = selectedSpell

    ? getImageForSpell(selectedSpell, images)

    : null;

  const selectedCategory = selectedSpell

    ? spellCategories.find(

        (item) => item.id === selectedSpell.category,

      )

    : null;

  return (

    <section

      dir="rtl"

      lang="fa"

      className="relative isolate min-h-[700px] overflow-hidden rounded-3xl border border-amber-100/10 bg-[#090a0d] text-stone-100"

    >

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

          right: -8rem;

          background: #b98232;

        }

        .spell-orb-two {

          left: -8rem;

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

        {/* سربرگ */}

        <header className="border-b border-amber-100/10 pb-6 text-center">

          <p

            dir="ltr"

            className="mb-3 text-xs tracking-[0.35em] text-amber-300/70"

          >

            DARK SOULS III · ARCHIVE

          </p>

          <h1

            dir="ltr"

            className="text-3xl font-black tracking-[0.12em] text-amber-100 sm:text-5xl"

          >

            SPELLS

          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-8 text-stone-400">

            آرشیو جادوهای دارک سولز ۳؛ جادوها را بررسی کن،

            محل پیدا کردنشان را بخوان و پیشرفت مجموعه‌ات را ثبت کن.

          </p>

          <div className="mx-auto mt-6 max-w-xl">

            <div className="mb-2 flex items-center justify-between gap-3 text-xs text-stone-400">

              <span>پیشرفت کلی مجموعه</span>

              <span className="whitespace-nowrap text-amber-200">

                {overallCollected} از {spells.length} · {progress}٪

              </span>

            </div>

            <div

              className="h-2 overflow-hidden rounded-full bg-white/10"

              role="progressbar"

              aria-valuemin={0}

              aria-valuemax={100}

              aria-valuenow={progress}

            >

              <div

                className="h-full rounded-full bg-gradient-to-l from-amber-700 via-amber-300 to-yellow-100 transition-all duration-700"

                style={{ width: `${progress}%` }}

              />

            </div>

          </div>

        </header>

        {/* دسته‌بندی‌ها با آیکون اختصاصی */}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

          {spellCategories.map((item) => {

            const active = category === item.id;

            const count = spells.filter(

              (spell) => spell.category === item.id,

            ).length;

            const owned = spells.filter(

              (spell) =>

                spell.category === item.id &&

                collected.includes(spell.id),

            ).length;

            const iconColor =

              item.id === "pyromancy"

                ? "text-orange-400"

                : item.id === "miracle"

                  ? "text-amber-200"

                  : "text-sky-300";

            return (

              <button

                key={item.id}

                type="button"

                onClick={() => setCategory(item.id)}

                aria-pressed={active}

                className={`group relative overflow-hidden rounded-2xl border p-5 text-right transition-all duration-300 hover:-translate-y-1 ${

                  active

                    ? "border-amber-300/60 bg-amber-200/[0.09] shadow-[0_0_35px_rgba(202,158,70,0.09)]"

                    : "border-white/10 bg-black/20 hover:border-amber-100/30"

                }`}

              >

<div className="flex flex-col items-center text-center">

  <div

    className={`relative mb-4 flex h-28 w-28 shrink-0 items-center justify-center transition duration-300 group-hover:scale-105 sm:h-32 sm:w-32 ${

      active ? "scale-105" : ""

    }`}

  >

    <div

      className={`absolute inset-2 rounded-full blur-2xl ${

        item.id === "pyromancy"

          ? "bg-orange-700/20"

          : item.id === "miracle"

            ? "bg-amber-300/20"

            : "bg-slate-300/20"

      }`}

    />

    <CategoryIcon

      category={item.id}

      className="relative z-10 h-full w-full drop-shadow-[0_0_12px_rgba(220,190,130,0.18)]"

    />

  </div>

  <h2

    dir="ltr"

    className="text-base font-bold tracking-wide text-amber-100 sm:text-lg"

  >

    {item.title}

  </h2>

  <p className="mt-2 text-sm text-stone-300">

    {item.fa}

  </p>

</div>

                <p className="mt-4 text-sm leading-7 text-stone-400">

                  {item.description}

                </p>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3 text-xs">

                  <span className="text-stone-400">{count} جادو</span>

                  <span className="text-amber-200">

                    {owned} از {count} جمع‌آوری‌شده

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

        {/* جست‌وجو و فیلترها */}

        <div className="space-y-4 rounded-2xl border border-white/10 bg-black/25 p-4">

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_190px_190px]">

            <label className="block">

              <span className="mb-2 block text-xs text-stone-300">

                جست‌وجو در جادوها

              </span>

              <input

                value={search}

                onChange={(event) => setSearch(event.target.value)}

                placeholder="نام جادو، توضیحات یا محل پیدا کردن..."

                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-right text-sm outline-none transition placeholder:text-stone-600 focus:border-amber-300/50"

              />

            </label>

            <label className="block">

              <span className="mb-2 block text-xs text-stone-300">

                وضعیت تروفی

              </span>

              <select

                value={trophyFilter}

                onChange={(event) =>

                  setTrophyFilter(event.target.value as TrophyFilter)

                }

                className="w-full rounded-xl border border-white/10 bg-[#111216] px-3 py-3 text-sm outline-none focus:border-amber-300/50"

              >

                <option value="all">همهٔ جادوها</option>

                <option value="trophy">موردنیاز برای تروفی</option>

                <option value="no-trophy">غیرضروری برای تروفی</option>

              </select>

            </label>

            <label className="block">

              <span className="mb-2 block text-xs text-stone-300">

                وضعیت مجموعه

              </span>

              <select

                value={collectionFilter}

                onChange={(event) =>

                  setCollectionFilter(

                    event.target.value as CollectionFilter,

                  )

                }

                className="w-full rounded-xl border border-white/10 bg-[#111216] px-3 py-3 text-sm outline-none focus:border-amber-300/50"

              >

                <option value="all">همه</option>

                <option value="collected">جمع‌آوری‌شده‌ها</option>

                <option value="missing">موارد باقی‌مانده</option>

              </select>

            </label>

          </div>

          <div className="flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center">

            <p className="text-sm text-stone-400">

              نمایش{" "}

              <span className="font-semibold text-amber-200">

                {categorySpells.length}

              </span>{" "}

              از {totalInCategory} جادو

              <span className="mx-2 text-stone-600">|</span>

              {collectedInCategory} مورد جمع‌آوری‌شده

            </p>

            <div className="flex flex-wrap gap-2">

              <button

                type="button"

                onClick={() =>

                  setSortOrder((value) =>

                    value === "az" ? "za" : "az",

                  )

                }

                className="rounded-lg border border-white/10 px-3 py-2 text-xs text-stone-300 hover:border-amber-200/40 hover:text-amber-100"

              >

                مرتب‌سازی: {sortOrder === "az" ? "الف تا ی" : "ی تا الف"}

              </button>

              <button

                type="button"

                onClick={() => setView("grid")}

                aria-pressed={view === "grid"}

                className={`rounded-lg border px-3 py-2 text-xs ${

                  view === "grid"

                    ? "border-amber-200/50 bg-amber-200/10 text-amber-100"

                    : "border-white/10 text-stone-400"

                }`}

              >

                نمای کارتی

              </button>

              <button

                type="button"

                onClick={() => setView("list")}

                aria-pressed={view === "list"}

                className={`rounded-lg border px-3 py-2 text-xs ${

                  view === "list"

                    ? "border-amber-200/50 bg-amber-200/10 text-amber-100"

                    : "border-white/10 text-stone-400"

                }`}

              >

                نمای فهرستی

              </button>

              <button

                type="button"

                onClick={clearFilters}

                className="rounded-lg border border-white/10 px-3 py-2 text-xs text-stone-400 hover:border-red-300/30 hover:text-red-200"

              >

                پاک‌کردن فیلترها

              </button>

            </div>

          </div>

        </div>

        {imageError && (

          <p

            role="status"

            className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-sm leading-7 text-amber-100/80"

          >

            {imageError}

          </p>

        )}

        {loadingImages && (

          <p

            role="status"

            className="animate-pulse py-3 text-center text-sm text-stone-500"

          >

            در حال دریافت تصاویر جادوها...

          </p>

        )}

        {/* کارت‌های جادو */}

        {categorySpells.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-white/15 px-5 py-16 text-center">

            <CategoryIcon

              category={category}

              className="mx-auto h-14 w-14 text-amber-200/60"

            />

            <h3 className="mt-4 text-lg font-bold text-stone-200">

              جادویی پیدا نشد

            </h3>

            <p className="mt-2 text-sm leading-7 text-stone-500">

              با این جست‌وجو یا فیلترها موردی پیدا نشد؛

              یا هنوز اطلاعاتی برای این دسته ثبت نشده است.

            </p>

            <button

              type="button"

              onClick={clearFilters}

              className="mt-5 rounded-xl border border-amber-200/30 px-4 py-2 text-sm text-amber-100 hover:bg-amber-200/10"

            >

              پاک‌کردن جست‌وجو و فیلترها

            </button>

          </div>

        ) : (

          <div

            className={

              view === "grid"

                ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

                : "flex flex-col gap-3"

            }

          >

            {categorySpells.map((spell) => {

              const image = getImageForSpell(spell, images);

              const isCollected = collected.includes(spell.id);

              return (

                <article

                  key={spell.id}

                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#101115]/90 transition-all duration-300 hover:border-amber-200/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] ${

                    view === "list"

                      ? "flex flex-row items-center gap-4 p-3 sm:p-4"

                      : "flex flex-col"

                  }`}

                >

                  <button

                    type="button"

                    onClick={() => setSelectedSpell(spell)}

                    aria-label={`نمایش جزئیات ${spell.name}`}

                    className={`relative block shrink-0 overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(202,158,70,0.10),rgba(0,0,0,0.35)_70%)] ${

                      view === "list"

                        ? "h-24 w-24 rounded-xl sm:h-28 sm:w-28"

                        : "aspect-[5/4] w-full border-b border-amber-100/10 sm:aspect-[4/3]"

                    }`}

                  >

                    {image ? (

                      <img

                        src={image}

                        alt={`تصویر ${spell.name}`}

                        loading="lazy"

                        onError={(event) => {

                          event.currentTarget.style.display = "none";

                        }}

                        className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105 sm:p-7"

                      />

                    ) : (

                      <div className="flex h-full w-full items-center justify-center">

                        <CategoryIcon

                          category={spell.category}

                          className="h-14 w-14 text-amber-200/50"

                        />

                      </div>

                    )}

                    <span className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/50 to-transparent" />

                  </button>

                  <div className="flex min-w-0 flex-1 flex-col p-4">

                    <div className="mb-3 flex flex-wrap gap-1.5">

                      {spell.trophyRequired && (

                        <span className="rounded-md border border-amber-200/20 bg-amber-200/10 px-2 py-1 text-[10px] font-bold text-amber-200">

                          موردنیاز تروفی

                        </span>

                      )}

                      {spell.dlc && (

                        <span className="rounded-md border border-violet-300/20 bg-violet-300/10 px-2 py-1 text-[10px] text-violet-200">

                          بستهٔ الحاقی

                        </span>

                      )}

                    </div>

                    <button

                      type="button"

                      onClick={() => setSelectedSpell(spell)}

                      dir="ltr"

                      className="text-right text-base font-bold leading-6 text-stone-100 hover:text-amber-200"

                    >

                      {spell.name}

                    </button>

                    <p className="mt-2 line-clamp-3 text-sm leading-7 text-stone-400">

                      {spell.description}

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-400">

                      {spell.fpCost !== null && (

                        <span className="rounded-md bg-white/5 px-2 py-1">

                          تمرکز: {spell.fpCost}

                        </span>

                      )}

                      {spell.slots !== null && (

                        <span className="rounded-md bg-white/5 px-2 py-1">

                          جایگاه: {spell.slots}

                        </span>

                      )}

                      {spell.intelligence !== null && (

                        <span className="rounded-md bg-white/5 px-2 py-1">

                          هوش: {spell.intelligence}

                        </span>

                      )}

                      {spell.faith !== null && spell.faith > 0 && (

                        <span className="rounded-md bg-white/5 px-2 py-1">

                          ایمان: {spell.faith}

                        </span>

                      )}

                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">

                      <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-300">

                        <input

                          type="checkbox"

                          checked={isCollected}

                          onChange={() => toggleCollected(spell.id)}

                          className="h-4 w-4 accent-amber-300"

                        />

                        <span>

                          {isCollected

                            ? "جمع‌آوری شده"

                            : "علامت‌گذاری به‌عنوان جمع‌آوری‌شده"}

                        </span>

                      </label>

                      <button

                        type="button"

                        onClick={() => setSelectedSpell(spell)}

                        className="shrink-0 text-xs text-amber-200/80 hover:text-amber-100"

                      >

                        جزئیات ←

                      </button>

                    </div>

                  </div>

                </article>

              );

            })}

          </div>

        )}

      </div>

      {/* پنجره جزئیات */}

      {selectedSpell && (

        <div

          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/85 p-3 backdrop-blur-sm sm:p-5"

          onClick={() => setSelectedSpell(null)}

          role="presentation"

        >

          <section

            role="dialog"

            aria-modal="true"

            aria-labelledby="spell-modal-title"

            className="relative my-auto max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-amber-200/20 bg-[#101115] shadow-2xl"

            onClick={(event) => event.stopPropagation()}

          >

            <div className="sticky top-0 z-10 h-1 bg-gradient-to-l from-transparent via-amber-300 to-transparent" />

            <button

              type="button"

              onClick={() => setSelectedSpell(null)}

              className="absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-black/70 px-3 py-2 text-sm text-stone-300 hover:text-white"

              aria-label="بستن جزئیات جادو"

            >

              ✕

            </button>

            <div className="grid sm:grid-cols-[minmax(220px,0.8fr)_1.2fr]">

              <div className="flex min-h-56 items-center justify-center border-b border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(202,158,70,0.10),rgba(0,0,0,0.35)_70%)] p-8 sm:border-b-0 sm:border-l">

                {selectedImage ? (

                  <img

                    src={selectedImage}

                    alt={`تصویر ${selectedSpell.name}`}

                    onError={(event) => {

                      event.currentTarget.style.display = "none";

                    }}

                    className="max-h-72 w-full object-contain"

                  />

                ) : (

                  <CategoryIcon

                    category={selectedSpell.category}

                    className="h-20 w-20 text-amber-200/50"

                  />

                )}

              </div>

              <div className="p-5 sm:p-7">

                <p

                  dir="ltr"

                  className="text-right text-xs tracking-[0.2em] text-amber-300/70"

                >

                  {selectedCategory?.title}

                </p>

                <h2

                  id="spell-modal-title"

                  dir="ltr"

                  className="mt-2 pl-8 text-right text-2xl font-black leading-9 text-amber-100"

                >

                  {selectedSpell.name}

                </h2>

                <p className="mt-4 text-sm leading-8 text-stone-300">

                  {selectedSpell.description}

                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">

                  {[

                    ["هزینهٔ تمرکز", selectedSpell.fpCost],

                    ["جایگاه موردنیاز", selectedSpell.slots],

                    ["نیازمندی هوش", selectedSpell.intelligence],

                    ["نیازمندی ایمان", selectedSpell.faith],

                  ].map(([label, value]) => (

                    <div

                      key={String(label)}

                      className="rounded-xl border border-white/10 bg-black/20 p-3"

                    >

                      <p className="text-xs text-stone-400">{label}</p>

                      <p className="mt-1 text-base font-bold text-amber-100">

                        {value === null || value === 0 ? "—" : value}

                      </p>

                    </div>

                  ))}

                </div>

                <div className="mt-5 space-y-4 text-sm">

                  <div>

                    <p className="text-xs text-stone-500">

                      روش به‌دست‌آوردن

                    </p>

                    <p className="mt-1 leading-7 text-stone-200">

                      {selectedSpell.source || "هنوز ثبت نشده است"}

                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-stone-500">

                      محل پیدا کردن / شرایط

                    </p>

                    <p className="mt-1 leading-7 text-stone-300">

                      {selectedSpell.location ||

                        "اطلاعات این بخش هنوز ثبت نشده است."}

                    </p>

                  </div>

                  {selectedSpell.notes && (

                    <div>

                      <p className="text-xs text-stone-500">

                        یادداشت‌ها

                      </p>

                      <p className="mt-1 leading-7 text-stone-300">

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

                      ? "برای تروفی لازم است"

                      : "برای تروفی لازم نیست"}

                  </span>

                  <button

                    type="button"

                    onClick={() => toggleCollected(selectedSpell.id)}

                    className="rounded-xl border border-amber-200/30 bg-amber-200/10 px-4 py-2 text-sm text-amber-100 hover:bg-amber-200/20"

                  >

                    {collected.includes(selectedSpell.id)

                      ? "✓ جمع‌آوری شده"

                      : "+ ثبت در مجموعه"}

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
