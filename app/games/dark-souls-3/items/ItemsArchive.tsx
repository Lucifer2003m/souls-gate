"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import itemFiles from "./items-data.json";
import itemMetadata from "./items-metadata.json";

type Category =
  | "all"
  | "consumables"
  | "souls"
  | "boss-souls"
  | "upgrade-materials"
  | "gems"
  | "keys"
  | "ashes"
  | "tomes-scrolls"
  | "covenant-online"
  | "quest-special"
  | "tools-ammo";
type ItemCategory = Exclude<Category, "all">;
type CollectionFilter = "all" | "collected" | "missing";
type SortMode = "az" | "za" | "category";
type ViewMode = "grid" | "list" | "table";
type Metadata = { file: string; category: ItemCategory; kind: string; description: string };
type Item = Metadata & { name: string; image: string };

const GOLD = "#c8a15b";
const STORAGE_KEY = "souls-gate-ds3-collected-items-v1";
const CATEGORY_LABELS: Record<Category, string> = {
  all: "همهٔ آیتم‌ها",
  consumables: "مصرفی‌ها و تقویتی‌ها",
  souls: "روح‌های قابل مصرف",
  "boss-souls": "روح باس‌ها و خاکستر اربابان",
  "upgrade-materials": "منابع ارتقا",
  gems: "سنگ‌های اینفیوژن",
  keys: "کلیدها و آیتم‌های کلیدی",
  ashes: "خاکسترهای فروشگاه",
  "tomes-scrolls": "کتاب‌ها و طومارها",
  "covenant-online": "آنلاین و پیمان‌ها",
  "quest-special": "مأموریت و آیتم‌های ویژه",
  "tools-ammo": "ابزارها و پرتابه‌ها",
};

const KIND_TRANSLATIONS: Record<string, string> = {
  "Consumable · Lure": "مصرفی · منحرف‌کردن دشمن",
  Restoration: "بازیابی سلامتی یا FP",
  "Key item": "آیتم کلیدی",
  Utility: "ابزار کاربردی",
  "Resistance consumable": "مصرفی افزایش مقاومت",
  "Quest · Invasion": "مأموریت · تهاجم آنلاین",
  Throwable: "پرتابه",
  "Online tool": "ابزار آنلاین",
  "Infusion gem": "سنگ اینفیوژن سلاح",
  "DLC quest item": "آیتم مأموریت بستهٔ الحاقی",
  "Status cure": "درمان وضعیت منفی",
  "Tome / scroll": "کتاب یا طومار جادو",
  "Ashes · Shrine Handmaid": "خاکستر برای خدمتکار آتشکده",
  "Weapon buff": "تقویت موقت سلاح",
  "Boss soul / Lord cinder": "روح باس یا خاکستر ارباب",
  "Reusable travel item": "ابزار سفر قابل استفادهٔ مجدد",
  "Key item · Bonfire": "آیتم کلیدی آتشکده",
  "Online · Invasion": "آنلاین · تهاجم",
  "Tome / scroll": "کتاب یا طومار جادو",
  "Consumable · Stamina": "مصرفی افزایش بازیابی استقامت",
  "Tool / projectile": "ابزار یا پرتابه",
  "Rare restoration": "بازیابی نادر",
  "Covenant · Online": "پیمان · آنلاین",
  "Online tool": "ابزار آنلاین",
  "Covenant / online item": "آیتم پیمان یا آنلاین",
  Consumable: "آیتم مصرفی",
  "Key item · Boss rewards": "آیتم کلیدی · پاداش باس‌ها",
  "Escape item": "ابزار بازگشت",
  "Quest / special item": "آیتم مأموریت یا ویژه",
  "Quest item · Ending": "آیتم مأموریت پایان بازی",
  "Soul item": "روح قابل مصرف برای دریافت سولز",
  "Upgrade material": "منبع ارتقا",
  "Quest item": "آیتم مأموریت",
  "Consumable · Resistance": "مصرفی افزایش مقاومت",
  "Online · PvP": "آنلاین · نبرد بازیکن با بازیکن",
  "Throwable · Bleed": "پرتابه · ایجاد خون‌ریزی",
  "Throwable · Poison": "پرتابه · ایجاد مسمومیت",
  "Consumable · Siegbräu": "مصرفی · زیگ‌برو",
  "Online recovery": "بازیابی امکان بازی آنلاین",
  "Online · Co-op": "آنلاین · همکاری",
  "Utility · Disguise": "ابزار تغییر شکل محیطی",
  "Quest / covenant item": "آیتم مأموریت یا پیمان",
  "Junk item": "آیتم کم‌ارزش",
  "Discovery consumable": "مصرفی افزایش کشف آیتم",
  "Consumable · Ember": "مصرفی · امبر",
  "Travel item": "ابزار سفر",
  "Covenant item": "آیتم پیمان",
  "Covenant / online item": "آیتم پیمان یا آنلاین",
  "Online · Undead Match": "آنلاین · مسابقهٔ مردگان",
  "Quest · Invasion": "مأموریت · تهاجم آنلاین",
};

