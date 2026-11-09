import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const BUCKET = "game-assets";
const FOLDER = "ds3/armor";
const PAGE_SIZE = 1000;
const MAX_PAGES = 100;

const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
  ".bmp",
  ".tif",
  ".tiff",
  ".svg",
  ".ico",
]);

type StorageFile = {
  id: string | null;
  name: string;
  metadata?: {
    size?: number | null;
    mimetype?: string | null;
    cacheControl?: string | null;
    eTag?: string | null;
  } | null;
  updated_at?: string | null;
  created_at?: string | null;
  last_accessed_at?: string | null;
};

type ArmorCategory = "helmet" | "chest" | "gauntlets" | "leggings" | "other";

type ArmorItem = {
  id: string;
  name: string;
  english: string;
  fileName: string;
  category: ArmorCategory;
  image: string | null;
  error: string | null;
  storagePath: string;
  size: number | null;
  mimeType: string | null;
  updatedAt: string | null;
};

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
      Vary: "Authorization",
    },
  });
}

function getExtension(fileName: string): string {
  const index = fileName.lastIndexOf(".");
  return index >= 0 ? fileName.slice(index).toLowerCase() : "";
}

function isImageFile(file: StorageFile): boolean {
  return file.name !== "." && file.name !== ".." && IMAGE_EXTENSIONS.has(getExtension(file.name));
}

function displayName(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** پسوند تصویر و شمارهٔ نسخه را برای تشخیص جایگاه حذف می‌کند. */
function categoryName(fileName: string): string {
  return displayName(fileName)
    .replace(/\s*\(\d+\)\s*$/, "")
    .replace(/\s*\d+\s*$/, "")
    .trim();
}

function normalizeName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function getCategory(fileName: string): ArmorCategory {
  const name = normalizeName(categoryName(fileName));

  const exactOverrides: Record<string, ArmorCategory> = {
    "symbol of avarice": "helmet",
    "crown of dusk": "helmet",
    "pharis s hat": "helmet",
    "sage s big hat": "helmet",
    "aristocrat s mask": "helmet",
    "creighton s steel mask": "helmet",
    "lucatiel s mask": "helmet",
    "sunless veil": "helmet",
    "old sage s blindfold": "helmet",
    "scholar s shed skin": "helmet",
    "white preacher head": "helmet",
    "black witch wrappings": "gauntlets",
    "cornyx s wrap": "gauntlets",
    "painting guardian waistcloth": "leggings",
    "dragonscale waistcloth": "leggings",
    loincloth: "leggings",
  };

  const override = exactOverrides[name];
  if (override) return override;

  if (/\b(helm|helmet|hat|hood|mask|crown|headpiece|headwear|cap|blindfold|veil|head|shed skin)\b/.test(name)) {
    return "helmet";
  }

  if (/\b(gauntlet|gauntlets|glove|gloves|manchette|manchettes|bracelet|bracelets|wrapping|wrappings|wrap)\b/.test(name)) {
    return "gauntlets";
  }

  if (/\b(leggings|legging|boots|boot|greaves|trousers|pants|shoes|skirt|waistcloth|legwear|tassets|sollerets|loincloth)\b/.test(name)) {
    return "leggings";
  }

  if (/\b(armor|armour|chestpiece|chest|robe|dress|garb|coat|mail|tunic|vest|torso|surcoat|cloak|mantle|gown|attire|overcoat|shirt|clothes|outfit)\b/.test(name)) {
    return "chest";
  }

  // همهٔ فایل‌های موجود در پوشه، قطعهٔ زره هستند؛ موردهای خاص
  // که الگوی نامشان شناخته نشود، در بدنه نگهداری می‌شوند تا از API حذف نشوند.
  return "other";
}

function getStorageErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Unknown Storage error";
}

