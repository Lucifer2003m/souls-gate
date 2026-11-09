
export type SpellCategory = "sorcery" | "miracle" | "pyromancy";

export type Spell = {
  id: string;
  name: string;
  category: SpellCategory;
  description: string;
  fpCost: number | null;
  slots: number | null;
  intelligence: number | null;
  faith: number | null;
  location: string;
  source: string;
  trophyRequired: boolean;
  dlc: boolean;
  notes?: string;
};

export const spellCategories = [
  {
    id: "sorcery",
    title: "SORCERIES",
    fa: "Ø¬Ø§Ø¯ÙˆÙ‡Ø§ÛŒ Ø±ÙˆØ­ÛŒ",
    description: "Manipulate souls and the power of crystals.",
    symbol: "âœ§",
  },
  {
    id: "miracle",
    title: "MIRACLES",
    fa: "Ù…Ø¹Ø¬Ø²Ù‡â€ŒÙ‡Ø§",
    description: "Call upon divine power, lightning, and healing.",
    symbol: "â˜¼",
  },
  {
    id: "pyromancy",
    title: "PYROMANCIES",
    fa: "Ø¢ØªØ´â€ŒØ§ÙØ³ÙˆÙ†â€ŒÙ‡Ø§",
    description: "Command flame, chaos, and destructive fire.",
    symbol: "â™¨",
  },
] as const;

export const spells: Spell[] = [
  // SORCERIES
  {
    id: "soul-arrow",
    name: "Soul Arrow",
    category: "sorcery",
    description: "Fires a small soul arrow at the target.",
    fpCost: 7,
    slots: 1,
    intelligence: 10,
    faith: 0,
    location: "Purchase from Orbeck of Vinheim or the Shrine Handmaid, depending on game progress.",
    source: "Orbeck of Vinheim",
    trophyRequired: true,
    dlc: false,
  },
  {
    id: "great-soul-arrow",
    name: "Great Soul Arrow",
    category: "sorcery",
    description: "Fires a more powerful soul arrow.",
    fpCost: 10,
    slots: 1,
    intelligence: 15,
    faith: 0,
    location: "Purchase from Orbeck of Vinheim.",
    source: "Orbeck of Vinheim",
    trophyRequired: true,
    dlc: false,
  },
  {
    id: "heavy-soul-arrow",
    name: "Heavy Soul Arrow",
    category: "sorcery",
    description: "Fires a heavy soul arrow.",
    fpCost: 11,
    slots: 1,
    intelligence: 13,
    faith: 0,
    location: "Purchase from Orbeck of Vinheim.",
    source: "Orbeck of Vinheim",
    trophyRequired: true,
    dlc: false,
  },
  {
    id: "great-heavy-soul-arrow",
    name: "Great Heavy Soul Arrow",
    category: "sorcery",
    description: "Fires a powerful heavy soul arrow.",
    fpCost: 14,
    slots: 1,
    intelligence: 18,
    faith: 0,
    location: "Purchase from Orbeck of Vinheim.",
    source: "Orbeck of Vinheim",
    trophyRequired: true,
    dlc: false,
  },
  {
    id: "soul-greatsword",
    name: "Soul Greatsword",
    category: "sorcery",
    description: "Creates a blade of souls that sweeps through nearby enemies.",
    fpCost: 23,
    slots: 1,
    intelligence: 22,
    faith: 0,
    location: "Purchase from Orbeck of Vinheim.",
    source: "Orbeck of Vinheim",
    trophyRequired: true,
    dlc: false,
  },
  {
    id: "farron-flashsword",
    name: "Farron Flashsword",
    category: "sorcery",
    description: "Conjures a quick magical blade for close-range attacks.",
    fpCost: 4,
    slots: 1,
    intelligence:  23,
    faith: 0,
    location: "Purchase from Orbeck of Vinheim.",
    source: "Orbeck of Vinheim",
    trophyRequired: true,
    dlc: false,
  },
];

