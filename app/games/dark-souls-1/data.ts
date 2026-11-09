export type ArchiveCategory =
  | "weapons"
  | "shields"
  | "armor"
  | "rings"
  | "sorceries"
  | "pyromancies"
  | "miracles"
  | "items";

export type ArchiveItem = {
  id: string;
  name: string;
  category: ArchiveCategory;
  subtitle: string;
  description: string;
  image?: string;
  location: string;
  requirements?: string;
  effect?: string;
  stats?: {
    label: string;
    value: string;
  }[];
  tags?: string[];
};

export const weapons: ArchiveItem[] = [
  {
    id: "black-knight-halberd",
    name: "Black Knight Halberd",
    category: "weapons",
    subtitle: "HALBERD",
    description:
      "A powerful halberd wielded by the Black Knights. Its exceptional reach and damage make it a formidable weapon throughout Lordran.",
    location: "Darkroot Basin",
    requirements: "STR 32 / DEX 18",
    effect: "Strong physical damage and excellent reach.",
    stats: [
      { label: "TYPE", value: "Halberd" },
      { label: "WEIGHT", value: "14.0" },
      { label: "DURABILITY", value: "100" },
      { label: "SCALING", value: "STR / DEX" },
    ],
    tags: ["BLACK KNIGHT", "HALBERD", "PHYSICAL"],
  },
  {
    id: "zweihander",
    name: "Zweihander",
    category: "weapons",
    subtitle: "ULTRA GREATSWORD",
    description:
      "A massive ultra greatsword capable of devastating attacks when wielded by a powerful warrior.",
    location: "Graveyard near Firelink Shrine",
    requirements: "STR 24 / DEX 10",
    effect: "Huge damage with wide attacks.",
    stats: [
      { label: "TYPE", value: "Ultra Greatsword" },
      { label: "WEIGHT", value: "10.0" },
      { label: "DURABILITY", value: "200" },
      { label: "SCALING", value: "STR / DEX" },
    ],
    tags: ["GREATSWORD", "STRENGTH"],
  },
  {
    id: "uchigatana",
    name: "Uchigatana",
    category: "weapons",
    subtitle: "KATANA",
    description:
      "A katana with high dexterity scaling and innate bleeding potential.",
    location: "Undead Burg",
    requirements: "STR 14 / DEX 14",
    effect: "Fast attacks with bleed buildup.",
    stats: [
      { label: "TYPE", value: "Katana" },
      { label: "WEIGHT", value: "5.0" },
      { label: "DURABILITY", value: "80" },
      { label: "SCALING", value: "DEX" },
    ],
    tags: ["KATANA", "DEXTERITY", "BLEED"],
  },
  {
    id: "moonlight-greatsword",
    name: "Moonlight Greatsword",
    category: "weapons",
    subtitle: "GREATSWORD",
    description:
      "A mysterious greatsword associated with Seath the Scaleless and powerful magical attacks.",
    location: "The Duke's Archives",
    requirements: "STR 16 / DEX 10 / INT 28",
    effect: "Magical attacks scale with Intelligence.",
    stats: [
      { label: "TYPE", value: "Greatsword" },
      { label: "WEIGHT", value: "6.0" },
      { label: "DURABILITY", value: "100" },
      { label: "SCALING", value: "INT" },
    ],
    tags: ["MAGIC", "INTELLIGENCE", "SEATH"],
  },
];

