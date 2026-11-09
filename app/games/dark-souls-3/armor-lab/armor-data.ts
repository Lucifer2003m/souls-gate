import {
  ARMOR_MANIFEST,
  ARMOR_MANIFEST_SINGLES,
} from "./armor-manifest";
import type { ManifestConfidence } from "./armor-manifest";

export type SlotId = "helmet" | "chest" | "gauntlets" | "leggings";

export const slots: { id: SlotId; label: string }[] = [
  { id: "helmet", label: "کلاه‌خود" },
  { id: "chest", label: "زره بدن" },
  { id: "gauntlets", label: "دستکش" },
  { id: "leggings", label: "پاها" },
];

export type PieceStats = {
  weight?: number;
  poise?: number;
  physical?: number;
  magic?: number;
  fire?: number;
  lightning?: number;
  dark?: number;
};

export const statDefs: { key: keyof PieceStats; label: string }[] = [
  { key: "weight", label: "وزن" },
  { key: "poise", label: "پایداری (Poise)" },
  { key: "physical", label: "دفاع فیزیکی" },
  { key: "magic", label: "دفاع جادویی" },
  { key: "fire", label: "دفاع آتش" },
  { key: "lightning", label: "دفاع رعد" },
  { key: "dark", label: "دفاع تاریکی" },
];

export type ArmorPiece = {
  english: string;
  image: string;
  thumb?: string;
  description?: string;
  fullCanvas?: boolean;
  stats?: PieceStats;
  fileName?: string;
  alternatives?: ArmorPiece[];
};

export type ArmorApiItem = {
  id: string;
  fileName: string;
  name: string;
  english: string;
  category: string;
  image: string | null;
  storagePath: string;
  size?: number | null;
  updatedAt?: string | null;
  error?: string | null;
  mimeType?: string | null;
};

export type ArmorSet = {
  id: string;
  name: string;
  english: string;
  description: string;
  fullImage?: string;
  pieces: Record<SlotId, ArmorPiece>;
  alternatives?: ArmorApiItem[];
  pieceCount?: number;
  isComplete?: boolean;
  /** جایگاه‌هایی که این ست در بازی واقعاً دارد (مثلاً Drang بدون کلاه‌خود). */
  slotsInSet?: SlotId[];
  /** true یعنی همهٔ قطعات واقعی این ست تصویر دارند. */
  isFullSet?: boolean;
  confidence?: ManifestConfidence;
  note?: string;
};

export type ArmorGroupingResult = {
  sets: ArmorSet[];
  allPieces: ArmorApiItem[];
  totalFiles: number;
  filesWithImages: number;
  recognizedPieces: number;
  unrecognizedPieces: ArmorApiItem[];
  duplicateSlots: ArmorApiItem[];
};

const SLOT_IDS: SlotId[] = [
  "helmet",
  "chest",
  "gauntlets",
  "leggings",
];

const EMPTY_STATS: PieceStats = {};

