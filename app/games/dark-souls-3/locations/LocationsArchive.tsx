"use client";

import { useEffect, useMemo, useState } from "react";

type Region = "main" | "optional" | "dlc" | "hub";
type LocationEntry = {
  id: string;
  name: string;
  fa: string;
  region: Region;
  order: number;
  summary: string;
  access: string;
  boss: string;
  bonfires: string[];
  highlights: string[];
};

const STORAGE_KEY = "souls-gate-ds3-locations-visited-v1";
const REGION_LABELS: Record<Region | "all", string> = {
  all: "همهٔ مناطق",
  main: "مسیر اصلی",
  optional: "مناطق اختیاری",
  dlc: "سرزمین‌های DLC",
  hub: "هاب و پایانی",
};

const LOCATIONS: LocationEntry[] = [
  { id: "cemetery-of-ash", name: "Cemetery of Ash", fa: "گورستان خاکستر", region: "main", order: 1, summary: "منطقهٔ آغازین سفر؛ جایی که نخستین آزمون و اولین باس بازی انتظار بازیکن را می‌کشد.", access: "منطقهٔ آغازین بازی.", boss: "Iudex Gundyr", bonfires: ["Cemetery of Ash", "Iudex Gundyr"], highlights: ["آموزش مبارزه و حرکت", "دسترسی به Firelink Shrine پس از باس"] },
  { id: "firelink-shrine", name: "Firelink Shrine", fa: "معبد فایرلینک", region: "hub", order: 2, summary: "پایگاه اصلی بازیکن؛ محل ارتقای شخصیت، مدیریت آیتم‌ها و تعامل با شخصیت‌های همراه.", access: "پس از عبور از Cemetery of Ash.", boss: "ندارد؛ منطقهٔ هاب", bonfires: ["Firelink Shrine"], highlights: ["Fire Keeper و ارتقای سطح", "فروشندگان و آهنگر Andre", "تخت‌های Lords of Cinder"] },
  { id: "high-wall", name: "High Wall of Lothric", fa: "دیوار بلند لاثریک", region: "main", order: 3, summary: "قلعه‌ای مرتفع و خطرناک با مسیرهای چندلایه، برج‌ها و گذرگاه‌های باریک.", access: "با سفر از Firelink Shrine.", boss: "Vordt of the Boreal Valley", bonfires: ["High Wall of Lothric", "Tower on the Wall", "Vordt of the Boreal Valley"], highlights: ["آزاد کردن Greirat", "گرفتن Small Lothric Banner", "مسیر ورود به Undead Settlement"] },
  { id: "undead-settlement", name: "Undead Settlement", fa: "آبادی نامردگان", region: "main", order: 4, summary: "آبادی‌ای ویران با خانه‌های فرسوده، دشمنان گروهی و مسیرهای پنهان.", access: "پس از High Wall of Lothric؛ با استفاده از Small Lothric Banner.", boss: "Curse-Rotted Greatwood", bonfires: ["Foot of the High Wall", "Undead Settlement", "Cliff Underside", "Dilapidated Bridge", "Pit of Hollows"], highlights: ["آزاد کردن Cornyx و Irina", "ماموریت Greirat", "دسترسی به مسیرهای اختیاری"] },
  { id: "road-of-sacrifices", name: "Road of Sacrifices", fa: "جادهٔ قربانی‌ها", region: "main", order: 5, summary: "مسیر جنگلی و باتلاقی که بازیکن را به منطقه‌های مهم بعدی می‌رساند.", access: "از Undead Settlement و مسیر آسانسور نزدیک Siegward.", boss: "Crystal Sage در بخش انتهایی مسیر", bonfires: ["Road of Sacrifices", "Halfway Fortress", "Crucifixion Woods", "Crystal Sage"], highlights: ["دیدار با Anri و Horace", "تقاطع مسیر Farron Keep و Cathedral of the Deep"] },
  { id: "farron-keep", name: "Farron Keep", fa: "دژ فارون", region: "main", order: 6, summary: "باتلاقی سمی پیرامون دژ فرسوده؛ برای باز کردن مسیر باس باید سه شعله خاموش شوند.", access: "از Road of Sacrifices، از مسیر پایین برج.", boss: "Abyss Watchers", bonfires: ["Farron Keep", "Keep Ruins", "Farron Keep Perimeter", "Old Wolf of Farron", "Abyss Watchers"], highlights: ["خاموش کردن سه شعله", "پیمان Watchdogs of Farron", "مسیر اختیاری Archdragon Peak از Old Wolf"] },
  { id: "cathedral-of-the-deep", name: "Cathedral of the Deep", fa: "کلیسای اعماق", region: "main", order: 7, summary: "کلیسایی عظیم با گورستان، پشت‌بام‌ها و تالارهایی که به نبردی چندمرحله‌ای ختم می‌شوند.", access: "از Road of Sacrifices؛ یکی از دو مسیر مهم آن منطقه.", boss: "Deacons of the Deep", bonfires: ["Cathedral of the Deep", "Cleansing Chapel", "Rosaria's Bed Chamber", "Deacons of the Deep"], highlights: ["دسترسی به Rosaria", "پیمان Rosaria's Fingers", "مسیر ورود به Painted World of Ariandel با Gael"] },
  { id: "catacombs", name: "Catacombs of Carthus", fa: "دخمه‌های کارتوس", region: "main", order: 8, summary: "دخمه‌هایی تاریک با اسکلت‌ها، تله‌ها و پل طنابی که مسیر پیشروی را مشخص می‌کند.", access: "پس از شکست Abyss Watchers و عبور از درِ بازشده.", boss: "High Lord Wolnir", bonfires: ["Catacombs of Carthus", "High Lord Wolnir"], highlights: ["مسیر مخفی به Smouldering Lake", "پل طنابی قابل فروریختن", "راه ورود به Irithyll"] },
  { id: "smouldering-lake", name: "Smouldering Lake", fa: "دریاچهٔ گدازه‌ای", region: "optional", order: 9, summary: "منطقه‌ای اختیاری در زیر دخمه‌ها با دریاچه، بالیستا و بقایای آتشین.", access: "از مسیر پنهان پشت پل فروریخته در Catacombs of Carthus.", boss: "Old Demon King", bonfires: ["Abandoned Tomb", "Demon Ruins", "Old King's Antechamber", "Old Demon King"], highlights: ["مبارزه با Old Demon King", "Demon Ruins", "چند مسیر فرعی و آیتم پنهان"] },
  { id: "irithyll", name: "Irithyll of the Boreal Valley", fa: "ایریتیلِ درهٔ شمالی", region: "main", order: 10, summary: "شهری سرد و درخشان با پل‌های سنگی، خیابان‌های وسیع و دشمنان سریع.", access: "پس از Catacombs of Carthus؛ برای عبور از سد جادویی Small Doll لازم است.", boss: "Pontiff Sulyvahn", bonfires: ["Irithyll of the Boreal Valley", "Central Irithyll", "Church of Yorshka", "Distant Manor", "Pontiff Sulyvahn", "Water Reserve"], highlights: ["پیمان Blades of the Darkmoon", "مسیر Anor Londo", "دسترسی به Irithyll Dungeon"] },
  { id: "anor-londo", name: "Anor Londo", fa: "آنور لوندو", region: "main", order: 11, summary: "شهر افسانه‌ای خدایان بر فراز ایریتیل؛ بخش مهمی از مسیر اصلی داستان.", access: "از مسیر پشت Pontiff Sulyvahn و محوطهٔ پس از کلیسا.", boss: "Aldrich, Devourer of Gods", bonfires: ["Anor Londo", "Aldrich, Devourer of Gods"], highlights: ["نبرد با Aldrich", "پیشروی در خط داستانی اصلی"] },
  { id: "irithyll-dungeon", name: "Irithyll Dungeon", fa: "سیاه‌چال ایریتیل", region: "main", order: 12, summary: "سیاه‌چالی پر از سلول‌ها و نگهبانانی که حداکثر سلامتی را کاهش می‌دهند.", access: "از مسیر فرعی نزدیک Distant Manor در Irithyll.", boss: "باس مستقیمی در خود سیاه‌چال ندارد", bonfires: ["Irithyll Dungeon"], highlights: ["آزاد کردن Siegward از سلول", "دسترسی به Profaned Capital", "ژست Path of the Dragon در مسیر مخفی"] },
  { id: "profaned-capital", name: "Profaned Capital", fa: "پایتخت نفرین‌شده", region: "main", order: 13, summary: "ویرانه‌های شهری فروپاشیده در کنار سیاه‌چال؛ مقصد مسیر مربوط به Yhorm.", access: "از آسانسور انتهای Irithyll Dungeon.", boss: "Yhorm the Giant", bonfires: ["Profaned Capital", "Yhorm the Giant"], highlights: ["نبرد Yhorm", "خط داستانی Siegward", "دسترسی به سلاح ویژهٔ نبرد باس"] },
  { id: "lothric-castle", name: "Lothric Castle", fa: "قلعهٔ لاثریک", region: "main", order: 14, summary: "قلعهٔ سلطنتی محافظت‌شده با شوالیه‌ها، اژدهایان و مسیرهای بلند سنگی.", access: "پس از رویداد Dancer of the Boreal Valley در High Wall.", boss: "مواجههٔ Dragonslayer Armour در مسیر؛ سپس Twin Princes در مسیر متصل", bonfires: ["Lothric Castle", "Dragon Barracks", "Dragonslayer Armour"], highlights: ["Dragon Barracks و اژدهایان", "مسیر ورود به Grand Archives"] },
  { id: "consumed-kings-garden", name: "Consumed King's Garden", fa: "باغ پادشاه بلعیده‌شده", region: "optional", order: 15, summary: "باغی مسموم در زیر قلعه که به اتاق پادشاهی دچار جنون ختم می‌شود.", access: "از بالای نردبان نزدیک bonfire مربوط به Dancer؛ مسیر سمت چپ.", boss: "Oceiros, the Consumed King", bonfires: ["Consumed King's Garden", "Oceiros, the Consumed King"], highlights: ["دسترسی به Untended Graves", "دریافت ژست Path of the Dragon در مسیر پس از باس"] },
  { id: "untended-graves", name: "Untended Graves", fa: "گورستان دست‌نخورده", region: "optional", order: 16, summary: "بازتابی تاریک از منطقهٔ آغازین؛ محیطی خاموش با نسخه‌ای قدرتمندتر از یک باس آشنا.", access: "پس از Oceiros، دیوار توهمی انتهای مسیر را پیدا کن.", boss: "Champion Gundyr", bonfires: ["Untended Graves", "Champion Gundyr"], highlights: ["نسخهٔ تاریک Firelink Shrine", "دسترسی به آیتم‌های ویژهٔ Shrine Handmaid"] },
  { id: "grand-archives", name: "Grand Archives", fa: "آرشیو بزرگ", region: "main", order: 17, summary: "کتابخانه‌ای عظیم با موم جادویی، بام‌ها و مسیرهای عمودی پیچیده.", access: "از دروازهٔ کنار پل Dragonslayer Armour؛ پس از دریافت کلید مربوطه.", boss: "Lothric, Younger Prince و Lorian, Elder Prince", bonfires: ["Grand Archives", "Twin Princes"], highlights: ["مسیرهای بام و آسانسورها", "نبرد پایانی با Twin Princes", "پیشروی به پایان مسیر اصلی"] },
  { id: "archdragon-peak", name: "Archdragon Peak", fa: "قلهٔ اژدها", region: "optional", order: 18, summary: "قله‌ای دورافتاده با آیین‌های اژدهایی، مارهای جنگجو و دو رویارویی ویژه.", access: "ژست Path of the Dragon را کنار مجسمهٔ اژدهایی در Irithyll Dungeon اجرا کن.", boss: "Ancient Wyvern و Nameless King", bonfires: ["Archdragon Peak", "Dragon-Kin Mausoleum", "Great Belfry", "Nameless King"], highlights: ["Ancient Wyvern", "نبرد اختیاری Nameless King", "پاداش‌های ویژهٔ مسیر اژدها"] },
  { id: "kiln", name: "Kiln of the First Flame", fa: "کورهٔ نخستین شعله", region: "hub", order: 19, summary: "مقصد نهایی سفر اصلی؛ سرزمینی خاکستری و ویران که نبرد آخر در آن رخ می‌دهد.", access: "پس از قرار دادن چهار Cinders of a Lord در تخت‌های Firelink Shrine.", boss: "Soul of Cinder", bonfires: ["Kiln of the First Flame", "Flameless Shrine"], highlights: ["نبرد پایانی بازی اصلی", "انتخاب پایان پس از نبرد"] },
  { id: "painted-world", name: "Painted World of Ariandel", fa: "دنیای نقاشی‌شدهٔ آریاندل", region: "dlc", order: 20, summary: "دنیایی برفی و منزوی از DLC اول؛ با روستا، کلیسا و رازهای درون نقاشی.", access: "با صحبت با Slave Knight Gael در Cleansing Chapel و لمس نقاشی.", boss: "Champion's Gravetender و Sister Friede", bonfires: ["Snowfield", "Rope Bridge Cave", "Ariandel Chapel", "Depths of the Painting", "Champion's Gravetender", "Sister Friede"], highlights: ["مسیرهای برفی و پل طنابی", "نبرد چندمرحله‌ای Sister Friede", "دسترسی به Undead Match"] },
  { id: "dreg-heap", name: "The Dreg Heap", fa: "تودهٔ تفاله‌ها", region: "dlc", order: 21, summary: "آغاز DLC دوم؛ بقایای به‌هم‌ریختهٔ سرزمین‌ها که در پایان عصر جهان گرد آمده‌اند.", access: "از DLC The Ringed City؛ یا پس از پایان Ashes of Ariandel از آتش مخصوص DLC.", boss: "Demon in Pain و Demon from Below؛ سپس Demon Prince", bonfires: ["The Dreg Heap", "Earthen Peak Ruins", "Within the Earthen Peak Ruins", "The Demon Prince"], highlights: ["سقوط‌های عمودی و مسیرهای لایه‌ای", "نبرد Demon Prince", "راه ورود به The Ringed City"] },
  { id: "ringed-city", name: "The Ringed City", fa: "شهر حلقه‌ای", region: "dlc", order: 22, summary: "منطقهٔ پایانی DLC با شهر باستانی، شوالیه‌های حلقه‌ای و رازهای انتهای جهان.", access: "از The Dreg Heap پس از شکست Demon Prince.", boss: "Halflight, Spear of the Church؛ Darkeater Midir؛ Slave Knight Gael", bonfires: ["Mausoleum Lookout", "Ringed Inner Wall", "Ringed City Streets", "Shared Grave", "Church of Filianore", "Filianore's Rest", "Slave Knight Gael"], highlights: ["نبرد اختیاری Darkeater Midir", "رویارویی Halflight", "نبرد پایانی Slave Knight Gael"] },
];


