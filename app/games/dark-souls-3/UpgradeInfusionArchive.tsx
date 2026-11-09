"use client";

import { useMemo, useState } from "react";

type Tab = "infusions" | "upgrade" | "locations";

const STORAGE_KEY = "souls-gate-ds3-upgrade-checklist-v1";

const infusions = [
  { name: "Fire", gem: "Fire Gem", group: "Elemental", coal: "بدون زغال مخصوص", effect: "آسیب آتش اضافه می‌کند و Scaling ویژگی‌ها را حذف می‌کند.", detail: "برای اوایل بازی یا سلاح‌هایی که از ویژگی‌ها Scaling خوبی نمی‌گیرند قابل بررسی است." },
  { name: "Deep", gem: "Deep Gem", group: "Elemental", coal: "Sage's Coal", effect: "آسیب تاریک اضافه می‌کند و Scaling ویژگی‌ها را حذف می‌کند.", detail: "آسیب تاریک ایجاد می‌کند؛ با Dark infusion یکی نیست و Scaling هوش/ایمان نمی‌دهد." },
  { name: "Raw", gem: "Raw Gem", group: "Physical", coal: "بدون زغال مخصوص", effect: "آسیب پایه فیزیکی را افزایش می‌دهد و Scaling ویژگی‌ها را حذف می‌کند.", detail: "برای شخصیت‌هایی با سطح پایین Strength و Dexterity می‌تواند مفید باشد." },
  { name: "Heavy", gem: "Heavy Gem", group: "Physical", coal: "Farron Coal", effect: "Scaling قدرت (Strength) را تقویت و Scaling مهارت (Dexterity) را کاهش می‌دهد.", detail: "برای ساختارهای مبتنی بر Strength طراحی شده است." },
  { name: "Sharp", gem: "Sharp Gem", group: "Physical", coal: "Farron Coal", effect: "Scaling مهارت (Dexterity) را تقویت و Scaling قدرت (Strength) را کاهش می‌دهد.", detail: "برای ساختارهای مبتنی بر Dexterity مناسب است." },
  { name: "Refined", gem: "Refined Gem", group: "Physical", coal: "بدون زغال مخصوص", effect: "Scaling قدرت و مهارت را متعادل می‌کند؛ آسیب پایه را کاهش می‌دهد.", detail: "برای پخش تقریباً متعادل امتیاز بین Strength و Dexterity کاربرد دارد." },
  { name: "Crystal", gem: "Crystal Gem", group: "Magic", coal: "Sage's Coal", effect: "آسیب جادویی و Scaling هوش (Intelligence) اضافه می‌کند؛ Scaling قدرت و مهارت کاهش می‌یابد.", detail: "برای ساختارهای مبتنی بر Intelligence." },
  { name: "Simple", gem: "Simple Gem", group: "Magic", coal: "Giant's Coal", effect: "آسیب جادویی و Scaling هوش اضافه می‌کند و در زمان در دست داشتن سلاح، FP را به‌آرامی بازیابی می‌کند.", detail: "بازیابی FP آهسته است و مقدار آن به‌تنهایی زیاد نیست." },
  { name: "Lightning", gem: "Lightning Gem", group: "Elemental", coal: "Giant's Coal", effect: "آسیب صاعقه و Scaling ایمان (Faith) اضافه می‌کند؛ Scaling قدرت و مهارت کاهش می‌یابد.", detail: "برای ساختارهای مبتنی بر Faith." },
  { name: "Blessed", gem: "Blessed Gem", group: "Magic", coal: "Sage's Coal", effect: "Scaling ایمان و بازیابی آهسته HP هنگام در دست داشتن سلاح را اضافه می‌کند؛ آسیب فیزیکی و Scaling فیزیکی کاهش می‌یابد.", detail: "همچنین مانع زنده‌شدن دوباره اسکلت‌ها می‌شود." },
  { name: "Chaos", gem: "Chaos Gem", group: "Elemental", coal: "Giant's Coal", effect: "آسیب آتش و Scaling بر پایه Intelligence و Faith اضافه می‌کند.", detail: "برای ساختارهای ترکیبی Intelligence/Faith." },
  { name: "Dark", gem: "Dark Gem", group: "Elemental", coal: "Profaned Coal", effect: "آسیب تاریک و Scaling بر پایه Intelligence و Faith اضافه می‌کند.", detail: "با Deep تفاوت دارد؛ Dark دارای Scaling هوش و ایمان است." },
  { name: "Poison", gem: "Poison Gem", group: "Status", coal: "Farron Coal", effect: "انباشت وضعیت Poison را اضافه یا تقویت می‌کند؛ آسیب پایه و Scaling فیزیکی کاهش می‌یابد.", detail: "برای ایجاد مسمومیت تدریجی روی دشمنان." },
  { name: "Blood", gem: "Blood Gem", group: "Status", coal: "Profaned Coal", effect: "انباشت وضعیت Bleed را اضافه یا تقویت می‌کند؛ آسیب پایه و Scaling فیزیکی کاهش می‌یابد.", detail: "برای سلاح‌هایی که می‌خواهند نوار خونریزی دشمن را سریع‌تر پر کنند." },
  { name: "Hollow", gem: "Hollow Gem", group: "Status", coal: "Profaned Coal", effect: "Scaling شانس (Luck) اضافه می‌کند و بر اساس Hollowing شخصیت، Luck بیشتری فراهم می‌کند.", detail: "میزان پاداش Luck به Hollowing شخصیت وابسته است." },
  { name: "Shriving", gem: "Shriving Stone", group: "Utility", coal: "بدون زغال مخصوص", effect: "اینفیوژن فعلی را حذف می‌کند و سلاح را به حالت بدون اینفیوژن برمی‌گرداند.", detail: "سطح ارتقای سلاح حفظ می‌شود؛ Shriving یک نوع بازگردانی است، نه اینفیوژنِ دارای آسیب تازه." },
];

