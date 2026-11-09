
import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import {
  spellDetails,
  categoryMeta,
  normalizeSpellKey,
  type SpellInfo,
  type SpellCategory,
} from "./data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// این Route سمت سرور اجرا می‌شود.
// در صورت وجود، کلید Service Role فقط در همین سمت استفاده می‌شود.
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const BUCKET = process.env.SUPABASE_SPELLS_BUCKET || "game-assets";

const FOLDER = (
  process.env.SUPABASE_SPELLS_FOLDER || "ds3/spells"
)
  .replace(/^\/+|\/+$/g, "")
  .replace(/\/+/g, "/");

const IMAGE_EXTENSIONS = /\.(png|jpe?g|webp)$/i;

type StorageImage = {
  file: string;
  path: string;
  url: string;
};

type StorageEntry = {
  name: string;
  id?: string | null;
  metadata?: Record<string, unknown> | null;
};

function normalizeFolder(value: string) {
  return value.replace(/^\/+|\/+$/g, "").replace(/\/+/g, "/");
}

function cleanFileName(file: string) {
  return file
    .split("/")
    .pop()!
    .replace(IMAGE_EXTENSIONS, "")
    .replace(/_/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function makeMatchKey(value: string) {
  return normalizeSpellKey(
    value
      .replace(IMAGE_EXTENSIONS, "")
      .replace(/_/g, "'")
      .replace(/[’‘`]/g, "'")
      .replace(/\s+/g, " ")
      .trim()
  )
    .replace(/[^a-z0-9]/g, "");
}

// بعضی فایل‌ها نام متفاوتی با نام داخل بازی دارند.
const IMAGE_ALIASES: Record<string, string[]> = {
  "pestilent mercury": ["pestilent mist"],
  "dorhys gnawing": ["dorhys' gnawing", "dorhys gnawing"],
};

function getPossibleKeys(value: string): string[] {
  const cleaned = cleanFileName(value);
  const candidates = [cleaned, value];

  for (const [canonical, aliases] of Object.entries(IMAGE_ALIASES)) {
    const canonicalKey = makeMatchKey(canonical);
    const aliasKeys = aliases.map(makeMatchKey);
    const currentKey = makeMatchKey(cleaned);

    if (
      currentKey === canonicalKey ||
      aliasKeys.includes(currentKey)
    ) {
      candidates.push(canonical, ...aliases);
    }
  }

  return [...new Set(candidates.map(makeMatchKey))];
}

async function listImages(
  supabase: SupabaseClient,
  folder: string
): Promise<StorageImage[]> {
  const images: StorageImage[] = [];
  const visitedFolders = new Set<string>();

  async function scan(currentFolder: string): Promise<void> {
    const normalizedFolder = normalizeFolder(currentFolder);

    if (visitedFolders.has(normalizedFolder)) return;
    visitedFolders.add(normalizedFolder);

    let offset = 0;
    const limit = 1000;

    while (true) {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(normalizedFolder, {
          limit,
          offset,
          sortBy: { column: "name", order: "asc" },
        });

      if (error) {
        throw new Error(
          `Storage list failed for "${normalizedFolder}": ${error.message}`
        );
      }

      const entries = (data ?? []) as StorageEntry[];

      for (const entry of entries) {
        if (!entry.name) continue;

        const fullPath = normalizedFolder
          ? `${normalizedFolder}/${entry.name}`
          : entry.name;

        const isFolder =
          entry.id == null && entry.metadata == null;

        if (isFolder) {
          await scan(fullPath);
          continue;
        }

        if (!IMAGE_EXTENSIONS.test(entry.name)) continue;

        const { data: publicData } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(fullPath);

        images.push({
          file: entry.name,
          path: fullPath,
          url: publicData.publicUrl,
        });
      }

      if (entries.length < limit) break;
      offset += limit;
    }
  }

  await scan(folder);

  return images;
}

function findImage(
  spellKey: string,
  spellName: string,
  images: StorageImage[]
): StorageImage | undefined {
  const candidates = [
    ...getPossibleKeys(spellKey),
    ...getPossibleKeys(spellName),
  ];

  return images.find((image) => {
    const fileKeys = getPossibleKeys(image.file);
    return candidates.some((key) => fileKeys.includes(key));
  });
}

export async function GET() {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Supabase environment variables are missing. Check .env.local.",
          debug: {
            hasUrl: Boolean(SUPABASE_URL),
            hasKey: Boolean(SUPABASE_KEY),
            bucket: BUCKET,
            folder: FOLDER,
          },
        },
        { status: 500 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    // بررسی مسیرهای Storage برای پیدا کردن علت صفر بودن تصاویر
    const storageChecks: Record<string, unknown> = {};

    for (const path of ["", "ds3", FOLDER]) {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(path, {
          limit: 10,
          sortBy: { column: "name", order: "asc" },
        });

      storageChecks[path || "(root)"] = {
        error: error?.message ?? null,
        entries: (data ?? []).map((item) => ({
          name: item.name,
          isFolder: item.id == null && item.metadata == null,
        })),
      };
    }

    const images = await listImages(supabase, FOLDER);

    const allSpells = Object.entries(spellDetails) as [
      string,
      SpellInfo
    ][];

    const spells = allSpells.map(([key, details]) => {
      const name =
        (details as SpellInfo & { name?: string }).name || key;

      const matchedImage = findImage(key, name, images);

      return {
        ...details,
        id: key,
        key,
        name,
        image: matchedImage?.url ?? null,
        imageUrl: matchedImage?.url ?? null,
        imageFile: matchedImage?.file ?? null,
        imagePath: matchedImage?.path ?? null,
        hasImage: Boolean(matchedImage),
      };
    });

    const matchedImages = spells.filter(
      (spell) => spell.hasImage
    ).length;

    const missingImages = spells
      .filter((spell) => !spell.hasImage)
      .map((spell) => ({
        key: spell.key,
        name: spell.name,
      }));

    const response = {
      success: true,
      count: spells.length,
      totalSpells: spells.length,
      allSpells: spells,
      spells,
      imageCount: images.length,
      matchedImages,
      missingImageCount: missingImages.length,
      missingImages,
      categories: categoryMeta,
      debug: {
        bucket: BUCKET,
        folder: FOLDER,
        storageChecks,
        sampleFiles: images.slice(0, 15).map((image) => ({
          file: image.file,
          path: image.path,
        })),
        sampleMatches: spells
          .filter((spell) => spell.hasImage)
          .slice(0, 10)
          .map((spell) => ({
            name: spell.name,
            imageFile: spell.imageFile,
          })),
      },
    };

    console.log("[DS3 SPELLS]", {
      bucket: BUCKET,
      folder: FOLDER,
      totalSpells: spells.length,
      imageCount: images.length,
      matchedImages,
      missingImages: missingImages.length,
      sampleFiles: images.slice(0, 10).map((image) => image.path),
    });

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);

    console.error("[DS3 SPELLS ERROR]", message);

    return NextResponse.json(
      {
        success: false,
        error: message,
        debug: {
          bucket: BUCKET,
          folder: FOLDER,
        },
      },
      { status: 500 }
    );
  }
}
