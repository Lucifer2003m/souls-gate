"use client";

import { useEffect, useMemo, useState } from "react";

type Stats = {
  vigor: number; attunement: number; endurance: number; vitality: number;
  strength: number; dexterity: number; intelligence: number; faith: number; luck: number;
};
type Build = {
  id: string; name: string; style: string; type: "PvE" | "PvP" | "Both";
  level: number; className: string; description: string; weapon: string;
  offhand: string; rings: string[]; armor: string; spells: string[]; stats: Stats;
};

const STARTER_STATS: Stats = { vigor: 10, attunement: 10, endurance: 10, vitality: 10, strength: 10, dexterity: 10, intelligence: 10, faith: 10, luck: 10 };
const STAT_LABELS: { key: keyof Stats; label: string; hint: string }[] = [
  { key: "vigor", label: "Vigor", hint: "HP" },
  { key: "attunement", label: "Attunement", hint: "FP و اسلات جادو" },
  { key: "endurance", label: "Endurance", hint: "Stamina" },
  { key: "vitality", label: "Vitality", hint: "ظرفیت تجهیزات" },
  { key: "strength", label: "Strength", hint: "قدرت سلاح" },
  { key: "dexterity", label: "Dexterity", hint: "چابکی و سلاح" },
  { key: "intelligence", label: "Intelligence", hint: "Sorcery" },
  { key: "faith", label: "Faith", hint: "Miracles و Pyromancy" },
  { key: "luck", label: "Luck", hint: "کشف آیتم و بعضی سلاح‌ها" },
];