function normalize(value: string) {
  return value.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

const REGION_STYLE: Record<Region, { label: string; color: string; badge: string }> = {
  main: { label: "مسیر اصلی", color: "#d7b76f", badge: "border-[#c8a15b]/30 bg-[#c8a15b]/10 text-[#e8cc8d]" },
  optional: { label: "اختیاری", color: "#8bc8c1", badge: "border-teal-300/20 bg-teal-300/[.07] text-teal-100" },
  dlc: { label: "DLC", color: "#b5a0ed", badge: "border-violet-300/20 bg-violet-300/[.07] text-violet-100" },
  hub: { label: "هاب / پایان", color: "#e4d5b3", badge: "border-white/15 bg-white/[.06] text-[#eee3ce]" },
};

const ART: Record<string, string> = {
  "cemetery-of-ash": "from-slate-700/70 via-stone-950 to-black",
  "firelink-shrine": "from-amber-900/50 via-stone-950 to-black",
  "high-wall": "from-sky-950 via-slate-950 to-black",
  "undead-settlement": "from-orange-950/70 via-stone-950 to-black",
  "road-of-sacrifices": "from-emerald-950/70 via-stone-950 to-black",
  "farron-keep": "from-teal-950 via-emerald-950 to-black",
  "cathedral-of-the-deep": "from-indigo-950 via-slate-950 to-black",
  "catacombs": "from-orange-950/60 via-neutral-950 to-black",
  "smouldering-lake": "from-red-950 via-stone-950 to-black",
  "irithyll": "from-cyan-950 via-blue-950 to-black",
  "anor-londo": "from-indigo-950 via-violet-950 to-black",
  "irithyll-dungeon": "from-slate-800 via-slate-950 to-black",
  "profaned-capital": "from-yellow-950/60 via-stone-950 to-black",
  "lothric-castle": "from-blue-950 via-slate-950 to-black",
  "consumed-kings-garden": "from-lime-950/60 via-stone-950 to-black",
  "untended-graves": "from-neutral-800 via-stone-950 to-black",
  "grand-archives": "from-amber-950/60 via-stone-950 to-black",
  "archdragon-peak": "from-sky-900/60 via-slate-950 to-black",
  "kiln": "from-orange-950/70 via-neutral-950 to-black",
  "painted-world": "from-blue-200/20 via-indigo-950 to-black",
  "dreg-heap": "from-stone-700/60 via-stone-950 to-black",
  "ringed-city": "from-violet-950 via-stone-950 to-black",
};

export default function LocationsArchive() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [progressFilter, setProgressFilter] = useState<"all" | "visited" | "unvisited">("all");
  const [visited, setVisited] = useState<string[]>([]);
  const [selected, setSelected] = useState<LocationEntry | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setVisited(parsed.filter((id): id is string => typeof id === "string"));
      }
    } catch { /* Archive remains usable if storage is unavailable. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(visited)); } catch { /* Ignore storage restrictions. */ }
  }, [visited, ready]);

  const filtered = useMemo(() => {
    const needle = normalize(query);
    return LOCATIONS.filter((item) => {
      const matchesSearch = !needle || normalize(`${item.name} ${item.fa} ${item.boss} ${item.bonfires.join(" ")}`).includes(needle);
      const matchesRegion = region === "all" || item.region === region;
      const matchesProgress = progressFilter === "all" || (progressFilter === "visited" ? visited.includes(item.id) : !visited.includes(item.id));
      return matchesSearch && matchesRegion && matchesProgress;
    });
  }, [query, region, progressFilter, visited]);

  const completedCount = LOCATIONS.filter((item) => visited.includes(item.id)).length;
  const percent = Math.round((completedCount / LOCATIONS.length) * 100);
  const mainRoute = LOCATIONS.filter((item) => item.region === "main" || item.region === "hub").sort((a, b) => a.order - b.order);
  const featured = LOCATIONS.find((item) => item.id === "irithyll") ?? LOCATIONS[0];

  const toggleVisited = (id: string) => {
    setVisited((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <section className="relative isolate overflow-hidden rounded-[28px] border border-[#c8a15b]/25 bg-[#090b0a] text-[#eee6d5] shadow-[0_35px_100px_rgba(0,0,0,.55)]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,161,91,.16),transparent_35%),radial-gradient(ellipse_at_0%_65%,rgba(37,74,66,.18),transparent_35%),linear-gradient(180deg,#101311,#080a09_58%,#0d0d0b)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[.08]" style={{ backgroundImage: "url('/images/ds3/bonfire-background.png')", backgroundSize: "cover", backgroundPosition: "center", mixBlendMode: "screen" }} />

      {/* Cinematic opening */}
      <header className="relative min-h-[360px] overflow-hidden border-b border-[#c8a15b]/20 sm:min-h-[430px]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,6,.97)_0%,rgba(5,7,6,.78)_48%,rgba(5,7,6,.24)_100%),linear-gradient(0deg,#090b0a_0%,transparent_48%)]" />
        <div className="absolute -right-12 top-[-80px] h-[430px] w-[430px] rounded-full border border-[#c8a15b]/10 sm:right-[6%] sm:top-[-105px] sm:h-[560px] sm:w-[560px]">
          <div className="absolute inset-5 rounded-full border border-[#c8a15b]/10" />
          <div className="absolute inset-12 rounded-full border border-dashed border-[#c8a15b]/15" />
          <div className="absolute left-1/2 top-1/2 h-[72%] w-px -translate-x-1/2 -translate-y-1/2 rotate-[35deg] bg-gradient-to-b from-transparent via-[#c8a15b]/40 to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-[72%] w-px -translate-x-1/2 -translate-y-1/2 -rotate-[35deg] bg-gradient-to-b from-transparent via-[#c8a15b]/25 to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f0d28b] shadow-[0_0_24px_8px_rgba(200,161,91,.45)]" />
        </div>
        <div className="absolute bottom-0 right-[16%] hidden h-[76%] w-[24%] opacity-50 sm:block">
          <div className="absolute bottom-0 left-[36%] h-[84%] w-[20%] border-x border-t border-[#b6a17a]/25 bg-gradient-to-b from-[#9b8964]/10 to-transparent" />
          <div className="absolute bottom-[62%] left-[30%] h-[5%] w-[32%] border border-[#b6a17a]/25 bg-[#0b0d0b]" />
          <div className="absolute bottom-[84%] left-[42%] h-[16%] w-[8%] bg-[#b6a17a]/20 [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
          <div className="absolute bottom-0 left-[5%] h-[53%] w-[24%] border-x border-t border-[#b6a17a]/20 bg-gradient-to-b from-[#9b8964]/10 to-transparent" />
          <div className="absolute bottom-[48%] left-0 h-[5%] w-[34%] border border-[#b6a17a]/20 bg-[#0b0d0b]" />
        </div>
        <div className="relative mx-auto flex min-h-[360px] max-w-[1500px] flex-col justify-between gap-10 px-5 py-7 sm:min-h-[430px] sm:px-9 sm:py-10 lg:px-12">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c8a15b]/50 bg-black/35 text-xl text-[#e3c47e]">✥</span><div><p className="text-[9px] tracking-[.28em] text-[#d6bb7a]">SOULS GATE / FIELD ARCHIVE</p><p className="mt-1 text-[10px] text-white/45">DARK SOULS III • WORLD ATLAS</p></div></div>
            <span className="hidden rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[9px] tracking-[.22em] text-white/55 sm:inline-flex">THE AGE OF FIRE</span>
          </div>
          <div className="max-w-3xl pb-2">
            <div className="mb-4 flex items-center gap-3 text-[10px] tracking-[.28em] text-[#d6bb7a]"><span className="h-px w-8 bg-[#c8a15b]/70" /> EXPLORE THE FORGOTTEN KINGDOM</div>
            <h2 className="font-serif text-5xl font-semibold leading-[.95] tracking-[-.045em] text-[#f2eadb] drop-shadow-[0_8px_30px_rgba(0,0,0,.7)] sm:text-7xl lg:text-8xl">THE ASHEN<br /><span className="text-[#d4b16a]">KINGDOM</span></h2>
            <p dir="rtl" className="mt-5 max-w-xl text-sm leading-7 text-[#d2c9b8]/80 sm:text-base">از نخستین شعله تا پایان عصر خاکستر؛ مسیرها را کشف کن، باس‌ها را پیدا کن و سفر خودت را ثبت کن.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => document.getElementById("location-explorer")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="group inline-flex items-center gap-3 rounded-full border border-[#e2c47f]/70 bg-[#c8a15b] px-5 py-3 text-xs font-semibold text-[#17130b] shadow-[0_0_30px_rgba(200,161,91,.15)] transition hover:bg-[#eed69b]"><span>شروع اکتشاف</span><span className="transition group-hover:translate-x-1">←</span></button>
              <div className="rounded-full border border-white/10 bg-black/35 px-4 py-3 text-xs text-[#d4c9b6]"><span className="text-[#e2c47f]">{LOCATIONS.length}</span> منطقهٔ ثبت‌شده <span className="mx-2 text-white/20">/</span> <span className="text-[#e2c47f]">{completedCount}</span> کشف‌شده</div>
            </div>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-5 border-t border-white/10 pt-4 text-[9px] tracking-[.2em] text-white/35"><span>LOTHRIC • IRITHYLL • THE RINGED CITY</span><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e1bd6f] shadow-[0_0_12px_#c8a15b]" /> EXPEDITION LOG ACTIVE</span></div>
        </div>
      </header>

      <div id="location-explorer" className="scroll-mt-24 p-4 sm:p-7 lg:p-9">
        {/* Progress and feature */}
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,.6fr)]">
          <button type="button" onClick={() => setSelected(featured)} className="group relative min-h-[220px] overflow-hidden rounded-2xl border border-[#c8a15b]/25 bg-[linear-gradient(115deg,rgba(17,29,30,.96),rgba(8,11,11,.94)_62%,rgba(26,20,13,.96))] p-5 text-right transition hover:border-[#d8b86f]/55 sm:p-7">
            <div className="absolute -left-12 -top-16 h-64 w-64 rounded-full border border-cyan-100/[.08] transition duration-700 group-hover:scale-110"><div className="absolute inset-6 rounded-full border border-cyan-100/[.07]" /><div className="absolute inset-14 rounded-full border border-dashed border-cyan-100/[.09]" /></div>
            <div className="absolute bottom-[-40px] left-[22%] h-48 w-48 rounded-full bg-cyan-300/[.06] blur-3xl" />
            <div className="relative flex h-full flex-col justify-between gap-7 sm:flex-row sm:items-end">
              <div className="max-w-lg"><span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-100/[.06] px-3 py-1.5 text-[10px] text-cyan-100/80"><span className="h-1.5 w-1.5 rounded-full bg-cyan-200" /> منطقهٔ منتخب</span><h3 className="mt-4 font-serif text-3xl text-[#f0e8da] sm:text-4xl">{featured.name}</h3><p className="mt-1 text-sm text-cyan-100/70">{featured.fa}</p><p className="mt-4 max-w-md text-xs leading-6 text-[#bcbdb4]">{featured.summary}</p></div>
              <div className="shrink-0 text-left"><p className="text-[9px] tracking-[.2em] text-white/35">FEATURED DESTINATION</p><p className="mt-2 font-serif text-5xl text-cyan-100/80">{String(featured.order).padStart(2, "0")}</p><p className="mt-2 text-xs text-[#d6bd82]">مشاهدهٔ پرونده ↗</p></div>
            </div>
          </button>
          <div className="rounded-2xl border border-white/10 bg-[#101310]/85 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4"><div><p className="text-[9px] tracking-[.22em] text-[#bba16a]">YOUR JOURNEY</p><h3 className="mt-2 font-serif text-2xl text-[#f0e5d2]">دفتر اکتشاف</h3><p className="mt-1 text-xs text-white/45">پیشرفت سفر تو در لاثریک</p></div><div className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full" style={{ background: `conic-gradient(#d6b66f ${percent * 3.6}deg,rgba(255,255,255,.08) 0deg)` }}><div className="absolute inset-[5px] rounded-full bg-[#101310]"/><span className="relative font-serif text-xl text-[#e6ca88]">{percent}%</span></div></div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[.07]"><div className="h-full rounded-full bg-gradient-to-r from-[#776032] via-[#c8a15b] to-[#f1d99b] transition-all duration-700" style={{ width: `${percent}%` }} /></div>
            <div className="mt-4 flex items-end justify-between"><div><p className="text-2xl font-light text-[#e6d8bd]">{String(completedCount).padStart(2, "0")}<span className="text-sm text-white/30"> / {LOCATIONS.length}</span></p><p className="mt-1 text-[10px] text-white/40">منطقه کشف‌شده</p></div><button type="button" onClick={() => setProgressFilter(progressFilter === "visited" ? "all" : "visited")} className="rounded-full border border-[#c8a15b]/25 px-3 py-2 text-[10px] text-[#dfc47e] transition hover:bg-[#c8a15b]/10">دیدن کشف‌شده‌ها ↗</button></div>
          </div>
        </div>

        {/* Route ribbon */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-[#c8a15b]/20 bg-[#0c0f0d]/90">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[.07] px-5 py-4"><div><p className="text-[9px] tracking-[.22em] text-[#bba16a]">THE CRITICAL PATH</p><h3 className="mt-1 font-serif text-xl text-[#eee3cf]">مسیر اصلی سفر</h3></div><span className="text-[10px] text-white/35">از آغاز تا پایان بازی</span></div>
          <div className="route-scroll flex gap-0 overflow-x-auto px-4 py-5 sm:px-6">
            {mainRoute.map((item, index) => <div key={item.id} className="flex min-w-[145px] flex-1 items-center">
              <button type="button" onClick={() => setSelected(item)} className="group flex min-w-0 flex-col items-center text-center">
                <span className={`relative flex h-11 w-11 items-center justify-center rounded-full border text-xs transition duration-300 group-hover:scale-110 ${visited.includes(item.id) ? "border-[#e6cb86] bg-[#c8a15b]/20 text-[#f2dca2] shadow-[0_0_18px_rgba(200,161,91,.18)]" : "border-[#c8a15b]/25 bg-[#141713] text-[#c8a15b] group-hover:border-[#e6cb86]/70"}`}>{visited.includes(item.id) ? "✓" : String(index + 1).padStart(2, "0")}<span className="absolute -inset-1 rounded-full border border-[#c8a15b]/0 transition group-hover:border-[#c8a15b]/25" /></span>
                <span className="mt-3 max-w-[132px] text-[11px] leading-5 text-[#d8cebd] transition group-hover:text-[#f0d48b]">{item.fa}</span><span className="mt-1 max-w-[132px] truncate text-[9px] text-white/30" dir="ltr">{item.name}</span>
              </button>
              {index < mainRoute.length - 1 && <div className="mb-10 mx-2 h-px min-w-5 flex-1 bg-gradient-to-r from-[#c8a15b]/50 to-[#c8a15b]/10"><span className="relative -top-[7px] float-right text-[11px] text-[#c8a15b]/60">›</span></div>}
            </div>)}
          </div>
        </div>

        {/* Search / filters */}
        <div className="mt-10 flex flex-col gap-5 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="text-[9px] tracking-[.25em] text-[#bba16a]">CHOOSE YOUR DESTINATION</p><h3 className="mt-2 font-serif text-3xl text-[#f0e5d2]">مناطق لاثریک</h3><p className="mt-2 text-xs leading-6 text-white/45">هر منطقه پرونده، مسیر دسترسی، باس‌ها و بون‌فایرهای خودش را دارد.</p></div>
          <div className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-[590px]">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 focus-within:border-[#c8a15b]/50"><span className="text-lg text-[#c8a15b]">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جست‌وجوی منطقه، باس یا بون‌فایر..." className="min-w-0 w-full bg-transparent py-3 text-xs text-[#eee3cf] outline-none placeholder:text-white/30" />{query && <button type="button" onClick={() => setQuery("")} className="px-1 text-white/40 hover:text-white">×</button>}</label>
            <select aria-label="فیلتر نوع منطقه" value={region} onChange={(event) => setRegion(event.target.value as Region | "all")} className="rounded-xl border border-white/10 bg-[#111411] px-3 py-3 text-xs text-[#d5cbb9] outline-none focus:border-[#c8a15b]/50">{(Object.keys(REGION_LABELS) as Array<Region | "all">).map((key) => <option key={key} value={key}>{REGION_LABELS[key]}</option>)}</select>
            <select aria-label="فیلتر پیشرفت" value={progressFilter} onChange={(event) => setProgressFilter(event.target.value as "all" | "visited" | "unvisited")} className="rounded-xl border border-white/10 bg-[#111411] px-3 py-3 text-xs text-[#d5cbb9] outline-none focus:border-[#c8a15b]/50"><option value="all">همه</option><option value="visited">کشف‌شده</option><option value="unvisited">کشف‌نشده</option></select>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-[10px] text-white/35"><span>{filtered.length} مقصد در دفتر ثبت شده</span><span>روی کارت بزن تا جزئیات باز شود</span></div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => {
            const style = REGION_STYLE[item.region];
            const isVisited = visited.includes(item.id);
            return <article key={item.id} className={`group relative isolate min-h-[265px] overflow-hidden rounded-2xl border bg-[#101310] transition duration-300 hover:-translate-y-1 hover:border-[#c8a15b]/45 hover:shadow-[0_20px_50px_rgba(0,0,0,.35)] ${isVisited ? "border-[#c8a15b]/30" : "border-white/[.09]"}`}>
              <div className={`absolute inset-0 -z-20 bg-gradient-to-br ${ART[item.id] ?? "from-stone-800 via-stone-950 to-black"}`} />
              <div className="absolute inset-0 -z-10 opacity-70 transition duration-500 group-hover:scale-105" style={{ backgroundImage: "radial-gradient(ellipse at 75% 10%,rgba(220,194,130,.18),transparent 28%),linear-gradient(135deg,transparent 20%,rgba(0,0,0,.4) 70%),url('/images/ds3/bonfire-background.png')", backgroundSize: "cover", backgroundPosition: "center", mixBlendMode: "screen" }} />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#070908] via-[#080a09]/65 to-black/10" />
              <div className="absolute -right-5 -top-7 -z-10 select-none font-serif text-[150px] leading-none text-white/[.035] transition duration-500 group-hover:text-[#e2c47f]/[.09]">{String(item.order).padStart(2, "0")}</div>
              <div className="flex items-start justify-between gap-3 p-4"><span className={`rounded-full border px-3 py-1.5 text-[9px] ${style.badge}`}>{style.label}</span><button type="button" aria-label={isVisited ? "لغو ثبت بازدید" : "ثبت بازدید"} onClick={() => toggleVisited(item.id)} className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs transition ${isVisited ? "border-[#d9bc78]/60 bg-[#c8a15b]/20 text-[#f0d58f]" : "border-white/15 bg-black/25 text-white/45 hover:border-[#c8a15b]/50 hover:text-[#e2c47f]"}`}>{isVisited ? "✓" : "＋"}</button></div>
              <button type="button" onClick={() => setSelected(item)} className="flex min-h-[178px] w-full flex-col justify-end p-5 text-right sm:p-6">
                <p className="text-[9px] tracking-[.2em] text-white/40" dir="ltr">REGION {String(item.order).padStart(2, "0")}</p><h4 className="mt-2 font-serif text-2xl leading-tight text-[#f1e8d8] transition group-hover:text-[#f1d58f]">{item.name}</h4><p className="mt-1 text-sm text-[#d4b56f]">{item.fa}</p><p className="mt-3 line-clamp-2 text-xs leading-6 text-[#c4bcae]/75">{item.summary}</p>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-3"><span className="min-w-0 truncate text-[10px] text-white/45">♜ {item.boss}</span><span className="shrink-0 text-xs text-[#d8b76d] transition group-hover:-translate-x-1">پرونده ←</span></div>
              </button>
              {isVisited && <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#d7b76f] to-transparent" />}
            </article>;
          })}
        </div>
        {filtered.length === 0 && <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-6 py-14 text-center"><p className="font-serif text-2xl text-[#e5d8c0]">مقصدی پیدا نشد</p><p className="mt-2 text-xs text-white/45">عبارت جست‌وجو یا فیلترها را تغییر بده.</p><button type="button" onClick={() => { setQuery(""); setRegion("all"); setProgressFilter("all"); }} className="mt-5 rounded-full border border-[#c8a15b]/30 px-4 py-2 text-xs text-[#e0c47f] hover:bg-[#c8a15b]/10">پاک‌کردن فیلترها</button></div>}
      </div>

      {selected && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="location-detail-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#c8a15b]/40 bg-[linear-gradient(145deg,#191b17,#0c0e0e_55%,#17130c)] shadow-[0_30px_120px_rgba(0,0,0,.8)]">
          <div className="relative overflow-hidden border-b border-[#c8a15b]/20 p-5 sm:p-7"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(200,161,91,.18),transparent_55%)]"/><div className="relative flex items-start justify-between gap-4"><div><p className="mb-2 text-[9px] tracking-[.25em] text-[#c8a15b]" dir="ltr">LOCATION DOSSIER / {String(selected.order).padStart(2, "0")}</p><h3 id="location-detail-title" className="font-serif text-2xl text-[#f0e5d2] sm:text-3xl">{selected.name}</h3><p className="mt-2 text-sm text-[#c8a15b]">{selected.fa}</p></div><button type="button" aria-label="بستن جزئیات" onClick={() => setSelected(null)} className="rounded-lg border border-white/10 px-3 py-2 text-[#c9c0b2] hover:border-[#c8a15b]/50">✕</button></div></div>
          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7"><div className="sm:col-span-2"><p className="text-sm leading-7 text-[#c4bcb0]">{selected.summary}</p></div><div className="rounded-xl border border-white/10 bg-black/20 p-4"><h4 className="mb-2 text-sm font-semibold text-[#c8a15b]">مسیر دسترسی</h4><p className="text-sm leading-6 text-[#b0a99e]">{selected.access}</p></div><div className="rounded-xl border border-white/10 bg-black/20 p-4"><h4 className="mb-2 text-sm font-semibold text-[#c8a15b]">باس یا مواجههٔ مهم</h4><p className="text-sm text-[#ddd2c0]">{selected.boss}</p></div><div className="rounded-xl border border-white/10 bg-black/20 p-4"><h4 className="mb-3 text-sm font-semibold text-[#c8a15b]">بون‌فایرهای شناخته‌شده</h4><div className="flex flex-wrap gap-2">{selected.bonfires.map((bonfire) => <span key={bonfire} className="rounded-lg border border-[#c8a15b]/15 bg-[#c8a15b]/[.04] px-3 py-2 text-xs text-[#c8c0b4]">✦ {bonfire}</span>)}</div></div><div className="rounded-xl border border-white/10 bg-black/20 p-4"><h4 className="mb-3 text-sm font-semibold text-[#c8a15b]">نکات مهم</h4><ul className="space-y-2">{selected.highlights.map((highlight) => <li key={highlight} className="flex gap-2 text-sm leading-6 text-[#b0a99e]"><span className="text-[#c8a15b]">◆</span><span>{highlight}</span></li>)}</ul></div><button type="button" onClick={() => toggleVisited(selected.id)} className={`sm:col-span-2 w-full rounded-lg px-4 py-3 text-sm transition ${visited.includes(selected.id) ? "bg-[#c8a15b] text-[#15120d]" : "border border-[#c8a15b]/40 text-[#e7d4b2] hover:bg-[#c8a15b]/10"}`}>{visited.includes(selected.id) ? "✓ این منطقه بازدید شده" : "علامت‌گذاری به‌عنوان بازدیدشده"}</button></div>
        </div>
      </div>}
    </section>
  );
}