const regularUpgrades = [
  { level: "+1", material: "Titanite Shard", amount: "2" },
  { level: "+2", material: "Titanite Shard", amount: "4" },
  { level: "+3", material: "Titanite Shard", amount: "6" },
  { level: "+4", material: "Large Titanite Shard", amount: "2" },
  { level: "+5", material: "Large Titanite Shard", amount: "4" },
  { level: "+6", material: "Large Titanite Shard", amount: "6" },
  { level: "+7", material: "Titanite Chunk", amount: "2" },
  { level: "+8", material: "Titanite Chunk", amount: "4" },
  { level: "+9", material: "Titanite Chunk", amount: "6" },
  { level: "+10", material: "Titanite Slab", amount: "1" },
];

const specialUpgrades = [
  { level: "+1", material: "Twinkling Titanite / Titanite Scale", amount: "1" },
  { level: "+2", material: "Twinkling Titanite / Titanite Scale", amount: "2" },
  { level: "+3", material: "Twinkling Titanite / Titanite Scale", amount: "4" },
  { level: "+4", material: "Twinkling Titanite / Titanite Scale", amount: "8" },
  { level: "+5", material: "Titanite Slab", amount: "1" },
];

const materials = [
  { name: "Titanite Shard", use: "ارتقای سلاح معمولی تا +3", locations: "در بخش‌های ابتدایی بازی از دشمنان و Crystal Lizardها به‌دست می‌آید؛ پس از دادن Dreamchaser's Ashes، مقدار نامحدود آن از Shrine Handmaid قابل خرید است." },
  { name: "Large Titanite Shard", use: "ارتقای سلاح معمولی از +4 تا +6", locations: "در مسیرهای میانی مانند Cathedral of the Deep، Catacombs of Carthus، Smouldering Lake و Irithyll پیدا می‌شود. پس از دادن Easterner's Ashes به Shrine Handmaid، قابل خرید نامحدود است." },
  { name: "Titanite Chunk", use: "ارتقای سلاح معمولی از +7 تا +9", locations: "در مناطق پایانی مانند Lothric Castle، Grand Archives و Archdragon Peak پیدا می‌شود. پس از دادن Dragon Chaser's Ashes به Shrine Handmaid، قابل خرید نامحدود است." },
  { name: "Titanite Slab", use: "ارتقای نهایی سلاح معمولی به +10 یا سلاح ویژه به +5", locations: "تعداد محدود دارد؛ فهرست کامل محل‌ها در زبانه «محل Titanite Slab» آمده است." },
  { name: "Twinkling Titanite", use: "ارتقای سلاح‌های ویژه و برخی تجهیزات خاص تا +4؛ سپس Slab برای +5", locations: "از Crystal Lizardها، برخی دشمنان و صندوق‌ها در مناطق مختلف به‌دست می‌آید؛ در Lothric Castle و Grand Archives نیز چندین مورد قابل جمع‌آوری است." },
  { name: "Titanite Scale", use: "ارتقای سلاح‌های ساخته‌شده از Soul Transposition تا +4؛ سپس Slab برای +5", locations: "از Crystal Lizardهای بزرگ، صندوق‌ها و برخی فروشندگان به‌دست می‌آید. Greirat پس از سفر موفق به Irithyll تعدادی می‌فروشد؛ Shrine Handmaid نیز پس از دریافت Captain's Ashes یک عدد عرضه می‌کند." },
];

