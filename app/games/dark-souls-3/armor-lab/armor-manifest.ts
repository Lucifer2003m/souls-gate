// Explicit armor grouping for Souls Gate (Dark Souls III)
// Built from armor.txt (every image file name in the storage bucket) and checked against
// Fandom / Fextralife set pages. `file` is the storage file name WITHOUT ".png".
//
// confidence:
//   verified   - a wiki page for the set was found and the pieces match
//   name-match - pieces share the set name and slots are consistent (not opened one by one)
//   check      - membership or naming is uncertain, see `note`
//
// altFiles = other images for the same slot (files ending in 2/3, probably the female model,
// or alternate heads such as Black Witch Hat).

export type ManifestSlot = "helmet" | "chest" | "gauntlets" | "leggings";
export type ManifestConfidence = "verified" | "name-match" | "check";

export type ManifestPiece = {
  file: string;
  slot: ManifestSlot;
  altFiles?: string[];
};

export type ManifestSet = {
  id: string;
  name: string; // English set name, e.g. "Elite Knight Set"
  confidence: ManifestConfidence;
  note?: string;
  pieces: ManifestPiece[];
};

export type ManifestSingle = ManifestPiece & {
  confidence: ManifestConfidence;
  note?: string;
};

export const ARMOR_MANIFEST: ManifestSet[] = [
  {
    id: "alva",
    name: "Alva Set",
    confidence: "name-match",
    pieces: [
      { file: "Alva Helm", slot: "helmet" },
      { file: "Alva Armor", slot: "chest" },
      { file: "Alva Gauntlets", slot: "gauntlets" },
      { file: "Alva Leggings", slot: "leggings" },
    ],
  },
  {
    id: "antiquated-plain",
    name: "Antiquated Plain Set",
    confidence: "check",
note: "3 pieces. Colony Guide beta + a Ringed City guide that calls it Antiquated Plain Set",    pieces: [
      { file: "Antiquated Plain Garb", slot: "chest", altFiles: ["Antiquated Plain Garb2"] },
      { file: "Loincloth2", slot: "leggings" },
      { file: "Violet Wrappings", slot: "gauntlets" },
    ],
  },
  {
    id: "antiquated",
    name: "Antiquated Set",
    confidence: "check",
    note: "Helm is 'Crown of Dusk' (name doesn't match). Source: Colony Guide beta",
    pieces: [
      { file: "Crown of Dusk", slot: "helmet" },
      { file: "Antiquated Dress", slot: "chest" },
      { file: "Antiquated Gloves", slot: "gauntlets" },
      { file: "Antiquated Skirt", slot: "leggings" },
    ],
  },
  {
    id: "archdeacon",
    name: "Archdeacon Set",
    confidence: "name-match",
    note: "3 pieces, no gauntlets",
    pieces: [
      { file: "Archdeacon White Crown", slot: "helmet" },
      { file: "Archdeacon Holy Garb", slot: "chest" },
      { file: "Archdeacon Skirt", slot: "leggings" },
    ],
  },
  {
    id: "assassin",
    name: "Assassin Set",
    confidence: "name-match",
    pieces: [
      { file: "Assassin Hood", slot: "helmet" },
      { file: "Assassin Armor", slot: "chest" },
      { file: "Assassin Gloves", slot: "gauntlets" },
      { file: "Assassin Trousers", slot: "leggings" },
    ],
  },
  {
    id: "black-hand",
    name: "Black Hand Set",
    confidence: "name-match",
    note: "2 pieces",
    pieces: [
      { file: "Black Hand Hat", slot: "helmet" },
      { file: "Black Hand Armor", slot: "chest" },
    ],
  },
  {
    id: "black-iron",
    name: "Black Iron Set",
    confidence: "verified",
    pieces: [
      { file: "Black Iron Helm", slot: "helmet" },
      { file: "Black Iron Armor", slot: "chest" },
      { file: "Black Iron Gauntlets", slot: "gauntlets" },
      { file: "Black Iron Leggings", slot: "leggings" },
    ],
  },
  {
    id: "black-knight",
    name: "Black Knight Set",
    confidence: "verified",
    pieces: [
      { file: "Black Knight Helm", slot: "helmet" },
      { file: "Black Knight Armor", slot: "chest" },
      { file: "Black Knight Gauntlets", slot: "gauntlets" },
      { file: "Black Knight Leggings", slot: "leggings" },
    ],
  },
  {
    id: "black-leather",
    name: "Black Leather Set",
    confidence: "name-match",
    note: "3 pieces, no helm",
    pieces: [
      { file: "Black Leather Armor", slot: "chest", altFiles: ["Black Leather Armor2"] },
      { file: "Black Leather Gloves", slot: "gauntlets", altFiles: ["Black Leather Gloves2"] },
      { file: "Black Leather Boots", slot: "leggings", altFiles: ["Black Leather Boots2"] },
    ],
  },
  {
    id: "black",
    name: "Black Set",
    confidence: "verified",
    note: "Yuria's set. Helm is 'Billed Mask' - not a standalone piece",
    pieces: [
      { file: "Billed Mask", slot: "helmet" },
      { file: "Black Dress", slot: "chest" },
      { file: "Black Gauntlets", slot: "gauntlets" },
      { file: "Black Leggings", slot: "leggings" },
    ],
  },
  {
    id: "black-witch",
    name: "Black Witch Set",
    confidence: "check",
    note: "Veil / Hat / Blindfold Mask are alternate heads (Fextralife: Blindfold Mask was Zullie's mask, same witch set). Some guides list Veil and Blindfold Mask as separate pieces",
    pieces: [
      { file: "Black Witch Veil", slot: "helmet", altFiles: ["Black Witch Hat", "Blindfold Mask"] },
      { file: "Black Witch Garb", slot: "chest", altFiles: ["Black Witch Garb2"] },
      { file: "Black Witch Wrappings", slot: "gauntlets" },
      { file: "Black Witch Trousers", slot: "leggings", altFiles: ["Black Witch Trousers 2"] },
    ],
  },
  {
    id: "brass",
    name: "Brass Set",
    confidence: "name-match",
    pieces: [
      { file: "Brass Helm", slot: "helmet" },
      { file: "Brass Armor", slot: "chest" },
      { file: "Brass Gauntlets", slot: "gauntlets" },
      { file: "Brass Leggings", slot: "leggings" },
    ],
  },
  {
    id: "brigand",
    name: "Brigand Set",
    confidence: "verified",
    note: "altImages are the alternate (female) look; Fandom says this set differs by gender",
    pieces: [
      { file: "Brigand Hood", slot: "helmet", altFiles: ["Brigand Hood2"] },
      { file: "Brigand Armor", slot: "chest", altFiles: ["Brigand Armor2"] },
      { file: "Brigand Gauntlets", slot: "gauntlets", altFiles: ["Brigand Gauntlets2"] },
      { file: "Brigand Trousers", slot: "leggings", altFiles: ["Brigand Trousers2"] },
    ],
  },
  {
    id: "catarina",
    name: "Catarina Set",
    confidence: "name-match",
    pieces: [
      { file: "Catarina Helm", slot: "helmet" },
      { file: "Catarina Armor", slot: "chest" },
      { file: "Catarina Gauntlets", slot: "gauntlets" },
      { file: "Catarina Leggings", slot: "leggings" },
    ],
  },
  {
    id: "cathedral-knight",
    name: "Cathedral Knight Set",
    confidence: "name-match",
    pieces: [
      { file: "Cathedral Knight Helm", slot: "helmet" },
      { file: "Cathedral Knight Armor", slot: "chest" },
      { file: "Cathedral Knight Gauntlets", slot: "gauntlets" },
      { file: "Cathedral Knight Leggings", slot: "leggings" },
    ],
  },
  {
    id: "chain",
    name: "Chain Set",
    confidence: "verified",
    note: "Gauntlets are 'Leather Gauntlets' (not part of the Leather Set)",
    pieces: [
      { file: "Chain Helm", slot: "helmet", altFiles: ["Chain Helm2"] },
      { file: "Chain Armor", slot: "chest", altFiles: ["Chain Armor2"] },
      { file: "Leather Gauntlets", slot: "gauntlets", altFiles: ["Leather Gauntlets2"] },
      { file: "Chain Leggings", slot: "leggings", altFiles: ["Chain Leggings2"] },
    ],
  },
  {
    id: "cleric",
    name: "Cleric Set",
    confidence: "name-match",
    pieces: [
      { file: "Cleric Hat", slot: "helmet", altFiles: ["Cleric Hat2"] },
      { file: "Cleric Blue Robe", slot: "chest", altFiles: ["Cleric Blue Robe2"] },
      { file: "Cleric Gloves", slot: "gauntlets" },
      { file: "Cleric Trousers", slot: "leggings", altFiles: ["Cleric Trousers2"] },
    ],
  },
  {
    id: "conjurator",
    name: "Conjurator Set",
    confidence: "name-match",
    pieces: [
      { file: "Conjurator Hood", slot: "helmet", altFiles: ["Conjurator Hood2"] },
      { file: "Conjurator Robe", slot: "chest", altFiles: ["Conjurator Robe2"] },
      { file: "Conjurator Manchettes", slot: "gauntlets", altFiles: ["Conjurator Manchettes2"] },
      { file: "Conjurator Boots", slot: "leggings", altFiles: ["Conjurator Boots2"] },
    ],
  },
  {
    id: "cornyx-s",
    name: "Cornyx's Set",
    confidence: "name-match",
    note: "3 pieces, no helm",
    pieces: [
      { file: "Cornyx_s Garb", slot: "chest" },
      { file: "Cornyx_s Wrap", slot: "gauntlets" },
      { file: "Cornyx_s Skirt", slot: "leggings" },
    ],
  },
  {
    id: "court-sorcerer",
    name: "Court Sorcerer Set",
    confidence: "name-match",
    pieces: [
      { file: "Court Sorcerer Hood", slot: "helmet" },
      { file: "Court Sorcerer Robe", slot: "chest" },
      { file: "Court Sorcerer Gloves", slot: "gauntlets" },
      { file: "Court Sorcerer Trousers", slot: "leggings" },
    ],
  },
  {
    id: "dancer-s",
    name: "Dancer's Set",
    confidence: "name-match",
    pieces: [
      { file: "Dancer_s Crown", slot: "helmet" },
      { file: "Dancer_s Armor", slot: "chest" },
      { file: "Dancer_s Gauntlets", slot: "gauntlets" },
      { file: "Dancer_s Leggings", slot: "leggings" },
    ],
  },
  {
    id: "dark",
    name: "Dark Set",
    confidence: "verified",
    pieces: [
      { file: "Dark Mask", slot: "helmet" },
      { file: "Dark Armor", slot: "chest" },
      { file: "Dark Gauntlets", slot: "gauntlets" },
      { file: "Dark Leggings", slot: "leggings" },
    ],
  },
  {
    id: "deacon",
    name: "Deacon Set",
    confidence: "name-match",
    note: "2 pieces",
    pieces: [
      { file: "Deacon Robe", slot: "chest" },
      { file: "Deacon Skirt", slot: "leggings" },
    ],
  },
  {
    id: "desert-pyromancer",
    name: "Desert Pyromancer Set",
    confidence: "name-match",
    pieces: [
      { file: "Desert Pyromancer Hood", slot: "helmet" },
      { file: "Desert Pyromancer Garb 2", slot: "chest", altFiles: ["Desert Pyromancer Garb"] },
      { file: "Desert Pyromancer Gloves", slot: "gauntlets" },
      { file: "Desert Pyromancer Skirt", slot: "leggings", altFiles: ["Desert Pyromancer Skirt 2"] },
    ],
  },
  {
    id: "deserter",
    name: "Deserter Set",
    confidence: "verified",
    note: "Helm is 'Steel Soldier Helm'; no gauntlets",
    pieces: [
      { file: "Steel Soldier Helm", slot: "helmet" },
      { file: "Deserter Armor", slot: "chest" },
      { file: "Deserter Trousers", slot: "leggings" },
    ],
  },
  {
    id: "dingy",
    name: "Dingy Set",
    confidence: "name-match",
    note: "3 pieces, no leggings",
    pieces: [
      { file: "Dingy Hood", slot: "helmet" },
      { file: "Dingy Robe", slot: "chest" },
      { file: "Dingy Gloves", slot: "gauntlets" },
    ],
  },
  {
    id: "dragonscale",
    name: "Dragonscale Set",
    confidence: "verified",
    note: "Fandom: Golden Bracelets belong to Dragonscale Set (with the golden breastplate and crown); Golden Crown is not a standalone piece",
    pieces: [
      { file: "Golden Crown", slot: "helmet" },
      { file: "Dragonscale Armor", slot: "chest" },
      { file: "Golden Bracelets", slot: "gauntlets" },
      { file: "Dragonscale Waistcloth", slot: "leggings" },
    ],
  },
  {
    id: "dragonslayer",
    name: "Dragonslayer Set",
    confidence: "name-match",
    pieces: [
      { file: "Dragonslayer Helm", slot: "helmet" },
      { file: "Dragonslayer Armor", slot: "chest" },
      { file: "Dragonslayer Gauntlets", slot: "gauntlets" },
      { file: "Dragonslayer Leggings", slot: "leggings" },
    ],
  },
  {
    id: "drakeblood",
    name: "Drakeblood Set",
    confidence: "name-match",
    pieces: [
      { file: "Drakeblood Helm", slot: "helmet" },
      { file: "Drakeblood Armor", slot: "chest" },
      { file: "Drakeblood Gauntlets", slot: "gauntlets" },
      { file: "Drakeblood Leggings", slot: "leggings" },
    ],
  },
  {
    id: "drang",
    name: "Drang Set",
    confidence: "verified",
    note: "3 pieces, no helm",
    pieces: [
      { file: "Drang Armor", slot: "chest" },
      { file: "Drang Gauntlets", slot: "gauntlets" },
      { file: "Drang Shoes", slot: "leggings" },
    ],
  },
  {
    id: "eastern",
    name: "Eastern Set",
    confidence: "name-match",
    pieces: [
      { file: "Eastern Helm", slot: "helmet" },
      { file: "Eastern Armor", slot: "chest" },
      { file: "Eastern Gauntlets", slot: "gauntlets" },
      { file: "Eastern Leggings", slot: "leggings" },
    ],
  },
  {
    id: "elite-knight",
    name: "Elite Knight Set",
    confidence: "name-match",
    pieces: [
      { file: "Elite Knight Helm", slot: "helmet" },
      { file: "Elite Knight Armor", slot: "chest" },
      { file: "Elite Knight Gauntlets", slot: "gauntlets" },
      { file: "Elite Knight Leggings", slot: "leggings" },
    ],
  },
  {
    id: "evangelist",
    name: "Evangelist Set",
    confidence: "name-match",
    pieces: [
      { file: "Evangelist Hat", slot: "helmet" },
      { file: "Evangelist Robe", slot: "chest" },
      { file: "Evangelist Gloves", slot: "gauntlets" },
      { file: "Evangelist Trousers", slot: "leggings" },
    ],
  },
  {
    id: "executioner",
    name: "Executioner Set",
    confidence: "name-match",
    pieces: [
      { file: "Executioner Helm", slot: "helmet" },
      { file: "Executioner Armor", slot: "chest" },
      { file: "Executioner Gauntlets", slot: "gauntlets" },
      { file: "Executioner Leggings", slot: "leggings" },
    ],
  },
  {
    id: "exile",
    name: "Exile Set",
    confidence: "name-match",
    pieces: [
      { file: "Exile Mask", slot: "helmet" },
      { file: "Exile Armor", slot: "chest" },
      { file: "Exile Gauntlets", slot: "gauntlets" },
      { file: "Exile Leggings", slot: "leggings" },
    ],
  },
  {
    id: "fallen-knight",
    name: "Fallen Knight Set",
    confidence: "name-match",
    pieces: [
      { file: "Fallen Knight Helm", slot: "helmet" },
      { file: "Fallen Knight Armor", slot: "chest" },
      { file: "Fallen Knight Gauntlets", slot: "gauntlets" },
      { file: "Fallen Knight Trousers", slot: "leggings" },
    ],
  },
  {
    id: "faraam",
    name: "Faraam Set",
    confidence: "verified",
    pieces: [
      { file: "Faraam Helm", slot: "helmet" },
      { file: "Faraam Armor", slot: "chest" },
      { file: "Faraam Gauntlets", slot: "gauntlets" },
      { file: "Faraam Boots", slot: "leggings" },
    ],
  },
  {
    id: "fire-keeper",
    name: "Fire Keeper Set",
    confidence: "name-match",
    note: "3 pieces, no helm",
    pieces: [
      { file: "Fire Keeper Robe", slot: "chest" },
      { file: "Fire Keeper Gloves", slot: "gauntlets" },
      { file: "Fire Keeper Skirt", slot: "leggings" },
    ],
  },
  {
    id: "fire-witch",
    name: "Fire Witch Set",
    confidence: "name-match",
    pieces: [
      { file: "Fire Witch Helm", slot: "helmet" },
      { file: "Fire Witch Armor", slot: "chest" },
      { file: "Fire Witch Gauntlets", slot: "gauntlets" },
      { file: "Fire Witch Leggings", slot: "leggings" },
    ],
  },
  {
    id: "firelink",
    name: "Firelink Set",
    confidence: "name-match",
    pieces: [
      { file: "Firelink Helm", slot: "helmet" },
      { file: "Firelink Armor", slot: "chest" },
      { file: "Firelink Gauntlets", slot: "gauntlets" },
      { file: "Firelink Leggings", slot: "leggings" },
    ],
  },
  {
    id: "follower",
    name: "Follower Set",
    confidence: "name-match",
    pieces: [
      { file: "Follower Helm", slot: "helmet" },
      { file: "Follower Armor", slot: "chest" },
      { file: "Follower Gloves", slot: "gauntlets" },
      { file: "Follower Boots", slot: "leggings" },
    ],
  },
  {
    id: "grave-warden",
    name: "Grave Warden Set",
    confidence: "name-match",
    pieces: [
      { file: "Grave Warden Hood", slot: "helmet" },
      { file: "Grave Warden Robe", slot: "chest" },
      { file: "Grave Warden Wrap", slot: "gauntlets" },
      { file: "Grave Warden Skirt", slot: "leggings" },
    ],
  },
  {
    id: "gundyr-s",
    name: "Gundyr's Set",
    confidence: "name-match",
    pieces: [
      { file: "Gundyr_s Helm", slot: "helmet" },
      { file: "Gundyr_s Armor", slot: "chest" },
      { file: "Gundyr_s Gauntlets", slot: "gauntlets" },
      { file: "Gundyr_s Leggings", slot: "leggings" },
    ],
  },
  {
    id: "harald-legion",
    name: "Harald Legion Set",
    confidence: "check",
    note: "3 pieces, no helm. Check whether 'Standard Helm' belongs here",
    pieces: [
      { file: "Harald Legion Armor", slot: "chest" },
      { file: "Harald Legion Gauntlets", slot: "gauntlets" },
      { file: "Harald Legion Leggings", slot: "leggings" },
    ],
  },
  {
    id: "hard-leather",
    name: "Hard Leather Set",
    confidence: "name-match",
    note: "3 pieces, no helm",
    pieces: [
      { file: "Hard Leather Armor", slot: "chest", altFiles: ["Hard Leather Armor2"] },
      { file: "Hard Leather Gauntlets", slot: "gauntlets" },
      { file: "Hard Leather Boots", slot: "leggings", altFiles: ["Hard Leather Boots2"] },
    ],
  },
  {
    id: "havel-s",
    name: "Havel's Set",
    confidence: "name-match",
    pieces: [
      { file: "Havel_s Helm", slot: "helmet" },
      { file: "Havel_s Armor", slot: "chest" },
      { file: "Havel_s Gauntlets", slot: "gauntlets" },
      { file: "Havel_s Leggings", slot: "leggings" },
    ],
  },
  {
    id: "herald",
    name: "Herald Set",
    confidence: "name-match",
    pieces: [
      { file: "Herald Helm", slot: "helmet" },
      { file: "Herald Armor", slot: "chest" },
      { file: "Herald Gloves", slot: "gauntlets" },
      { file: "Herald Trousers", slot: "leggings" },
    ],
  },
  {
    id: "iron-dragonslayer",
    name: "Iron Dragonslayer Set",
    confidence: "name-match",
    pieces: [
      { file: "Iron Dragonslayer Helm", slot: "helmet" },
      { file: "Iron Dragonslayer Armor", slot: "chest" },
      { file: "Iron Dragonslayer Gauntlets", slot: "gauntlets" },
      { file: "Iron Dragonslayer Leggings", slot: "leggings" },
    ],
  },
  {
    id: "iron",
    name: "Iron Set",
    confidence: "check",
    note: "Fandom lists Iron Bracelets in the Iron Set; guides/Fextralife call the same Solaire look the Armor of the Sun set. Chest = Armor of the Sun is from guides, confirm once",
    pieces: [
      { file: "Iron Helm", slot: "helmet" },
      { file: "Armor of the Sun", slot: "chest" },
      { file: "Iron Bracelets", slot: "gauntlets" },
      { file: "Iron Leggings", slot: "leggings" },
    ],
  },
  {
    id: "jailer",
    name: "Jailer Set",
    confidence: "name-match",
    note: "3 pieces, no helm",
    pieces: [
      { file: "Jailer Robe", slot: "chest" },
      { file: "Jailer Gloves", slot: "gauntlets" },
      { file: "Jailer Trousers", slot: "leggings" },
    ],
  },
  {
    id: "karla-s",
    name: "Karla's Set",
    confidence: "name-match",
    pieces: [
      { file: "Karla_s Pointed Hat", slot: "helmet" },
      { file: "Karla_s Coat", slot: "chest" },
      { file: "Karla_s Gloves", slot: "gauntlets" },
      { file: "Karla_s Trousers", slot: "leggings" },
    ],
  },
  {
    id: "knight",
    name: "Knight Set",
    confidence: "name-match",
    note: "Different from Nameless Knight Set",
    pieces: [
      { file: "Knight Helm", slot: "helmet" },
      { file: "Knight Armor", slot: "chest" },
      { file: "Knight Gauntlets", slot: "gauntlets" },
      { file: "Knight Leggings", slot: "leggings" },
    ],
  },
  {
    id: "lapp-s",
    name: "Lapp's Set",
    confidence: "name-match",
    pieces: [
      { file: "Lapp_s Helm", slot: "helmet" },
      { file: "Lapp_s Armor", slot: "chest" },
      { file: "Lapp_s Gauntlets", slot: "gauntlets" },
      { file: "Lapp_s Leggings", slot: "leggings" },
    ],
  },
  {
    id: "leather",
    name: "Leather Set",
    confidence: "name-match",
    note: "3 pieces. NOT 'Leather Gauntlets' - those belong to Chain Set",
    pieces: [
      { file: "Leather Armor", slot: "chest", altFiles: ["Leather Armor2"] },
      { file: "Leather Gloves", slot: "gauntlets", altFiles: ["Leather Gloves2"] },
      { file: "Leather Boots", slot: "leggings", altFiles: ["Leather Boots2"] },
    ],
  },
  {
    id: "leonhard-s",
    name: "Leonhard's Set",
    confidence: "name-match",
    note: "3 pieces, no helm",
    pieces: [
      { file: "Leonhard_s Garb", slot: "chest" },
      { file: "Leonhard_s Gauntlets", slot: "gauntlets" },
      { file: "Leonhard_s Trousers", slot: "leggings" },
    ],
  },
  {
    id: "lorian-s",
    name: "Lorian's Set",
    confidence: "name-match",
    pieces: [
      { file: "Lorian_s Helm", slot: "helmet" },
      { file: "Lorian_s Armor", slot: "chest" },
      { file: "Lorian_s Gauntlets", slot: "gauntlets" },
      { file: "Lorian_s Leggings", slot: "leggings" },
    ],
  },
  {
    id: "lothric-knight",
    name: "Lothric Knight Set",
    confidence: "name-match",
    pieces: [
      { file: "Lothric Knight Helm", slot: "helmet" },
      { file: "Lothric Knight Armor", slot: "chest" },
      { file: "Lothric Knight Gauntlets", slot: "gauntlets" },
      { file: "Lothric Knight Leggings", slot: "leggings" },
    ],
  },
  {
    id: "maiden",
    name: "Maiden Set",
    confidence: "name-match",
    pieces: [
      { file: "Maiden Hood", slot: "helmet" },
      { file: "Maiden Robe", slot: "chest" },
      { file: "Maiden Gloves", slot: "gauntlets" },
      { file: "Maiden Skirt", slot: "leggings" },
    ],
  },
  {
    id: "master-s",
    name: "Master's Set",
    confidence: "verified",
    note: "2 pieces. Ragged Mask and Loincloth share the DS2 Prisoner look and may pair with it, but wikis list them separately",
    pieces: [
      { file: "Master_s Attire", slot: "chest", altFiles: ["Master_s Attire2"] },
      { file: "Master_s Gloves", slot: "gauntlets" },
    ],
  },
  {
    id: "millwood-knight",
    name: "Millwood Knight Set",
    confidence: "name-match",
    pieces: [
      { file: "Millwood Knight Helm", slot: "helmet" },
      { file: "Millwood Knight Armor", slot: "chest" },
      { file: "Millwood Knight Gauntlets", slot: "gauntlets" },
      { file: "Millwood Knight Leggings", slot: "leggings" },
    ],
  },
  {
    id: "mirrah-chain",
    name: "Mirrah Chain Set",
    confidence: "name-match",
    note: "3 pieces, no helm",
    pieces: [
      { file: "Mirrah Chain Mail", slot: "chest" },
      { file: "Mirrah Chain Gloves", slot: "gauntlets" },
      { file: "Mirrah Chain Leggings", slot: "leggings" },
    ],
  },
  {
    id: "mirrah",
    name: "Mirrah Set",
    confidence: "name-match",
    note: "3 pieces, no helm",
    pieces: [
      { file: "Mirrah Vest", slot: "chest" },
      { file: "Mirrah Gloves", slot: "gauntlets" },
      { file: "Mirrah Trousers", slot: "leggings" },
    ],
  },
  {
    id: "morne-s",
    name: "Morne's Set",
    confidence: "name-match",
    pieces: [
      { file: "Morne_s Helm", slot: "helmet" },
      { file: "Morne_s Armor", slot: "chest" },
      { file: "Morne_s Gauntlets", slot: "gauntlets" },
      { file: "Morne_s Leggings", slot: "leggings" },
    ],
  },
  {
    id: "nameless-knight",
    name: "Nameless Knight Set",
    confidence: "name-match",
    note: "Different from Knight Set",
    pieces: [
      { file: "Nameless Knight Helm", slot: "helmet" },
      { file: "Nameless Knight Armor", slot: "chest" },
      { file: "Nameless Knight Gauntlets", slot: "gauntlets" },
      { file: "Nameless Knight Leggings", slot: "leggings" },
    ],
  },
  {
    id: "northern",
    name: "Northern Set",
    confidence: "name-match",
    pieces: [
      { file: "Northern Helm", slot: "helmet" },
      { file: "Northern Armor", slot: "chest" },
      { file: "Northern Gloves", slot: "gauntlets" },
      { file: "Northern Trousers", slot: "leggings" },
    ],
  },
  {
    id: "old-sorcerer",
    name: "Old Sorcerer Set",
    confidence: "name-match",
    pieces: [
      { file: "Old Sorcerer Hat", slot: "helmet", altFiles: ["Old Sorcerer Hat2"] },
      { file: "Old Sorcerer Coat", slot: "chest", altFiles: ["Old Sorcerer Coat2"] },
      { file: "Old Sorcerer Gauntlets", slot: "gauntlets", altFiles: ["Old Sorcerer Gauntlets2"] },
      { file: "Old Sorcerer Boots", slot: "leggings", altFiles: ["Old Sorcerer Boots2"] },
    ],
  },
  {
    id: "ordained",
    name: "Ordained Set",
    confidence: "name-match",
    note: "3 pieces, no gauntlets",
    pieces: [
      { file: "Ordained Hood", slot: "helmet" },
      { file: "Ordained Dress", slot: "chest", altFiles: ["Ordained Dress2"] },
      { file: "Ordained Trousers", slot: "leggings" },
    ],
  },
  {
    id: "outrider-knight",
    name: "Outrider Knight Set",
    confidence: "name-match",
    pieces: [
      { file: "Outrider Knight Helm", slot: "helmet" },
      { file: "Outrider Knight Armor", slot: "chest" },
      { file: "Outrider Knight Gauntlets", slot: "gauntlets" },
      { file: "Outrider Knight Leggings", slot: "leggings" },
    ],
  },
  {
    id: "painting-guardian",
    name: "Painting Guardian Set",
    confidence: "name-match",
    pieces: [
      { file: "Painting Guardian Hood", slot: "helmet" },
      { file: "Painting Guardian Gown", slot: "chest" },
      { file: "Painting Guardian Gloves", slot: "gauntlets" },
      { file: "Painting Guardian Waistcloth", slot: "leggings" },
    ],
  },
  {
    id: "pale-shade",
    name: "Pale Shade Set",
    confidence: "name-match",
    note: "3 pieces, no helm",
    pieces: [
      { file: "Pale Shade Robe", slot: "chest" },
      { file: "Pale Shade Gloves", slot: "gauntlets" },
      { file: "Pale Shade Trousers", slot: "leggings" },
    ],
  },
  {
    id: "pontiff-knight",
    name: "Pontiff Knight Set",
    confidence: "name-match",
    pieces: [
      { file: "Pontiff Knight Crown", slot: "helmet" },
      { file: "Pontiff Knight Armor", slot: "chest" },
      { file: "Pontiff Knight Gauntlets", slot: "gauntlets" },
      { file: "Pontiff Knight Leggings", slot: "leggings" },
    ],
  },
  {
    id: "prayer",
    name: "Prayer Set",
    confidence: "name-match",
    note: "3 pieces, no gauntlets. Names use 'of Prayer' pattern",
    pieces: [
      { file: "Hood of Prayer", slot: "helmet" },
      { file: "Robe of Prayer", slot: "chest" },
      { file: "Skirt of Prayer", slot: "leggings" },
    ],
  },
  {
    id: "pyromancer",
    name: "Pyromancer Set",
    confidence: "name-match",
    pieces: [
      { file: "Pyromancer Crown", slot: "helmet" },
      { file: "Pyromancer Garb 2", slot: "chest" },
      { file: "Pyromancer Wrap", slot: "gauntlets" },
      { file: "Pyromancer Trousers", slot: "leggings" },
    ],
  },
  {
    id: "ringed-knight",
    name: "Ringed Knight Set",
    confidence: "name-match",
    pieces: [
      { file: "Ringed Knight Hood", slot: "helmet" },
      { file: "Ringed Knight Armor", slot: "chest" },
      { file: "Ringed Knight Gauntlets", slot: "gauntlets" },
      { file: "Ringed Knight Leggings", slot: "leggings" },
    ],
  },
  {
    id: "ruin",
    name: "Ruin Set",
    confidence: "name-match",
    pieces: [
      { file: "Ruin Helm", slot: "helmet" },
      { file: "Ruin Armor", slot: "chest" },
      { file: "Ruin Gauntlets", slot: "gauntlets" },
      { file: "Ruin Leggings", slot: "leggings" },
    ],
  },
  {
    id: "scholar",
    name: "Scholar Set",
    confidence: "check",
    note: "2 pieces. Fextralife Scholar Set page includes the helm (not obtainable without save editing) but the Robe page calls the robe standalone",
    pieces: [
      { file: "Scholar_s Shed Skin", slot: "helmet" },
      { file: "Scholar_s Robe", slot: "chest" },
    ],
  },
  {
    id: "sellsword",
    name: "Sellsword Set",
    confidence: "name-match",
    note: "Image name is singular: 'Sellsword Gauntlet'",
    pieces: [
      { file: "Sellsword Helm", slot: "helmet" },
      { file: "Sellsword Armor", slot: "chest" },
      { file: "Sellsword Gauntlet", slot: "gauntlets" },
      { file: "Sellsword Trousers", slot: "leggings" },
    ],
  },
  {
    id: "set-of-favor",
    name: "Set of Favor",
    confidence: "name-match",
    note: "Names use 'of Favor' pattern",
    pieces: [
      { file: "Helm of Favor", slot: "helmet" },
      { file: "Embraced Armor of Favor", slot: "chest" },
      { file: "Gauntlets of Favor", slot: "gauntlets" },
      { file: "Leggings of Favor", slot: "leggings" },
    ],
  },
  {
    id: "set-of-thorns",
    name: "Set of Thorns",
    confidence: "name-match",
    note: "Names use 'of Thorns' pattern, not 'Thorns X'",
    pieces: [
      { file: "Helm of Thorns", slot: "helmet" },
      { file: "Armor of Thorns", slot: "chest" },
      { file: "Gauntlets of Thorns", slot: "gauntlets" },
      { file: "Leggings of Thorns", slot: "leggings" },
    ],
  },
  {
    id: "shadow",
    name: "Shadow Set",
    confidence: "verified",
    note: "altImages are the alternate (female) look",
    pieces: [
      { file: "Shadow Mask", slot: "helmet", altFiles: ["Shadow Mask2"] },
      { file: "Shadow Garb", slot: "chest", altFiles: ["Shadow Garb2"] },
      { file: "Shadow Gauntlets", slot: "gauntlets", altFiles: ["Shadow Gauntlets2"] },
      { file: "Shadow Leggings", slot: "leggings", altFiles: ["Shadow Leggings2"] },
    ],
  },
  {
    id: "shira-s",
    name: "Shira's Set",
    confidence: "name-match",
    pieces: [
      { file: "Shira_s Crown", slot: "helmet" },
      { file: "Shira_s Armor", slot: "chest" },
      { file: "Shira_s Gloves", slot: "gauntlets" },
      { file: "Shira_s Trousers", slot: "leggings" },
    ],
  },
  {
    id: "silver-knight",
    name: "Silver Knight Set",
    confidence: "name-match",
    pieces: [
      { file: "Silver Knight Helm", slot: "helmet" },
      { file: "Silver Knight Armor", slot: "chest" },
      { file: "Silver Knight Gauntlets", slot: "gauntlets" },
      { file: "Silver Knight Leggings", slot: "leggings" },
    ],
  },
  {
    id: "slave-knight",
    name: "Slave Knight Set",
    confidence: "name-match",
    pieces: [
      { file: "Slave Knight Hood", slot: "helmet" },
      { file: "Slave Knight Armor", slot: "chest" },
      { file: "Slave Knight Gauntlets", slot: "gauntlets" },
      { file: "Slave Knight Leggings", slot: "leggings" },
    ],
  },
  {
    id: "smough-s",
    name: "Smough's Set",
    confidence: "name-match",
    pieces: [
      { file: "Smough_s Helm", slot: "helmet" },
      { file: "Smough_s Armor", slot: "chest" },
      { file: "Smough_s Gauntlets", slot: "gauntlets" },
      { file: "Smough_s Leggings", slot: "leggings" },
    ],
  },
  {
    id: "sorcerer",
    name: "Sorcerer Set",
    confidence: "name-match",
    pieces: [
      { file: "Sorcerer Hood", slot: "helmet" },
      { file: "Sorcerer Robe", slot: "chest", altFiles: ["Sorcerer Robe2"] },
      { file: "Sorcerer Gloves", slot: "gauntlets" },
      { file: "Sorcerer Trousers", slot: "leggings" },
    ],
  },
  {
    id: "sunless",
    name: "Sunless Set",
    confidence: "verified",
    pieces: [
      { file: "Sunless Veil", slot: "helmet" },
      { file: "Sunless Armor", slot: "chest" },
      { file: "Sunless Gauntlets", slot: "gauntlets" },
      { file: "Sunless Leggings", slot: "leggings" },
    ],
  },
  {
    id: "sunset",
    name: "Sunset Set",
    confidence: "verified",
    pieces: [
      { file: "Sunset Helm", slot: "helmet" },
      { file: "Sunset Armor", slot: "chest" },
      { file: "Sunset Gauntlets", slot: "gauntlets" },
      { file: "Sunset Leggings", slot: "leggings" },
    ],
  },
  {
    id: "undead-legion",
    name: "Undead Legion Set",
    confidence: "name-match",
    note: "Image name is singular: 'Undead Legion Gauntlet'",
    pieces: [
      { file: "Undead Legion Helm", slot: "helmet" },
      { file: "Undead Legion Armor", slot: "chest" },
      { file: "Undead Legion Gauntlet", slot: "gauntlets" },
      { file: "Undead Legion Leggings", slot: "leggings" },
    ],
  },
  {
    id: "winged-knight",
    name: "Winged Knight Set",
    confidence: "name-match",
    pieces: [
      { file: "Winged Knight Helm", slot: "helmet" },
      { file: "Winged Knight Armor", slot: "chest" },
      { file: "Winged Knight Gauntlets", slot: "gauntlets" },
      { file: "Winged Knight Leggings", slot: "leggings" },
    ],
  },
  {
    id: "wolf-knight",
    name: "Wolf Knight Set",
    confidence: "name-match",
    pieces: [
      { file: "Wolf Knight Helm", slot: "helmet" },
      { file: "Wolf Knight Armor", slot: "chest" },
      { file: "Wolf Knight Gauntlets", slot: "gauntlets" },
      { file: "Wolf Knight Leggings", slot: "leggings" },
    ],
  },
  {
    id: "worker",
    name: "Worker Set",
    confidence: "name-match",
    pieces: [
      { file: "Worker Hat", slot: "helmet" },
      { file: "Worker Garb", slot: "chest" },
      { file: "Worker Gloves", slot: "gauntlets" },
      { file: "Worker Trousers", slot: "leggings" },
    ],
  },
  {
    id: "xanthous",
    name: "Xanthous Set",
    confidence: "name-match",
    pieces: [
      { file: "Xanthous Crown", slot: "helmet" },
      { file: "Xanthous Overcoat", slot: "chest" },
      { file: "Xanthous Gloves", slot: "gauntlets" },
      { file: "Xanthous Trousers", slot: "leggings" },
    ],
  },
];