function displayName(file: string) {
  return file
    .replace(/\.(png|jpe?g|webp)$/i, "")
    .replace(/_/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s*\(2\)$/i, "");
}

function imageUrl(file: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return "";
  return `${base}/storage/v1/object/public/game-assets/ds3/items/${encodeURIComponent(file).replace(/%2F/g, "/")}`;
}

function categoryName(category: ItemCategory) {
  return CATEGORY_LABELS[category] ?? "دسته‌بندی نامشخص";
}

function translateKind(kind: string) {
  return KIND_TRANSLATIONS[kind] ?? kind;
}

function translatedDescription(item: Metadata) {
  const name = displayName(item.file);
  const exact: Record<string, string> = {
    "Alluring Skull.png": "جمجمه‌ای پرتابی که توجه بسیاری از دشمنان نزدیک را منحرف می‌کند؛ بعضی دشمنان تحت‌تأثیر آن قرار نمی‌گیرند.",
    "Ashen Estus Flask.png": "برای بازیابی FP استفاده می‌شود. تعداد استفاده‌ها با تقسیم‌بندی فلاسک استوس در آتشکده مشترک است.",
    "Ashen Estus Flask (2).png": "برای بازیابی FP استفاده می‌شود. تعداد استفاده‌ها با تقسیم‌بندی فلاسک استوس در آتشکده مشترک است.",
    "Estus Flask.png": "برای بازیابی HP استفاده می‌شود. تعداد فلاسک‌ها و تقسیم میان HP و FP در آتشکده تنظیم می‌شود.",
    "Estus Flask (2).png": "برای بازیابی HP استفاده می‌شود. تعداد فلاسک‌ها و تقسیم میان HP و FP در آتشکده تنظیم می‌شود.",
    "Binoculars.png": "امکان مشاهدهٔ دوردست‌ها را از نمای اول‌شخص فراهم می‌کند.",
    "Black Bug Pellet.png": "برای مدت محدودی جذب آسیب تاریک را افزایش می‌دهد.",
    "Blue Bug Pellet.png": "برای مدت محدودی جذب آسیب جادویی را افزایش می‌دهد.",
    "Red Bug Pellet.png": "برای مدت محدودی جذب آسیب آتش را افزایش می‌دهد.",
    "Yellow Bug Pellet.png": "برای مدت محدودی جذب آسیب صاعقه را افزایش می‌دهد.",
    "Bloodred Moss Clump.png": "میزان انباشت خون‌ریزی را کاهش می‌دهد.",
    "Blooming Purple Moss Clump.png": "مسمومیت و زهر شدید را درمان می‌کند و انباشت آن‌ها را کاهش می‌دهد.",
    "Purple Moss Clump.png": "مسمومیت را درمان می‌کند و انباشت زهر را کاهش می‌دهد.",
    "Rime-blue Moss Clump.png": "یخ‌زدگی را درمان می‌کند و انباشت آن را کاهش می‌دهد.",
    "Black Eye Orb.png": "در جریان مأموریت مرتبط با آتشبان، برای ورود تهاجمی به دنیای شخصیت مسئول دزدیده‌شدن روح آتشبان به کار می‌رود.",
    "Black Separation Crystal.png": "فانتوم احضارشده را به دنیای خودش بازمی‌گرداند یا بازیکن مهمان را از دنیا خارج می‌کند.",
    "Cracked Red Eye Orb.png": "برای تلاش جهت تهاجم به دنیای بازیکن دیگری مصرف می‌شود.",
    "Red Eye Orb.png": "امکان تلاش‌های مکرر برای تهاجم به دنیای بازیکنان دیگر را فراهم می‌کند.",
    "White Sign Soapstone.png": "نشانهٔ احضار همکاری قرار می‌دهد تا بازیکن دیگری بتواند شما را به‌عنوان فانتوم دوستانه احضار کند.",
    "Red Sign Soapstone.png": "نشانهٔ قرمز برای نبردهای رقابتی بازیکن در برابر بازیکن قرار می‌دهد.",
    "Dried Finger.png": "تعداد مهمانان قابل احضار را افزایش می‌دهد و زمان‌سنج تهاجم را بازنشانی می‌کند؛ در عوض احتمال تهاجم را نیز افزایش می‌دهد.",
    "Homeward Bone.png": "بازیکن را به آخرین آتشکده‌ای که در آن استراحت کرده بازمی‌گرداند.",
    "Coiled Sword Fragment.png": "بازیکن را بدون مصرف‌شدن آیتم به آخرین آتشکده‌ای که در آن استراحت کرده بازمی‌گرداند.",
    "Darksign.png": "بازیکن را به آخرین آتشکده بازمی‌گرداند، اما سولز حمل‌شده را از دست می‌دهد.",
    "Divine Blessing.png": "سلامتی را کاملاً بازیابی و وضعیت‌های منفی را درمان می‌کند.",
    "Hidden Blessing.png": "FP را کاملاً بازیابی می‌کند.",
    "Ember.png": "بازیکن را امبر می‌کند، حداکثر HP را افزایش می‌دهد و تا زمان فعال‌بودن اثر امکان احضار آنلاین را فراهم می‌کند.",
    "Estus Shard.png": "برای افزایش تعداد استفاده‌های فلاسک استوس در آتشکده به آهنگر داده می‌شود.",
    "Undead Bone Shard.png": "با سوزاندن در آتشکدهٔ فایرلینک، قدرت بازیابی فلاسک استوس را افزایش می‌دهد.",
    "Transposing Kiln.png": "پس از تحویل به لودلث در فایرلینک، امکان تبدیل روح‌های واجد شرایط باس به سلاح، جادو یا پاداش ویژه را فراهم می‌کند.",
    "Small Doll.png": "برای عبور از مانع جادویی ورودی ایریتیل درهٔ بورئال لازم است.",
    "Loretta's Bone.png": "در جریان مأموریت گرِیرَت، این استخوان را به او در فایرلینک تحویل دهید.",
    "Eyes of a Fire Keeper.png": "آیتم مأموریتی مرتبط با آتشبان است که گزینه‌های گفت‌وگو و مسیرهای پایانی ویژه‌ای را فعال می‌کند.",
    "Fire Keeper Soul.png": "با تحویل به آتشبان، امکان درمان نشان تاریک را فراهم می‌کند و بر وضعیت مأموریت مربوطه اثر می‌گذارد.",
    "Champion's Bones.png": "با سوزاندن در آتشکدهٔ فایرلینک، قابلیت Undead Match را باز می‌کند.",
    "Purging Stone.png": "میزان Hollowing را کاهش می‌دهد؛ نشان تاریک را حذف نمی‌کند.",
    "Repair Powder.png": "دوام تجهیزات قابل تعمیر را بازیابی می‌کند.",
    "Prism Stone.png": "سنگی درخشان برای علامت‌گذاری مکان‌هاست؛ استفاده از آن برای سنجش سقوط، تضمین‌کنندهٔ امن‌بودن سقوط نیست.",
    "Rusted Coin.png": "برای مدت محدودی شانس یافتن آیتم را افزایش می‌دهد.",
    "Rusted Gold Coin.png": "برای مدت محدودی شانس یافتن آیتم را بیشتر از سکهٔ زنگ‌زدهٔ معمولی افزایش می‌دهد.",
    "Seed of a Giant Tree.png": "برای مدت محدودی باعث می‌شود دشمنان محیط به مهاجمان دنیای میزبان حمله کنند.",
    "Way of White Circlet.png": "برای بازیابی امکان بازی آنلاین پس از محدودیت ناشی از قطع‌کردن مکرر اتصال به کار می‌رود.",
    "Basin of Vows.png": "آیتم کلیدی مرتبط با پیشروی در دیوار بلند لوتریک و دسترسی به توالی مبارزهٔ رقصنده است.",
    "Coiled Sword.png": "در فایرلینک قرار می‌گیرد تا آتشکدهٔ مرکزی برقرار شود.",
    "Blood of the Dark Soul.png": "آیتم پایان‌بخش مأموریت نقاش در بستهٔ الحاقی The Ringed City است.",
    "Dragon Chaser's Ashes.png": "با تحویل به خدمتکار آتشکده، موجودی فروشگاه او را گسترش می‌دهد.",
    "Dreamchaser's Ashes.png": "با تحویل به خدمتکار آتشکده، موجودی فروشگاه او را گسترش می‌دهد.",
    "Easterner's Ashes.png": "با تحویل به خدمتکار آتشکده، موجودی فروشگاه او را گسترش می‌دهد.",
    "Greirat's Ashes.png": "با تحویل به خدمتکار آتشکده، موجودی فروشگاه او را گسترش می‌دهد.",
    "Yuria's Ashes.png": "با تحویل به خدمتکار آتشکده، موجودی فروشگاه او را گسترش می‌دهد.",
  };
  const specific = exact[item.file];
  if (specific) return specific;

  if (item.category === "souls") return "با مصرف این آیتم، مقدار مشخصی سولز دریافت می‌کنید. مقدار دقیق باید با توضیحات درون‌بازی یا منبع معتبر همان آیتم تطبیق داده شود.";
  if (item.category === "boss-souls") return "روح باس یا آیتم ویژهٔ مرتبط با باس است. پاداش‌های قابل تبدیل و کاربرد دقیق این مورد باید بر اساس نام آن در منبع معتبر بررسی شود.";
  if (item.category === "gems") return "برای اینفیوژن سلاح‌های واجد شرایط نزد آهنگر آندره استفاده می‌شود. اثر دقیق به نوع سنگ و سلاح بستگی دارد.";
  if (item.category === "ashes") return "این خاکستر را به خدمتکار آتشکده در فایرلینک تحویل دهید تا موجودی فروشگاه او گسترش یابد؛ اقلام آزادشده به نوع خاکستر بستگی دارند.";
  if (item.category === "tomes-scrolls") return "برای بازکردن جادوهای قابل خرید به مربی مناسب تحویل داده می‌شود. گیرنده به نوع کتاب یا طومار بستگی دارد.";
  if (item.category === "keys") return "آیتم کلیدی برای بازکردن مسیر، قفل یا فعال‌کردن تعامل مشخصی است. کاربرد دقیق این مورد نیازمند تطبیق نام آیتم با راهنمای معتبر بازی است.";
  if (item.category === "upgrade-materials") return "در یکی از سامانه‌های ارتقای بازی استفاده می‌شود. کاربرد دقیق این مورد به نوع منبع و مسیر ارتقا بستگی دارد.";
  if (item.category === "covenant-online") return "به تعاملات آنلاین یا پیمان‌ها مربوط است. کاربرد دقیق و شرایط دریافت پاداش باید با راهنمای معتبر همین آیتم بررسی شود.";
  if (item.category === "quest-special") return "آیتم ویژه یا مأموریتی است. برای جلوگیری از ارائهٔ اطلاعات نادرست، محل دریافت و اثر دقیق آن بدون تأیید منبع اعلام نشده است.";
  if (item.category === "tools-ammo") return "ابزار یا پرتابه‌ای با کاربرد مشخص در بازی است؛ اثر دقیق این مورد هنوز به‌صورت اختصاصی تأیید نشده است.";
  if (item.category === "consumables") return "آیتم مصرفی است. اثر دقیق این مورد باید با توضیحات داخل بازی یا یک منبع معتبر اختصاصی تطبیق داده شود.";
  return item.description || "توضیحات تأییدشده‌ای برای این آیتم ثبت نشده است.";
}

