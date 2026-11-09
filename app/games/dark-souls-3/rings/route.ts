
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "game-assets";
const FOLDER = "ds3/rings";
const SIGNED_URL_TTL = 3600;

export async function GET() {
  try {
    const { data: files, error: listError } =
      await supabaseServer.storage.from(BUCKET).list(FOLDER, {
        limit: 100,
        sortBy: { column: "name", order: "asc" },
      });

    if (listError) {
      console.error("Ring image listing failed:", listError.message);

      return NextResponse.json(
        { error: "Could not list ring images" },
        { status: 500 }
      );
    }

    const imageFiles = (files ?? []).filter(
      (file) =>
        /\.(png|jpe?g|webp)$/i.test(file.name) &&
        file.id !== null
    );

    if (imageFiles.length === 0) {
      return NextResponse.json(
        { count: 0, rings: [] },
        {
          headers: {
            "Cache-Control": "private, max-age=300",
          },
        }
      );
    }

    const paths = imageFiles.map(
      (file) => `${FOLDER}/${file.name}`
    );

    // Create signed URLs in a batch instead of one request per image.
    const { data: signedFiles, error: signedError } =
      await supabaseServer.storage
        .from(BUCKET)
        .createSignedUrls(paths, SIGNED_URL_TTL);

    if (signedError) {
      console.error(
        "Ring signed URL creation failed:",
        signedError.message
      );

      return NextResponse.json(
        { error: "Could not create ring image URLs" },
        { status: 500 }
      );
    }

    const signedByPath = new Map(
      (signedFiles ?? []).map((item) => [
        item.path,
        {
          url: item.signedUrl ?? null,
          error: item.error ?? null,
        },
      ])
    );

    const rings = imageFiles.map((file, index) => {
      const path = paths[index];
      const signed = signedByPath.get(path);

      return {
        file: file.name,
        url: signed?.url ?? null,
        error: signed?.error ?? null,
      };
    });

    return NextResponse.json(
      {
        count: rings.length,
        rings,
      },
      {
        headers: {
          // The signed URLs expire after one hour.
          // Keep the browser cache shorter than that.
          "Cache-Control": "private, max-age=300",
        },
      }
    );
  } catch (error) {
    console.error("Ring API error:", error);

    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