// Pieces that do not belong to any set (one card each)
export const ARMOR_MANIFEST_SINGLES: ManifestSingle[] = [
  { file: "Aristocrat_s Mask", slot: "helmet", confidence: "name-match" },
  { file: "Blood-Stained Skirt", slot: "leggings", confidence: "name-match" },
  { file: "Clandestine Coat", slot: "chest", altFiles: ["Clandestine Coat2"], confidence: "name-match" },
  { file: "Creighton_s Steel Mask", slot: "helmet", confidence: "name-match" },
{ file: "Loincloth", slot: "leggings", altFiles: ["Loincloth3"], confidence: "name-match" },  { file: "Lucatiel_s Mask", slot: "helmet", confidence: "name-match" },
  { file: "Old Sage_s Blindfold", slot: "helmet", confidence: "name-match" },
  { file: "Pharis_s Hat", slot: "helmet", confidence: "name-match" },
  { file: "Ragged Mask", slot: "helmet", confidence: "name-match" },
  { file: "Sage_s Big Hat", slot: "helmet", confidence: "name-match" },
  { file: "Silver Mask", slot: "helmet", confidence: "name-match" },
  { file: "Sneering Mask", slot: "helmet", confidence: "name-match" },
  { file: "Standard Helm", slot: "helmet", altFiles: ["Standard Helm2"], confidence: "check", note: "Check whether it belongs to Harald Legion Set" },
  { file: "Symbol of Avarice", slot: "helmet", confidence: "name-match" },
  { file: "Thief Mask", slot: "helmet", confidence: "check" },
  { file: "Thrall Hood", slot: "helmet", confidence: "name-match" },
  { file: "White Preacher Head", slot: "helmet", confidence: "name-match" },
  { file: "Wolnir_s Crown", slot: "helmet", confidence: "name-match" },
];