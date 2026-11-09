"use client";

import { useMemo, useState } from "react";
import {
  allArchiveItems,
  bosses,
  type ArchiveCategory,
  type ArchiveItem,
} from "./data";

const journey = [
  "Undead Asylum",
  "Firelink Shrine",
  "Undead Burg",
  "Undead Parish",
  "The Depths",
  "Blighttown",
  "Sen's Fortress",
  "Anor Londo",
  "Duke's Archives",
  "New Londo Ruins",
  "Demon Ruins",
  "Lost Izalith",
  "Kiln of the First Flame",
];

const lore = [
  "The First Flame",
  "Gwyn, Lord of Cinder",
  "Nito",
  "The Witch of Izalith",
  "Seath the Scaleless",
  "The Age of Fire",
  "The Age of Dark",
  "Artorias the Abysswalker",
  "The Abyss",
];

const categories: {
  id: ArchiveCategory;
  label: string;
  icon: string;
}[] = [
  {
    id: "weapons",
    label: "WEAPONS",
    icon: "⚔",
  },
  {
    id: "shields",
    label: "SHIELDS",
    icon: "🛡",
  },
  {
    id: "armor",
    label: "ARMOR",
    icon: "♜",
  },
  {
    id: "rings",
    label: "RINGS",
    icon: "◉",
  },
  {
    id: "sorceries",
    label: "SORCERIES",
    icon: "✦",
  },
  {
    id: "pyromancies",
    label: "PYROMANCIES",
    icon: "🔥",
  },
  {
    id: "miracles",
    label: "MIRACLES",
    icon: "☀",
  },
  {
    id: "items",
    label: "ITEMS",
    icon: "◆",
  },
];