export const shields: ArchiveItem[] = [
  {
    id: "grass-crest-shield",
    name: "Grass Crest Shield",
    category: "shields",
    subtitle: "SMALL SHIELD",
    description:
      "A shield decorated with a grass crest. It provides a useful stamina recovery effect while equipped.",
    location: "Darkroot Basin",
    requirements: "STR 10",
    effect: "Increases stamina recovery.",
    stats: [
      { label: "TYPE", value: "Shield" },
      { label: "WEIGHT", value: "3.0" },
      { label: "STABILITY", value: "51" },
      { label: "PHYSICAL", value: "95%" },
    ],
    tags: ["STAMINA", "SHIELD"],
  },
  {
    id: "heater-shield",
    name: "Heater Shield",
    category: "shields",
    subtitle: "SMALL SHIELD",
    description:
      "A lightweight shield with strong physical protection and excellent usability.",
    location: "Undead Burg",
    requirements: "STR 8",
    effect: "Reliable early-game protection.",
    stats: [
      { label: "TYPE", value: "Shield" },
      { label: "WEIGHT", value: "2.0" },
      { label: "STABILITY", value: "55" },
      { label: "PHYSICAL", value: "100%" },
    ],
    tags: ["LIGHTWEIGHT", "SHIELD"],
  },
];

export const armor: ArchiveItem[] = [
  {
    id: "elite-knight-set",
    name: "Elite Knight Set",
    category: "armor",
    subtitle: "ARMOR SET",
    description:
      "A balanced armor set offering solid protection without becoming excessively heavy.",
    location: "Darkroot Garden",
    effect: "Balanced physical defense and poise.",
    stats: [
      { label: "WEIGHT", value: "24.0" },
      { label: "POISE", value: "37" },
      { label: "STYLE", value: "KNIGHT" },
      { label: "CLASS", value: "MEDIUM" },
    ],
    tags: ["KNIGHT", "MEDIUM", "POISE"],
  },
  {
    id: "black-knight-set",
    name: "Black Knight Set",
    category: "armor",
    subtitle: "HEAVY ARMOR",
    description:
      "Armor worn by the Black Knights who wander the lands after the linking of the fire.",
    location: "Kiln of the First Flame",
    effect: "Strong defenses and high poise.",
    stats: [
      { label: "WEIGHT", value: "35.0" },
      { label: "POISE", value: "40" },
      { label: "STYLE", value: "BLACK KNIGHT" },
      { label: "CLASS", value: "HEAVY" },
    ],
    tags: ["BLACK KNIGHT", "HEAVY", "POISE"],
  },
];

export const rings: ArchiveItem[] = [
  {
    id: "ring-favor-protection",
    name: "Ring of Favor and Protection",
    category: "rings",
    subtitle: "RING",
    description:
      "This ring was granted to warriors favored by the goddess Fina. It greatly increases several important attributes.",
    location: "Obtained from Knight Lautrec's questline.",
    effect:
      "Increases maximum HP, stamina and equipment burden. Removing the ring destroys it.",
    stats: [
      { label: "HP", value: "+20%" },
      { label: "STAMINA", value: "+20%" },
      { label: "EQUIP LOAD", value: "+20%" },
      { label: "SLOT", value: "1" },
    ],
    tags: ["FAVOR", "HP", "STAMINA", "EQUIP LOAD"],
  },
  {
    id: "havels-ring",
    name: "Havel's Ring",
    category: "rings",
    subtitle: "RING",
    description:
      "A ring granted by Havel the Rock. It greatly increases maximum equipment burden.",
    location: "Defeat Havel the Rock in the Undead Burg.",
    effect: "Greatly increases maximum equipment load.",
    stats: [
      { label: "EQUIP LOAD", value: "+50%" },
      { label: "SLOT", value: "1" },
      { label: "TYPE", value: "UTILITY" },
    ],
    tags: ["HAVEL", "EQUIP LOAD"],
  },
  {
    id: "wolf-ring",
    name: "Wolf Ring",
    category: "rings",
    subtitle: "RING",
    description:
      "A ring associated with Artorias the Abysswalker.",
    location: "Darkroot Garden.",
    effect: "Greatly increases poise.",
    stats: [
      { label: "POISE", value: "+40" },
      { label: "SLOT", value: "1" },
      { label: "TYPE", value: "DEFENSE" },
    ],
    tags: ["ARTORIAS", "POISE"],
  },
  {
    id: "cloranthy-ring",
    name: "Cloranthy Ring",
    category: "rings",
    subtitle: "RING",
    description:
      "A green ring associated with a rare plant. It greatly speeds stamina recovery.",
    location: "Great Hollow.",
    effect: "Increases stamina recovery speed.",
    stats: [
      { label: "STAMINA RECOVERY", value: "INCREASED" },
      { label: "SLOT", value: "1" },
      { label: "TYPE", value: "UTILITY" },
    ],
    tags: ["STAMINA", "UTILITY"],
  },
];

