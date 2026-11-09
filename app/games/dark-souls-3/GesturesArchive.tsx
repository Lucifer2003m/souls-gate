"use client";

import { useEffect, useMemo, useState } from "react";

type Gesture = {
  id: string;
  name: string;
  fa: string;
  method: string;
  location: string;
  category: "default" | "npc" | "location" | "summon" | "trade";
  note?: string;
};

const STORAGE_KEY = "souls-gate-ds3-gestures-v1";

const gestures: Gesture[] = [
  { id: "point-forward", name: "Point Forward", fa: "اشاره به جلو", method: "از ابتدای بازی به‌صورت خودکار در اختیار شخصیت است.", location: "شروع بازی", category: "default" },
  { id: "point-up", name: "Point Up", fa: "اشاره به بالا", method: "از ابتدای بازی به‌صورت خودکار در اختیار شخصیت است.", location: "شروع بازی", category: "default" },
  { id: "point-down", name: "Point Down", fa: "اشاره به پایین", method: "از ابتدای بازی به‌صورت خودکار در اختیار شخصیت است.", location: "شروع بازی", category: "default" },
  { id: "wave", name: "Wave", fa: "دست تکان دادن", method: "از ابتدای بازی به‌صورت خودکار در اختیار شخصیت است.", location: "شروع بازی", category: "default" },
  { id: "jump-for-joy", name: "Jump for Joy", fa: "پرش از شادی", method: "از ابتدای بازی به‌صورت خودکار در اختیار شخصیت است.", location: "شروع بازی", category: "default" },
  { id: "joy", name: "Joy", fa: "شادی", method: "از ابتدای بازی به‌صورت خودکار در اختیار شخصیت است.", location: "شروع بازی", category: "default" },
  { id: "bow", name: "Bow", fa: "تعظیم", method: "از ابتدای بازی به‌صورت خودکار در اختیار شخصیت است.", location: "شروع بازی", category: "default" },
  { id: "beckon", name: "Beckon", fa: "فراخواندن", method: "پس از نجات Yoel of Londor و انتقال او به Firelink Shrine، تمام گفت‌وگوهایش را ادامه بده.", location: "Firelink Shrine", category: "npc", note: "به حضور و گفت‌وگو با Yoel وابسته است؛ او را در ابتدای مسیرش از دست نده." },
  { id: "call-over", name: "Call Over", fa: "صدا زدن برای نزدیک شدن", method: "یکی از آیتم‌های قابل‌معامله را در لانه Nestling روی پشت‌بام Firelink Shrine مبادله کن؛ Homeward Bone یکی از گزینه‌هاست.", location: "Firelink Shrine — Nestling", category: "trade" },
  { id: "welcome", name: "Welcome", fa: "خوش‌آمدگویی", method: "Cornyx of the Great Swamp را به Firelink Shrine بیاور؛ پس از گفت‌وگوی اول، دوباره با او صحبت کن.", location: "Firelink Shrine", category: "npc" },
  { id: "applause", name: "Applause", fa: "تشویق", method: "پس از دریافت Red Eye Orb، با Ringfinger Leonhard صحبت کن و زنجیره گفت‌وگوی مربوط به او را ادامه بده.", location: "Firelink Shrine", category: "npc" },
  { id: "quiet-resolve", name: "Quiet Resolve", fa: "آرامش استوار", method: "در Irithyll of the Boreal Valley، کنار Church of Yorshka با Anri of Astora صحبت کن.", location: "Church of Yorshka", category: "npc" },
  { id: "rejoice", name: "Rejoice", fa: "ابراز خوشحالی", method: "پس از پیدا کردن Siegward در چاه بیرون Cleansing Chapel، زره Catarina او را تهیه کن و به خودش برگردان.", location: "Cathedral of the Deep", category: "npc" },
  { id: "hurrah", name: "Hurrah!", fa: "هورا!", method: "در Firelink Shrine با Blacksmith Andre صحبت کن و گفت‌وگوهای اولیه‌اش را تا پایان ادامه بده.", location: "Firelink Shrine", category: "npc" },
  { id: "praise-the-sun", name: "Praise the Sun", fa: "ستایش خورشید", method: "با Altar of Sunlight تعامل کن.", location: "Lothric Castle", category: "location" },
  { id: "my-thanks", name: "My Thanks!", fa: "سپاسگزارم!", method: "با Knight Slayer Tsorig در Catacombs of Carthus یا Smouldering Lake روبه‌رو شو؛ پس از رویارویی، ژست را دریافت می‌کنی.", location: "Catacombs of Carthus / Smouldering Lake", category: "location" },
  { id: "proper-bow", name: "Proper Bow", fa: "تعظیم رسمی", method: "ابتدا Yellowfinger Heysel را به‌عنوان مهاجم شکست بده؛ سپس به Rosaria's Fingers بپیوند و حداقل یک Pale Tongue به Rosaria تقدیم کن. بعد علامت احضار Heysel را در Farron Keep پیدا و او را احضار کن.", location: "Farron Keep", category: "summon", note: "به شرایط Heysel و Rosaria وابسته است؛ پیش از پیشروی بیش از حد در مسیر باس‌ها بررسی‌اش کن." },
  { id: "dignified-bow", name: "Dignified Bow", fa: "تعظیم باوقار", method: "پس از ظاهر شدن Yuria of Londor در Firelink Shrine، برای نخستین بار با او صحبت کن.", location: "Firelink Shrine", category: "npc" },
  { id: "duel-bow", name: "Duel Bow", fa: "تعظیم دوئل", method: "Londor Pale Shade را در یکی از محل‌های قابل‌احضارش، مانند Farron Keep یا Irithyll، احضار کن.", location: "Farron Keep / Irithyll", category: "summon" },
  { id: "legion-etiquette", name: "Legion Etiquette", fa: "آیین لژیون", method: "در Farron Keep با Old Wolf of Farron تعامل کن.", location: "Farron Keep", category: "location" },
  { id: "darkmoon-loyalty", name: "Darkmoon Loyalty", fa: "وفاداری دارک‌مون", method: "Dreamchaser's Ashes را به Shrine Handmaid بده؛ سپس در Firelink Shrine با Sirris of the Sunless Realms صحبت کن.", location: "Firelink Shrine", category: "npc" },
  { id: "by-my-sword", name: "By My Sword", fa: "به شمشیرم سوگند", method: "Black Hand Gotthard را از علامت احضارش برای همراهی در نبرد احضار کن.", location: "Farron Keep / Irithyll", category: "summon" },
  { id: "prayer", name: "Prayer", fa: "نیایش", method: "Irina of Carim را در سلولش در Undead Settlement پیدا کن و گزینه لمس کردن او (Touch) را بپذیر.", location: "Undead Settlement", category: "npc" },
  { id: "silent-ally", name: "Silent Ally", fa: "همراه خاموش", method: "Orbeck of Vinheim را به Firelink Shrine بیاور؛ جادوهای موردنیازش را خریداری کن و سپس گزینه Talk را انتخاب کن.", location: "Firelink Shrine", category: "npc" },
  { id: "rest", name: "Rest", fa: "استراحت", method: "برای نخستین بار کنار یک Bonfire استراحت کن.", location: "Cemetery of Ash", category: "location" },
  { id: "collapse", name: "Collapse", fa: "از پا افتادن", method: "در Firelink Shrine با Hawkwood the Deserter صحبت کن.", location: "Firelink Shrine", category: "npc" },
  { id: "patches-squat", name: "Patches Squat", fa: "چمباتمه پچز", method: "پس از برخورد با Unbreakable Patches و بازگشت به Firelink Shrine، وقتی او در حالت چمباتمه است با او صحبت کن.", location: "Firelink Shrine", category: "npc", note: "در مسیر جایگزین DLC نیز Lapp می‌تواند این ژست را آموزش دهد." },
  { id: "prostration", name: "Prostration", fa: "به خاک افتادن", method: "در Cathedral of the Deep، پس از پایین آوردن پل توسط Patches، با او روبه‌رو شو و گزینه «You know who I am» را انتخاب کن. مسیر جایگزین پس از فرار از تله او در Firelink Shrine نیز وجود دارد.", location: "Cathedral of the Deep / Firelink Shrine", category: "npc" },
  { id: "toast", name: "Toast", fa: "به سلامتی", method: "پس از رویارویی Siegward با Demon در Undead Settlement، با او صحبت کن؛ در صورت از دست رفتن این فرصت، گفت‌وگوهای بعدی او در مسیر مأموریتش را بررسی کن.", location: "Undead Settlement", category: "npc" },
  { id: "sleep", name: "Sleep", fa: "خواب", method: "وقتی Siegward پس از ماجرای Demon یا در محل بعدی مأموریتش به خواب رفت، دوباره با او صحبت کن.", location: "Undead Settlement / Irithyll", category: "npc" },
  { id: "curl-up", name: "Curl Up", fa: "جمع کردن بدن", method: "Loretta's Bone را به Greirat بده؛ منطقه را دوباره بارگذاری کن و وقتی در حالت مخصوصش قرار دارد با او صحبت کن.", location: "Firelink Shrine", category: "npc" },
  { id: "stretch-out", name: "Stretch Out", fa: "کش‌وقوس", method: "جسد Laddersmith Gilligan را کنار Bonfire منطقه بررسی کن.", location: "Profaned Capital", category: "location" },
  { id: "path-of-the-dragon", name: "Path of the Dragon", fa: "راه اژدها", method: "پس از شکست Oceiros، وارد اتاق پشت محل نبرد شو و جسد انتهای مسیر را بررسی کن.", location: "Consumed King's Garden", category: "location", note: "این ژست برای دسترسی به Archdragon Peak ضروری است." },
];