const slabs = [
  { area: "Firelink Shrine", count: "۲", route: "۱) Coiled Sword Fragment را از Untended Graves بردار و با Pickle-Pee مبادله کن. ۲) پس از قرار گرفتن هر چهار Cinder of a Lord روی تخت‌ها، Shrine Handmaid یک Slab را با ۳۰٬۰۰۰ Souls می‌فروشد.", dlc: false },
  { area: "Profaned Capital / Irithyll Dungeon", count: "۱", route: "خط مأموریت Siegward of Catarina را پیش ببر، در Irithyll Dungeon سلول او را با Old Cell Key باز کن و پاداش Titanite Slab را دریافت کن.", dlc: false },
  { area: "Grand Archives", count: "۲", route: "۱) اهرم مخفی کنار قفسه‌ها و حوض موم را فعال کن تا قفسه جابه‌جا شود؛ صندوق پشت آن Slab دارد. ۲) هر سه Ascended Winged Knight روی بام را شکست بده.", dlc: false },
  { area: "Lothric Castle", count: "۱", route: "پس از باز شدن آسانسور میان Grand Archives و مسیر Twin Princes، آسانسور را به بالا بفرست؛ سکوی دوم ظاهر می‌شود. با آن به طبقه پایین برو و آیتم روی جسد را بردار.", dlc: false },
  { area: "Archdragon Peak", count: "۲", route: "۱) در Great Belfry از مسیر بالای محوطه به سکوی کنار جسد اژدها و Havel برو. ۲) پس از شکست Nameless King، آیتمی در محوطه نبرد ظاهر می‌شود.", dlc: false },
  { area: "Painted World of Ariandel (DLC)", count: "۳", route: "۱) در Depths of the Painting پس از شکست دشمن محافظ، مسیر نردبان بلند را بالا برو. ۲) پاداش نبرد Sister Friede. ۳) پس از شکست Friede از Corvian Settler در Ariandel Chapel دریافت کن.", dlc: true },
  { area: "The Dreg Heap / Earthen Peak Ruins (DLC)", count: "۱", route: "در محدوده باتلاق سمی Earthen Peak Ruins، Slab را در غار پیدا کن؛ در مسیر مأموریت Lapp ممکن است او آن را برایت بردارد.", dlc: true },
  { area: "The Ringed City (DLC)", count: "۳", route: "سه Slab دیگر از رویدادها و مأموریت‌های DLC به‌دست می‌آیند: پاداش Halflight، ادامه مأموریت Lapp و پاداش Shira. هر سه را در مسیر Ringed City پیگیری کن.", dlc: true },
];

