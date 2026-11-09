"use client";

import { useEffect, useMemo, useState } from "react";

type Step = { id: string; text: string };
type Area = {
  id: string;
  number: string;
  name: string;
  fa: string;
  group: "main" | "optional" | "dlc";
  boss: string;
  note: string;
  steps: Step[];
};

const STORAGE_KEY = "souls-gate-ds3-walkthrough-v1";

const areas: Area[] = [
  { id: "cemetery", number: "01", name: "CEMETERY OF ASH", fa: "گورستان خاکستر", group: "main", boss: "Iudex Gundyr", note: "نقطه آغاز سفر؛ مسیر رسیدن به فایرلینک و نخستین آزمون جدی بازیکن.", steps: [
    { id: "cem-1", text: "مسیر ابتدایی را بگرد و آیتم‌های قابل‌دسترسی را بردار." },
    { id: "cem-2", text: "به بون‌فایر ورودی منطقه برس." },
    { id: "cem-3", text: "Iudex Gundyr را شکست بده." },
    { id: "cem-4", text: "به Firelink Shrine برو." },
  ] },
  { id: "firelink", number: "02", name: "FIRELINK SHRINE", fa: "معبد فایرلینک", group: "main", boss: "—", note: "پایگاه اصلی؛ ارتقا، خرید، ارتقای سطح و پیگیری شخصیت‌هایی که ملاقات می‌کنی.", steps: [
    { id: "fire-1", text: "با Fire Keeper و Blacksmith Andre آشنا شو." },
    { id: "fire-2", text: "با Shrine Handmaid صحبت کن و امکانات فروشگاه را بررسی کن." },
    { id: "fire-3", text: "با Ludleth و شخصیت‌های حاضر در معبد صحبت کن." },
    { id: "fire-4", text: "از بون‌فایر به High Wall of Lothric سفر کن." },
  ] },
  { id: "high-wall", number: "03", name: "HIGH WALL OF LOTHRIC", fa: "دیوار بلند لاثریک", group: "main", boss: "Vordt of the Boreal Valley", note: "اولین منطقه بزرگ؛ سلول‌ها، برج‌ها و مسیر بازشدن راه به Undead Settlement.", steps: [
    { id: "wall-1", text: "بون‌فایرهای منطقه را فعال کن و مسیرهای فرعی را بررسی کن." },
    { id: "wall-2", text: "با Emma صحبت کن و Small Lothric Banner را دریافت کن." },
    { id: "wall-3", text: "در صورت تمایل Greirat را از سلول آزاد کن." },
    { id: "wall-4", text: "Vordt of the Boreal Valley را شکست بده." },
    { id: "wall-5", text: "از بنر برای رسیدن به Undead Settlement استفاده کن." },
  ] },
  { id: "settlement", number: "04", name: "UNDEAD SETTLEMENT", fa: "سکونتگاه نامردگان", group: "main", boss: "Curse-Rotted Greatwood (اختیاری)", note: "منطقه‌ای پر از مسیرهای فرعی و شخصیت‌های قابل‌ملاقات؛ چند مأموریت جانبی از اینجا آغاز می‌شوند.", steps: [
    { id: "set-1", text: "با Yoel of Londor در مسیر ورودی صحبت کن؛ اگر مسیر مأموریتش را می‌خواهی، او را از دست نده." },
    { id: "set-2", text: "با Siegward در مسیر آسانسور ملاقات کن." },
    { id: "set-3", text: "Cornyx و Irina را در صورت تمایل پیدا و آزاد کن." },
    { id: "set-4", text: "Loretta's Bone را برای خط مأموریت Greirat پیدا کن." },
    { id: "set-5", text: "Curse-Rotted Greatwood را در صورت تمایل شکست بده." },
    { id: "set-6", text: "مسیر خروج به Road of Sacrifices را پیدا کن." },
  ] },
  { id: "road", number: "05", name: "ROAD OF SACRIFICES", fa: "جاده قربانی‌ها", group: "main", boss: "Crystal Sage", note: "مسیر اتصال به دو شاخه مهم: Cathedral of the Deep و Farron Keep.", steps: [
    { id: "road-1", text: "در Halfway Fortress با Anri و Horace صحبت کن." },
    { id: "road-2", text: "در صورت داشتن شرایط لازم، Orbeck of Vinheim را پیدا و استخدام کن." },
    { id: "road-3", text: "Crucifixion Woods و مسیرهای اطراف را بررسی کن." },
    { id: "road-4", text: "Crystal Sage را شکست بده." },
    { id: "road-5", text: "مسیر Cathedral of the Deep را باز کن." },
  ] },
  { id: "cathedral", number: "06", name: "CATHEDRAL OF THE DEEP", fa: "کلیسای اعماق", group: "main", boss: "Deacons of the Deep", note: "برای پیشروی اصلی ضروری است و نقطه دسترسی به DLC اول نیز محسوب می‌شود.", steps: [
    { id: "cat-1", text: "به Cleansing Chapel برس و بون‌فایر را فعال کن." },
    { id: "cat-2", text: "میان‌بُرهای کلیسا را باز کن." },
    { id: "cat-3", text: "در صورت تمایل، مسیرهای فرعی و آیتم‌های مهم را کامل بررسی کن." },
    { id: "cat-4", text: "Deacons of the Deep را شکست بده." },
    { id: "cat-5", text: "در صورت داشتن Ashes of Ariandel، مسیر ورود به DLC را بررسی کن." },
  ] },
  { id: "farron", number: "07", name: "FARRON KEEP", fa: "دژ فارون", group: "main", boss: "Abyss Watchers", note: "برای بازکردن راه، سه شعله خاموش می‌شوند؛ مراقب محیط باتلاقی باش.", steps: [
    { id: "far-1", text: "سه شعله اطراف باتلاق را خاموش کن." },
    { id: "far-2", text: "بون‌فایرها و مسیرهای امن میان باتلاق را پیدا کن." },
    { id: "far-3", text: "در صورت تمایل، Old Wolf of Farron و مسیرهای جانبی را بررسی کن." },
    { id: "far-4", text: "Abyss Watchers را شکست بده." },
    { id: "far-5", text: "راه Catacombs of Carthus را باز کن." },
  ] },
  { id: "catacombs", number: "08", name: "CATACOMBS OF CARTHUS", fa: "مقبره‌های کارثوس", group: "main", boss: "High Lord Wolnir", note: "مسیر اصلی به Irithyll از این منطقه عبور می‌کند؛ یک مسیر فرعی نیز به Smouldering Lake می‌رسد.", steps: [
    { id: "car-1", text: "مسیر اصلی مقبره‌ها را دنبال کن و بون‌فایرها را فعال کن." },
    { id: "car-2", text: "در صورت تمایل، مسیر مخفی Smouldering Lake را باز کن." },
    { id: "car-3", text: "High Lord Wolnir را شکست بده." },
    { id: "car-4", text: "به Irithyll of the Boreal Valley وارد شو." },
  ] },
  { id: "smouldering", number: "09", name: "SMOULDERING LAKE", fa: "دریاچه سوزان", group: "optional", boss: "Old Demon King", note: "منطقه فرعی زیرزمینی؛ برای تکمیل اکتشاف و جمع‌آوری آیتم‌ها ارزشمند است.", steps: [
    { id: "sm-1", text: "از مسیر مخفی Catacombs وارد دریاچه شو." },
    { id: "sm-2", text: "Demon Ruins و مسیرهای زیرزمینی را بررسی کن." },
    { id: "sm-3", text: "Old Demon King را در صورت تمایل شکست بده." },
    { id: "sm-4", text: "پیش از ترک منطقه، آیتم‌های قابل‌دسترسی را جمع‌آوری کن." },
  ] },
  { id: "irithyll", number: "10", name: "IRITHYLL OF THE BOREAL VALLEY", fa: "ایریتیل دره بورئال", group: "main", boss: "Pontiff Sulyvahn", note: "شهر یخی؛ پس از Pontiff مسیر Anor Londo باز می‌شود و راهی به Dungeon نیز وجود دارد.", steps: [
    { id: "iri-1", text: "از پل ورودی عبور کن و بون‌فایرهای شهر را فعال کن." },
    { id: "iri-2", text: "در Church of Yorshka با شخصیت‌های مرتبط صحبت کن." },
    { id: "iri-3", text: "مسیرهای فرعی و ساختمان‌های شهر را جست‌وجو کن." },
    { id: "iri-4", text: "Pontiff Sulyvahn را شکست بده." },
    { id: "iri-5", text: "مسیر Anor Londo و مسیر Irithyll Dungeon را بررسی کن." },
  ] },
  { id: "anor", number: "11", name: "ANOR LONDO", fa: "آنور لوندو", group: "main", boss: "Aldrich, Devourer of Gods", note: "یکی از مسیرهای اصلی رسیدن به Lord of Cinderها.", steps: [
    { id: "anor-1", text: "از مسیر بالارونده وارد شهر شو و بون‌فایر را فعال کن." },
    { id: "anor-2", text: "مسیرهای اطراف تالار اصلی را بررسی کن." },
    { id: "anor-3", text: "Aldrich, Devourer of Gods را شکست بده." },
    { id: "anor-4", text: "پس از نبرد، به Firelink Shrine بازگرد و وضعیت مأموریت‌ها را بررسی کن." },
  ] },
  { id: "dungeon", number: "12", name: "IRITHYLL DUNGEON", fa: "سیاه‌چال ایریتیل", group: "main", boss: "—", note: "مسیر زندان به Profaned Capital می‌رسد؛ آزادکردن برخی شخصیت‌ها و جمع‌آوری آیتم‌های کلیدی در اینجا ممکن است.", steps: [
    { id: "dun-1", text: "کلیدها و سلول‌های قابل‌دسترسی را بررسی کن." },
    { id: "dun-2", text: "در صورت تمایل، Siegward را از سلول آزاد کن." },
    { id: "dun-3", text: "مسیر خروج به Profaned Capital را پیدا کن." },
  ] },
  { id: "capital", number: "13", name: "PROFANED CAPITAL", fa: "پایتخت بی‌حرمتی‌شده", group: "main", boss: "Yhorm the Giant", note: "محل رویارویی با یکی از چهار Lord of Cinder.", steps: [
    { id: "cap-1", text: "بون‌فایر Profaned Capital را فعال کن." },
    { id: "cap-2", text: "ساختمان‌ها و مسیرهای اطراف را جست‌وجو کن." },
    { id: "cap-3", text: "Yhorm the Giant را شکست بده." },
    { id: "cap-4", text: "در صورت پیشرفت خط مأموریت Siegward، نتیجه آن را بررسی کن." },
  ] },
  { id: "consumed", number: "14", name: "CONSUMED KING'S GARDEN", fa: "باغ پادشاه بلعیده‌شده", group: "optional", boss: "Oceiros, the Consumed King", note: "منطقه فرعی که به Untended Graves و محتوای مخفی مرتبط می‌شود.", steps: [
    { id: "con-1", text: "پس از بازشدن مسیر Dancer، به باغ دسترسی پیدا کن." },
    { id: "con-2", text: "مسیرهای باغ و آیتم‌های آن را بررسی کن." },
    { id: "con-3", text: "Oceiros را شکست بده." },
    { id: "con-4", text: "ژست Path of the Dragon را در بخش پنهان پیدا کن." },
  ] },
  { id: "untended", number: "15", name: "UNTENDED GRAVES", fa: "قبرهای متروک", group: "optional", boss: "Champion Gundyr", note: "نسخه‌ای پنهان و تاریک از منطقه آغازین بازی.", steps: [
    { id: "unt-1", text: "از مسیر مخفی پس از Oceiros وارد منطقه شو." },
    { id: "unt-2", text: "بون‌فایر و محیط قبرستان را بررسی کن." },
    { id: "unt-3", text: "Champion Gundyr را شکست بده." },
    { id: "unt-4", text: "Firelink Shrine تاریک را جست‌وجو کن." },
  ] },
  { id: "lothric", number: "16", name: "LOTHRIC CASTLE", fa: "قلعه لاثریک", group: "main", boss: "Dancer of the Boreal Valley / Dragonslayer Armour / Twin Princes", note: "پس از فراهم‌شدن شرایط، مسیر قلعه و نبردهای پایانی آن در دسترس قرار می‌گیرد.", steps: [
    { id: "lot-1", text: "پس از فعال‌شدن مسیر، از Dancer's bonfire وارد قلعه شو." },
    { id: "lot-2", text: "Dragon Barracks و مسیرهای اطراف را بررسی کن." },
    { id: "lot-3", text: "Dragonslayer Armour را شکست بده." },
    { id: "lot-4", text: "مسیر Grand Archives را باز کن." },
  ] },
  { id: "archives", number: "17", name: "GRAND ARCHIVES", fa: "بایگانی بزرگ", group: "main", boss: "Lothric, Younger Prince / Lorian, Elder Prince", note: "آخرین مسیر اصلی پیش از گردآوردن Cinders و رفتن به Kiln.", steps: [
    { id: "arc-1", text: "کلید ورود را دریافت کن و وارد بایگانی شو." },
    { id: "arc-2", text: "میان‌برها و بون‌فایرهای طبقات مختلف را باز کن." },
    { id: "arc-3", text: "مسیر پشت‌بام‌ها را بررسی کن." },
    { id: "arc-4", text: "Twin Princes را شکست بده." },
    { id: "arc-5", text: "پیش از پایان، مأموریت‌های باقی‌مانده را بررسی کن." },
  ] },
  { id: "archdragon", number: "18", name: "ARCHDRAGON PEAK", fa: "قله آرک‌دراگون", group: "optional", boss: "Ancient Wyvern / Nameless King", note: "منطقه مخفی و اختیاری که با ژست Path of the Dragon قابل‌دسترسی است.", steps: [
    { id: "arch-1", text: "در محل مناسب از ژست Path of the Dragon استفاده کن." },
    { id: "arch-2", text: "مسیر قله و بون‌فایرها را پیدا کن." },
    { id: "arch-3", text: "Ancient Wyvern را شکست بده." },
    { id: "arch-4", text: "Nameless King را در صورت تمایل شکست بده." },
  ] },
  { id: "ariandel", number: "19", name: "ASHES OF ARIANDEL", fa: "خاکسترهای آریاندل · DLC", group: "dlc", boss: "Champion's Gravetender / Sister Friede", note: "DLC اول؛ ورود از Cathedral of the Deep و گفت‌وگو با شخصیت کنار نقاشی.", steps: [
    { id: "ari-1", text: "از Cathedral of the Deep وارد Painted World شو." },
    { id: "ari-2", text: "Snowfield و مسیرهای فرعی را کاوش کن." },
    { id: "ari-3", text: "Corvian Settlement و Ariandel Chapel را پیدا کن." },
    { id: "ari-4", text: "Champion's Gravetender را در صورت تمایل شکست بده." },
    { id: "ari-5", text: "Sister Friede را شکست بده." },
  ] },
  { id: "dreg", number: "20", name: "THE DREG HEAP", fa: "توده خاکستر · DLC", group: "dlc", boss: "Demon Prince", note: "آغاز The Ringed City؛ از محتوای پایانی DLC محسوب می‌شود.", steps: [
    { id: "dreg-1", text: "از بون‌فایر مخصوص DLC وارد The Dreg Heap شو." },
    { id: "dreg-2", text: "مسیرهای ویران و میان‌برها را پیدا کن." },
    { id: "dreg-3", text: "Demon in Pain و Demon from Below را شکست بده تا به Demon Prince برسی." },
    { id: "dreg-4", text: "پس از نبرد، راه Ringed City را ادامه بده." },
  ] },
  { id: "ringed", number: "21", name: "THE RINGED CITY", fa: "شهر حلقه‌شده · DLC", group: "dlc", boss: "Halflight / Darkeater Midir / Slave Knight Gael", note: "پایان ماجراجویی DLC؛ برخی رویارویی‌ها اختیاری‌اند.", steps: [
    { id: "ring-1", text: "از The Ringed City و خیابان‌های ویران عبور کن." },
    { id: "ring-2", text: "در صورت تمایل، مسیر مخفی Darkeater Midir را کامل کن." },
    { id: "ring-3", text: "Halflight را شکست بده." },
    { id: "ring-4", text: "Slave Knight Gael را شکست بده." },
    { id: "ring-5", text: "Blood of the Dark Soul را دریافت کن." },
  ] },
  { id: "kiln", number: "22", name: "KILN OF THE FIRST FLAME", fa: "کوره نخستین شعله", group: "main", boss: "Soul of Cinder", note: "پایان مسیر اصلی؛ پیش از انتخاب پایان، کارهای باقی‌مانده و مأموریت‌ها را بررسی کن.", steps: [
    { id: "kiln-1", text: "پس از قرارگرفتن Cinders روی تخت‌ها، به Kiln سفر کن." },
    { id: "kiln-2", text: "پیش از نبرد نهایی، اکتشاف و مأموریت‌های باقی‌مانده را انجام بده." },
    { id: "kiln-3", text: "Soul of Cinder را شکست بده." },
    { id: "kiln-4", text: "پایان موردنظرت را انتخاب کن؛ ورود به NG+ خودکار نیست." },
  ] },
];