const PRESETS: Build[] = [
  { id: "quality", name: "Quality Knight", style: "متعادل", type: "Both", level: 120, className: "Knight", description: "بیلد همه‌فن‌حریف با امکان استفاده از طیف وسیعی از سلاح‌ها؛ مناسب شروع و تجربه سبک‌های مختلف.", weapon: "Claymore / Longsword", offhand: "نسخه‌ای از سپر متوسط", rings: ["Prisoner's Chain", "Ring of Favor", "Havel's Ring", "Chloranthy Ring"], armor: "زره متوسط با تعادل بین دفاع و وزن", spells: ["بدون نیاز به جادو"], stats: { vigor: 40, attunement: 10, endurance: 35, vitality: 15, strength: 40, dexterity: 40, intelligence: 9, faith: 9, luck: 7 } },
  { id: "strength", name: "Strength Bruiser", style: "قدرتی", type: "Both", level: 120, className: "Knight", description: "ضربات سنگین و آسیب بالا؛ به مدیریت زمان حمله و فاصله‌گیری نیاز دارد.", weapon: "Great Club / Heavy Greatsword", offhand: "سپر اختیاری یا دست خالی", rings: ["Ring of Favor", "Prisoner's Chain", "Havel's Ring", "Chloranthy Ring"], armor: "زره سنگین در محدوده بار قابل‌قبول", spells: ["بدون نیاز به جادو"], stats: { vigor: 40, attunement: 10, endurance: 35, vitality: 25, strength: 60, dexterity: 13, intelligence: 9, faith: 9, luck: 7 } },
  { id: "dex", name: "Dexterity Duelist", style: "چابکی", type: "Both", level: 120, className: "Mercenary", description: "حملات سریع و فشار پیوسته؛ برای بازیکنانی که زمان‌بندی و جاخالی را دوست دارند.", weapon: "Sellsword Twinblades / Uchigatana", offhand: "سپر سبک یا سلاح دو دستی", rings: ["Pontiff's Right Eye", "Ring of Favor", "Prisoner's Chain", "Chloranthy Ring"], armor: "زره سبک یا متوسط", spells: ["بدون نیاز به جادو"], stats: { vigor: 40, attunement: 10, endurance: 35, vitality: 15, strength: 10, dexterity: 60, intelligence: 10, faith: 8, luck: 9 } },
  { id: "sorcery", name: "Sorcerer", style: "جادوی روح", type: "Both", level: 120, className: "Sorcerer", description: "آسیب دوربرد با Sorcery؛ مدیریت FP و فاصله با دشمن اهمیت دارد.", weapon: "Moonlight Greatsword یا سلاح جادویی", offhand: "Sorcerer's Staff", rings: ["Young Dragon Ring", "Bellowing Dragoncrest Ring", "Sage Ring", "Magic Clutch Ring"], armor: "زره سبک", spells: ["Soul Spear", "Great Heavy Soul Arrow", "Homing Soulmass"], stats: { vigor: 27, attunement: 24, endurance: 20, vitality: 10, strength: 16, dexterity: 12, intelligence: 60, faith: 7, luck: 7 } },
  { id: "pyro", name: "Chaos Pyromancer", style: "آتش و Chaos", type: "Both", level: 120, className: "Pyromancer", description: "ترکیب آسیب آتش و تاریکی با انعطاف در برابر دشمنان مختلف.", weapon: "Onyx Blade / Chaos-infused weapon", offhand: "Pyromancy Flame", rings: ["Great Swamp Ring", "Witch's Ring", "Ring of Favor", "Prisoner's Chain"], armor: "زره متوسط", spells: ["Chaos Bed Vestiges", "Black Flame", "Fire Orb"], stats: { vigor: 35, attunement: 24, endurance: 25, vitality: 15, strength: 16, dexterity: 18, intelligence: 30, faith: 30, luck: 7 } },
  { id: "faith", name: "Faith Knight", style: "معجزه و صاعقه", type: "Both", level: 120, className: "Knight", description: "ترکیب مبارزه نزدیک با معجزه‌های درمانی و صاعقه؛ به مدیریت FP نیاز دارد.", weapon: "Lothric Knight Sword / Lightning weapon", offhand: "Talisman یا Chime", rings: ["Morne's Ring", "Ring of the Sun's First Born", "Ring of Favor", "Sage Ring"], armor: "زره متوسط", spells: ["Lightning Stake", "Sunlight Spear", "Blessed Weapon"], stats: { vigor: 35, attunement: 24, endurance: 25, vitality: 15, strength: 16, dexterity: 18, intelligence: 8, faith: 60, luck: 7 } },
  { id: "pvp", name: "Arena Duelist", style: "دوئل PvP", type: "PvP", level: 125, className: "Knight", description: "پیکربندی پیشنهادی برای دوئل؛ سلاح و رینگ‌ها را با سبک بازی خودت تنظیم کن.", weapon: "Straight Sword / Spear / Curved Sword", offhand: "سپر متوسط", rings: ["Ring of Favor", "Prisoner's Chain", "Chloranthy Ring", "Hornet Ring"], armor: "زره با جذب آسیب و Poise مناسب", spells: ["اختیاری؛ بسته به سلاح"], stats: { vigor: 44, attunement: 10, endurance: 34, vitality: 18, strength: 40, dexterity: 40, intelligence: 9, faith: 9, luck: 7 } },
];
const SAVE_KEY = "souls-gate-ds3-builds-v1";

