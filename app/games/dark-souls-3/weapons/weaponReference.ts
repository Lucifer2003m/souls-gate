/**
 * مرجع رسمی دسته‌بندی ۲۲۱ سلاح Dark Souls 3 برای Souls Gate.
 * فقط سلاح‌های موجود در این فهرست نمایش داده می‌شوند؛ موارد خارج از فهرست فیلتر می‌شوند.
 * Giant Door Shield عمداً حذف شده و Test Greatbow به Dragonslayer Greatbow نگاشت می‌شود.
 */

export const WEAPON_CATEGORIES: Record<string, string> = {
  all: "همه سلاح‌ها",
  dagger: "خنجرها",
  straight_sword: "شمشیرهای مستقیم",
  greatsword: "شمشیرهای بزرگ",
  ultra_greatsword: "شمشیرهای فوق‌بزرگ",
  curved_sword: "شمشیرهای خمیده",
  curved_greatsword: "شمشیرهای خمیده بزرگ",
  katana: "کاتاناها",
  thrusting_sword: "شمشیرهای نوک‌تیز",
  axe: "تبرها",
  greataxe: "تبرهای بزرگ",
  hammer: "چکش‌ها",
  great_hammer: "چکش‌های بزرگ",
  fist: "مشت‌ها و پنجه‌ها",
  spear: "نیزه‌ها",
  halberd: "هالبردها",
  reaper: "داس‌ها",
  whip: "شلاق‌ها",
  bow: "کمان‌ها",
  greatbow: "کمان‌های بزرگ",
  crossbow: "کمان‌های زنبورکی",
  staff: "عصاهای جادوگری",
  flames_talismans_chimes: "شعله‌ها، طلسم‌ها و زنگ‌ها",
};

const CATEGORY_NAMES: Record<string, string[]> = {
  dagger: [
    "Dagger", "Parrying Dagger", "Mail Breaker", "Bandit's Knife",
    "Rotten Ghru Dagger", "Corvian Greatknife", "Handmaid's Dagger",
    "Scholar's Candlestick", "Tailbone Short Sword", "Brigand Twindaggers",
    "Harpe", "Aquamarine Dagger", "Murky Hand Scythe",
  ],
  straight_sword: [
    "Shortsword", "Longsword", "Broadsword", "Broken Straight Sword",
    "Astora Straight Sword", "Lothric Knight Sword", "Barbed Straight Sword",
    "Reinforced Dark Sword", "Cleric's Candlestick", "Irithyll Straight Sword",
    "Anri's Straight Sword", "Sunlight Straight Sword", "Morion Blade",
    "Lothric's Holy Sword", "Gotthard Twinswords", "Valorheart",
    "Ringed Knight Straight Sword",
  ],
  greatsword: [
    "Bastard Sword", "Claymore", "Hollowslayer Greatsword",
    "Firelink Greatsword", "Black Knight Sword", "Flamberge",
    "Executioner's Greatsword", "Wolf Knight's Greatsword",
    "Wolnir's Holy Sword", "Greatsword of Judgment", "Storm Ruler",
    "Moonlight Greatsword", "Twin Princes' Greatsword",
    "Drakeblood Greatsword", "Onyx Blade", "Gael's Greatsword",
  ],
  ultra_greatsword: [
    "Zweihander", "Greatsword", "Astora Greatsword", "Farron Greatsword",
    "Fume Ultra Greatsword", "Profaned Greatsword",
    "Cathedral Knight Greatsword", "Black Knight Greatsword",
    "Lorian's Greatsword", "Lothric Knight Greatsword",
    "Ringed Knight Paired Greatswords",
  ],
  curved_sword: [
    "Crescent Moon Sword", "Scimitar", "Pontiff Knight Curved Sword",
    "Falchion", "Sellsword Twinblades", "Warden Twinblades", "Shotel",
    "Painting Guardian's Curved Sword", "Dancer's Enchanted Swords",
    "Storm Curved Sword", "Carthus Curved Sword", "Carthus Shotel",
    "Rotten Ghru Curved Sword", "Follower Sabre", "Demon's Scar",
  ],
  curved_greatsword: [
    "Murakumo", "Exile Greatsword", "Old Wolf Curved Sword",
    "Carthus Curved Greatsword", "Harald Curved Greatsword",
  ],
  katana: [
    "Darkdrift", "Uchigatana", "Washing Pole", "Onikiri and Ubadachi",
    "Black Blade", "Chaos Blade", "Bloodlust", "Frayed Blade",
  ],
  thrusting_sword: [
    "Estoc", "Rapier", "Ricard's Rapier", "Crystal Sage's Rapier",
    "Irithyll Rapier", "Crow Quills",
  ],
  axe: [
    "Battle Axe", "Hand Axe", "Thrall Axe", "Brigand Axe",
    "Dragonslayer's Axe", "Butcher Knife", "Winged Knight Twinaxes",
    "Eleonora", "Man Serpent Hatchet", "Millwood Battle Axe",
  ],
  greataxe: [
    "Greataxe", "Dragonslayer Greataxe", "Demon's Greataxe",
    "Great Machete", "Yhorm's Great Machete", "Black Knight Greataxe",
    "Earth Seeker",
  ],
  hammer: [
    "Club", "Drang Hammers", "Mace", "Morning Star", "Reinforced Club",
    "Heysel Pick", "Warpick", "Blacksmith Hammer",
  ],
  great_hammer: [
    "Gargoyle Flame Hammer", "Great Mace", "Large Club",
    "Vordt's Great Hammer", "Morne's Great Hammer", "Great Wooden Hammer",
    "Great Club", "Smough's Great Hammer", "Old King's Great Hammer",
    "Pickaxe", "Dragon Tooth", "Spiked Mace", "Quakestone Hammer",
    "Ledo's Great Hammer",
  ],
  fist: [
    "Caestus", "Demon's Fist", "Dark Hand", "Claw", "Manikin Claws",
    "Crow Talons",
  ],
  spear: [
    "Arstor's Spear", "Drang Twinspears", "Gargoyle Flame Spear", "Spear",
    "Tailbone Spear", "Pike", "Winged Spear", "Four-Pronged Plow",
    "Saint Bident", "Rotten Ghru Spear", "Partizan", "Yorshka's Spear",
    "Dragonslayer Spear", "Dragonslayer Swordspear", "Golden Ritual Spear",
    "Soldering Iron", "Lothric Knight Long Spear", "Greatlance",
    "Follower Javelin", "Lothric War Banner", "Ringed Knight Spear",
  ],
  halberd: [
    "Halberd", "Lucerne", "Winged Knight Halberd", "Red Hilted Halberd",
    "Glaive", "Crescent Axe", "Gundyr's Halberd", "Black Knight Glaive",
    "Immolation Tinder", "Splitleaf Greatsword", "Crucifix of the Mad King",
  ],
  reaper: [
    "Great Scythe", "Pontiff Knight Great Scythe", "Great Corvian Scythe",
    "Friede's Great Scythe",
  ],
  whip: [
    "Whip", "Notched Whip", "Witch's Locks", "Spotted Whip",
    "Rose of Ariandel",
  ],
  bow: [
    "Black Bow of Pharis", "Longbow", "Short Bow", "Dragonrider Bow",
    "Composite Bow", "Darkmoon Longbow", "White Birch Bow",
  ],
  greatbow: [
    "Onislayer Greatbow", "Dragonslayer Greatbow", "Millwood Greatbow",
  ],
  crossbow: [
    "Light Crossbow", "Knight's Crossbow", "Arbalest", "Sniper Crossbow",
    "Avelyn", "Heavy Crossbow", "Repeating Crossbow",
  ],
  staff: [
    "Sorcerer's Staff", "Heretic's Staff", "Witchtree Branch",
    "Sage's Crystal Staff", "Izalith Staff", "Court Sorcerer's Staff",
    "Man-Grub's Staff", "Storyteller's Staff", "Mendicant's Staff",
    "Archdeacon's Great Staff", "Murky Longstaff", "Preacher's Right Arm",
  ],
  flames_talismans_chimes: [
    "Pyromancy Flame", "Pyromancer's Parting Flame", "Talisman",
    "Saint's Talisman", "Sunlight Talisman", "Canvas Talisman",
    "White Hair Talisman", "Sunless Talisman", "Cleric's Sacred Chime",
    "Priest's Chime", "Crystal Chime", "Caitha's Chime",
    "Saint-tree Bellvine", "Yorshka's Chime", "Sacred Chime of Filianore",
  ],
};