export default function ItemsArchive() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [collectionFilter, setCollectionFilter] = useState<CollectionFilter>("all");
  const [sort, setSort] = useState<SortMode>("az");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [collected, setCollected] = useState<string[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [imageErrors, setImageErrors] = useState<string[]>([]);

  const metadataByFile = useMemo(() => {
    const map = new Map<string, Metadata>();
    (itemMetadata as Metadata[]).forEach((entry) => map.set(entry.file, entry));
    return map;
  }, []);

  const items = useMemo<Item[]>(() => (itemFiles as string[]).map((file) => {
    const metadata = metadataByFile.get(file);
    return {
      file,
      name: displayName(file),
      category: metadata?.category ?? "quest-special",
      kind: metadata?.kind ?? "اطلاعات نیازمند بررسی",
      description: metadata?.description ?? "برای این فایل هنوز فرادادهٔ تأییدشده ثبت نشده است.",
      image: imageUrl(file),
    };
  }), [metadataByFile]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setCollected(parsed.filter((x): x is string => typeof x === "string"));
      }
    } catch { /* Storage may be unavailable; collection still works for this session. */ }
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collected)); } catch { /* Ignore blocked storage. */ }
  }, [collected]);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase();
    const result = items.filter((item) => {
      const translated = translatedDescription(item).toLocaleLowerCase();
      const matchesSearch = !q || item.name.toLocaleLowerCase().includes(q) || item.file.toLocaleLowerCase().includes(q) || item.kind.toLocaleLowerCase().includes(q) || translated.includes(q) || item.description.toLocaleLowerCase().includes(q);
      const matchesCategory = category === "all" || item.category === category;
      const isCollected = collected.includes(item.file);
      const matchesCollection = collectionFilter === "all" || (collectionFilter === "collected" ? isCollected : !isCollected);
      return matchesSearch && matchesCategory && matchesCollection;
    });
    return result.sort((a, b) => sort === "za" ? b.name.localeCompare(a.name) : sort === "category" ? CATEGORY_LABELS[a.category].localeCompare(CATEGORY_LABELS[b.category], "fa") || a.name.localeCompare(b.name) : a.name.localeCompare(b.name));
  }, [items, search, category, collectionFilter, collected, sort]);

  const collectedCount = collected.filter((file) => (itemFiles as string[]).includes(file)).length;
  const progress = Math.round((collectedCount / Math.max(items.length, 1)) * 100);
  const toggleCollected = (file: string) => setCollected((current) => current.includes(file) ? current.filter((x) => x !== file) : [...current, file]);
  const markVisible = () => setCollected((current) => [...new Set([...current, ...filtered.map((item) => item.file)])]);
  const clearVisible = () => setCollected((current) => current.filter((file) => !filtered.some((item) => item.file === file)));
  const categoryCounts = useMemo(() => {
    const counts = {} as Record<ItemCategory, number>;
    (Object.keys(CATEGORY_LABELS).filter((key) => key !== "all") as ItemCategory[]).forEach((key) => { counts[key] = items.filter((item) => item.category === key).length; });
    return counts;
  }, [items]);

  return (
    <section dir="rtl" lang="fa" className="mt-6 space-y-5 text-white">
      <header className="relative overflow-hidden border border-[#c8a15b]/35 bg-[radial-gradient(ellipse_at_top,rgba(200,161,91,0.17),transparent_58%),linear-gradient(135deg,#101515,#050606_65%)] p-5 sm:p-8">
        <div className="pointer-events-none absolute -left-10 -top-16 h-56 w-56 rounded-full border border-[#c8a15b]/15" />
        <p dir="ltr" className="text-right text-[10px] tracking-[0.25em] text-[#c8a15b]">DARK SOULS III · FIELD RECORDS</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="font-serif text-3xl text-[#f1e6d2] sm:text-5xl">دانشنامهٔ آیتم‌ها</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">آرشیو آیتم‌های دارک سولز ۳؛ با جست‌وجو، دسته‌بندی، توضیحات و ثبت وضعیت جمع‌آوری روی همین مرورگر.</p>
          </div>
          <div className="border border-[#c8a15b]/30 bg-black/40 px-5 py-3 text-left">
            <p className="text-[10px] text-white/45">وضعیت جمع‌آوری</p>
            <p className="mt-1 font-serif text-3xl text-[#e0bd78]">{collectedCount}<span className="text-base text-white/40"> / {items.length}</span></p>
          </div>
        </div>
        <div className="mt-6 h-1.5 overflow-hidden bg-white/10"><div className="h-full bg-gradient-to-l from-[#76552b] via-[#c8a15b] to-[#f2d99a] transition-all" style={{ width: `${progress}%` }} /></div>
        <div className="mt-2 flex justify-between gap-3 text-[10px] text-white/45"><span>{progress}% تکمیل‌شده</span><span dir="ltr">FIRE FADES · KNOWLEDGE REMAINS</span></div>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(["all", "boss-souls", "upgrade-materials", "consumables"] as Category[]).map((key) => <button key={key} type="button" onClick={() => setCategory(key)} className={`border px-3 py-3 text-right transition ${category === key ? "border-[#c8a15b]/70 bg-[#c8a15b]/10" : "border-white/10 bg-black/25 hover:border-[#c8a15b]/40"}`}><span className="block text-[10px] text-white/45">دسترسی سریع</span><span className="mt-1 block text-xs text-[#e6d4b0]">{CATEGORY_LABELS[key]}</span></button>)}
        </div>
      </header>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_230px_190px_180px]">
        <label className="relative block"><span className="sr-only">جست‌وجوی آیتم‌ها</span><span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-[#c8a15b]">⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جست‌وجو بر اساس نام، نوع یا کاربرد..." className="w-full border border-white/15 bg-black/50 py-3 pl-4 pr-10 text-sm text-right outline-none placeholder:text-white/35 focus:border-[#c8a15b]/70" /></label>
        <select aria-label="دسته‌بندی" value={category} onChange={(e) => setCategory(e.target.value as Category)} className="border border-[#c8a15b]/35 bg-[#0b0d0d] px-3 py-3 text-xs text-white/80 outline-none">{Object.entries(CATEGORY_LABELS).map(([key, label]) => <option key={key} value={key}>{label}{key !== "all" ? ` (${categoryCounts[key as ItemCategory] ?? 0})` : ` (${items.length})`}</option>)}</select>
        <select aria-label="فیلتر جمع‌آوری" value={collectionFilter} onChange={(e) => setCollectionFilter(e.target.value as CollectionFilter)} className="border border-[#c8a15b]/35 bg-[#0b0d0d] px-3 py-3 text-xs text-white/80 outline-none"><option value="all">همهٔ وضعیت‌ها</option><option value="collected">جمع‌آوری‌شده</option><option value="missing">جمع‌آوری‌نشده</option></select>
        <select aria-label="مرتب‌سازی" value={sort} onChange={(e) => setSort(e.target.value as SortMode)} className="border border-[#c8a15b]/35 bg-[#0b0d0d] px-3 py-3 text-xs text-white/80 outline-none"><option value="az">نام: الف تا ی</option><option value="za">نام: ی تا الف</option><option value="category">بر اساس دسته‌بندی</option></select>
      </div>

      <div className="flex flex-col gap-3 border-y border-[#c8a15b]/20 py-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-white/60">نمایش <span className="text-[#e2bf78]">{filtered.length}</span> از {items.length} آیتم</p><div className="flex flex-wrap items-center gap-2"><div className="flex border border-white/10 p-1" aria-label="حالت نمایش">{([{ value: "grid", label: "گریدی", icon: "▦" }, { value: "list", label: "لیستی", icon: "☷" }, { value: "table", label: "جدولی", icon: "▤" }] as { value: ViewMode; label: string; icon: string }[]).map((mode) => <button key={mode.value} type="button" onClick={() => setViewMode(mode.value)} aria-pressed={viewMode === mode.value} className={`px-3 py-2 text-[11px] transition ${viewMode === mode.value ? "bg-[#c8a15b]/15 text-[#e6c57e]" : "text-white/50 hover:text-white/80"}`}>{mode.icon} {mode.label}</button>)}</div><button type="button" onClick={markVisible} className="border border-[#c8a15b]/35 px-3 py-2 text-[10px] text-[#e5c57e] hover:bg-[#c8a15b]/10">علامت‌گذاری موارد نمایش‌داده‌شده</button><button type="button" onClick={clearVisible} className="border border-white/15 px-3 py-2 text-[10px] text-white/55 hover:border-white/35">پاک‌کردن وضعیت موارد نمایش‌داده‌شده</button></div></div>

      {!process.env.NEXT_PUBLIC_SUPABASE_URL && <div className="border border-amber-300/30 bg-amber-950/20 p-3 text-xs text-amber-100/80">برای نمایش تصاویر، متغیر NEXT_PUBLIC_SUPABASE_URL باید در فایل .env.local تنظیم شده باشد.</div>}
      {imageErrors.length > 0 && <div className="border border-red-400/25 bg-red-950/20 p-3 text-xs text-red-200/80">بارگذاری {imageErrors.length} تصویر ناموفق بود. نام فایل‌ها و مسیر پوشهٔ ds3/items را در Supabase بررسی کن.</div>}

      {filtered.length === 0 ? <div className="border border-white/10 bg-black/25 p-12 text-center"><p className="font-serif text-2xl text-[#d5b779]">موردی پیدا نشد</p><p className="mt-2 text-sm text-white/45">عبارت جست‌وجو یا فیلترها را تغییر بده.</p><button type="button" onClick={() => { setSearch(""); setCategory("all"); setCollectionFilter("all"); }} className="mt-4 border border-[#c8a15b]/40 px-4 py-2 text-xs text-[#e3c47f]">بازنشانی فیلترها</button></div> : viewMode === "table" ? <div className="overflow-x-auto border border-white/10"><table className="w-full min-w-[850px] border-collapse text-right"><thead className="bg-[#c8a15b]/10 text-[11px] text-[#e5c57e]"><tr><th className="p-3 font-normal">تصویر</th><th className="p-3 font-normal">نام آیتم</th><th className="p-3 font-normal">دسته‌بندی</th><th className="p-3 font-normal">نوع</th><th className="p-3 font-normal">کاربرد</th><th className="p-3 font-normal">وضعیت</th><th className="p-3 font-normal">عملیات</th></tr></thead><tbody>{filtered.map((item, index) => { const isCollected = collected.includes(item.file); return <tr key={item.file} className={`border-t border-white/10 text-xs ${isCollected ? "bg-[#c8a15b]/[0.06]" : "hover:bg-white/[0.025]"}`}><td className="p-2"><button type="button" onClick={() => setSelected(item)} aria-label={`نمایش ${item.name}`} className="h-14 w-14 border border-white/10 bg-black/30 p-1"><img src={item.image} alt={item.name} loading="lazy" onError={() => setImageErrors((current) => current.includes(item.file) ? current : [...current, item.file])} className="h-full w-full object-contain" /></button></td><td className="max-w-56 p-3"><button type="button" onClick={() => setSelected(item)} className="text-right text-sm text-[#f0e6d6] hover:text-[#e6c57e]">{item.name}</button><p dir="ltr" className="mt-1 truncate text-left text-[9px] text-white/25">{item.file}</p></td><td className="p-3 text-white/65">{categoryName(item.category)}</td><td className="p-3 text-white/55">{translateKind(item.kind)}</td><td className="max-w-xs p-3 leading-6 text-white/55">{translatedDescription(item)}</td><td className="p-3">{isCollected ? <span className="text-[#e6c57e]">✓ جمع‌شده</span> : <span className="text-white/35">جمع‌نشده</span>}</td><td className="p-3"><button type="button" onClick={() => toggleCollected(item.file)} className="whitespace-nowrap border border-[#c8a15b]/30 px-2 py-2 text-[10px] text-[#e6c57e]">{isCollected ? "لغو جمع‌آوری" : "+ جمع‌آوری"}</button></td></tr>; })}</tbody></table></div> : viewMode === "grid" ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{filtered.map((item, index) => { const isCollected = collected.includes(item.file); return <article key={item.file} className={`group min-w-0 border transition hover:border-[#c8a15b]/60 ${isCollected ? "border-[#c8a15b]/50 bg-[#15130e]" : "border-white/10 bg-[#080b0b]"}`}><button type="button" onClick={() => setSelected(item)} aria-label={`نمایش ${item.name}`} className="relative flex aspect-square w-full items-center justify-center overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(200,161,91,0.12),transparent_65%),#080b0b] p-4"><span dir="ltr" className="absolute left-2 top-2 z-10 bg-black/75 px-1.5 py-0.5 text-[8px] text-[#d9b66d]">{String(index + 1).padStart(3, "0")}</span><img src={item.image} alt={item.name} loading="lazy" onError={() => setImageErrors((current) => current.includes(item.file) ? current : [...current, item.file])} className="h-full w-full object-contain transition duration-300 group-hover:scale-105" />{isCollected && <span className="absolute bottom-2 left-2 grid h-6 w-6 place-items-center rounded-full border border-[#c8a15b]/70 bg-black/85 text-xs text-[#e6c57e]">✓</span>}</button><div className="p-3"><p className="text-[9px] leading-5 text-[#c8a15b]">{categoryName(item.category)}</p><button type="button" onClick={() => setSelected(item)} className="mt-1 line-clamp-2 min-h-10 w-full break-words text-right font-serif text-sm leading-5 text-[#f0e6d6] hover:text-[#e6c57e]">{item.name}</button><p className="mt-2 line-clamp-3 min-h-[4.5rem] text-[10px] leading-6 text-white/50">{translatedDescription(item)}</p><button type="button" onClick={() => toggleCollected(item.file)} className={`mt-3 w-full border px-2 py-2 text-[10px] ${isCollected ? "border-[#c8a15b]/50 bg-[#c8a15b]/10 text-[#e4c47e]" : "border-white/10 text-white/55 hover:border-[#c8a15b]/40"}`}>{isCollected ? "✓ جمع شد" : "+ جمع‌آوری"}</button></div></article>; })}</div> : <div className="space-y-2">{filtered.map((item, index) => { const isCollected = collected.includes(item.file); return <article key={item.file} className={`group flex min-w-0 items-center gap-3 border p-3 transition hover:border-[#c8a15b]/60 sm:gap-5 sm:p-4 ${isCollected ? "border-[#c8a15b]/50 bg-[#15130e]" : "border-white/10 bg-[#080b0b]"}`}><button type="button" onClick={() => setSelected(item)} className="relative h-20 w-20 shrink-0 overflow-hidden border border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(200,161,91,0.12),transparent_65%),#080b0b] sm:h-24 sm:w-28" aria-label={`نمایش ${item.name}`}><span dir="ltr" className="absolute left-1 top-1 z-10 bg-black/75 px-1.5 py-0.5 text-[8px] text-[#d9b66d]">{String(index + 1).padStart(3, "0")}</span><img src={item.image} alt={item.name} loading="lazy" onError={() => setImageErrors((current) => current.includes(item.file) ? current : [...current, item.file])} className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-110" />{isCollected && <span className="absolute bottom-1 left-1 grid h-5 w-5 place-items-center rounded-full border border-[#c8a15b]/70 bg-black/85 text-xs text-[#e6c57e]">✓</span>}</button><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] text-[#c8a15b]">{categoryName(item.category)}</span><span className="text-white/20">•</span><span className="text-[10px] text-white/45">{translateKind(item.kind)}</span></div><button type="button" onClick={() => setSelected(item)} className="mt-1 block max-w-full break-words text-right font-serif text-sm leading-6 text-[#f0e6d6] hover:text-[#e6c57e] sm:text-base">{item.name}</button><p className="mt-1 line-clamp-2 text-xs leading-6 text-white/55">{translatedDescription(item)}</p><p dir="ltr" className="mt-1 truncate text-left text-[10px] text-white/25">{item.file}</p></div><div className="flex shrink-0 flex-col gap-2"><button type="button" onClick={() => toggleCollected(item.file)} className={`border px-2 py-2 text-[10px] transition sm:px-3 ${isCollected ? "border-[#c8a15b]/50 bg-[#c8a15b]/10 text-[#e4c47e]" : "border-white/10 text-white/55 hover:border-[#c8a15b]/40 hover:text-[#e4c47e]"}`}>{isCollected ? "✓ جمع شد" : "+ جمع‌آوری"}</button><button type="button" onClick={() => setSelected(item)} className="px-2 py-1 text-[10px] text-white/40 hover:text-[#e4c47e]">جزئیات بیشتر</button></div></article>; })}</div>}

      {selected && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-5" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}><section role="dialog" aria-modal="true" aria-label={selected.name} className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto border border-[#c8a15b]/45 bg-[radial-gradient(ellipse_at_top,rgba(200,161,91,0.13),transparent_55%),#090c0c] p-5 shadow-2xl sm:p-8">
        <button type="button" onClick={() => setSelected(null)} aria-label="بستن جزئیات" className="absolute left-3 top-3 z-10 h-9 w-9 border border-white/15 text-lg text-white/70 hover:border-[#c8a15b]/60 hover:text-[#e6c57e]">×</button>
        <p dir="ltr" className="text-right text-[10px] tracking-[0.2em] text-[#c8a15b]">ITEM RECORD · DARK SOULS III</p>
        <h3 className="mt-3 pl-10 font-serif text-2xl text-[#f0e5d2] sm:text-4xl">{selected.name}</h3>
        <p className="mt-2 text-xs text-white/45">{categoryName(selected.category)} · {translateKind(selected.kind)}</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex min-h-52 items-center justify-center border border-[#c8a15b]/20 bg-black/30 p-5">{selected.image && <img src={selected.image} alt={selected.name} className="max-h-64 w-full object-contain" />}</div>
          <div className="space-y-3">
            <div className="border border-[#c8a15b]/25 bg-black/25 p-4"><p className="text-[10px] text-white/40">نوع آیتم</p><p className="mt-2 text-sm leading-7 text-[#e4d7c1]">{translateKind(selected.kind)}</p></div>
            <div className="border border-white/10 bg-black/25 p-4"><p className="text-[10px] text-white/40">کاربرد و توضیحات</p><p className="mt-2 text-sm leading-8 text-white/80">{translatedDescription(selected)}</p></div>
            <div className="border border-white/10 bg-black/25 p-4"><p className="text-[10px] text-white/40">وضعیت جمع‌آوری</p><p className="mt-2 text-sm text-[#e4d7c1]">{collected.includes(selected.file) ? "جمع‌آوری شده" : "هنوز جمع‌آوری نشده"}</p></div>
            <button type="button" onClick={() => toggleCollected(selected.file)} className="w-full border border-[#c8a15b]/50 bg-[#c8a15b]/10 px-4 py-3 text-xs text-[#e6c57e] hover:bg-[#c8a15b]/20">{collected.includes(selected.file) ? "حذف از فهرست جمع‌آوری‌شده‌ها" : "علامت‌گذاری به‌عنوان جمع‌آوری‌شده"}</button>
          </div>
        </div>
        <div className="mt-4 border border-white/10 bg-black/20 p-4"><p className="text-[10px] text-white/40">نام فایل در Supabase</p><p dir="ltr" className="mt-2 break-all text-left text-xs text-white/55">{selected.file}</p></div>
        <p className="mt-4 text-[11px] leading-7 text-white/35">محل دقیق پیدا کردن، تعداد دریافتی یا جزئیات عددی فقط زمانی باید درج شود که برای همین آیتم از منبع معتبر تأیید شده باشد. توضیحات عمومی یا تأییدنشده به‌عنوان محل دریافت قطعی نمایش داده نمی‌شود.</p>
      </section></div>}
    </section>
  );
}