export default function BuildsPage() {
  const [mode, setMode] = useState<"presets" | "builder" | "saved">("presets");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Build | null>(null);
  const [saved, setSaved] = useState<Build[]>([]);
  const [customName, setCustomName] = useState("My Build");
  const [customLevel, setCustomLevel] = useState(100);
  const [customClass, setCustomClass] = useState("Knight");
  const [customStats, setCustomStats] = useState<Stats>({ ...STARTER_STATS, vigor: 27, endurance: 20, strength: 20, dexterity: 20 });
  const [customType, setCustomType] = useState<"PvE" | "PvP" | "Both">("Both");
  const [customWeapon, setCustomWeapon] = useState("Claymore");
  const [customNotes, setCustomNotes] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) setSaved(JSON.parse(raw) as Build[]);
    } catch (error) { console.error("Could not load saved builds", error); }
    finally { setLoaded(true); }
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(saved)); }
    catch (error) { console.error("Could not save builds", error); }
  }, [saved, loaded]);

  const visiblePresets = useMemo(() => PRESETS.filter((build) => {
    const matchesType = filter === "All" || build.type === "Both" || build.type === filter;
    const text = `${build.name} ${build.style} ${build.description} ${build.weapon}`.toLowerCase();
    return matchesType && text.includes(query.trim().toLowerCase());
  }), [filter, query]);
  const pointsUsed = Object.values(customStats).reduce((sum, value) => sum + value, 0);
  const saveCustomBuild = () => {
    const build: Build = {
      id: `custom-${Date.now()}`, name: customName.trim() || "My Build", style: "شخصی‌سازی‌شده", type: customType,
      level: customLevel, className: customClass, description: customNotes.trim() || "بیلد ساخته‌شده با ابزار Souls Gate.",
      weapon: customWeapon || "انتخاب نشده", offhand: "انتخاب نشده", rings: [], armor: "انتخاب نشده", spells: [], stats: { ...customStats },
    };
    setSaved((current) => [build, ...current]);
    setSelected(build);
    setMode("saved");
  };
  const updateStat = (key: keyof Stats, value: number) => setCustomStats((current) => ({ ...current, [key]: Math.max(1, Math.min(99, value)) }));

  return (
    <section dir="rtl" className="mt-7 text-[#eee6d5]">
      <div className="relative overflow-hidden border border-[#c8a15b]/35 bg-gradient-to-br from-[#17140f] via-[#0b0d0c] to-[#080909] p-5 md:p-8">
        <div className="pointer-events-none absolute -left-8 -top-10 font-serif text-[180px] text-[#c8a15b]/[0.06]">⚔</div>
        <div className="relative">
          <div className="text-[10px] tracking-[0.3em] text-[#c8a15b]">CHARACTER PLANNER · DARK SOULS III</div>
          <h2 className="mt-3 font-serif text-3xl text-[#f1e5cf] md:text-4xl">Builds & Character Planner</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">بیلدهای آماده برای PvE و PvP را بررسی کن یا با تنظیم Attributeها، سطح، کلاس و سلاح، بیلد شخصی خودت را بساز و ذخیره کن.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {([{ id: "presets", label: "بیلدهای آماده" }, { id: "builder", label: "بیلدساز" }, { id: "saved", label: `بیلدهای ذخیره‌شده (${saved.length})` }] as const).map((item) => (
              <button key={item.id} onClick={() => setMode(item.id)} className={`border px-4 py-2.5 text-xs transition ${mode === item.id ? "border-[#c8a15b] bg-[#c8a15b]/15 text-[#f0cd83]" : "border-white/10 bg-black/30 text-white/60 hover:border-[#c8a15b]/50 hover:text-[#f0cd83]"}`}>{item.label}</button>
            ))}
          </div>
        </div>
      </div>

      {mode === "presets" && <>
        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جست‌وجوی بیلد، سبک یا سلاح..." className="min-w-0 flex-1 border border-white/15 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-[#c8a15b]/70" />
          <div className="flex flex-wrap gap-2">{["All", "PvE", "PvP"].map((item) => <button key={item} onClick={() => setFilter(item)} className={`border px-4 py-2 text-xs ${filter === item ? "border-[#c8a15b] text-[#e7c477]" : "border-white/10 text-white/55"}`}>{item === "All" ? "همه" : item}</button>)}</div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visiblePresets.map((build, index) => <article key={build.id} className="group flex flex-col border border-[#c8a15b]/20 bg-[#090b0b]/85 transition hover:border-[#c8a15b]/60 hover:bg-[#12120f]">
            <div className="relative flex h-32 items-center justify-between overflow-hidden border-b border-[#c8a15b]/15 bg-gradient-to-br from-[#2a2114] via-[#10110f] to-[#080909] px-5">
              <span className="font-serif text-6xl text-[#c8a15b]/25">{["⚔", "♜", "☄", "✧", "♨", "☼", "♛"][index % 7]}</span>
              <div className="text-left"><div className="font-serif text-4xl text-[#d7b56b]/70">{String(index + 1).padStart(2, "0")}</div><div className="mt-1 text-[10px] tracking-[0.2em] text-white/35">SOULS GATE</div></div>
              <span className="absolute bottom-3 right-4 border border-[#c8a15b]/30 bg-black/40 px-2 py-1 text-[10px] text-[#d9bc7a]">{build.level} SL</span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-serif text-xl text-[#f0e5d1]">{build.name}</h3><span className="border border-white/10 px-2 py-1 text-[10px] text-white/55">{build.type === "Both" ? "PvE + PvP" : build.type}</span></div>
              <p className="mt-1 text-xs text-[#c8a15b]">{build.style} · کلاس پیشنهادی: {build.className}</p>
              <p className="mt-3 flex-1 text-sm leading-7 text-white/60">{build.description}</p>
              <div className="mt-4 border-t border-white/10 pt-3"><div className="text-[10px] tracking-widest text-white/35">SUGGESTED WEAPON</div><div className="mt-1 text-sm text-[#e4d5b8]">{build.weapon}</div></div>
              <button onClick={() => setSelected(build)} className="mt-4 border border-[#c8a15b]/50 px-4 py-3 text-xs text-[#e6c57e] transition hover:bg-[#c8a15b] hover:text-black">مشاهده جزئیات بیلد ←</button>
            </div>
          </article>)}
        </div>
        {visiblePresets.length === 0 && <p className="mt-6 border border-white/10 p-8 text-center text-sm text-white/50">بیلدی با این مشخصات پیدا نشد.</p>}
      </>}

      {mode === "builder" && <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="border border-[#c8a15b]/25 bg-black/35 p-5 md:p-6">
          <h3 className="font-serif text-2xl text-[#e8d3a7]">Character Builder</h3>
          <p className="mt-2 text-xs leading-6 text-white/45">مقادیر را بین ۱ تا ۹۹ تنظیم کن. مجموع Attributeها نمایش داده می‌شود؛ محاسبه سطح دقیق بازی و نیازمندی سلاح‌ها در این نسخه به‌صورت خودکار اعتبارسنجی نمی‌شود.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-xs text-white/60">نام بیلد<input value={customName} onChange={(e) => setCustomName(e.target.value)} className="mt-2 w-full border border-white/15 bg-[#090b0b] px-3 py-3 text-sm text-white outline-none focus:border-[#c8a15b]/70" /></label>
            <label className="text-xs text-white/60">کلاس شروع<select value={customClass} onChange={(e) => setCustomClass(e.target.value)} className="mt-2 w-full border border-white/15 bg-[#090b0b] px-3 py-3 text-sm text-white outline-none">{["Knight", "Mercenary", "Warrior", "Herald", "Thief", "Assassin", "Sorcerer", "Pyromancer", "Cleric", "Deprived"].map((x) => <option key={x}>{x}</option>)}</select></label>
            <label className="text-xs text-white/60">سطح هدف: {customLevel}<input type="range" min="1" max="250" value={customLevel} onChange={(e) => setCustomLevel(Number(e.target.value))} className="mt-3 w-full accent-[#c8a15b]" /><span className="mt-1 flex justify-between text-[10px] text-white/35"><span>SL 1</span><span>SL 250</span></span></label>
            <label className="text-xs text-white/60">کاربرد<select value={customType} onChange={(e) => setCustomType(e.target.value as "PvE" | "PvP" | "Both")} className="mt-2 w-full border border-white/15 bg-[#090b0b] px-3 py-3 text-sm text-white outline-none"><option value="Both">PvE و PvP</option><option value="PvE">PvE</option><option value="PvP">PvP</option></select></label>
            <label className="text-xs text-white/60 sm:col-span-2">سلاح اصلی<input value={customWeapon} onChange={(e) => setCustomWeapon(e.target.value)} placeholder="مثلاً Claymore" className="mt-2 w-full border border-white/15 bg-[#090b0b] px-3 py-3 text-sm text-white outline-none focus:border-[#c8a15b]/70" /></label>
          </div>
          <div className="mt-7 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {STAT_LABELS.map(({ key, label, hint }) => <div key={key}>
              <div className="flex items-center justify-between"><label htmlFor={`stat-${key}`} className="text-sm text-[#e5d4b4]">{label}</label><span className="font-serif text-lg text-[#d9b86f]">{customStats[key]}</span></div>
              <input id={`stat-${key}`} type="range" min="1" max="99" value={customStats[key]} onChange={(e) => updateStat(key, Number(e.target.value))} className="mt-2 w-full accent-[#c8a15b]" />
              <div className="mt-1 text-[10px] text-white/35">{hint}</div>
            </div>)}
          </div>
          <label className="mt-6 block text-xs text-white/60">یادداشت یا سبک بازی<textarea value={customNotes} onChange={(e) => setCustomNotes(e.target.value)} rows={3} placeholder="مثلاً مناسب باس‌ها، سلاح سنگین و مبارزه نزدیک..." className="mt-2 w-full resize-y border border-white/15 bg-[#090b0b] px-3 py-3 text-sm text-white outline-none focus:border-[#c8a15b]/70" /></label>
          <button onClick={saveCustomBuild} className="mt-5 w-full border border-[#c8a15b] bg-[#c8a15b]/10 px-5 py-3 text-sm text-[#edcf8b] transition hover:bg-[#c8a15b] hover:text-black">ذخیره بیلد من</button>
        </div>
        <aside className="h-fit border border-[#c8a15b]/25 bg-gradient-to-b from-[#17140f] to-[#090b0b] p-5">
          <div className="text-[10px] tracking-[0.25em] text-[#c8a15b]">BUILD SUMMARY</div><div className="mt-3 font-serif text-3xl text-[#ead8b4]">SL {customLevel}</div><div className="mt-1 text-xs text-white/45">{customClass} · {customType === "Both" ? "PvE + PvP" : customType}</div>
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><span className="text-xs text-white/50">مجموع Attributeها</span><strong className="text-xl text-[#d9b86f]">{pointsUsed}</strong></div>
          <div className="mt-4 space-y-2">{STAT_LABELS.map(({ key, label }) => <div key={key} className="flex items-center gap-3 text-xs"><span className="w-24 text-white/45">{label}</span><div className="h-1.5 flex-1 overflow-hidden bg-white/10"><div className="h-full bg-[#c8a15b]" style={{ width: `${customStats[key]}%` }} /></div><span className="w-6 text-left text-white/70">{customStats[key]}</span></div>)}</div>
          <p className="mt-5 border-t border-white/10 pt-4 text-[11px] leading-6 text-white/40">توجه: مجموع امتیازها جایگزین محاسبه دقیق Soul Level نیست؛ کلاس شروع و مقادیر پایه روی سطح نهایی اثر دارند.</p>
        </aside>
      </div>}

      {mode === "saved" && <div className="mt-5 space-y-3">
        {saved.length === 0 ? <div className="border border-[#c8a15b]/20 bg-black/30 p-10 text-center"><div className="font-serif text-4xl text-[#c8a15b]/60">♢</div><h3 className="mt-3 font-serif text-xl">هنوز بیلدی ذخیره نکرده‌ای</h3><p className="mt-2 text-sm text-white/45">از بیلدساز یک بیلد بساز یا یکی از بیلدهای آماده را بررسی کن.</p><button onClick={() => setMode("builder")} className="mt-5 border border-[#c8a15b]/50 px-5 py-3 text-xs text-[#e6c57e]">رفتن به بیلدساز</button></div> : saved.map((build) => <div key={build.id} className="flex flex-col gap-3 border border-[#c8a15b]/20 bg-black/35 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-serif text-lg text-[#e8d6b3]">{build.name}</h3><p className="mt-1 text-xs text-white/45">SL {build.level} · {build.className} · {build.type === "Both" ? "PvE + PvP" : build.type}</p><p className="mt-2 text-xs text-white/60">{build.weapon}</p></div><div className="flex gap-2"><button onClick={() => setSelected(build)} className="border border-[#c8a15b]/40 px-4 py-2 text-xs text-[#e6c57e]">جزئیات</button><button onClick={() => setSaved((current) => current.filter((item) => item.id !== build.id))} className="border border-red-900/50 px-4 py-2 text-xs text-red-300/70 hover:bg-red-950/30">حذف</button></div></div>)}</div>}

      {selected && <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        <div role="dialog" aria-modal="true" aria-label={selected.name} className="my-6 max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-[#c8a15b]/45 bg-[#0b0d0c] shadow-2xl shadow-black/60">
          <div className="flex items-start justify-between gap-4 border-b border-[#c8a15b]/25 bg-gradient-to-l from-[#241b10] to-[#0b0d0c] p-5 md:p-7"><div><div className="text-[10px] tracking-[0.25em] text-[#c8a15b]">BUILD DOSSIER · SL {selected.level}</div><h3 className="mt-2 font-serif text-2xl text-[#f0e4cd] md:text-3xl">{selected.name}</h3><p className="mt-2 text-xs text-white/50">{selected.className} · {selected.type === "Both" ? "PvE + PvP" : selected.type} · {selected.style}</p></div><button onClick={() => setSelected(null)} aria-label="بستن" className="border border-white/15 px-3 py-2 text-white/60 hover:text-white">✕</button></div>
          <div className="grid gap-6 p-5 md:grid-cols-2 md:p-7"><div><p className="text-sm leading-7 text-white/65">{selected.description}</p><h4 className="mt-5 border-b border-white/10 pb-2 text-xs tracking-widest text-[#c8a15b]">EQUIPMENT</h4><dl className="mt-3 space-y-3 text-sm"><div><dt className="text-[10px] text-white/35">سلاح</dt><dd className="mt-1 text-[#e8d8ba]">{selected.weapon}</dd></div><div><dt className="text-[10px] text-white/35">دست دوم / کاتالیزور</dt><dd className="mt-1 text-[#e8d8ba]">{selected.offhand}</dd></div><div><dt className="text-[10px] text-white/35">زره</dt><dd className="mt-1 text-[#e8d8ba]">{selected.armor}</dd></div><div><dt className="text-[10px] text-white/35">رینگ‌ها</dt><dd className="mt-1 text-[#e8d8ba]">{selected.rings.length ? selected.rings.join(" · ") : "هنوز انتخاب نشده"}</dd></div><div><dt className="text-[10px] text-white/35">جادوها</dt><dd className="mt-1 text-[#e8d8ba]">{selected.spells.join(" · ") || "ندارد / انتخاب نشده"}</dd></div></dl></div><div><h4 className="border-b border-white/10 pb-2 text-xs tracking-widest text-[#c8a15b]">ATTRIBUTES</h4><div className="mt-4 space-y-3">{STAT_LABELS.map(({ key, label }) => <div key={key}><div className="flex justify-between text-xs"><span className="text-white/55">{label}</span><span className="text-[#e6c77f]">{selected.stats[key]}</span></div><div className="mt-1.5 h-1.5 bg-white/10"><div className="h-full bg-[#c8a15b]" style={{ width: `${selected.stats[key]}%` }} /></div></div>)}</div></div></div>
          <div className="flex flex-wrap justify-end gap-2 border-t border-white/10 p-4"><button onClick={() => { setCustomName(selected.name); setCustomLevel(selected.level); setCustomClass(selected.className); setCustomStats({ ...selected.stats }); setCustomType(selected.type); setCustomWeapon(selected.weapon); setCustomNotes(selected.description); setSelected(null); setMode("builder"); }} className="border border-[#c8a15b]/50 px-4 py-2.5 text-xs text-[#e6c57e]">ویرایش در بیلدساز</button><button onClick={() => { setSaved((current) => [{ ...selected, id: `copy-${Date.now()}`, name: `${selected.name} (Copy)` }, ...current]); }} className="border border-white/15 px-4 py-2.5 text-xs text-white/65">ذخیره یک کپی</button></div>
        </div>
      </div>}
    </section>
  );
}