export default function UpgradeInfusionArchive() {
  const [tab, setTab] = useState<Tab>("infusions");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      return value ? JSON.parse(value) : [];
    } catch {
      return [];
    }
  });

  const toggle = (key: string) => {
    setChecked((current) => {
      const next = current.includes(key) ? current.filter((item) => item !== key) : [...current, key];
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const filteredInfusions = useMemo(() => infusions.filter((item) => {
    const matchesSearch = `${item.name} ${item.gem} ${item.effect} ${item.coal}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (filter === "All" || item.group === filter);
  }), [search, filter]);

  const tabs: { id: Tab; label: string; fa: string }[] = [
    { id: "infusions", label: "INFUSION GEMS", fa: "سنگ‌های اینفیوژن" },
    { id: "upgrade", label: "WEAPON UPGRADE", fa: "جدول ارتقای سلاح" },
    { id: "locations", label: "MATERIAL LOCATIONS", fa: "محل پیدا کردن متریال‌ها" },
  ];

  return (
    <div className="space-y-6">
      <div className="border border-[#c8a15b]/25 bg-black/35 p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button key={item.id} onClick={() => { setTab(item.id); setSearch(""); setSelected(null); }}
              className={`border px-4 py-3 text-left transition ${tab === item.id ? "border-[#c8a15b]/70 bg-[#c8a15b]/10 text-[#e6c47e]" : "border-white/10 text-white/60 hover:border-[#c8a15b]/40 hover:text-white"}`}>
              <span className="block text-[10px] tracking-[.13em]">{item.label}</span>
              <span dir="rtl" className="mt-1 block text-xs">{item.fa}</span>
            </button>
          ))}
        </div>

        {tab !== "upgrade" && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جست‌وجو در آرشیو..."
              className="min-w-0 flex-1 border border-white/15 bg-black/50 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#c8a15b]/60" />
            {tab === "infusions" && (
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-white/15 bg-[#111] px-3 py-3 text-sm text-white outline-none">
                {["All", "Physical", "Elemental", "Magic", "Status", "Utility"].map((v) => <option key={v} value={v}>{v === "All" ? "همه دسته‌ها" : v}</option>)}
              </select>
            )}
          </div>
        )}
      </div>

      {tab === "infusions" && (
        <>
          <div className="flex items-center justify-between gap-3" dir="rtl">
            <p className="text-sm text-white/65">۱۵ نوع سنگ و بازگردانی اینفیوژن</p>
            <p className="text-xs text-[#d8b66e]">{filteredInfusions.length} مورد</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredInfusions.map((item) => (
              <article key={item.name} className={`border bg-black/35 p-4 transition ${selected === item.name ? "border-[#c8a15b]/70" : "border-white/10 hover:border-[#c8a15b]/40"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg tracking-wide text-[#e5c47f]">{item.name}</h3>
                    <p className="mt-1 text-xs text-white/45">{item.gem}</p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-[10px] text-white/55">
                    <input type="checkbox" checked={checked.includes(`gem:${item.name}`)} onChange={() => toggle(`gem:${item.name}`)} className="accent-[#c8a15b]" />
                    جمع‌آوری شد
                  </label>
                </div>
                <p dir="rtl" className="mt-4 text-sm leading-7 text-white/75">{item.effect}</p>
                <div className="mt-3 border-t border-white/10 pt-3">
                  <p dir="rtl" className="text-xs text-[#d5b978]">زغال موردنیاز: {item.coal}</p>
                  <button onClick={() => setSelected(selected === item.name ? null : item.name)} className="mt-3 text-xs text-white/55 underline decoration-[#c8a15b]/50 underline-offset-4 hover:text-[#e5c47f]">
                    {selected === item.name ? "بستن توضیحات" : "جزئیات بیشتر"}
                  </button>
                  {selected === item.name && <p dir="rtl" className="mt-3 text-xs leading-7 text-white/65">{item.detail}</p>}
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {tab === "upgrade" && (
        <div className="grid gap-5 xl:grid-cols-2">
          <section className="border border-[#c8a15b]/25 bg-black/35 p-4 sm:p-5">
            <h3 className="font-serif text-lg text-[#e5c47f]">STANDARD REINFORCEMENT</h3>
            <p dir="rtl" className="mb-4 mt-2 text-xs leading-6 text-white/55">مسیر سلاح‌های معمولی از +0 تا +10؛ مقدارها برای هر مرحله هستند.</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[300px] text-sm">
                <thead><tr className="border-b border-[#c8a15b]/30 text-xs text-[#d8b66e]"><th className="p-3 text-left">Level</th><th className="p-3 text-left">Material</th><th className="p-3 text-right">Qty</th></tr></thead>
                <tbody>{regularUpgrades.map((row) => <tr key={row.level} className="border-b border-white/5"><td className="p-3 text-[#e5c47f]">{row.level}</td><td className="p-3 text-white/75">{row.material}</td><td className="p-3 text-right text-white/75">{row.amount}</td></tr>)}</tbody>
              </table>
            </div>
            <p dir="rtl" className="mt-4 text-xs leading-6 text-white/55">مجموع مسیر معمولی: ۱۲ Shard + ۱۲ Large Shard + ۱۲ Chunk + یک Slab.</p>
          </section>
          <section className="border border-[#c8a15b]/25 bg-black/35 p-4 sm:p-5">
            <h3 className="font-serif text-lg text-[#e5c47f]">SPECIAL REINFORCEMENT</h3>
            <p dir="rtl" className="mb-4 mt-2 text-xs leading-6 text-white/55">برای سلاح‌های ویژه از Twinkling Titanite یا Titanite Scale استفاده می‌شود.</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[300px] text-sm">
                <thead><tr className="border-b border-[#c8a15b]/30 text-xs text-[#d8b66e]"><th className="p-3 text-left">Level</th><th className="p-3 text-left">Material</th><th className="p-3 text-right">Qty</th></tr></thead>
                <tbody>{specialUpgrades.map((row) => <tr key={row.level} className="border-b border-white/5"><td className="p-3 text-[#e5c47f]">{row.level}</td><td className="p-3 text-white/75">{row.material}</td><td className="p-3 text-right text-white/75">{row.amount}</td></tr>)}</tbody>
              </table>
            </div>
            <p dir="rtl" className="mt-4 text-xs leading-6 text-white/55">برای رسیدن به +4 مجموعاً ۱۵ عدد متریال ویژه لازم است؛ مرحله +5 به یک Titanite Slab نیاز دارد.</p>
          </section>
        </div>
      )}

      {tab === "locations" && (
        <div className="space-y-5">
          <section className="border border-[#c8a15b]/25 bg-black/35 p-4 sm:p-5">
            <h3 className="font-serif text-lg text-[#e5c47f]">UPGRADE MATERIALS</h3>
            <div className="mt-3 space-y-3">
              {materials.filter((m) => `${m.name} ${m.use} ${m.locations}`.toLowerCase().includes(search.toLowerCase())).map((m) => (
                <article key={m.name} className="border border-white/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h4 className="text-sm text-[#e5c47f]">{m.name}</h4>
                    <label className="flex cursor-pointer items-center gap-2 text-[10px] text-white/55"><input type="checkbox" checked={checked.includes(`mat:${m.name}`)} onChange={() => toggle(`mat:${m.name}`)} className="accent-[#c8a15b]" /> بررسی شد</label>
                  </div>
                  <p dir="rtl" className="mt-2 text-xs text-[#d5b978]">{m.use}</p>
                  <p dir="rtl" className="mt-2 text-sm leading-7 text-white/65">{m.locations}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="border border-[#c8a15b]/25 bg-black/35 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><h3 className="font-serif text-lg text-[#e5c47f]">TITANITE SLAB LOCATIONS</h3><p dir="rtl" className="mt-1 text-xs text-white/55">۸ عدد در بازی اصلی + ۳ عدد در Ashes of Ariandel + ۴ عدد در The Ringed City</p></div>
              <span className="border border-[#c8a15b]/30 px-3 py-2 text-xs text-[#e5c47f]">۱۵ SLABS</span>
            </div>
            <div className="mt-4 space-y-3">
              {slabs.filter((s) => `${s.area} ${s.route}`.toLowerCase().includes(search.toLowerCase())).map((s) => (
                <article key={s.area} className="border border-white/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h4 className="text-sm text-[#e5c47f]">{s.area}</h4>
                    <div className="flex items-center gap-2"><span className="text-xs text-white/55">{s.count} عدد</span><span className={`border px-2 py-1 text-[9px] ${s.dlc ? "border-sky-400/30 text-sky-200/75" : "border-white/15 text-white/50"}`}>{s.dlc ? "DLC" : "BASE GAME"}</span></div>
                  </div>
                  <p dir="rtl" className="mt-3 text-sm leading-7 text-white/65">{s.route}</p>
                  <label className="mt-3 flex cursor-pointer items-center gap-2 text-[10px] text-white/55"><input type="checkbox" checked={checked.includes(`slab:${s.area}`)} onChange={() => toggle(`slab:${s.area}`)} className="accent-[#c8a15b]" /> این محل را کامل کردم</label>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      <div className="border-t border-[#c8a15b]/20 pt-4">
        <p dir="rtl" className="text-[11px] leading-6 text-white/40">یادداشت: بعضی اینفیوژن‌ها فقط پس از تحویل Coal مربوطه به Andre باز می‌شوند. سلاح‌های ویژه و سلاح‌های ساخته‌شده از Soul معمولاً قابل اینفیوژن نیستند.</p>
      </div>
    </div>
  );
}