export const sorceries: ArchiveItem[] = [
  {
    id: "soul-arrow",
    name: "Soul Arrow",
    category: "sorceries",
    subtitle: "SORCERY",
    description:
      "A basic sorcery that fires a projectile formed from soul energy.",
    location: "Sold by Griggs of Vinheim and other sorcery merchants.",
    requirements: "INT 10",
    effect: "Fires a magical projectile.",
    stats: [
      { label: "USES", value: "30" },
      { label: "SLOTS", value: "1" },
      { label: "TYPE", value: "PROJECTILE" },
    ],
    tags: ["SORCERY", "PROJECTILE"],
  },
  {
    id: "great-soul-arrow",
    name: "Great Soul Arrow",
    category: "sorceries",
    subtitle: "SORCERY",
    description:
      "A more powerful version of Soul Arrow.",
    location: "Sold by Griggs of Vinheim.",
    requirements: "INT 14",
    effect: "Fires a stronger soul projectile.",
    stats: [
      { label: "USES", value: "20" },
      { label: "SLOTS", value: "1" },
      { label: "TYPE", value: "PROJECTILE" },
    ],
    tags: ["SORCERY", "PROJECTILE"],
  },
  {
    id: "soul-spear",
    name: "Soul Spear",
    category: "sorceries",
    subtitle: "SORCERY",
    description:
      "A powerful sorcery that launches a concentrated spear of soul energy.",
    location: "Big Hat Logan.",
    requirements: "INT 36",
    effect: "Extremely powerful magical projectile.",
    stats: [
      { label: "USES", value: "4" },
      { label: "SLOTS", value: "2" },
      { label: "TYPE", value: "PROJECTILE" },
    ],
    tags: ["SORCERY", "HIGH DAMAGE"],
  },
];

export const pyromancies: ArchiveItem[] = [
  {
    id: "fireball",
    name: "Fireball",
    category: "pyromancies",
    subtitle: "PYROMANCY",
    description:
      "A basic pyromancy that hurls a fireball at the target.",
    location: "Laurentius of the Great Swamp.",
    effect: "Throws an explosive fireball.",
    stats: [
      { label: "USES", value: "8" },
      { label: "SLOTS", value: "1" },
      { label: "TYPE", value: "FIRE" },
    ],
    tags: ["FIRE", "PROJECTILE"],
  },
  {
    id: "great-fireball",
    name: "Great Fireball",
    category: "pyromancies",
    subtitle: "PYROMANCY",
    description:
      "A larger and more destructive fireball.",
    location: "Blighttown.",
    effect: "Creates a large explosive fireball.",
    stats: [
      { label: "USES", value: "4" },
      { label: "SLOTS", value: "1" },
      { label: "TYPE", value: "FIRE" },
    ],
    tags: ["FIRE", "EXPLOSION"],
  },
  {
    id: "great-chaos-fireball",
    name: "Great Chaos Fireball",
    category: "pyromancies",
    subtitle: "CHAOS PYROMANCY",
    description:
      "A powerful Chaos pyromancy associated with the Bed of Chaos.",
    location: "Chaos Servant Covenant.",
    effect: "Creates a massive chaos fireball and lava pool.",
    stats: [
      { label: "USES", value: "4" },
      { label: "SLOTS", value: "2" },
      { label: "TYPE", value: "CHAOS" },
    ],
    tags: ["CHAOS", "FIRE", "COVENANT"],
  },
];