const filters = [
  { id: "all", label: "همه ژست‌ها" },
  { id: "default", label: "از ابتدای بازی" },
  { id: "npc", label: "مربوط به NPCها" },
  { id: "location", label: "مکان‌ها" },
  { id: "summon", label: "احضار" },
  { id: "trade", label: "تبادل" },
] as const;

type FilterId = (typeof filters)[number]["id"];

export default function GesturesArchive() {
  const [collected, setCollected] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [showCollectedOnly, setShowCollectedOnly] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCollected(parsed.filter((id): id is string => typeof id === "string" && gestures.some((gesture) => gesture.id === id)));
        }
      }
    } catch (error) {
      console.error("Could not load collected gestures:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collected));
    } catch (error) {
      console.error("Could not save collected gestures:", error);
    }
  }, [collected, loaded]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return gestures.filter((gesture) => {
      const matchesQuery = !normalized || `${gesture.name} ${gesture.fa} ${gesture.method} ${gesture.location}`.toLowerCase().includes(normalized);
      const matchesFilter = filter === "all" || gesture.category === filter;
      const matchesCollected = !showCollectedOnly || collected.includes(gesture.id);
      return matchesQuery && matchesFilter && matchesCollected;
    });
  }, [query, filter, showCollectedOnly, collected]);

  const progress = Math.round((collected.length / gestures.length) * 100);

  const toggleCollected = (id: string) => {
    setCollected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <div dir="rtl" className="space-y-6 text-[#eee6d5]">
      <section className="relative overflow-hidden border border-[#c8a15b]/35 bg-[radial-gradient(ellipse_at_top,rgba(200,161,91,0.13),transparent_60%),rgba(0,0,0,0.38)] p-5 sm:p-7">
        <div className="absolute -left-8 -top-10 select-none font-serif text-[180px] leading-none text-[#c8a15b]/[0.06]">☼</div>
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[10px] tracking-[0.25em] text-[#d8b66e]">MASTER OF EXPRESSION</span>
            <span className="border border-[#c8a15b]/30 px-3 py-1 text-[10px] text-[#d8b66e]">33 GESTURES</span>
          </div>
          <h3 className="mt-3 font-serif text-2xl text-[#f1e5cd] sm:text-3xl">آرشیو کامل ژست‌ها</h3>
          <p className="mt-2 max-w-3xl text-xs leading-7 text-white/65 sm:text-sm">تمام ۳۳ ژست Dark Souls III را پیدا کن، روش آزادسازی هرکدام را بخوان و مواردی را که به دست آورده‌ای علامت بزن. وضعیت جمع‌آوری روی همین مرورگر ذخیره می‌شود.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-white/65">پیشرفت جمع‌آوری</span>
                <span className="tabular-nums text-[#e3c47f]">{collected.length} / {gestures.length}</span>
              </div>
              <div className="h-2 overflow-hidden bg-white/10">
                <div className="h-full bg-gradient-to-l from-[#e6c77e] to-[#9d7536] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="text-left font-serif text-3xl tabular-nums text-[#d8b66e]">{progress}%</div>
          </div>
          <p className="mt-3 text-[11px] leading-6 text-white/45">با جمع‌آوری هر ۳۳ ژست، تروفی / اچیومنت Master of Expression آزاد می‌شود.</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جست‌وجوی نام ژست، مکان یا روش دریافت..." className="min-w-0 flex-1 border border-white/15 bg-black/45 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#c8a15b]/60" />
          <button type="button" onClick={() => setShowCollectedOnly((value) => !value)} className={`border px-4 py-3 text-xs transition ${showCollectedOnly ? "border-[#c8a15b]/70 bg-[#c8a15b]/15 text-[#e5c77f]" : "border-white/15 bg-black/35 text-white/65 hover:border-[#c8a15b]/50"}`}>
            {showCollectedOnly ? "نمایش همه ژست‌ها" : "فقط ژست‌های جمع‌آوری‌شده"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button key={item.id} type="button" onClick={() => setFilter(item.id)} className={`border px-3 py-2 text-[11px] transition ${filter === item.id ? "border-[#c8a15b]/70 bg-[#c8a15b]/15 text-[#e5c77f]" : "border-white/10 bg-black/25 text-white/55 hover:border-[#c8a15b]/40 hover:text-white/80"}`}>
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between border-b border-[#c8a15b]/20 pb-3 text-xs">
        <span className="text-white/55">نمایش {filtered.length} از {gestures.length} ژست</span>
        <button type="button" onClick={() => setCollected([])} className="text-[11px] text-white/40 transition hover:text-red-300">پاک کردن تیک‌ها</button>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-white/10 bg-black/25 px-5 py-14 text-center text-sm text-white/50">ژستی با این مشخصات پیدا نشد.</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((gesture, index) => {
            const isCollected = collected.includes(gesture.id);
            const isDefault = gesture.category === "default";
            return (
              <article key={gesture.id} className={`relative overflow-hidden border p-4 transition ${isCollected ? "border-[#c8a15b]/45 bg-[#17140d]/75" : "border-white/10 bg-black/30 hover:border-white/20"}`}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#c8a15b]/25 bg-[#c8a15b]/[0.07] font-serif text-sm text-[#d8b66e]">{String(index + 1).padStart(2, "0")}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`font-serif text-base ${isCollected ? "text-[#e5c77f]" : "text-[#eee6d5]"}`}>{gesture.name}</h4>
                      {isDefault && <span className="border border-emerald-500/25 bg-emerald-500/[0.07] px-2 py-0.5 text-[9px] text-emerald-300/80">پیش‌فرض</span>}
                      {isCollected && <span className="text-[10px] text-[#d8b66e]">✓ جمع‌آوری شد</span>}
                    </div>
                    <p className="mt-1 text-xs text-[#d8b66e]/85">{gesture.fa}</p>
                  </div>
                  <button type="button" aria-label={isCollected ? `حذف علامت ${gesture.name}` : `علامت‌گذاری ${gesture.name} به‌عنوان جمع‌آوری‌شده`} onClick={() => toggleCollected(gesture.id)} className={`flex h-8 w-8 shrink-0 items-center justify-center border text-sm transition ${isCollected ? "border-[#c8a15b]/70 bg-[#c8a15b]/15 text-[#e5c77f]" : "border-white/15 text-white/35 hover:border-[#c8a15b]/60 hover:text-[#e5c77f]"}`}>{isCollected ? "✓" : "+"}</button>
                </div>
                <div className="mt-4 border-t border-white/[0.07] pt-3">
                  <p className="text-xs leading-6 text-white/75">{gesture.method}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-white/45">
                    <span className="text-[#c8a15b]">⌖</span>
                    <span>{gesture.location}</span>
                  </div>
                  {gesture.note && <p className="mt-3 border-r-2 border-[#c8a15b]/50 bg-[#c8a15b]/[0.05] px-3 py-2 text-[10px] leading-6 text-[#d7c39b]/75">نکته: {gesture.note}</p>}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="border border-[#c8a15b]/20 bg-black/25 p-4 text-xs leading-7 text-white/55">
        <strong className="text-[#d8b66e]">نکته تروفی:</strong> برای Master of Expression باید هر ۳۳ ژست را روی یک فایل ذخیره به دست بیاوری. بعضی ژست‌ها به گفت‌وگوهای NPCها یا احضارهای خاص وابسته‌اند؛ بنابراین قبل از عبور از مراحل مهم، شرایط آن‌ها را بررسی کن.
      </div>
    </div>
  );
}
