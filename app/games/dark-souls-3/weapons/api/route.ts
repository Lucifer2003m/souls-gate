
import { NextResponse } from "next/server";
import { readdir } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const IMAGE_EXTENSIONS = /\.(png|jpe?g|webp|avif)$/i;

type WeaponImage = {
  name: string;
  fileName: string;
  image: string;
};

export async function GET() {
  try {
    const folder = path.join(
      process.cwd(),
      "public",
      "images",
      "ds3",
      "weapons"
    );

    const files = await readdir(folder, {
      withFileTypes: true,
    });

    const weapons: WeaponImage[] = files
      .filter(
        (file) =>
          file.isFile() &&
          IMAGE_EXTENSIONS.test(file.name)
      )
      .map((file) => ({
        name: path.parse(file.name).name,
        fileName: file.name,
        image: `/images/ds3/weapons/${encodeURIComponent(
          file.name
        )}`,
      }))
      .sort((a, b) =>
        a.name.localeCompare(b.name, "en", {
          sensitivity: "base",
          numeric: true,
        })
      );

    return NextResponse.json(
      {
        success: true,
        total: weapons.length,
        weapons,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("DS3 weapons API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "خواندن پوشه تصاویر سلاح‌ها امکان‌پذیر نیست.",
        total: 0,
        weapons: [],
      },
      { status: 500 }
    );
  }
}