/** دریافت تمام فایل‌های پوشه به‌صورت صفحه‌به‌صفحه. */
async function listAllFiles(): Promise<StorageFile[]> {
  const allFiles: StorageFile[] = [];

  for (let page = 0; page < MAX_PAGES; page++) {
    const { data, error } = await supabaseServer.storage
      .from(BUCKET)
      .list(FOLDER, {
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      throw new Error(`Storage list failed on page ${page + 1}: ${error.message}`);
    }

    const batch = (data ?? []) as StorageFile[];
    allFiles.push(...batch);

    if (batch.length < PAGE_SIZE) return allFiles;
  }

  throw new Error(
    `Storage listing stopped after ${MAX_PAGES} pages. Increase MAX_PAGES if this folder contains more files.`
  );
}

/** ساخت URL عمومی و ثابت برای تصاویر Bucket عمومی. */
function createImageUrls(
  paths: string[]
): Map<string, { url: string | null; error: string | null }> {
  const results = new Map<string, { url: string | null; error: string | null }>();

  for (const path of paths) {
    try {
      const { data } = supabaseServer.storage.from(BUCKET).getPublicUrl(path);
      const url =
        typeof data.publicUrl === "string" && data.publicUrl.trim().length > 0
          ? data.publicUrl.trim()
          : null;

      results.set(path, {
        url,
        error: url ? null : "Public URL unavailable",
      });
    } catch (error) {
      results.set(path, {
        url: null,
        error: getStorageErrorMessage(error),
      });
    }
  }

  return results;
}

export async function GET() {
  try {
    const files = await listAllFiles();

    const imageFiles = files
      .filter(isImageFile)
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
          numeric: true,
        })
      );

    const storagePaths = imageFiles.map((file) => `${FOLDER}/${file.name}`);
    const publicUrls = createImageUrls(storagePaths);

    const armor: ArmorItem[] = imageFiles.map((file, index) => {
      const storagePath = storagePaths[index];
      const publicResult = publicUrls.get(storagePath);
      const name = displayName(file.name);

      return {
        id: storagePath,
        name,
        english: name,
        fileName: file.name,
        category: getCategory(file.name),
        image: publicResult?.url ?? null,
        error: publicResult?.error ?? (publicResult?.url ? null : "Public URL unavailable"),
        storagePath,
        size: typeof file.metadata?.size === "number" ? file.metadata.size : null,
        mimeType: file.metadata?.mimetype ?? null,
        updatedAt: file.updated_at ?? null,
      };
    });

    const categories = {
      helmet: armor.filter((item) => item.category === "helmet").length,
      chest: armor.filter((item) => item.category === "chest").length,
      gauntlets: armor.filter((item) => item.category === "gauntlets").length,
      leggings: armor.filter((item) => item.category === "leggings").length,
      other: armor.filter((item) => item.category === "other").length,
    };

    const failedImages = armor
      .filter((item) => !item.image)
      .map((item) => ({
        fileName: item.fileName,
        storagePath: item.storagePath,
        error: item.error,
      }));

    console.info("[Armor Lab API] Storage audit:", {
      bucket: BUCKET,
      folder: FOLDER,
      listedEntries: files.length,
      imageFiles: imageFiles.length,
      linkedImages: armor.length - failedImages.length,
      failedImages: failedImages.length,
      categories,
    });

    return jsonResponse({
      success: true,
      bucket: BUCKET,
      path: FOLDER,
      total: armor.length,
      categories,
      armor,
      debug: {
        listedEntries: files.length,
        imageFiles: imageFiles.length,
        linkedImages: armor.length - failedImages.length,
        failedImages,
        nonImageFiles: files.filter((file) => !isImageFile(file)).map((file) => file.name),
      },
    });
  } catch (error) {
    const message = getStorageErrorMessage(error);
    console.error("[Armor Lab API] Request failed:", message);

    return jsonResponse(
      {
        success: false,
        error: "Could not load armor storage",
        details: message,
        bucket: BUCKET,
        path: FOLDER,
        total: 0,
        armor: [],
      },
      500
    );
  }
}