export default function DarkSouls1Page() {
  const [selectedCategory, setSelectedCategory] =
    useState<ArchiveCategory>("weapons");

  const [selectedItem, setSelectedItem] =
    useState<ArchiveItem | null>(null);

  const [search, setSearch] = useState("");

  const [journeyProgress, setJourneyProgress] =
    useState(7);

  const currentItems = useMemo(() => {
    let source = allArchiveItems.filter(
      (item) => item.category === selectedCategory
    );

    if (search.trim()) {
      const query = search.toLowerCase().trim();

      source = source.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.subtitle.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags?.some((tag) =>
            tag.toLowerCase().includes(query)
          )
      );
    }

    return source;
  }, [selectedCategory, search]);

  const progress = Math.round(
    (journeyProgress / journey.length) * 100
  );

  function openItem(item: ArchiveItem) {
    setSelectedItem(item);

    setTimeout(() => {
      document
        .getElementById("selected-item")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 50);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/images/darksouls1-hero.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-black/70" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/20 to-[#050505]" />

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c8a15b]/10 blur-[140px]" />

        <div className="relative z-10 px-6 text-center">

          <p className="text-[9px] tracking-[0.7em] text-[#c8a15b] sm:text-xs">
            THE AGE OF FIRE
          </p>

          <h1 className="mt-7 text-5xl font-black tracking-[0.08em] sm:text-7xl md:text-9xl">
            DARK SOULS
          </h1>

          <div className="mx-auto mt-6 h-px w-32 bg-[#c8a15b]" />

          <h2 className="mt-6 text-xl tracking-[0.6em] text-[#c8a15b] sm:text-3xl">
            LORDRAN
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-sm leading-8 text-white/40">
            Explore the world, discover its secrets, forge your build
            and uncover the history buried beneath the fading flame.
          </p>

          <a
            href="#world"
            className="mt-12 inline-flex h-28 w-28 items-center justify-center rounded-full border border-[#c8a15b]/60 transition duration-700 hover:scale-110 hover:border-[#c8a15b] hover:shadow-[0_0_80px_rgba(200,161,91,0.3)]"
          >
            <div>
              <p className="text-[8px] tracking-[0.35em] text-[#c8a15b]">
                ENTER
              </p>

              <p className="mt-2 text-[8px] tracking-[0.25em] text-white/40">
                LORDRAN
              </p>
            </div>
          </a>

        </div>
      </section>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="sticky top-0 z-50 border-y border-white/10 bg-[#050505]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3">

          {[
            ["WORLD", "#world"],
            ["JOURNEY", "#journey"],
            ["BOSSES", "#bosses"],
            ["ARSENAL", "#archive"],
            ["MAGIC", "#archive"],
            ["LORE", "#lore"],
            ["BUILDS", "#builds"],
            ["COMMUNITY", "#community"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="shrink-0 px-4 py-3 text-[8px] tracking-[0.3em] text-white/40 transition hover:text-[#c8a15b]"
            >
              {label}
            </a>
          ))}

        </div>

      </nav>


      {/* =====================================================
          SOUL PROFILE
      ===================================================== */}

      <section className="border-b border-white/5 bg-[#070707] px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">

            <div className="border border-[#c8a15b]/20 bg-[#0a0a0a] p-8 sm:p-12">

              <p className="text-[8px] tracking-[0.5em] text-[#c8a15b]">
                SOUL PROFILE
              </p>

              <h2 className="mt-4 text-4xl font-black">
                Nobody
              </h2>

              <p className="mt-2 text-xs text-white/25">
                SOUL TRAVELER
              </p>

              <div className="mt-10 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">

                <ProfileStat
                  number="27"
                  label="SOUL LEVEL"
                />

                <ProfileStat
                  number="84"
                  label="BOSSES"
                />

                <ProfileStat
                  number="31"
                  label="ACHIEVEMENTS"
                />

                <ProfileStat
                  number="67%"
                  label="LORE"
                />

              </div>

            </div>


            <div className="border border-white/10 bg-[#0a0a0a] p-8">

              <p className="text-[8px] tracking-[0.4em] text-[#c8a15b]">
                GATE RANK
              </p>

              <div className="mt-7 flex items-center gap-5">

                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#c8a15b]/40">

                  <span className="text-3xl font-black text-[#c8a15b]">
                    27
                  </span>

                </div>

                <div>

                  <h3 className="font-black">
                    SOUL TRAVELER
                  </h3>

                  <p className="mt-2 text-xs text-white/25">
                    Continue your journey.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          WORLD
      ===================================================== */}

      <section
        id="world"
        className="border-b border-white/5 bg-[#080808] px-6 py-28"
      >

        <div className="mx-auto max-w-7xl">

          <p className="text-[8px] tracking-[0.5em] text-[#c8a15b]">
            EXPLORE LORDRAN
          </p>

          <h2 className="mt-4 text-4xl font-black sm:text-6xl">
            THE WORLD
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-8 text-white/30">
            Explore the interconnected world of Lordran. Discover areas,
            shortcuts, bonfires, bosses and hidden paths.
          </p>

          {/* INTERACTIVE LORDRAN MAP */}

          

        </div>

      </section>


      {/* =====================================================
          SOUL JOURNEY
      ===================================================== */}

      <section
        id="journey"
        className="border-b border-white/5 bg-[#050505] px-6 py-28"
      >

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div>

              <p className="text-[8px] tracking-[0.5em] text-[#c8a15b]">
                YOUR PATH
              </p>

              <h2 className="mt-4 text-4xl font-black sm:text-6xl">
                SOUL JOURNEY
              </h2>

            </div>

            <div className="md:text-right">

              <p className="text-5xl font-black text-[#c8a15b]">
                {progress}%
              </p>

              <p className="mt-2 text-[8px] tracking-[0.3em] text-white/25">
                LORDRAN DISCOVERED
              </p>

            </div>

          </div>


          <div className="mt-12 border border-white/10 bg-[#090909] p-6 sm:p-10">

            <div className="h-1 bg-white/5">

              <div
                className="h-full bg-[#c8a15b] transition-all duration-700"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>


            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {journey.map((area, index) => {

                const completed =
                  index < journeyProgress;

                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() =>
                      setJourneyProgress(
                        completed
                          ? index
                          : index + 1
                      )
                    }
                    className={`group flex items-center gap-4 border p-5 text-left transition ${
                      completed
                        ? "border-[#c8a15b]/30 bg-[#c8a15b]/5"
                        : "border-white/5 bg-[#080808] hover:border-white/10"
                    }`}
                  >

                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[9px] ${
                        completed
                          ? "border-[#c8a15b] bg-[#c8a15b] text-black"
                          : "border-white/10 text-white/20"
                      }`}
                    >
                      {completed ? "✓" : index + 1}
                    </span>

                    <span
                      className={`text-xs ${
                        completed
                          ? "text-white"
                          : "text-white/30"
                      }`}
                    >
                      {area}
                    </span>

                  </button>
                );
              })}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          BOSS ARCHIVE
      ===================================================== */}

      <section
        id="bosses"
        className="border-b border-white/5 bg-[#080808] px-6 py-28"
      >

        <div className="mx-auto max-w-7xl">

          <p className="text-[8px] tracking-[0.5em] text-[#c8a15b]">
            FACE THE LORDS
          </p>

          <h2 className="mt-4 text-4xl font-black sm:text-6xl">
            BOSS ARCHIVE
          </h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {bosses.map((boss) => (
              <div
                key={boss.name}
                className="group border border-white/10 bg-[#090909] p-7 transition hover:border-[#c8a15b]/30"
              >

                <p className="text-[8px] tracking-[0.3em] text-[#c8a15b]">
                  {boss.location}
                </p>

                <h3 className="mt-4 text-xl font-black">
                  {boss.name}
                </h3>

                <div className="mt-5 flex gap-1">

                  {"★★★★★"
                    .split("")
                    .map((star, index) => (
                      <span
                        key={index}
                        className={
                          index < boss.difficulty
                            ? "text-[#c8a15b]"
                            : "text-white/10"
                        }
                      >
                        {star}
                      </span>
                    ))}

                </div>

                <div className="mt-7 space-y-3 border-t border-white/5 pt-5">

                  <BossInfo
                    label="LOCATION"
                    value={boss.location}
                  />

                  <BossInfo
                    label="DIFFICULTY"
                    value={`${boss.difficulty}/5`}
                  />

                </div>

                <button
                  type="button"
                  className="mt-7 text-[8px] tracking-[0.3em] text-white/30 transition hover:text-[#c8a15b]"
                >
                  VIEW PROFILE →
                </button>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          COMPLETE ARCHIVE
      ===================================================== */}

      <section
        id="archive"
        className="border-b border-white/5 bg-[#050505] px-6 py-28"
      >

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">

            <div>

              <p className="text-[8px] tracking-[0.5em] text-[#c8a15b]">
                THE LORDRAN DATABASE
              </p>

              <h2 className="mt-4 text-4xl font-black sm:text-6xl">
                THE ARCHIVE
              </h2>

            </div>

            <div className="relative">

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="SEARCH THE ARCHIVE..."
                className="w-full border border-white/10 bg-[#090909] px-5 py-4 text-[9px] tracking-[0.2em] text-white outline-none placeholder:text-white/20 focus:border-[#c8a15b]/50 md:w-80"
              />

            </div>

          </div>


          {/* CATEGORY BUTTONS */}

          <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">

            {categories.map((category) => {

              const active =
                selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSelectedItem(null);
                    setSearch("");
                  }}
                  className={`group border p-5 transition ${
                    active
                      ? "border-[#c8a15b] bg-[#c8a15b]/10"
                      : "border-white/5 bg-[#090909] hover:border-white/15"
                  }`}
                >

                  <div
                    className={`text-xl ${
                      active
                        ? "text-[#c8a15b]"
                        : "text-white/30"
                    }`}
                  >
                    {category.icon}
                  </div>

                  <p
                    className={`mt-3 text-[7px] tracking-[0.2em] ${
                      active
                        ? "text-[#c8a15b]"
                        : "text-white/30"
                    }`}
                  >
                    {category.label}
                  </p>

                </button>
              );
            })}

          </div>


          {/* ITEMS */}

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {currentItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openItem(item)}
                className={`group text-left ${
                  selectedItem?.id === item.id
                    ? "ring-1 ring-[#c8a15b]"
                    : ""
                }`}
              >

                <div className="border border-white/10 bg-[#090909] p-6 transition duration-300 hover:border-[#c8a15b]/40 hover:bg-[#0c0c0c]">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <p className="text-[7px] tracking-[0.3em] text-[#c8a15b]">
                        {item.subtitle}
                      </p>

                      <h3 className="mt-3 text-lg font-black">
                        {item.name}
                      </h3>

                    </div>

                    <span className="text-white/10 transition group-hover:text-[#c8a15b]">
                      +
                    </span>

                  </div>

                  <p className="mt-5 line-clamp-3 text-xs leading-6 text-white/25">
                    {item.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-1">

                    {item.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="border border-white/5 px-2 py-1 text-[6px] tracking-[0.15em] text-white/20"
                      >
                        {tag}
                      </span>
                    ))}

                  </div>

                </div>

              </button>
            ))}

          </div>


          {/* NO RESULTS */}

          {currentItems.length === 0 && (
            <div className="mt-8 border border-white/5 bg-[#090909] p-16 text-center">

              <p className="text-sm text-white/25">
                No knowledge found in the archive.
              </p>

            </div>
          )}


          {/* =================================================
              SELECTED ITEM
          ================================================= */}

          {selectedItem && (
            <div
              id="selected-item"
              className="mt-10 overflow-hidden border border-[#c8a15b]/30 bg-[#090909]"
            >

              <div className="grid lg:grid-cols-[0.8fr_1.2fr]">

                {/* IMAGE / SYMBOL */}

                <div className="relative flex min-h-[300px] items-center justify-center border-b border-white/5 bg-[#070707] lg:border-b-0 lg:border-r">

                  <div className="absolute h-56 w-56 rounded-full border border-[#c8a15b]/10" />

                  <div className="absolute h-40 w-40 rounded-full border border-[#c8a15b]/20" />

                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[#c8a15b]/40 bg-[#0b0b0b] text-4xl text-[#c8a15b] shadow-[0_0_70px_rgba(200,161,91,0.12)]">

                    {selectedCategory === "weapons" && "⚔"}
                    {selectedCategory === "shields" && "🛡"}
                    {selectedCategory === "armor" && "♜"}
                    {selectedCategory === "rings" && "◉"}
                    {selectedCategory === "sorceries" && "✦"}
                    {selectedCategory === "pyromancies" && "🔥"}
                    {selectedCategory === "miracles" && "☀"}
                    {selectedCategory === "items" && "◆"}

                  </div>

                </div>


                {/* DETAILS */}

                <div className="p-7 sm:p-10">

                  <div className="flex items-start justify-between gap-6">

                    <div>

                      <p className="text-[8px] tracking-[0.4em] text-[#c8a15b]">
                        {selectedItem.subtitle}
                      </p>

                      <h3 className="mt-3 text-3xl font-black sm:text-4xl">
                        {selectedItem.name}
                      </h3>

                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedItem(null)}
                      className="text-xl text-white/20 transition hover:text-white"
                    >
                      ×
                    </button>

                  </div>


                  <div className="mt-7 h-px bg-white/5" />


                  <p className="mt-7 max-w-3xl text-sm leading-8 text-white/45">
                    {selectedItem.description}
                  </p>


                  {selectedItem.stats && (
                    <div className="mt-8 grid grid-cols-2 gap-px border border-white/5 bg-white/5 sm:grid-cols-4">

                      {selectedItem.stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-[#0b0b0b] p-5"
                        >

                          <p className="text-[7px] tracking-[0.2em] text-white/20">
                            {stat.label}
                          </p>

                          <p className="mt-2 text-sm font-bold text-[#c8a15b]">
                            {stat.value}
                          </p>

                        </div>
                      ))}

                    </div>
                  )}


                  <div className="mt-8 grid gap-5 sm:grid-cols-2">

                    <DetailBox
                      label="LOCATION"
                      value={selectedItem.location}
                    />

                    {selectedItem.requirements && (
                      <DetailBox
                        label="REQUIREMENTS"
                        value={selectedItem.requirements}
                      />
                    )}

                    {selectedItem.effect && (
                      <DetailBox
                        label="EFFECT"
                        value={selectedItem.effect}
                      />
                    )}

                  </div>


                  {selectedItem.tags && (
                    <div className="mt-8 flex flex-wrap gap-2">

                      {selectedItem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-[#c8a15b]/20 px-3 py-2 text-[7px] tracking-[0.2em] text-[#c8a15b]/70"
                        >
                          {tag}
                        </span>
                      ))}

                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

        </div>

      </section>


      {/* =====================================================
          BUILDS
      ===================================================== */}

      <section
        id="builds"
        className="border-b border-white/5 bg-[#080808] px-6 py-28"
      >

        <div className="mx-auto max-w-7xl">

          <p className="text-[8px] tracking-[0.5em] text-[#c8a15b]">
            FORGED BY PLAYERS
          </p>

          <h2 className="mt-4 text-4xl font-black sm:text-6xl">
            BUILD LIBRARY
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-3">

            <BuildCard
              name="DARK KNIGHT"
              level="90"
              type="STRENGTH"
              weapon="Black Knight Halberd"
            />

            <BuildCard
              name="ARTORIAS"
              level="80"
              type="QUALITY"
              weapon="Greatsword"
            />

            <BuildCard
              name="SUN WARRIOR"
              level="60"
              type="FAITH"
              weapon="Sunlight Straight Sword"
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          LORE
      ===================================================== */}

      <section
        id="lore"
        className="border-b border-white/5 bg-[#050505] px-6 py-28"
      >

        <div className="mx-auto max-w-7xl">

          <p className="text-[8px] tracking-[0.5em] text-[#c8a15b]">
            DISCOVER THE TRUTH
          </p>

          <h2 className="mt-4 text-4xl font-black sm:text-6xl">
            LORE LIBRARY
          </h2>

          <div className="mt-12 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">

            {lore.map((entry, index) => (
              <button
                key={entry}
                type="button"
                className="group bg-[#090909] p-8 text-left transition hover:bg-[#0d0d0d]"
              >

                <p className="text-[7px] tracking-[0.3em] text-[#c8a15b]">
                  LORE {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-4 text-xl font-black transition group-hover:text-[#c8a15b]">
                  {entry}
                </h3>

                <p className="mt-3 text-xs text-white/20">
                  Explore the hidden history.
                </p>

              </button>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          COMMUNITY
      ===================================================== */}

      <section
        id="community"
        className="border-b border-white/5 bg-[#080808] px-6 py-28"
      >

        <div className="mx-auto max-w-7xl">

          <p className="text-[8px] tracking-[0.5em] text-[#c8a15b]">
            BEYOND THE WIKI
          </p>

          <h2 className="mt-4 text-4xl font-black sm:text-6xl">
            COMMUNITY
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-3">

            <CommunityCard
              title="DISCUSSIONS"
              text="Talk about bosses, lore, builds and secrets."
            />

            <CommunityCard
              title="SHOWCASE"
              text="Share your characters, builds and achievements."
            />

            <CommunityCard
              title="CHALLENGES"
              text="Take part in Souls Gate community challenges."
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          EVENT
      ===================================================== */}

      <section className="bg-black px-6 py-32">

        <div className="mx-auto max-w-4xl border border-[#c8a15b]/20 bg-[#080808] p-10 text-center sm:p-16">

          <p className="text-[8px] tracking-[0.5em] text-[#c8a15b]">
            SOULS GATE EVENT
          </p>

          <h2 className="mt-5 text-4xl font-black sm:text-6xl">
            THE FIRST FLAME
          </h2>

          <div className="mx-auto mt-10 flex h-24 w-24 items-center justify-center rounded-full border border-[#c8a15b]/30 text-4xl">
            🔥
          </div>

          <p className="mt-8 text-[8px] tracking-[0.4em] text-white/25">
            COMPLETE DARK SOULS I
          </p>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/5 px-6 py-12">

        <div className="mx-auto max-w-7xl text-center">

          <p className="font-black tracking-[0.3em]">
            SOULS <span className="text-[#c8a15b]">GATE</span>
          </p>

          <p className="mt-3 text-[8px] tracking-[0.3em] text-white/20">
            DARK SOULS I — LORDRAN
          </p>

        </div>

      </footer>

    </main>
  );
}


/* ============================================================
   SMALL COMPONENTS
============================================================ */

function ProfileStat({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="bg-[#0b0b0b] p-5 text-center">

      <p className="text-2xl font-black text-[#c8a15b]">
        {number}
      </p>

      <p className="mt-2 text-[6px] tracking-[0.25em] text-white/20">
        {label}
      </p>

    </div>
  );
}


function BossInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-5">

      <span className="text-[7px] tracking-[0.2em] text-white/20">
        {label}
      </span>

      <span className="text-right text-[9px] text-white/50">
        {value}
      </span>

    </div>
  );
}


function DetailBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-white/5 bg-[#0b0b0b] p-5">

      <p className="text-[7px] tracking-[0.25em] text-white/20">
        {label}
      </p>

      <p className="mt-3 text-xs leading-6 text-white/50">
        {value}
      </p>

    </div>
  );
}


function BuildCard({
  name,
  level,
  type,
  weapon,
}: {
  name: string;
  level: string;
  type: string;
  weapon: string;
}) {
  return (
    <div className="border border-white/10 bg-[#090909] p-7 transition hover:border-[#c8a15b]/30">

      <p className="text-[7px] tracking-[0.3em] text-[#c8a15b]">
        LEVEL {level}
      </p>

      <h3 className="mt-4 text-2xl font-black">
        {name}
      </h3>

      <p className="mt-2 text-[8px] tracking-[0.25em] text-white/25">
        {type}
      </p>

      <div className="mt-7 border-t border-white/5 pt-5">

        <p className="text-[7px] text-white/20">
          MAIN WEAPON
        </p>

        <p className="mt-2 text-sm">
          {weapon}
        </p>

      </div>

      <button
        type="button"
        className="mt-7 text-[7px] tracking-[0.3em] text-[#c8a15b]"
      >
        VIEW BUILD →
      </button>

    </div>
  );
}


function CommunityCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="border border-white/10 bg-[#090909] p-8 transition hover:border-[#c8a15b]/30">

      <p className="text-[7px] tracking-[0.35em] text-[#c8a15b]">
        {title}
      </p>

      <p className="mt-7 text-sm leading-7 text-white/40">
        {text}
      </p>

      <button
        type="button"
        className="mt-8 text-[7px] tracking-[0.3em] text-white/20 hover:text-[#c8a15b]"
      >
        ENTER →
      </button>

    </div>
  );
}