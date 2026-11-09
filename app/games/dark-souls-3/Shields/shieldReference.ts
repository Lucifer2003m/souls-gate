
export const SHIELD_CATEGORIES = {
  small: {
    label: "شیلدهای کوچک",
    english: "Small Shields",
    names: [
      "Buckler",
      "Red and White Round Shield",
      "Elkhorn Round Shield",
      "Target Shield",
      "Iron Round Shield",
      "Warrior's Round Shield",
      "Hawkwood's Shield",
      "Caduceus Round Shield",
      "Crimson Parma",
      "Leather Shield",
      "Sacred Bloom Shield",
      "Small Leather Shield",
      "Llewellyn Shield",
      "Golden Falcon Shield",
      "Eastern Iron Shield",
      "Plank Shield",
      "Ghru Rotshield",
    ],
  },

  standard: {
    label: "شیلدهای استاندارد",
    english: "Standard Shields",
    names: [
      "Wargod Wooden Shield",
      "Spider Shield",
      "Sunset Shield",
      "Shield of Want",
      "Silver Eagle Kite Shield",
      "Kite Shield",
      "Pierce Shield",
      "Stone Parma",
      "Spiked Shield",
      "Crest Shield",
      "Grass Crest Shield",
      "Dragon Crest Shield",
      "East-West Shield",
      "Blue Wooden Shield",
      "Knight Shield",
      "Pontiff Knight Shield",
      "Silver Knight Shield",
      "Porcine Shield",
      "Spirit Tree Crest Shield",
      "Black Knight Shield",
      "Golden Wing Crest Shield",
      "Large Leather Shield",
      "Wooden Shield",
      "Lothric Knight Shield",
      "Sunlight Shield",
      "Carthus Shield",
      "Round Shield",
      "Dragonhead Shield",
      "Follower Shield",
      "Ethereal Oak Shield",
    ],
  },

  great: {
    label: "شیلدهای بزرگ",
    english: "Greatshields",
    names: [
      "Black Iron Greatshield",
      "Bonewheel Shield",
      "Moaning Shield",
      "Twin Dragon Greatshield",
      "Stone Greatshield",
      "Lothric Knight Greatshield",
      "Curse Ward Greatshield",
      "Yhorm's Greatshield",
      "Greatshield of Glory",
      "Dragonslayer Greatshield",
      "Havel's Greatshield",
      "Ancient Dragon Greatshield",
      "Wolf Knight's Greatshield",
      "Cathedral Knight Greatshield",
      "Dragonhead Greatshield",
      "Giant Door Shield",
    ],
  },
} as const;

export type ShieldCategoryKey = keyof typeof SHIELD_CATEGORIES;

export function normalizeShieldName(value: string): string {
  return value
    .replace(/\.[^/.]+$/, "")
    .replace(/_s\b/gi, "'s")
    .replace(/['’]/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const categoryLookup = new Map<string, ShieldCategoryKey>();

for (const key of Object.keys(SHIELD_CATEGORIES) as ShieldCategoryKey[]) {
  const category = SHIELD_CATEGORIES[key];

  for (const name of category.names) {
    categoryLookup.set(normalizeShieldName(name), key);
  }
}

export function getShieldCategory(
  name: string,
): ShieldCategoryKey | "other" {
  return categoryLookup.get(normalizeShieldName(name)) ?? "other";
}

export function cleanShieldName(fileName: string): string {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/_s\b/gi, "'s")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
