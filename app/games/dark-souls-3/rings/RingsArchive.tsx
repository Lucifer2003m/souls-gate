"use client";

import { useEffect, useMemo, useState } from "react";
import { ringDetails } from "./ring-details";

type RingImage = {

  file: string;

  url: string | null;

  error: string | null;

};



type Ring = {

  name: string;

  fa: string;

  file: string;

  url: string | null;

  trophyRequired: boolean;

};



type RingImageResponse = {

  count: number;

  rings: RingImage[];

  error?: string;

};



const STORAGE_KEY = "souls-gate-ds3-collected-rings";



const translations: Record<string, string> = {

  "Life Ring": "رینگ سلامتی",

  "Dusk Crown Ring": "رینگ تاج غروب",

  "Flynn's Ring": "رینگ فلین",

  "Magic Clutch Ring": "رینگ چنگ جادو",

  "Lightning Clutch Ring": "رینگ چنگ صاعقه",

  "Fire Clutch Ring": "رینگ چنگ آتش",

  "Dark Clutch Ring": "رینگ چنگ تاریکی",

  "Red Tearstone Ring": "رینگ اشک‌سنگ سرخ",

  "Blue Tearstone Ring": "رینگ اشک‌سنگ آبی",

  "Silvercat Ring": "رینگ گربه‌ی نقره‌ای",

  "Chloranthy Ring": "رینگ کلورانتی",

  "Havel's Ring": "رینگ هاول",

  "Ring of Favor": "رینگ لطف",

  "Ring of Steel Protection": "رینگ محافظت فولادی",

  "Magic Stoneplate Ring": "رینگ صفحه‌سنگی جادو",

  "Flame Stoneplate Ring": "رینگ صفحه‌سنگی آتش",

  "Thunder Stoneplate Ring": "رینگ صفحه‌سنگی صاعقه",

  "Dark Stoneplate Ring": "رینگ صفحه‌سنگی تاریکی",

  "Speckled Stoneplate Ring": "رینگ صفحه‌سنگی خال‌دار",

  "Bloodbite Ring": "رینگ مقاومت در برابر خون‌ریزی",

  "Poisonbite Ring": "رینگ مقاومت در برابر سم",

  "Cursebite Ring": "رینگ مقاومت در برابر نفرین",

  "Fleshbite Ring": "رینگ مقاومت در برابر وضعیت‌های منفی",

  "Chillbite Ring": "رینگ مقاومت در برابر سرما",

  "Wood Grain Ring": "رینگ دانه‌های چوب",

  "Knight's Ring": "رینگ شوالیه",

  "Hunter's Ring": "رینگ شکارچی",

  "Scholar Ring": "رینگ دانشمند",

  "Priestess Ring": "رینگ کاهنه",

  "Covetous Gold Serpent Ring": "رینگ مار طلایی طمع‌کار",

  "Covetous Silver Serpent Ring": "رینگ مار نقره‌ای طمع‌کار",

  "Lingering Dragoncrest Ring": "رینگ نشان اژدها با ماندگاری",

  "Sage Ring": "رینگ فرزانه",

  "Slumbering Dragoncrest Ring": "رینگ نشان اژدهای خفته",

  "Saint's Ring": "رینگ قدیس",

  "Deep Ring": "رینگ اعماق",

  "Darkmoon Ring": "رینگ دارک‌مون",

  "Leo Ring": "رینگ لئو",

  "Wolf Ring": "رینگ گرگ",

  "Hawk Ring": "رینگ شاهین",

  "Hornet Ring": "رینگ زنبور سرخ",

  "Farron Ring": "رینگ فارون",

  "Prisoner's Chain": "زنجیر زندانی",

  "Pontiff's Right Eye": "چشم راست پونتیف",

  "Pontiff's Left Eye": "چشم چپ پونتیف",

  "Aldrich's Ruby": "یاقوت آلدریچ",

  "Aldrich's Sapphire": "یاقوت کبود آلدریچ",

  "Lloyd's Sword Ring": "رینگ شمشیر لوید",

  "Lloyd's Shield Ring": "رینگ سپر لوید",

  "Carthus Milkring": "رینگ شیر کارثوس",

  "Carthus Bloodring": "رینگ خون کارثوس",

  "Reversal Ring": "رینگ وارونگی",

  "Untrue Dark Ring": "رینگ تاریکی دروغین",

  "Untrue White Ring": "رینگ سفیدی دروغین",

  "Calamity Ring": "رینگ مصیبت",

  "Sun Princess Ring": "رینگ شاهزاده خورشید",

  "Estus Ring": "رینگ استوس",

  "Ashen Estus Ring": "رینگ استوس خاکستر",

  "Knight Slayer's Ring": "رینگ قاتل شوالیه",

  "Obscuring Ring": "رینگ پنهان‌سازی",

  "Ring of Sacrifice": "رینگ فداکاری",

  "Skull Ring": "رینگ جمجمه",

  "Young Dragon Ring": "رینگ اژدهای جوان",

  "Bellowing Dragoncrest Ring": "رینگ نشان اژدهای غران",

  "Great Swamp Ring": "رینگ باتلاق بزرگ",

  "Witch's Ring": "رینگ جادوگر",

  "Morne's Ring": "رینگ مورنه",

  "Ring of the Sun's First Born": "رینگ نخست‌زاده خورشید",

  "Dragonscale Ring": "رینگ فلس اژدها",

  "Horsehoof Ring": "رینگ سُم اسب",

  "Slayer's Ring": "رینگ قاتل",

  "Ring of the Evil Eye": "رینگ چشم شر",

};



