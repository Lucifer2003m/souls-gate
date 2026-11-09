
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import {
  cleanShieldName,
  getShieldCategory,
} from "../shieldReference";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "game-assets";
const FOLDER = "ds3/Shields";
const SIGNED_URL_TTL = 3600;

const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
]);

export async function GET() {
  try {
    // دریافت فهرست فایل‌های سپرها از Supabase Storage
    const { data: files, error: listError } =
      await supabaseServer.storage
        .from(BUCKET)
        .list(FOLDER, {
          limit: 100,
          sortBy: {
            column: "name",
            order: "asc",
          },
        });

    if (listError) {
      console.error(
        "Shield image listing failed:",
        listError.message,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Could not list shield images",
          shields: [],
          total: 0,
        },
        { status: 500 },
      );
    }

    // فقط فایل‌های تصویری واقعی را نگه می‌داریم
    const imageFiles = (files ?? []).filter((file) => {
      const extension = file.name
        .slice(file.name.lastIndexOf("."))
        .toLowerCase();

      return (
        file.id !== null &&
        IMAGE_EXTENSIONS.has(extension)
      );
    });

    if (imageFiles.length === 0) {
      return NextResponse.json(
        {
          success: true,
          total: 0,
          shields: [],
        },
        {
          headers: {
            "Cache-Control": "private, max-age=300",
          },
        },
      );
    }

    // ساخت مسیر کامل تصاویر برای تولید Signed URL
    const paths = imageFiles.map(
      (file) => `${FOLDER}/${file.name}`,
    );

    const { data: signedFiles, error: signedError } =
      await supabaseServer.storage
        .from(BUCKET)
        .createSignedUrls(paths, SIGNED_URL_TTL);

    if (signedError) {
      console.error(
        "Shield signed URL creation failed:",
        signedError.message,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Could not create shield image URLs",
          shields: [],
          total: 0,
        },
        { status: 500 },
      );
    }

    // اتصال هر مسیر به آدرس امن تصویر
    const signedByPath = new Map(
      (signedFiles ?? []).map((item) => [
        item.path,
        {
          url: item.signedUrl ?? null,
          error: item.error ?? null,
        },
      ]),
    );

    // ساخت خروجی سازگار با بخش Shields
    const shields = imageFiles
      .map((file, index) => {
        const fileName = file.name;
        const name = cleanShieldName(fileName);
        const path = paths[index];
        const signed = signedByPath.get(path);

        return {
          id: fileName,
          name,
          fileName,
          category: getShieldCategory(name),
          image: signed?.url ?? null,
          error: signed?.error ?? null,
        };
      })
      .sort((a, b) =>
        a.name.localeCompare(b.name, "en"),
      );

    return NextResponse.json(
      {
        success: true,
        total: shields.length,
        shields,
      },
      {
        headers: {
          // آدرس‌های تصاویر یک ساعت اعتبار دارند.
          // کش مرورگر کوتاه‌تر از اعتبار آدرس است.
          "Cache-Control": "private, max-age=300",
        },
      },
    );
  } catch (error) {
    console.error("Shields API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unexpected server error",
        shields: [],
        total: 0,
      },
      { status: 500 },
    );
  }
}