function normalizeWeaponName(value: unknown): string {
  return String(value ?? "")
    .replace(/\.(png|jpe?g|webp|avif)$/i, "")
    .replace(/[_-]+/g, " ")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

const WEAPON_CATEGORY_BY_NAME = new Map<string, string>();

for (const [category, names] of Object.entries(CATEGORY_NAMES)) {
  for (const name of names) {
    WEAPON_CATEGORY_BY_NAME.set(normalizeWeaponName(name), category);
  }
}

// نام واقعی فایل‌های فعلی که با نام مرجع فرق دارند.
const NAME_ALIASES: Record<string, string> = {
  "long sword": "Longsword",
  "dark sword": "Dark Sword",
  "executioner's greatword": "Executioner's Greatsword",
  "test greatbow": "Dragonslayer Greatbow",
};

export function canonicalWeaponName(value: unknown): string {
  // APIها گاهی مسیر کامل فایل را برمی‌گردانند؛ فقط نام فایل را بررسی می‌کنیم.
  const raw = String(value ?? "")
    .replace(/\\/g, "/")
    .split("/")
    .pop()!
    .replace(/\.(png|jpe?g|webp|avif)$/i, "")
    .replace(/[_-]+/g, " ")
    .trim();

  // نام Dark Sword را دقیقاً به همین شکل نگه می‌داریم تا در Straight Sword بیاید.
  const alias = NAME_ALIASES[raw.toLowerCase()];
  return alias ?? raw;
}

export function getWeaponCategory(value: unknown): string {
  const canonical = canonicalWeaponName(value);
  return WEAPON_CATEGORY_BY_NAME.get(normalizeWeaponName(canonical)) ?? "extra";
}

export function isReferenceWeapon(value: unknown): boolean {
  return getWeaponCategory(value) !== "extra";
}

export function isExcludedWeapon(value: unknown): boolean {
  return normalizeWeaponName(value) === normalizeWeaponName("Giant Door Shield");
}

export function getWeaponReferenceStats() {
  const names = Object.values(CATEGORY_NAMES).flat();
  return {
    expected: 221,
    listed: names.length,
    unique: new Set(names.map(normalizeWeaponName)).size,
    categories: Object.fromEntries(
      Object.entries(CATEGORY_NAMES).map(([category, entries]) => [
        category,
        entries.length,
      ]),
    ),
  };
}