const upgradeLevels: Record<string, number[]> = {

  "Bloodbite Ring": [1],

  "Chloranthy Ring": [1, 2, 3],

  "Covetous Gold Serpent Ring": [1, 2, 3],

  "Covetous Silver Serpent Ring": [1, 2, 3],

  "Dark Stoneplate Ring": [1, 2],

  "Flame Stoneplate Ring": [1, 2],

  "Fleshbite Ring": [1],

  "Havel's Ring": [1, 2, 3],

  "Life Ring": [1, 2, 3],

  "Lingering Dragoncrest Ring": [1, 2],

  "Magic Stoneplate Ring": [1, 2],

  "Poisonbite Ring": [1],

  "Ring of Favor": [1, 2, 3],

  "Ring of Steel Protection": [1, 2, 3],

  "Ring of the Evil Eye": [1, 2, 3],

  "Sage Ring": [1, 2],

  "Speckled Stoneplate Ring": [1],

  "Thunder Stoneplate Ring": [1, 2],

  "Wolf Ring": [1, 2, 3],

  "Wood Grain Ring": [1, 2],

};



const normalizeRingKey = (value: string) =>

  value.replace(/[’']/g, "'").replace(/\s+/g, " ").trim().toLowerCase();



// این ۹ مورد DLC هستند و برای Master of Rings لازم نیستند.

const nonTrophyRingNames = new Set(

  [

    "Chillbite Ring",

    "Chloranthy Ring +3",

    "Covetous Gold Serpent Ring +3",

    "Covetous Silver Serpent Ring +3",

    "Havel's Ring +3",

    "Ring of Favor +3",

    "Ring of Steel Protection +3",

    "Ring of the Evil Eye +3",

    "Wolf Ring +3",

  ].map(normalizeRingKey)

);



function isTrophyRequiredRing(name: string) {

  return !nonTrophyRingNames.has(normalizeRingKey(name));

}



function cleanRingName(file: string) {

  return file

    .replace(/\.(png|jpe?g|webp)$/i, "")

    .replace(/_/g, "'")

    .replace(/\s+/g, " ")

    .trim();

}



function toPersianDigits(value: string) {

  return value.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

}



function translateRing(name: string) {

  const normalized = name.replace(/['’]/g, "'");

  const direct = translations[name] ?? translations[normalized];



  if (direct) return direct;



  const plusMatch = normalized.match(/^(.*?)\s\+([123])$/);



  if (plusMatch) {

    const base = plusMatch[1].trim();

    const baseTranslation = translations[base] ?? base;

    return baseTranslation + " +" + toPersianDigits(plusMatch[2]);

  }



  return name;

}



function buildRings(items: RingImage[]): Ring[] {

  const baseRings = items

    .filter((item) => /\.(png|jpe?g|webp)$/i.test(item.file))

    .map((item) => {

      const name = cleanRingName(item.file);



      return {

        name,

        fa: translateRing(name),

        file: item.file,

        url: item.url,

        trophyRequired: isTrophyRequiredRing(name),

      };

    });



  const baseRingMap = new Map(

    baseRings.map((ring) => [normalizeRingKey(ring.name), ring])

  );



  const upgradedRings: Ring[] = [];



  for (const [baseName, levels] of Object.entries(upgradeLevels)) {

    const baseRing = baseRingMap.get(normalizeRingKey(baseName));



    // اگر تصویر رینگ پایه وجود نداشته باشد، نسخه‌های آن ساخته نمی‌شوند.

    if (!baseRing) continue;



    for (const level of levels) {

      const name = `${baseRing.name} +${level}`;



      upgradedRings.push({

        name,

        fa: translateRing(name),

        file: `${baseRing.file}::+${level}`,

        url: baseRing.url,

        trophyRequired: isTrophyRequiredRing(name),

      });

    }

  }



  return [...baseRings, ...upgradedRings].sort((a, b) =>

    a.name.localeCompare(b.name)

  );

}

export default function RingsArchive() {
// جست‌وجوی رینگ‌ها (فقط داخل بخش Rings)

  const [search, setSearch] = useState("");







  const [collected, setCollected] = useState<string[]>([]);

  const [collectedLoaded, setCollectedLoaded] = useState(false);

  const [view, setView] = useState<"grid" | "list">("grid");

  const [sort, setSort] = useState("default");

  const [collectionFilter, setCollectionFilter] = useState("all");

  const [rings, setRings] = useState<Ring[]>([]);

  const [imagesLoading, setImagesLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  const [selectedRing, setSelectedRing] = useState<Ring | null>(null);



  useEffect(() => {

    let cancelled = false;



    async function loadRingImages() {

      try {

        setImagesLoading(true);

        setLoadError("");



        const response = await fetch("/games/dark-souls-3/rings");
if (!response.ok) {

          throw new Error("Ring API returned " + response.status);

        }



        const data: RingImageResponse = await response.json();



        if (!Array.isArray(data.rings)) {

          throw new Error(

            data.error ??

              "The Ring API response does not contain a rings array."

          );

        }



        const loadedRings = buildRings(data.rings);



        if (cancelled) return;



        setRings(loadedRings);



        if (loadedRings.length === 0) {

          setLoadError("No ring images were found in Supabase.");

        } else if (loadedRings.some((ring) => !ring.url)) {

          setLoadError(

            "Some images do not have a URL. Check the Supabase bucket and API."

          );

        }

      } catch (error) {

        console.error("Ring image loading failed:", error);



        if (!cancelled) {

          setLoadError(

            error instanceof Error

              ? error.message

              : "Could not load ring images."

          );

        }

      } finally {

        if (!cancelled) setImagesLoading(false);

      }

    }



    loadRingImages();



    return () => {

      cancelled = true;

    };

  }, []);



  // خواندن از localStorage (فقط یک‌بار)

  useEffect(() => {

    try {

      const saved = window.localStorage.getItem(STORAGE_KEY);



      if (saved) {

        const parsed: unknown = JSON.parse(saved);



        if (

          Array.isArray(parsed) &&

          parsed.every((item) => typeof item === "string")

        ) {

          setCollected(parsed);

        }

      }

    } catch (error) {

      console.error("Could not load collected rings:", error);

    } finally {

      setCollectedLoaded(true);

    }

  }, []);



  // ذخیره در localStorage، فقط بعد از اینکه داده‌ی قبلی خوانده شد

  useEffect(() => {

    if (!collectedLoaded) return;



    try {

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collected));

    } catch (error) {

      console.error("Could not save collected rings:", error);

    }

  }, [collected, collectedLoaded]);



  // بستن مودال با Escape

  useEffect(() => {

    if (!selectedRing) return;



    function onKeyDown(event: KeyboardEvent) {

      if (event.key === "Escape") setSelectedRing(null);

    }



    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);

  }, [selectedRing]);

// آمار مجموعه از کل رینگ‌های بارگذاری‌شده محاسبه می‌شود؛

  // جست‌وجو و فیلتر روی این اعداد اثری ندارند.

  const totalRings = rings.length;



  const collectedCount = rings.filter((ring) =>

    collected.includes(ring.name)

  ).length;



  const remainingCount = Math.max(0, totalRings - collectedCount);



  const progress =

    totalRings > 0 ? Math.round((collectedCount / totalRings) * 100) : 0;



  const trophyCount = rings.filter((ring) => ring.trophyRequired).length;

  const nonTrophyCount = totalRings - trophyCount;



  const filteredRings = useMemo(() => {

    const query = search.trim().toLowerCase();



    let result = rings.filter((ring) =>

      (ring.name + " " + ring.fa).toLowerCase().includes(query)

    );



    if (collectionFilter === "collected") {

      result = result.filter((ring) => collected.includes(ring.name));

    } else if (collectionFilter === "missing") {

      result = result.filter((ring) => !collected.includes(ring.name));

    } else if (collectionFilter === "trophy") {

      result = result.filter((ring) => ring.trophyRequired);

    } else if (collectionFilter === "not-trophy") {

      result = result.filter((ring) => !ring.trophyRequired);

    }



    if (sort === "az") {

      result = [...result].sort((a, b) => a.name.localeCompare(b.name));

    } else if (sort === "za") {

      result = [...result].sort((a, b) => b.name.localeCompare(a.name));

    }



    return result;

  }, [rings, search, collectionFilter, collected, sort]);



  function toggleCollected(name: string) {

    setCollected((previous) =>

      previous.includes(name)

        ? previous.filter((item) => item !== name)

        : [...previous, name]

    );

  }



  const selectedDetail = selectedRing

    ? ringDetails[normalizeRingKey(selectedRing.name)]

    : undefined;




  return (
    <>
{/* Ring collection statistics */}

              <section

                aria-label="Ring collection progress"

                className="mt-6 border border-[#c8a15b]/35 bg-gradient-to-br from-[#17150f]/95 via-[#0b0d0c]/95 to-black/95 p-4 sm:p-6"

              >

                <div className="flex flex-wrap items-center justify-between gap-3">

                  <div>

                    <p className="text-[10px] tracking-[0.25em] text-[#d8b66e]">

                      SOUL PROFILE / COLLECTION

                    </p>



                    <h3 className="mt-2 font-serif text-xl text-[#f0e6d3] sm:text-2xl">

                      RING COLLECTION

                    </h3>



                    <p dir="rtl" className="mt-2 text-xs text-white/50">

                      پیشرفت جمع‌آوری رینگ‌ها

                    </p>

                  </div>



                  <div className="text-right">

                    <span className="font-serif text-4xl text-[#d8b66e]">

                      {progress}%

                    </span>



                    <p className="mt-1 text-[10px] tracking-widest text-white/45">

                      COMPLETED

                    </p>

                  </div>

                </div>



                <div

                  className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"

                  role="progressbar"

                  aria-label="Collection progress"

                  aria-valuemin={0}

                  aria-valuemax={100}

                  aria-valuenow={progress}

                >

                  <div

                    className="h-full rounded-full bg-gradient-to-r from-[#8d6a32] via-[#c8a15b] to-[#f0d89a] transition-all duration-500"

                    style={{ width: `${progress}%` }}

                  />

                </div>



                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

                  <div className="border border-[#c8a15b]/25 bg-black/30 p-4">

                    <div className="flex items-center justify-between">

                      <span className="text-[10px] tracking-widest text-white/50">

                        COLLECTED

                      </span>



                      <span className="text-lg text-[#d8b66e]">✓</span>

                    </div>



                    <p className="mt-2 font-serif text-3xl text-[#e5c078]">

                      {collectedCount}



                      <span className="ml-2 text-sm text-white/40">

                        / {totalRings}

                      </span>

                    </p>



                    <p dir="rtl" className="mt-1 text-xs text-white/55">

                      رینگ جمع‌شده

                    </p>

                  </div>



                  <div className="border border-white/10 bg-black/30 p-4">

                    <div className="flex items-center justify-between">

                      <span className="text-[10px] tracking-widest text-white/50">

                        REMAINING

                      </span>



                      <span className="text-lg text-white/50">◇</span>

                    </div>



                    <p className="mt-2 font-serif text-3xl text-[#eee6d5]">

                      {remainingCount}

                    </p>



                    <p dir="rtl" className="mt-1 text-xs text-white/55">

                      باقی‌مانده برای جمع‌آوری

                    </p>

                  </div>



                  <div className="border border-white/10 bg-black/30 p-4">

                    <div className="flex items-center justify-between">

                      <span className="text-[10px] tracking-widest text-white/50">

                        TOTAL RINGS

                      </span>



                      <span className="text-lg text-[#d8b66e]">♢</span>

                    </div>



                    <p className="mt-2 font-serif text-3xl text-[#eee6d5]">

                      {totalRings}

                    </p>



                    <p dir="rtl" className="mt-1 text-xs text-white/55">

                      کل رینگ‌های بارگذاری‌شده

                    </p>

                  </div>

                </div>



                {!imagesLoading && totalRings === 0 && (

                  <p dir="rtl" className="mt-4 text-xs text-white/45">

                    برای نمایش آمار، ابتدا باید تصاویر رینگ‌ها بارگذاری شوند.

                  </p>

                )}

              </section>



              <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_190px_150px_auto]">

                <input

                  value={search}

                  onChange={(event) => setSearch(event.target.value)}

                  placeholder="⌕ Search rings..."

                  className="min-w-0 border border-white/15 bg-black/60 px-4 py-3 text-xs outline-none transition placeholder:text-white/45 focus:border-[#c8a15b]/70"

                />



                <select

                  value={collectionFilter}

                  onChange={(event) => setCollectionFilter(event.target.value)}

                  className="border border-[#c8a15b]/40 bg-[#0b0d0d] px-3 py-3 text-xs text-white/80 outline-none"

                >

                  <option value="all">All Rings</option>

                  <option value="collected">Collected</option>

                  <option value="missing">Not Collected</option>

                  <option value="trophy">

                    Trophy Required ({trophyCount})

                  </option>

                  <option value="not-trophy">

                    Not Required (DLC {nonTrophyCount})

                  </option>

                </select>



                <select

                  value={sort}

                  onChange={(event) => setSort(event.target.value)}

                  className="border border-[#c8a15b]/40 bg-[#0b0d0d] px-3 py-3 text-xs text-white/80 outline-none"

                >

                  <option value="default">Sort by</option>

                  <option value="az">Name A–Z</option>

                  <option value="za">Name Z–A</option>

                </select>



                <div className="flex border border-[#c8a15b]/40">

                  <button

                    aria-label="Grid view"

                    onClick={() => setView("grid")}

                    className={

                      "px-4 text-[#e4bd70] " +

                      (view === "grid"

                        ? "bg-[#c8a15b]/15"

                        : "hover:bg-white/5")

                    }

                  >

                    ▦

                  </button>



                  <button

                    aria-label="List view"

                    onClick={() => setView("list")}

                    className={

                      "border-l border-[#c8a15b]/30 px-4 text-[#e4bd70] " +

                      (view === "list"

                        ? "bg-[#c8a15b]/15"

                        : "hover:bg-white/5")

                    }

                  >

                    ☰

                  </button>

                </div>

              </div>



              {imagesLoading && (

                <p className="mt-5 text-xs text-[#d7b66f]/70">

                  Loading ring images...

                </p>

              )}



              {loadError && (

                <div className="mt-5 border border-red-400/30 bg-red-950/20 p-4">

                  <p className="text-sm text-red-200">

                    مشکل در دریافت تصاویر رینگ‌ها

                  </p>



                  <p className="mt-2 break-words text-xs text-red-200/70">

                    {loadError}

                  </p>



                  <button

                    onClick={() => window.location.reload()}

                    className="mt-3 border border-red-200/30 px-3 py-2 text-xs text-red-100 hover:bg-red-200/10"

                  >

                    Retry

                  </button>

                </div>

              )}



              <div

                className={

                  "mt-5 grid gap-4 " +

                  (view === "grid"

                    ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"

                    : "grid-cols-1")

                }

              >

                {filteredRings.map((ring) => {

                  const isCollected = collected.includes(ring.name);



                  return (

                    <article

                      key={ring.name}

                      role="button"

                      tabIndex={0}

                      onClick={() => setSelectedRing(ring)}

                      onKeyDown={(event) => {

                        if (event.target !== event.currentTarget) return;



                        if (event.key === "Enter" || event.key === " ") {

                          event.preventDefault();

                          setSelectedRing(ring);

                        }

                      }}

                      className={

                        "group flex min-w-0 cursor-pointer flex-col overflow-hidden border transition duration-300 hover:-translate-y-1 hover:border-[#e0bb70]/80 " +

                        (ring.trophyRequired

                          ? "bg-[#070a0a]/95 "

                          : "bg-[#171022]/95 ring-1 ring-violet-500/10 ") +

                        (isCollected

                          ? "border-[#c8a15b]/50"

                          : ring.trophyRequired

                            ? "border-white/10"

                            : "border-violet-400/50") +

                        (view === "list" ? " sm:flex-row" : "")

                      }

                    >

                      <div

                        className={

                          "relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-[#172020] via-[#090b0b] to-black " +

                          (view === "grid"

                            ? "h-44"

                            : "h-28 sm:h-auto sm:w-40")

                        }

                      >

                        <span className="absolute left-3 top-3 z-10 text-[9px] tracking-widest text-[#d3ac60]">

                          RING

                        </span>



                        <span className="absolute right-3 top-3 z-10 text-xs text-[#d3ac60]">

                          ◇

                        </span>



                        {ring.url ? (

                          <img

                            src={ring.url}

                            alt={ring.name}

                            loading="lazy"

                            className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-110"

                          />

                        ) : (

                          <div className="flex h-24 w-24 items-center justify-center rounded-full border-[5px] border-[#c8a15b]/50">

                            <span className="text-3xl text-[#c8a15b]">

                              ◇

                            </span>

                          </div>

                        )}

                      </div>



                      <div className="flex min-w-0 flex-1 flex-col p-3">

                        <h3 className="break-words font-serif text-[11px] font-bold leading-5 text-[#f1e7d7]">

                          {ring.name}

                        </h3>



                        <p dir="rtl" className="mt-1 text-xs text-[#d7b66f]">

                          {ring.fa}

                        </p>



                        <div className="mt-4 flex-1" />



                        <label

                          onClick={(event) => event.stopPropagation()}

                          className="mt-4 flex cursor-pointer items-center gap-2 border-t border-white/10 pt-3 text-[10px] text-white/50 hover:text-[#e0bd77]"

                        >

                          <input

                            type="checkbox"

                            checked={isCollected}

                            onChange={() => toggleCollected(ring.name)}

                            onKeyDown={(event) => event.stopPropagation()}

                            className="accent-[#c8a15b]"

                          />



                          {isCollected ? "Collected" : "Not Collected"}

                        </label>

                      </div>

                    </article>

                  );

                })}

              </div>



              {!imagesLoading &&

                !loadError &&

                filteredRings.length === 0 && (

                  <p className="mt-8 text-center text-sm text-white/50">

                    No rings match your search.

                  </p>

                )}



              <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#c8a15b]/20 pt-5 text-[10px] text-white/45">

                <span>

                  Showing {filteredRings.length} of {totalRings} rings

                </span>



                <span>

                  Collection progress:{" "}

                  <strong className="text-[#e2bd73]">

                    {collectedCount} / {totalRings} ({progress}%)

                  </strong>

                </span>

              </div>

{/* Ring detail modal */}

      {selectedRing && (

        <div

          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"

          role="presentation"

          onClick={() => setSelectedRing(null)}

        >

          <section

            role="dialog"

            aria-modal="true"

            aria-labelledby="ring-detail-title"

            dir="rtl"

            onClick={(event) => event.stopPropagation()}

            className={`max-h-[90vh] w-full max-w-2xl overflow-y-auto border p-5 shadow-2xl sm:p-7 ${

              selectedRing.trophyRequired

                ? "border-[#c8a15b]/60 bg-[#0b0d0c]"

                : "border-violet-400/60 bg-[#160f20]"

            }`}

          >

            <div className="flex items-start justify-between gap-4">

              <div>

                <p

                  dir="ltr"

                  className="text-[10px] tracking-[0.2em] text-[#c8a15b]"

                >

                  SOULS GATE / RING ARCHIVE

                </p>



                <h3

                  id="ring-detail-title"

                  dir="ltr"

                  className="mt-2 text-left font-serif text-2xl text-[#f0e6d3] sm:text-3xl"

                >

                  {selectedRing.name}

                </h3>



                <p className="mt-2 text-sm text-[#d8b66e]">

                  {selectedRing.fa}

                </p>

              </div>



              <button

                type="button"

                onClick={() => setSelectedRing(null)}

                aria-label="بستن جزئیات"

                className="border border-white/20 px-3 py-2 text-white/70 hover:bg-white/10"

              >

                ✕

              </button>

            </div>



            <div className="mt-5 grid gap-4 sm:grid-cols-[140px_minmax(0,1fr)]">

              <div className="flex min-h-[130px] items-center justify-center border border-white/10 bg-black/30 p-3">

                {selectedRing.url ? (

                  <img

                    src={selectedRing.url}

                    alt={selectedRing.name}

                    className="max-h-36 max-w-full object-contain"

                  />

                ) : (

                  <span className="text-4xl text-[#c8a15b]">◇</span>

                )}

              </div>



              <div className="space-y-4">

                <div>

                  <h4 className="text-xs font-bold text-[#d8b66e]">

                    کاربرد و اثر

                  </h4>



                  <p className="mt-2 text-sm leading-7 text-white/75">

                    {selectedDetail?.effect ??

                      "اطلاعات اثر این رینگ هنوز از منابع بررسی و ثبت نشده است."}

                  </p>

                </div>



                <div>

                  <h4 className="text-xs font-bold text-[#d8b66e]">

                    محل پیدا کردن

                  </h4>



                  <p className="mt-2 text-sm leading-7 text-white/75">

                    {selectedDetail?.location ??

                      "محل دقیق پیدا کردن این رینگ هنوز بررسی و ثبت نشده است."}

                  </p>

                </div>



                {selectedDetail?.notes && (

                  <div>

                    <h4 className="text-xs font-bold text-[#d8b66e]">

                      نکته

                    </h4>



                    <p className="mt-2 text-sm leading-7 text-white/75">

                      {selectedDetail.notes}

                    </p>

                  </div>

                )}

              </div>

            </div>



            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">

              <span

                className={`text-xs ${

                  selectedRing.trophyRequired

                    ? "text-[#d8b66e]"

                    : "text-violet-300"

                }`}

              >

                {selectedRing.trophyRequired

                  ? "موردنیاز تروفی Master of Rings"

                  : "برای تروفی Master of Rings لازم نیست"}

              </span>



              <label className="flex cursor-pointer items-center gap-2 text-xs text-white/70">

                <input

                  type="checkbox"

                  checked={collected.includes(selectedRing.name)}

                  onChange={() => toggleCollected(selectedRing.name)}

                  className="accent-[#c8a15b]"

                />



                {collected.includes(selectedRing.name)

                  ? "جمع‌آوری شده"

                  : "علامت‌گذاری به‌عنوان جمع‌آوری‌شده"}

              </label>

            </div>

          </section>

        </div>

      )}
    </>
  );
}