function cleanFileName(value: string): string {
  const lastPart = value.split("/").pop() ?? value;

  return lastPart
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** نام نمایشی: زیرخط فایل‌ها همان آپوستروف است (Havel_s → Havel's). */
function displayFileName(value: string): string {
  const lastPart = value.split("/").pop() ?? value;

  return lastPart
    .replace(/\.[^.]+$/, "")
    .replace(/_/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeName(value: string): string {
  return cleanFileName(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .replace(/[()[\]{},.]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

function slugify(value: string): string {
  return normalizeName(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function removeAttachedCopyNumber(value: string): string {
  return cleanFileName(value)
    .replace(/\s*\(\d+\)\s*$/, "")
    .replace(/(?<=[a-z])\d+$/i, "");
}

const SLOT_PATTERNS: Record<SlotId, RegExp> = {
  helmet:
    /\b(helm|helmet|hat|hood|mask|crown|headpiece|headwear|cap|blindfold|veil|head|shed skin)\b/i,

  gauntlets:
    /\b(gauntlet|gauntlets|glove|gloves|manchette|manchettes|bracelet|bracelets|wrapping|wrappings|wrap)\b/i,

  leggings:
    /\b(leggings|legging|boots|boot|greaves|trousers|pants|shoes|skirt|waistcloth|legwear|tassets|sollerets|loincloth)\b/i,

  chest:
    /\b(armor|armour|chestpiece|chest|robe|dress|garb|coat|mail|tunic|vest|torso|surcoat|cloak|mantle|gown|attire|overcoat|shirt|clothes|outfit)\b/i,
};

/** فقط برای فایل‌هایی که در armor-manifest.ts نیستند (فایل جدید). */
const SLOT_OVERRIDES: Record<string, SlotId> = {
  "black witch wrappings": "gauntlets",
  "painting guardian waistcloth": "leggings",
  "dragonscale waistcloth": "leggings",
  "golden bracelets": "gauntlets",
  "iron bracelets": "gauntlets",
  "scholar s shed skin": "helmet",
  "old sage s blindfold": "helmet",
  "white preacher head": "helmet",
  "symbol of avarice": "helmet",
  "crown of dusk": "helmet",
  "pharis s hat": "helmet",
  "sage s big hat": "helmet",
  "aristocrat s mask": "helmet",
  "creighton s steel mask": "helmet",
  "lucatiel s mask": "helmet",
  "black witch veil": "helmet",
  "sunless veil": "helmet",
  "cornyx s wrap": "gauntlets",
  "loincloth":  "leggings",
  "loincloth2": "leggings",
  "loincloth3": "leggings",
};

const CATEGORY_TO_SLOT: Record<string, SlotId> = {
  helmet: "helmet",
  head: "helmet",
  headwear: "helmet",
  hat: "helmet",
  chest: "chest",
  torso: "chest",
  body: "chest",
  armor: "chest",
  armour: "chest",
  gauntlets: "gauntlets",
  gloves: "gauntlets",
  hands: "gauntlets",
  hand: "gauntlets",
  leggings: "leggings",
  legs: "leggings",
  leg: "leggings",
  boots: "leggings",
};

function identifySlot(
  fileName: string,
  category?: string,
): SlotId | null {
  const cleanedName = removeAttachedCopyNumber(fileName);
  const name = normalizeName(cleanedName);
  const override = SLOT_OVERRIDES[name];

  if (override) return override;

  const normalizedCategory = normalizeName(category ?? "");
  const categorySlot = CATEGORY_TO_SLOT[normalizedCategory];

  if (categorySlot) return categorySlot;

  for (const slot of SLOT_IDS) {
    if (SLOT_PATTERNS[slot].test(name)) return slot;
  }

  return null;
}

/**
 * پسوند شماره فقط وقتی حذف می‌شود که نسخهٔ اصلی همان فایل
 * با همان جایگاه در فهرست وجود داشته باشد.
 */
function getGroupingFileName(
  item: ArmorApiItem,
  allItems: ArmorApiItem[],
): string {
  const original = cleanFileName(
    item.fileName || item.name || item.id,
  );

  const match = original.match(/^(.*?)(?:\s*\((\d+)\)|\s*(\d+))$/);

  if (!match || !match[1].trim()) return original;

  const candidate = match[1].trim();
  const currentSlot = identifySlot(original, item.category);

  if (!currentSlot) return original;

  const hasMatchingOriginal = allItems.some((other) => {
    if (other.id === item.id) return false;

    const otherName = cleanFileName(
      other.fileName || other.name || other.id,
    );

    return (
      normalizeName(otherName) === normalizeName(candidate) &&
      identifySlot(otherName, other.category) === currentSlot
    );
  });

  return hasMatchingOriginal ? candidate : original;
}

const SLOT_SUFFIXES: Record<SlotId, RegExp> = {
  helmet:
    /\s+(helm|helmet|hat|hood|mask|crown|headpiece|headwear|cap|blindfold|veil|head|shed skin)$/i,

  chest:
    /\s+(armor|armour|chestpiece|chest|robe|dress|garb|coat|mail|tunic|vest|torso|surcoat|cloak|mantle|gown|attire|overcoat|shirt|clothes|outfit)$/i,

  gauntlets:
    /\s+(gauntlets?|gloves?|manchettes?|bracelets?|wrappings?|wrap)$/i,

  leggings:
    /\s+(leggings?|boots?|greaves|trousers|pants|shoes|skirt|waistcloth|legwear|tassets|sollerets|loincloth)$/i,
};

/** فقط برای فایل‌هایی که در armor-manifest.ts نیستند (فایل جدید). */
function getSetName(fileName: string, slot: SlotId): string {
  const baseName = cleanFileName(fileName);
  const normalized = normalizeName(baseName);
  const withoutSlot = baseName.replace(SLOT_SUFFIXES[slot], "").trim();

  // فقط وقتی پسوند جایگاه واقعاً حذف شده باشد از نام باقی‌مانده
  // به‌عنوان نام ست استفاده می‌کنیم.
  if (
    withoutSlot &&
    normalizeName(withoutSlot) !== normalized
  ) {
    return withoutSlot;
  }

  return baseName || "Unknown Armor";
}

function makePiece(item: ArmorApiItem): ArmorPiece {
  const originalName = displayFileName(
    item.fileName || item.name || item.id,
  );

  const image =
    typeof item.image === "string" ? item.image.trim() : "";

  return {
    english: originalName,
    image,
    thumb: image || undefined,
    fileName: item.fileName,
    description: image
      ? `قطعهٔ ${originalName} از تجهیزات Dark Souls III.`
      : `تصویر قطعهٔ ${originalName} در حال حاضر در دسترس نیست.`,
  };
}

function emptyPiece(name: string): ArmorPiece {
  return {
    english: name,
    image: "",
    description: "برای این جایگاه تصویر ثبت نشده است.",
  };
}

function isUsableImage(
  item: Pick<ArmorApiItem, "image">,
): boolean {
  return (
    typeof item.image === "string" &&
    item.image.trim().length > 0
  );
}

function inferFallbackSlot(item: ArmorApiItem): SlotId | null {
  const fileName = item.fileName || item.name || item.id;
  return identifySlot(fileName, item.category);
}

type GroupMeta = {
  groupId: string;
  groupName: string;
  standalone: boolean;
  slotsInSet?: SlotId[];
  confidence?: ManifestConfidence;
  note?: string;
};

type ManifestLookup = GroupMeta & {
  slot: SlotId;
  /** true: تصویر جایگزین (نسخهٔ ۲/۳ یا کلاه جایگزین) برای همان جایگاه */
  alt: boolean;
};

/**
 * فهرست صریح ست‌ها (armor-manifest.ts) کلید می‌خورد با نام فایل
 * نرمال‌شده؛ بنابراین گروه‌بندی دیگر به حدس زدن از روی اسم وابسته نیست.
 */
function buildManifestIndex(): Map<string, ManifestLookup> {
  const index = new Map<string, ManifestLookup>();

  for (const set of ARMOR_MANIFEST) {
    const slotsInSet = SLOT_IDS.filter((slot) =>
      set.pieces.some((piece) => piece.slot === slot),
    );

    // getEnglishSetName دوباره «Set» را اضافه می‌کند
    const groupName = set.name.replace(/\s+Set$/i, "");

    for (const piece of set.pieces) {
      const base = {
        groupId: set.id,
        groupName,
        standalone: false,
        slot: piece.slot,
        slotsInSet,
        confidence: set.confidence,
        note: set.note,
      };

      index.set(normalizeName(piece.file), { ...base, alt: false });

      for (const altFile of piece.altFiles ?? []) {
        index.set(normalizeName(altFile), { ...base, alt: true });
      }
    }
  }

  for (const single of ARMOR_MANIFEST_SINGLES) {
    const base = {
      groupId: `solo-${slugify(single.file)}`,
      groupName: displayFileName(single.file),
      standalone: true,
      slot: single.slot,
      slotsInSet: [single.slot],
      confidence: single.confidence,
      note: single.note,
    };

    index.set(normalizeName(single.file), { ...base, alt: false });

    for (const altFile of single.altFiles ?? []) {
      index.set(normalizeName(altFile), { ...base, alt: true });
    }
  }

  return index;
}

const MANIFEST_INDEX = buildManifestIndex();

type InternalGroup = {
  name: string;
  pieces: Partial<Record<SlotId, ArmorPiece>>;
  alternatives: ArmorApiItem[];
  standalone: boolean;
  slotsInSet?: SlotId[];
  confidence?: ManifestConfidence;
  note?: string;
};

function getEnglishSetName(name: string): string {
  if (/^set of /i.test(name) || /\bset$/i.test(name)) {
    return name;
  }

  return `${name} Set`;
}

export function buildArmorGrouping(
  items: ArmorApiItem[],
): ArmorGroupingResult {
  const groups = new Map<string, InternalGroup>();
  const unrecognizedPieces: ArmorApiItem[] = [];
  const duplicateSlots: ArmorApiItem[] = [];

  let filesWithImages = 0;
  let recognizedPieces = 0;

  const addToGroup = (
    meta: GroupMeta,
    slot: SlotId,
    item: ArmorApiItem,
  ) => {
    let group = groups.get(meta.groupId);

    if (!group) {
      group = {
        name: meta.groupName,
        pieces: {},
        alternatives: [],
        standalone: meta.standalone,
        slotsInSet: meta.slotsInSet,
        confidence: meta.confidence,
        note: meta.note,
      };

      groups.set(meta.groupId, group);
    }

    const piece = makePiece(item);
    const existing = group.pieces[slot];

    if (!existing) {
      group.pieces[slot] = piece;
      recognizedPieces++;
      return;
    }

    // تصویرهای تکراری حذف نمی‌شوند و به‌عنوان جایگزین حفظ می‌شوند.
    duplicateSlots.push(item);
    group.alternatives.push(item);

    existing.alternatives = [
      ...(existing.alternatives ?? []),
      piece,
    ];
  };

  const sortedItems = [...items].sort((a, b) => {
    const aName = a.fileName || a.name || a.id;
    const bName = b.fileName || b.name || b.id;

    return aName.localeCompare(bName, "en", {
      numeric: true,
      sensitivity: "base",
    });
  });

  // تصویرهای جایگزین بعد از قطعهٔ اصلی پردازش می‌شوند تا ترتیب
  // مرتب‌سازی تعیین نکند کدام تصویر اصلی است.
  const deferredAlternates: {
    item: ArmorApiItem;
    lookup: ManifestLookup;
  }[] = [];

  for (const item of sortedItems) {
    if (isUsableImage(item)) filesWithImages++;

    const originalFileName =
      item.fileName || item.name || item.id;

    const lookup = MANIFEST_INDEX.get(
      normalizeName(originalFileName),
    );

    if (lookup) {
      if (lookup.alt) {
        deferredAlternates.push({ item, lookup });
      } else {
        addToGroup(lookup, lookup.slot, item);
      }

      continue;
    }

    // --- فایلی که در manifest نیست (فایل جدید): حدس از روی نام ---
    const groupingFileName = getGroupingFileName(item, items);

    const slot =
      identifySlot(originalFileName, item.category) ??
      inferFallbackSlot(item);

    if (!slot) unrecognizedPieces.push(item);

    const isUnique = !slot;

    const setName = isUnique
      ? cleanFileName(groupingFileName) || "Unknown Armor"
      : getSetName(groupingFileName, slot);

    const baseId =
      slugify(setName) ||
      slugify(originalFileName) ||
      "unknown-armor";

    // آیتم بدون جایگاه هیچ‌وقت به ست دیگری متصل نمی‌شود.
    const setId = isUnique
      ? `${baseId}-${slugify(originalFileName)}-${slugify(item.id)}`
      : baseId;

    addToGroup(
      {
        groupId: setId,
        groupName: setName,
        standalone: isUnique,
      },
      slot ?? "chest",
      item,
    );
  }

  for (const { item, lookup } of deferredAlternates) {
    addToGroup(lookup, lookup.slot, item);
  }

  const sets: ArmorSet[] = Array.from(groups.entries()).map(
    ([id, group]) => {
      const pieces = group.pieces;

      const pieceCount = SLOT_IDS.filter((slot) =>
        Boolean(pieces[slot]?.image?.trim()),
      ).length;

      const isFullSet = group.slotsInSet
        ? group.slotsInSet.every((slot) =>
            Boolean(pieces[slot]?.image?.trim()),
          )
        : pieceCount === 4;

      return {
        id,
        name: group.name,
        english: group.standalone
          ? group.name
          : getEnglishSetName(group.name),
        description: group.standalone
          ? "قطعهٔ زرهی مستقل که در هیچ ست شناخته‌شده‌ای عضو نیست."
          : "قطعات گروه‌بندی‌شده بر اساس فهرست ست‌های Dark Souls III.",
        pieces: {
          helmet:
            pieces.helmet ?? emptyPiece(`${group.name} Helm`),
          chest:
            pieces.chest ?? emptyPiece(`${group.name} Armor`),
          gauntlets:
            pieces.gauntlets ?? emptyPiece(`${group.name} Gauntlets`),
          leggings:
            pieces.leggings ?? emptyPiece(`${group.name} Leggings`),
        },
        alternatives: group.alternatives,
        pieceCount,
        isComplete: pieceCount === 4,
        slotsInSet: group.slotsInSet,
        isFullSet,
        confidence: group.confidence,
        note: group.note,
      };
    },
  );

  return {
    sets: sets.sort((a, b) =>
      a.name.localeCompare(b.name, "en"),
    ),
    allPieces: items,
    totalFiles: items.length,
    filesWithImages,
    recognizedPieces,
    unrecognizedPieces,
    duplicateSlots,
  };
}

export function buildArmorSetsFromStorage(
  items: ArmorApiItem[],
): ArmorSet[] {
  return buildArmorGrouping(items).sets;
}

/** فقط زمانی استفاده می‌شود که API در دسترس نباشد. */
export const armorSets: ArmorSet[] = [
  {
    id: "elite-knight",
    name: "شوالیه نخبه",
    english: "Elite Knight Set",
    description: "ست موقت برای حالت قطع بودن API.",
    pieces: {
      helmet: {
        english: "Elite Knight Helm",
        image: "/images/armor/elite-knight/helmet.png",
      },
      chest: {
        english: "Elite Knight Armor",
        image: "/images/armor/elite-knight/chest.png",
      },
      gauntlets: {
        english: "Elite Knight Gauntlets",
        image: "/images/armor/elite-knight/gauntlets.png",
      },
      leggings: {
        english: "Elite Knight Leggings",
        image: "/images/armor/elite-knight/leggings.png",
      },
    },
  },
];

export function makeSet(opts: {
  id: string;
  name: string;
  english: string;
  names: Record<SlotId, string>;
  description?: string;
  folder?: string;
  fullImage?: string;
  descriptions?: Partial<Record<SlotId, string>>;
  stats?: Partial<Record<SlotId, PieceStats>>;
}): ArmorSet {
  const folder = opts.folder ?? `/images/armor/${opts.id}`;

  const piece = (slot: SlotId): ArmorPiece => ({
    english: opts.names[slot],
    image: `${folder}/${slot}.png`,
    description: opts.descriptions?.[slot],
    stats: opts.stats?.[slot] ?? EMPTY_STATS,
  });

  return {
    id: opts.id,
    name: opts.name,
    english: opts.english,
    description: opts.description ?? "",
    fullImage: opts.fullImage,
    pieces: {
      helmet: piece("helmet"),
      chest: piece("chest"),
      gauntlets: piece("gauntlets"),
      leggings: piece("leggings"),
    },
  };
}

export type Placement = {
  left: number;
  top: number;
  width: number;
  height: number;
  rotate?: number;
  flipX?: boolean;
  z: number;
  depth: number;
  fadeTop?: boolean;
  brightness?: number;
};

export const slotLayout: Record<SlotId, Placement[]> = {
  leggings: [
    {
      left: 19,
      top: 47,
      width: 62,
      height: 49,
      z: 1,
      depth: 4,
    },
  ],
  chest: [
    {
      left: 8,
      top: 13,
      width: 84,
      height: 60,
      z: 3,
      depth: 8,
    },
  ],
  gauntlets: [
    {
      left: 2,
      top: 30,
      width: 34,
      height: 29,
      rotate: -8,
      z: 2,
      depth: 12,
      fadeTop: true,
    },
    {
      left: 64,
      top: 30,
      width: 34,
      height: 29,
      rotate: 8,
      flipX: true,
      z: 2,
      depth: 12,
      fadeTop: true,
    },
  ],
  helmet: [
    {
      left: 31,
      top: 0,
      width: 38,
      height: 23,
      z: 5,
      depth: 14,
    },
  ],
};

export const pieceLayouts: Record<string, Placement[]> = {};

const FULL_CANVAS = {
  left: 0,
  top: 0,
  width: 100,
  height: 100,
};

export function getPlacements(
  setId: string,
  slot: SlotId,
  piece: ArmorPiece,
): Placement[] {
  const base = slotLayout[slot];

  if (piece.fullCanvas) {
    return [
      {
        ...FULL_CANVAS,
        z: base[0].z,
        depth: base[0].depth,
      },
    ];
  }

  return pieceLayouts[`${setId}:${slot}`] ?? base;
}