export const miracles: ArchiveItem[] = [
  {
    id: "heal",
    name: "Heal",
    category: "miracles",
    subtitle: "MIRACLE",
    description:
      "A basic miracle that restores a portion of the caster's HP.",
    location: "Sold by Petrus of Thorolund.",
    requirements: "FAITH 12",
    effect: "Restores HP.",
    stats: [
      { label: "USES", value: "3" },
      { label: "SLOTS", value: "1" },
      { label: "TYPE", value: "HEALING" },
    ],
    tags: ["HEAL", "FAITH"],
  },
  {
    id: "force",
    name: "Force",
    category: "miracles",
    subtitle: "MIRACLE",
    description:
      "Creates a powerful shockwave that can stagger enemies and knock them back.",
    location: "Replenishment of the Way of White.",
    requirements: "FAITH 12",
    effect: "Releases a force shockwave.",
    stats: [
      { label: "USES", value: "21" },
      { label: "SLOTS", value: "1" },
      { label: "TYPE", value: "UTILITY" },
    ],
    tags: ["KNOCKBACK", "FAITH"],
  },
  {
    id: "wrath-of-the-gods",
    name: "Wrath of the Gods",
    category: "miracles",
    subtitle: "MIRACLE",
    description:
      "A devastating miracle that releases a powerful explosion around the caster.",
    location: "Replenishment of the Warriors of Sunlight.",
    requirements: "FAITH 28",
    effect: "Powerful point-blank area attack.",
    stats: [
      { label: "USES", value: "3" },
      { label: "SLOTS", value: "1" },
      { label: "TYPE", value: "AOE" },
    ],
    tags: ["AOE", "FAITH", "PVP"],
  },
];

export const items: ArchiveItem[] = [
  {
    id: "estus-flask",
    name: "Estus Flask",
    category: "items",
    subtitle: "CONSUMABLE",
    description:
      "A flask filled with Estus. Drinking it restores HP.",
    location: "Bonfires.",
    effect: "Restores HP.",
    stats: [
      { label: "TYPE", value: "HEALING" },
      { label: "UPGRADE", value: "KINDLE" },
    ],
    tags: ["HEAL", "BONFIRE"],
  },
  {
    id: "humanity",
    name: "Humanity",
    category: "items",
    subtitle: "CONSUMABLE",
    description:
      "A tiny sprite found within the darkness. Humanity has many mysterious uses.",
    location: "Throughout Lordran.",
    effect: "Can restore humanity and increase the humanity counter.",
    stats: [
      { label: "TYPE", value: "CONSUMABLE" },
      { label: "USE", value: "HUMANITY" },
    ],
    tags: ["HUMANITY", "ONLINE"],
  },
  {
    id: "homeward-bone",
    name: "Homeward Bone",
    category: "items",
    subtitle: "CONSUMABLE",
    description:
      "Bone fragment that returns the player to the last bonfire rested at.",
    location: "Various locations.",
    effect: "Returns you to the last rested bonfire.",
    stats: [
      { label: "TYPE", value: "UTILITY" },
      { label: "USE", value: "TELEPORT" },
    ],
    tags: ["BONFIRE", "UTILITY"],
  },
];

export const allArchiveItems: ArchiveItem[] = [
  ...weapons,
  ...shields,
  ...armor,
  ...rings,
  ...sorceries,
  ...pyromancies,
  ...miracles,
  ...items,
];
export const bosses = [
  {
    name: "ASYLUM DEMON",
    location: "Undead Asylum",
    difficulty: 3,
  },
  {
    name: "TAURUS DEMON",
    location: "Undead Burg",
    difficulty: 3,
  },
  {
    name: "CAPRA DEMON",
    location: "Lower Undead Burg",
    difficulty: 4,
  },
  {
    name: "BELL GARGOYLES",
    location: "Undead Parish",
    difficulty: 4,
  },
  {
    name: "ORNSTEIN & SMOUGH",
    location: "Anor Londo",
    difficulty: 5,
  },
  {
    name: "ARTORIAS",
    location: "Oolacile Township",
    difficulty: 5,
  },
  {
    name: "MANUS",
    location: "Chasm of the Abyss",
    difficulty: 5,
  },
  {
    name: "GWYN",
    location: "Kiln of the First Flame",
    difficulty: 5,
  },
];