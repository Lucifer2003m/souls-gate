export type SpellCategory = "sorcery" | "pyromancy" | "miracle";
export type SourceType = "npc" | "ground" | "drop" | "transposition" | "covenant" | "gift";
export type Dlc = "ashes-of-ariandel" | "the-ringed-city";

export type SpellInfo = {
  /** نام نمایشی؛ فقط وقتی با اسم فایل فرق دارد */
  name?: string;
  category: SpellCategory;
  sourceType: SourceType;
  /** توضیح فارسی: از کجا و چطور به دست می‌آید */
  source: string;
  /** قیمت به سول (فروش NPC یا هزینه‌ی Transposition) */
  price?: number;
  dlc?: Dlc;
  effect?: string;
  fp?: number;
  slots?: number;
  requirement?: string;
  notes?: string;
};

// ───────────────────────── کمک‌کننده‌ها ─────────────────────────

/** مثل رینگ‌ها: پسوند را حذف می‌کند و "_" را به "'" تبدیل می‌کند (Dorhys_ Gnawing → Dorhys' Gnawing) */
export function cleanSpellName(file: string) {
  return file
    .replace(/\.(png|jpe?g|webp)$/i, "")
    .replace(/_/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** کلید یکتا: حروف کوچک، بدون آپستروف، بدون فاصله‌ی اضافه */
export function normalizeSpellKey(value: string) {
  return value
    .replace(/[’'`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export const categoryMeta: Record<
  SpellCategory,
  { title: string; fa: string; iconSpell: string }
> = {
  sorcery: { title: "SORCERIES", fa: "جادوها", iconSpell: "Soul Arrow" },
  pyromancy: { title: "PYROMANCIES", fa: "پیرومنسی‌ها", iconSpell: "Fireball" },
  miracle: { title: "MIRACLES", fa: "معجزه‌ها", iconSpell: "Heal" },
};

export const sourceTypeMeta: Record<SourceType, string> = {
  npc: "خرید از NPC",
  ground: "روی زمین",
  drop: "دراپ",
  transposition: "Transposition",
  covenant: "پاداش کاوننت",
  gift: "هدیه‌ی NPC",
};

export const dlcMeta: Record<Dlc, string> = {
  "ashes-of-ariandel": "Ashes of Ariandel",
  "the-ringed-city": "The Ringed City",
};

/** آیتم‌های کلیدی (Scroll و Tome) که فروشنده‌ها برای باز شدن اسپل‌ها لازم دارند */
export const keyItems: Record<string, string> = {
  "Sage's Scroll": "Farron Keep، نزدیک گروه Elder Ghru. به Orbeck بدهید.",
  "Golden Scroll": "Farron Keep، نزدیک Basilisk‌ها. به Orbeck بدهید.",
  "Logan's Scroll": "Profaned Capital، روی سقف ساختمان؛ جادوگر NPC (Logan) را بکشید. به Orbeck بدهید.",
  "Crystal Scroll": "با شکست Crystal Sage در Grand Archives. به Orbeck بدهید.",
  "Great Swamp Pyromancy Tome": "داخل آب در Road of Sacrifices. به Cornyx بدهید.",
  "Carthus Pyromancy Tome": "پشت دیوار توهمی در Catacombs of Carthus. به Cornyx بدهید.",
  "Izalith Pyromancy Tome": "در خرابه‌های Smouldering Lake. به Cornyx بدهید.",
  "Quelana Pyromancy Tome": "پشت دیوار توهمی در Smouldering Lake. به Karla بدهید.",
  "Grave Warden Pyromancy Tome": "در عرصه‌ی باس High Lord Wolnir. به Karla بدهید.",
  "Braille Divine Tome of Carim": "روی یک پیش‌آمدگی در Road of Sacrifices. به Irina بدهید.",
  "Braille Divine Tome of Lothric": "نزدیک یک وایورن در Lothric Castle. به Irina بدهید.",
  "Londor Braille Divine Tome": "از Yuria of Londor خریده می‌شود. (معجزه‌های تاریک؛ بهتر است به Karla بدهید)",
  "Deep Braille Divine Tome": "دراپ Mimic در Cathedral of the Deep. (معجزه‌های تاریک؛ بهتر است به Karla بدهید)",
};

const DARK_TOME_NOTE =
  "اگر Tome را به Irina بدهید و این معجزه‌ی تاریک را از او بخرید، داستان Irina خراب می‌شود. آن را به Karla بدهید.";

// ───────────────────────── داده‌ی اسپل‌ها ─────────────────────────
// کلیدها از normalizeSpellKey ساخته می‌شوند (حروف کوچک، بدون آپستروف).
// 38 جادو + 30 پیرومنسی + 38 معجزه = 106

export const spellDetails: Record<string, SpellInfo> = {
  // ════════════════ SORCERIES (38) ════════════════
  "soul arrow": {
    category: "sorcery", sourceType: "npc", price: 1000,
    source: "خرید از Orbeck of Vinheim، Yoel of Londor یا Yuria of Londor.",
    effect: "یک تیر روح شلیک می‌کند.", fp: 7, slots: 1, requirement: "Intelligence 10",
    notes: "اگر با کلاس Sorcerer شروع کرده باشید از ابتدا دارید؛ برای ثبت تروفی یک بار هم از فروشنده بخرید.",
  },
  "great soul arrow": {
    category: "sorcery", sourceType: "npc", price: 3000,
    source: "خرید از Orbeck of Vinheim.",
    effect: "تیر روح قوی‌تر.", fp: 10, slots: 1, requirement: "Intelligence 15",
  },
  "heavy soul arrow": {
    category: "sorcery", sourceType: "npc", price: 2000,
    source: "خرید از Orbeck of Vinheim، Yoel of Londor یا Yuria of Londor.",
    effect: "تیر روح سنگین.", fp: 11, slots: 1, requirement: "Intelligence 13",
  },
  "great heavy soul arrow": {
    category: "sorcery", sourceType: "npc", price: 4000,
    source: "خرید از Orbeck of Vinheim.",
    effect: "تیر روح سنگین قوی‌تر.", fp: 14, slots: 1, requirement: "Intelligence 18",
  },
  "farron dart": {
    category: "sorcery", sourceType: "npc", price: 500,
    source: "خرید از Shrine Handmaid یا Orbeck of Vinheim.",
    effect: "دارت روح شلیک می‌کند.", fp: 3, slots: 1, requirement: "Intelligence 8",
  },
  "great farron dart": {
    category: "sorcery", sourceType: "npc", price: 2000,
    source: "خرید از Orbeck of Vinheim پس از دادن Sage's Scroll.",
    effect: "دارت روح قوی‌تر.", fp: 4, slots: 1, requirement: "Intelligence 23",
  },
  "farron hail": {
    category: "sorcery", sourceType: "npc", price: 5000,
    source: "خرید از Orbeck of Vinheim پس از دادن Sage's Scroll.",
    effect: "رگباری از دارت‌های روح شلیک می‌کند.", fp: 4, slots: 1, requirement: "Intelligence 28",
  },
  "homing soulmass": {
    category: "sorcery", sourceType: "npc", price: 6000,
    source: "خرید از Orbeck of Vinheim پس از دادن Logan's Scroll.",
    effect: "توده‌ی روح هدایت‌شونده رها می‌کند.", fp: 20, slots: 1, requirement: "Intelligence 20",
  },
  "homing crystal soulmass": {
    category: "sorcery", sourceType: "npc", price: 18000,
    source: "خرید از Orbeck of Vinheim پس از دادن Crystal Scroll.",
    effect: "توده‌ی کریستالی هدایت‌شونده؛ ضربه‌اش نافذ است.", fp: 43, slots: 1, requirement: "Intelligence 30",
  },
  "crystal hail": {
    category: "sorcery", sourceType: "transposition", price: 1500,
    source: "Transposition نزد Ludleth of Courland با Soul of a Crystal Sage.",
    effect: "باران توده‌های کریستالی کوچک از بالا؛ نافذ.", fp: 19, slots: 1, requirement: "Intelligence 18",
  },
  "soul spear": {
    category: "sorcery", sourceType: "npc", price: 5000,
    source: "خرید از Orbeck of Vinheim پس از دادن Logan's Scroll.",
    effect: "نیزه‌ی روح شلیک می‌کند.", fp: 32, slots: 1, requirement: "Intelligence 32",
  },
  "crystal soul spear": {
    category: "sorcery", sourceType: "npc", price: 15000,
    source: "خرید از Orbeck of Vinheim پس از دادن Crystal Scroll.",
    effect: "نیزه‌ی کریستالی نافذ.", fp: 46, slots: 1, requirement: "Intelligence 48",
  },
  "white dragon breath": {
    category: "sorcery", sourceType: "transposition", price: 10000,
    source: "Transposition نزد Ludleth of Courland با Soul of Consumed Oceiros.",
    effect: "نفس کریستالی Seath the Scaleless؛ نافذ.", fp: 25, slots: 1, requirement: "Intelligence 50",
  },
  "soul stream": {
    category: "sorcery", sourceType: "ground",
    source: "روی زمین در Grand Archives.",
    effect: "رگباری سیل‌آسا از روح‌ها شلیک می‌کند.", fp: 55, slots: 2, requirement: "Intelligence 45",
  },
  "soul greatsword": {
    category: "sorcery", sourceType: "npc", price: 5000,
    source: "خرید از Orbeck of Vinheim، Yoel of Londor یا Yuria of Londor.",
    effect: "با یک شمشیر بزرگِ ساخته‌شده از روح حمله می‌کند.", fp: 23, slots: 1, requirement: "Intelligence 22",
  },
  "farron flashsword": {
    category: "sorcery", sourceType: "npc", price: 3000,
    source: "خرید از Orbeck of Vinheim.",
    effect: "نسخه‌ی تغییر‌یافته‌ی Soul Greatsword که جادوگران Undead Legion of Farron ساخته‌اند.", fp: 4, slots: 1, requirement: "Intelligence 23",
  },
  "magic weapon": {
    category: "sorcery", sourceType: "npc", price: 3000,
    source: "خرید از Orbeck of Vinheim، Yoel of Londor یا Yuria of Londor.",
    effect: "سلاح دست راست را با جادو تقویت می‌کند.", fp: 25, slots: 1, requirement: "Intelligence 10",
  },
  "great magic weapon": {
    category: "sorcery", sourceType: "ground",
    source: "روی زمین در Farron Keep (منطقه‌ی Perimeter).",
    effect: "سلاح دست راست را به‌شدت با جادو تقویت می‌کند.", fp: 35, slots: 1, requirement: "Intelligence 15",
  },
  "crystal magic weapon": {
    category: "sorcery", sourceType: "npc", price: 10000,
    source: "خرید از Orbeck of Vinheim پس از دادن Crystal Scroll.",
    effect: "سلاح دست راست را با کریستال تقویت می‌کند.", fp: 45, slots: 1, requirement: "Intelligence 30",
  },
  "magic shield": {
    category: "sorcery", sourceType: "npc", price: 3000,
    source: "خرید از Orbeck of Vinheim، Yoel of Londor یا Yuria of Londor.",
    effect: "سپر دست چپ را با جادو تقویت می‌کند.", fp: 30, slots: 1, requirement: "Intelligence 10",
  },
  "great magic shield": {
    category: "sorcery", sourceType: "drop",
    source: "دراپ Corpse Grub در Irithyll Dungeon.",
    effect: "سپر دست چپ را به‌شدت با جادو تقویت می‌کند.", fp: 60, slots: 1, requirement: "Intelligence 18",
  },
  "spook": {
    category: "sorcery", sourceType: "npc", price: 2000,
    source: "خرید از Orbeck of Vinheim.",
    effect: "صدای حرکت را پنهان می‌کند و از آسیب سقوط جلوگیری می‌کند.", fp: 15, slots: 1, requirement: "Intelligence 10",
  },
  "aural decoy": {
    category: "sorcery", sourceType: "npc", price: 2000,
    source: "خرید از Orbeck of Vinheim.",
    effect: "با صدایی از دور، دشمنان را منحرف می‌کند.", fp: 15, slots: 1, requirement: "Intelligence 18",
  },
  "pestilent mist": {
    name: "Pestilent Mercury",
    category: "sorcery", sourceType: "npc", price: 1000,
    source: "خرید از Orbeck of Vinheim پس از دادن Sage's Scroll.",
    effect: "مه غلیظی رها می‌کند که HP را می‌خورد. به خود جادوگر هم آسیب می‌زند.", fp: 13, slots: 1, requirement: "Intelligence 30",
    notes: "در بازی با نام Pestilent Mercury شناخته می‌شود.",
  },
  "cast light": {
    category: "sorcery", sourceType: "npc", price: 1000,
    source: "خرید از Orbeck of Vinheim پس از دادن Golden Scroll.",
    effect: "نوری برای روشن کردن اطراف می‌سازد.", fp: 20, slots: 1, requirement: "Intelligence 15",
  },
  "repair": {
    category: "sorcery", sourceType: "npc", price: 2000,
    source: "خرید از Orbeck of Vinheim پس از دادن Golden Scroll.",
    effect: "سلاح و زره‌ی در دست را تعمیر می‌کند، حتی اگر دوامشان صفر شده باشد.", fp: 20, slots: 1, requirement: "Intelligence 15",
  },
  "hidden weapon": {
    category: "sorcery", sourceType: "npc", price: 1500,
    source: "خرید از Orbeck of Vinheim پس از دادن Golden Scroll.",
    effect: "سلاح دست راست را نامرئی می‌کند.", fp: 25, slots: 1, requirement: "Intelligence 12",
  },
  "hidden body": {
    category: "sorcery", sourceType: "npc", price: 3000,
    source: "خرید از Orbeck of Vinheim پس از دادن Golden Scroll.",
    effect: "بدن را تقریباً نامرئی می‌کند.", fp: 15, slots: 1, requirement: "Intelligence 15",
  },
  "chameleon": {
    category: "sorcery", sourceType: "drop",
    source: "دراپ Old Woman of Londor (زائر) در Irithyll of the Boreal Valley.",
    effect: "بازیکن را به یک شیء بی‌اهمیت تبدیل می‌کند (بسته به منطقه).", fp: 20, slots: 1, requirement: "Intelligence 12",
  },
  "twisted wall of light": {
    category: "sorcery", sourceType: "npc", price: 6000,
    source: "خرید از Orbeck of Vinheim پس از دادن Golden Scroll.",
    effect: "نور را منحرف می‌کند تا جادو را دفع کند.", fp: 10, slots: 1, requirement: "Intelligence 27",
  },
  "deep soul": {
    category: "sorcery", sourceType: "transposition",
    source: "Transposition نزد Ludleth of Courland با Soul of the Deacons of the Deep.",
    effect: "تفاله‌های روح تاریک شلیک می‌کند.", fp: 6, slots: 1, requirement: "Intelligence 12",
  },
  "great deep soul": {
    category: "sorcery", sourceType: "covenant",
    source: "پاداش رتبه‌ی ۱ کاوننت Aldrich Faithful (Archdeacon McDonnell آن را می‌فروشد).",
    effect: "رسوب قدرتمند و تاریک روح شلیک می‌کند.", fp: 9, slots: 1, requirement: "Intelligence 20",
  },
  "affinity": {
    category: "sorcery", sourceType: "npc", price: 15000,
    source: "خرید از Karla.",
    effect: "تجلی تاریکی انسانیت را احضار می‌کند.", fp: 40, slots: 1, requirement: "Intelligence 32",
  },
  "dark edge": {
    category: "sorcery", sourceType: "npc", price: 8000,
    source: "خرید از Karla.",
    effect: "با تیغه‌ای از تاریکی انسانیت ضربه می‌زند.", fp: 26, slots: 1, requirement: "Intelligence 30",
  },
  "frozen weapon": {
    category: "sorcery", sourceType: "ground", dlc: "ashes-of-ariandel",
    source: "روی زمین در Rope Bridge Cave (DLC Ashes of Ariandel).",
    effect: "سلاح دست راست را با یخ تقویت می‌کند.", fp: 30, slots: 1, requirement: "Intelligence 15",
  },
  "snap freeze": {
    category: "sorcery", sourceType: "ground", dlc: "ashes-of-ariandel",
    source: "روی زمین در Depths of the Painting (DLC Ashes of Ariandel).",
    effect: "ابری از مه نزدیک به یخ‌زدگی می‌سازد.", fp: 16, slots: 1, requirement: "Intelligence 18",
  },
  "great soul dregs": {
    category: "sorcery", sourceType: "ground", dlc: "the-ringed-city",
    source: "روی زمین در The Dreg Heap (DLC The Ringed City).",
    effect: "رسوب بزرگ روح شلیک می‌کند.", fp: 30, slots: 1, requirement: "Intelligence 40",
  },
  "old moonlight": {
    category: "sorcery", sourceType: "transposition", dlc: "the-ringed-city",
    source: "Transposition نزد Ludleth of Courland (DLC The Ringed City).",
    effect: "شمشیر ماهتاب کهن را می‌سازد و حمله می‌کند.", fp: 23, slots: 1, requirement: "Intelligence 25",
  },

  // ════════════════ PYROMANCIES (30) ════════════════
  "fireball": {
    category: "pyromancy", sourceType: "npc", price: 1000,
    source: "خرید از Cornyx of the Great Swamp.",
    effect: "گلوله‌ی آتشین ساده‌ای پرتاب می‌کند.", fp: 10, slots: 1, requirement: "Intelligence 6 / Faith 6",
    notes: "اگر با کلاس Pyromancer شروع کرده باشید از ابتدا دارید؛ برای ثبت تروفی یک بار هم از Cornyx بخرید.",
  },
  "fire orb": {
    category: "pyromancy", sourceType: "npc", price: 3000,
    source: "خرید از Cornyx of the Great Swamp پس از دادن Great Swamp Pyromancy Tome.",
    effect: "گوی آتشین بزرگی پرتاب می‌کند که با برخورد منفجر می‌شود.", fp: 14, slots: 1, requirement: "Intelligence 8 / Faith 8",
  },
  "bursting fireball": {
    category: "pyromancy", sourceType: "npc", price: 5000,
    source: "خرید از Cornyx of the Great Swamp پس از دادن Great Swamp Pyromancy Tome.",
  },
  "great chaos fire orb": {
    category: "pyromancy", sourceType: "npc", price: 10000,
    source: "خرید از Cornyx of the Great Swamp پس از دادن Izalith Pyromancy Tome.",
  },
  "chaos bed vestiges": {
    category: "pyromancy", sourceType: "transposition", price: 5000,
    source: "Transposition نزد Ludleth of Courland با Soul of the Old Demon King.",
  },
  "fire surge": {
    category: "pyromancy", sourceType: "npc", price: 1000,
    source: "خرید از Cornyx of the Great Swamp.",
  },
  "fire whip": {
    name: "Fire Whip",
    category: "pyromancy", sourceType: "npc", price: 10000,
    source: "خرید از Karla پس از دادن Quelana Pyromancy Tome.",
  },
  "firestorm": {
    category: "pyromancy", sourceType: "npc", price: 15000,
    source: "خرید از Karla پس از دادن Quelana Pyromancy Tome.",
  },
  "chaos storm": {
    category: "pyromancy", sourceType: "npc", price: 12000,
    source: "خرید از Cornyx of the Great Swamp پس از دادن Izalith Pyromancy Tome.",
  },
  "great combustion": {
    category: "pyromancy", sourceType: "npc", price: 3000,
    source: "خرید از Cornyx of the Great Swamp.",
    effect: "شعله‌ی بزرگ و قدرتمندی در دست می‌سازد؛ حمله‌ی نزدیک‌برد با خسارت Poise بالا.", fp: 17, slots: 1, requirement: "Intelligence 10 / Faith 10",
  },
  "sacred flame": {
    category: "pyromancy", sourceType: "ground",
    source: "روی زمین، داخل گدازه در Smouldering Lake (منطقه‌ی Demon Ruins).",
  },
  "profaned flame": {
    category: "pyromancy", sourceType: "ground",
    source: "روی زمین در Irithyll Dungeon.",
  },
  "poison mist": {
    category: "pyromancy", sourceType: "npc", price: 2000,
    source: "خرید از Cornyx of the Great Swamp پس از دادن Great Swamp Pyromancy Tome.",
  },
  "toxic mist": {
    category: "pyromancy", sourceType: "ground",
    source: "روی زمین، داخل گدازه در Smouldering Lake (منطقه‌ی Demon Ruins).",
  },
  "acid surge": {
    category: "pyromancy", sourceType: "npc", price: 6000,
    source: "خرید از Cornyx of the Great Swamp پس از دادن Carthus Pyromancy Tome.",
  },
  "flash sweat": {
    category: "pyromancy", sourceType: "npc", price: 1500,
    source: "خرید از Cornyx of the Great Swamp.",
  },
  "profuse sweat": {
    category: "pyromancy", sourceType: "npc", price: 2000,
    source: "خرید از Cornyx of the Great Swamp پس از دادن Great Swamp Pyromancy Tome.",
  },
  "iron flesh": {
    category: "pyromancy", sourceType: "ground",
    source: "روی زمین در Farron Keep.",
  },
  "power within": {
    category: "pyromancy", sourceType: "ground",
    source: "روی زمین در Grand Archives.",
  },
  "carthus beacon": {
    category: "pyromancy", sourceType: "npc", price: 8000,
    source: "خرید از Cornyx of the Great Swamp پس از دادن Carthus Pyromancy Tome.",
  },
  "carthus flame arc": {
    category: "pyromancy", sourceType: "npc", price: 10000,
    source: "خرید از Cornyx of the Great Swamp پس از دادن Carthus Pyromancy Tome.",
  },
  "warmth": {
    category: "pyromancy", sourceType: "covenant",
    source: "پاداش رتبه‌ی ۱ کاوننت Mound-makers (Holy Knight Hodrick آن را می‌فروشد).",
    effect: "شعله‌ای ملایم می‌سازد که با لمس، HP را بازیابی می‌کند (۶۰ ثانیه). روی دشمنان و بازیکنان دیگر هم اثر می‌گذارد.", fp: 50, slots: 2, requirement: "Faith 25",
  },
  "rapport": {
    category: "pyromancy", sourceType: "npc", price: 7000,
    source: "خرید از Karla پس از دادن Quelana Pyromancy Tome.",
  },
  "boulder heave": {
    category: "pyromancy", sourceType: "transposition",
    source: "Transposition نزد Ludleth of Courland با Soul of a Stray Demon.",
  },
  "black flame": {
    category: "pyromancy", sourceType: "npc", price: 10000,
    source: "خرید از Karla پس از دادن Grave Warden Pyromancy Tome.",
  },
  "black fire orb": {
    category: "pyromancy", sourceType: "npc", price: 10000,
    source: "خرید از Karla پس از دادن Grave Warden Pyromancy Tome.",
  },
  "black serpent": {
    category: "pyromancy", sourceType: "transposition",
    source: "Transposition نزد Ludleth of Courland با Soul of High Lord Wolnir.",
  },
  "floating chaos": {
    category: "pyromancy", sourceType: "drop", dlc: "ashes-of-ariandel",
    source: "دراپ Livid Pyromancer Dunnel (DLC Ashes of Ariandel).",
  },
  "seething chaos": {
    category: "pyromancy", sourceType: "transposition", dlc: "the-ringed-city",
    source: "Transposition نزد Ludleth of Courland با Soul of the Demon Prince (DLC The Ringed City).",
  },
  "flame fan": {
    category: "pyromancy", sourceType: "drop", dlc: "the-ringed-city",
    source: "دراپ Desert Pyromancer Zoey در Earthen Peak Ruins (DLC The Ringed City).",
    effect: "با یک بادبزن آتشین به چپ و راست ضربه می‌زند؛ حمله‌ی نزدیک‌برد.", fp: 9, slots: 1, requirement: "Intelligence 15 / Faith 15",
  },

  // ════════════════ MIRACLES (38) ════════════════
  "heal aid": {
    category: "miracle", sourceType: "npc", price: 500,
    source: "خرید از Shrine Handmaid.",
  },
  "heal": {
    category: "miracle", sourceType: "npc", price: 1000,
    source: "خرید از Irina of Carim.",
    effect: "HP را بازیابی می‌کند.",
    notes: "اگر با کلاس Cleric شروع کرده باشید از ابتدا دارید؛ برای ثبت تروفی یک بار هم از Irina بخرید.",
  },
  "med heal": {
    category: "miracle", sourceType: "npc", price: 3500,
    source: "خرید از Irina of Carim پس از دادن Braille Divine Tome of Carim.",
  },
  "great heal": {
    category: "miracle", sourceType: "ground",
    source: "روی زمین در Irithyll of the Boreal Valley (منطقه‌ی Distant Manor).",
  },
  "soothing sunlight": {
    category: "miracle", sourceType: "transposition", price: 6000,
    source: "Transposition نزد Ludleth of Courland با Soul of the Dancer of the Boreal Valley.",
    effect: "HP خودتان و متحدان نزدیک را بازیابی می‌کند.",
  },
  "replenishment": {
    category: "miracle", sourceType: "npc", price: 1000,
    source: "خرید از Irina of Carim.",
    effect: "HP را به‌تدریج بازیابی می‌کند (حدود ۵ واحد در ثانیه).",
  },
  "bountiful light": {
    category: "miracle", sourceType: "npc", price: 5000,
    source: "خرید از Irina of Carim پس از دادن Braille Divine Tome of Lothric.",
    effect: "HP زیادی را به‌تدریج بازیابی می‌کند (۷ واحد در ثانیه، ۶۰ ثانیه).", fp: 45, slots: 1, requirement: "Faith 25",
  },
  "bountiful sunlight": {
    category: "miracle", sourceType: "transposition",
    source: "Transposition نزد Ludleth of Courland با Soul of Rosaria.",
  },
  "caressing tears": {
    category: "miracle", sourceType: "npc", price: 1500,
    source: "خرید از Irina of Carim.",
    effect: "خونریزی، سم و یخ‌زدگی را برای خودتان و اطرافیان درمان می‌کند.", fp: 14, slots: 1, requirement: "Faith 12",
  },
  "tears of denial": {
    category: "miracle", sourceType: "npc", price: 10000,
    source: "خرید از Irina of Carim پس از دادن Braille Divine Tome of Carim.",
  },
  "homeward": {
    category: "miracle", sourceType: "npc", price: 3000,
    source: "خرید از Irina of Carim.",
    effect: "شما را به آخرین بونفایر برمی‌گرداند.",
  },
  "seek guidance": {
    category: "miracle", sourceType: "ground",
    source: "روی زمین در Cathedral of the Deep (منطقه‌ی Cleansing Chapel).",
  },
  "sacred oath": {
    category: "miracle", sourceType: "covenant",
    source: "پاداش رتبه‌ی ۱ کاوننت Warriors of Sunlight (Altar of Sunlight).",
  },
  "force": {
    category: "miracle", sourceType: "npc", price: 1000,
    source: "خرید از Irina of Carim پس از دادن Braille Divine Tome of Carim.",
    notes: "اگر با کلاس Cleric شروع کرده باشید از ابتدا دارید؛ برای ثبت تروفی یک بار هم از Irina بخرید.",
  },
  "emit force": {
    category: "miracle", sourceType: "gift",
    source: "از Siegward of Catarina در مسیر کوئستش به شما داده می‌شود.",
    notes: "منبع این معجزه در راهنماها یکسان نیست و بعضی سایت‌ها منبعی برایش نشان نمی‌دهند. حتماً داخل بازی هم تست کنید.",
  },
  "wrath of the gods": {
    category: "miracle", sourceType: "ground",
    source: "روی زمین در Profaned Capital.",
  },
  "lightning spear": {
    category: "miracle", sourceType: "ground",
    source: "روی زمین در Farron Keep (منطقه‌ی Old Wolf of Farron).",
  },
  "great lightning spear": {
    category: "miracle", sourceType: "covenant",
    source: "پاداش رتبه‌ی ۲ کاوننت Warriors of Sunlight (Altar of Sunlight).",
  },
  "sunlight spear": {
    category: "miracle", sourceType: "transposition", price: 10000,
    source: "Transposition نزد Ludleth of Courland با Soul of the Lords.",
  },
  "lightning stake": {
    category: "miracle", sourceType: "drop",
    source: "دراپ Carthus Sandworm در Smouldering Lake.",
  },
  "lightning storm": {
    category: "miracle", sourceType: "transposition", price: 5000,
    source: "Transposition نزد Ludleth of Courland با Soul of the Nameless King.",
  },
  "divine pillars of light": {
    category: "miracle", sourceType: "ground",
    source: "روی زمین در Grand Archives.",
  },
  "blessed weapon": {
    category: "miracle", sourceType: "npc", price: 8000,
    source: "خرید از Irina of Carim پس از دادن Braille Divine Tome of Lothric.",
    effect: "در زمان اثر، HP را به‌تدریج بازیابی می‌کند و سلاح هاله‌ی سفید می‌گیرد.", fp: 35, slots: 1,
  },
  "lightning blade": {
    category: "miracle", sourceType: "ground",
    source: "روی زمین در Irithyll Dungeon.",
  },
  "darkmoon blade": {
    category: "miracle", sourceType: "covenant",
    source: "پاداش رتبه‌ی ۲ کاوننت Blade of the Darkmoon (Company Captain Yorshka آن را می‌فروشد).",
    effect: "به سلاح خسارت جادویی می‌دهد که فقط با Faith مقیاس می‌گیرد.",
  },
  "magic barrier": {
    category: "miracle", sourceType: "npc", price: 5000,
    source: "خرید از Irina of Carim پس از دادن Braille Divine Tome of Lothric.",
  },
  "great magic barrier": {
    category: "miracle", sourceType: "ground",
    source: "روی زمین در Archdragon Peak (منطقه‌ی Great Belfry).",
  },
  "dark blade": {
    category: "miracle", sourceType: "npc", price: 10000,
    source: "خرید از Irina of Carim یا Karla پس از دادن Londor Braille Divine Tome.",
    notes: DARK_TOME_NOTE,
  },
  "vow of silence": {
    category: "miracle", sourceType: "npc", price: 15000,
    source: "خرید از Irina of Carim یا Karla پس از دادن Londor Braille Divine Tome.",
    effect: "استفاده از هر نوع جادو را برای حدود ۱۵ ثانیه مسدود می‌کند (شما را هم).",
    notes: DARK_TOME_NOTE,
  },
  "dead again": {
    category: "miracle", sourceType: "npc", price: 5000,
    source: "خرید از Irina of Carim یا Karla پس از دادن Londor Braille Divine Tome.",
    notes: DARK_TOME_NOTE,
  },
  "atonement": {
    category: "miracle", sourceType: "ground",
    source: "روی زمین در Farron Keep (منطقه‌ی Perimeter).",
  },
  "deep protection": {
    category: "miracle", sourceType: "npc", price: 4000,
    source: "خرید از Irina of Carim یا Karla پس از دادن Deep Braille Divine Tome.",
    notes: DARK_TOME_NOTE,
  },
  "gnaw": {
    category: "miracle", sourceType: "npc", price: 2000,
    source: "خرید از Irina of Carim یا Karla پس از دادن Deep Braille Divine Tome.",
    notes: DARK_TOME_NOTE,
  },
  "dorhys gnawing": {
    name: "Dorhys' Gnawing",
    category: "miracle", sourceType: "drop",
    source: "دراپ Cathedral Evangelist در Irithyll of the Boreal Valley.",
  },
  "lifehunt scythe": {
    category: "miracle", sourceType: "transposition",
    source: "Transposition نزد Ludleth of Courland با Soul of Aldrich.",
  },
  "lightning arrow": {
    category: "miracle", sourceType: "ground", dlc: "the-ringed-city",
    source: "روی زمین در Shared Grave (DLC The Ringed City).",
  },
  "projected heal": {
    category: "miracle", sourceType: "ground", dlc: "the-ringed-city",
    source: "روی زمین در The Dreg Heap (DLC The Ringed City).",
  },
  "way of white corona": {
    category: "miracle", sourceType: "ground", dlc: "ashes-of-ariandel",
    source: "روی زمین در Corvian Settlement (DLC Ashes of Ariandel).",
  },
};