const groupLabels = { all: "همه مسیرها", main: "مسیر اصلی", optional: "مناطق اختیاری", dlc: "محتوای DLC" } as const;
type Filter = keyof typeof groupLabels;

export default function WalkthroughArchive() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string>("cemetery");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setCompleted(parsed.filter((item): item is string => typeof item === "string"));
      }
    } catch (error) {
      console.error("Could not restore walkthrough progress:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch (error) {
      console.error("Could not save walkthrough progress:", error);
    }
  }, [completed, loaded]);

  const allSteps = areas.reduce((total, area) => total + area.steps.length, 0);
  const doneCount = completed.length;
  const percent = allSteps ? Math.round((doneCount / allSteps) * 100) : 0;
  const visibleAreas = useMemo(() => areas.filter((area) => {
    const matchesFilter = filter === "all" || area.group === filter;
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || `${area.name} ${area.fa} ${area.boss} ${area.note}`.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  }), [filter, search]);

  const toggleStep = (id: string) => setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const resetProgress = () => {
    if (window.confirm("تمام تیک‌های راهنما پاک شوند؟")) setCompleted([]);
  };

  return (
    <div dir="rtl" className="space-y-7 text-[#eee6d5]">
      <section className="relative overflow-hidden border border-[#c8a15b]/35 bg-[radial-gradient(ellipse_at_top,rgba(142,102,42,.2),transparent_60%),linear-gradient(135deg,#11110e,#080a0a)] p-5 sm:p-8">
        <div className="pointer-events-none absolute -left-10 -top-16 font-serif text-[190px] text-[#c8a15b]/[0.055]">✥</div>
        <div className="relative">
          <p className="text-[10px] tracking-[.28em] text-[#d8b66e]">THE ASHEN ONE'S JOURNEY / FIELD GUIDE</p>
          <h2 className="mt-3 font-serif text-3xl text-[#f0e5d0] sm:text-4xl">راهنمای سفر در لاثریک</h2>
          <p className="mt-3 max-w-3xl text-sm leading-8 text-white/65">مسیر پیشنهادی بازی را منطقه‌به‌منطقه دنبال کن، کارهای مهم را علامت بزن و هر زمان خواستی از همان‌جا ادامه بده. مناطق اختیاری و DLC جداگانه مشخص شده‌اند.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="border border-white/10 bg-black/35 p-4"><p className="text-xs text-white/45">پیشرفت کلی</p><p className="mt-1 text-2xl font-serif text-[#e5c47d]">{percent}%</p><div className="mt-3 h-1.5 overflow-hidden bg-white/10"><div className="h-full bg-[#c8a15b] transition-all" style={{ width: `${percent}%` }} /></div></div>
            <div className="border border-white/10 bg-black/35 p-4"><p className="text-xs text-white/45">کارهای انجام‌شده</p><p className="mt-1 text-2xl font-serif text-[#e5c47d]">{doneCount} <span className="text-sm text-white/40">/ {allSteps}</span></p></div>
            <div className="border border-white/10 bg-black/35 p-4"><p className="text-xs text-white/45">مناطق راهنما</p><p className="mt-1 text-2xl font-serif text-[#e5c47d]">{areas.length}</p></div>
          </div>
        </div>
      </section>

      <section className="border border-[#c8a15b]/25 bg-black/35 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(groupLabels) as Filter[]).map((key) => <button key={key} type="button" onClick={() => setFilter(key)} className={`border px-3 py-2 text-xs transition ${filter === key ? "border-[#c8a15b]/70 bg-[#c8a15b]/15 text-[#e8c982]" : "border-white/10 text-white/55 hover:border-[#c8a15b]/40 hover:text-white/85"}`}>{groupLabels[key]}</button>)}
          </div>
          <div className="flex gap-2">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جست‌وجوی منطقه یا باس..." className="min-w-0 flex-1 border border-white/15 bg-black/50 px-3 py-2 text-xs text-white outline-none placeholder:text-white/35 focus:border-[#c8a15b]/60 lg:w-64" />
            <button type="button" onClick={resetProgress} className="shrink-0 border border-white/10 px-3 py-2 text-xs text-white/45 transition hover:border-red-400/40 hover:text-red-200">پاک‌کردن تیک‌ها</button>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        {visibleAreas.map((area) => {
          const areaDone = area.steps.filter((step) => completed.includes(step.id)).length;
          const isOpen = expanded === area.id;
          const groupText = area.group === "main" ? "مسیر اصلی" : area.group === "optional" ? "اختیاری" : "DLC";
          return (
            <article key={area.id} className={`overflow-hidden border bg-[#090b0b]/90 transition ${isOpen ? "border-[#c8a15b]/55" : "border-white/10 hover:border-[#c8a15b]/30"}`}>
              <button type="button" onClick={() => setExpanded(isOpen ? "" : area.id)} aria-expanded={isOpen} className="flex w-full items-center gap-3 p-4 text-right sm:gap-5 sm:p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#c8a15b]/30 bg-[#c8a15b]/[0.07] font-serif text-sm text-[#d9b66e]">{area.number}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2"><span className="font-serif text-sm tracking-[.08em] text-[#eee6d5] sm:text-base">{area.name}</span><span className="border border-white/10 px-2 py-0.5 text-[9px] text-white/40">{groupText}</span></span>
                  <span className="mt-1 block text-xs text-[#d8b66e]/85">{area.fa}</span>
                  <span className="mt-2 block text-[11px] text-white/45">باس: {area.boss}</span>
                </span>
                <span className="hidden text-xs text-white/35 sm:block">{areaDone}/{area.steps.length}</span>
                <span className={`text-lg text-[#c8a15b] transition ${isOpen ? "rotate-180" : ""}`}>⌄</span>
              </button>
              <div className="h-px bg-white/[0.06]"><div className="h-px bg-[#c8a15b]/65 transition-all" style={{ width: `${(areaDone / area.steps.length) * 100}%` }} /></div>
              {isOpen && <div className="p-4 sm:p-6">
                <p className="mb-4 text-xs leading-7 text-white/60">{area.note}</p>
                <div className="space-y-2">
                  {area.steps.map((step, index) => {
                    const checked = completed.includes(step.id);
                    return <label key={step.id} className={`flex cursor-pointer items-start gap-3 border p-3 transition ${checked ? "border-[#c8a15b]/25 bg-[#c8a15b]/[0.06]" : "border-white/[0.07] bg-black/20 hover:border-white/20"}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggleStep(step.id)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#c8a15b]" />
                      <span className={`text-xs leading-7 ${checked ? "text-white/35 line-through" : "text-white/75"}`}><span className="ml-2 text-[10px] text-[#c8a15b]/60">{String(index + 1).padStart(2, "0")}</span>{step.text}</span>
                    </label>;
                  })}
                </div>
              </div>}
            </article>
          );
        })}
        {visibleAreas.length === 0 && <div className="border border-white/10 px-4 py-12 text-center text-sm text-white/45">موردی با این جست‌وجو پیدا نشد.</div>}
      </div>
      <p className="text-center text-[10px] leading-6 text-white/35">وضعیت تیک‌ها به‌صورت خودکار در همین مرورگر ذخیره می‌شود. پاک‌کردن داده‌های مرورگر ممکن است این پیشرفت را حذف کند.</p>
    </div>
  );
}
