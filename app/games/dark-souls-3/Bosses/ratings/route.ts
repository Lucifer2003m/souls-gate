import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const BOSS_IDS = new Set([
  "gundyr", "vordt", "greatwood", "sage", "deacons", "watchers", "wolnir",
  "old-demon-king", "pontiff", "yhorm", "aldrich", "dancer", "dragonslayer",
  "oceiros", "champion-gundyr", "ancient-wyvern", "nameless-king", "soul-of-cinder",
  "champion-gravetender", "friede", "demon-prince", "halflight", "midir", "gael",
]);


function reply(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Pragma: "no-cache",
    },
  });
}

function hashVoterId(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

type SummaryRow = {
  boss_id: string;
  vote_count: number | string;
  average_rating: number | string;
};

function mapSummaries(rows: SummaryRow[]) {
  const ratings: Record<string, { count: number; average: number }> = {};
  for (const row of rows) {
    ratings[row.boss_id] = {
      count: Number(row.vote_count) || 0,
      average: Math.round((Number(row.average_rating) || 0) * 10) / 10,
    };
  }
  return ratings;
}

export async function GET() {
  const { data, error } = await supabaseServer.rpc("get_boss_difficulty_summary");
  if (error) {
    return reply({
      success: false,
      error: "دریافت رأی‌های سختی باس‌ها انجام نشد. ابتدا SQL مربوط به boss-difficulty-votes.sql را در Supabase اجرا کن.",
      details: error.message,
    }, 500);
  }
  return reply({ success: true, ratings: mapSummaries((data ?? []) as SummaryRow[]) });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reply({ success: false, error: "بدنهٔ درخواست JSON معتبر نیست." }, 400);
  }

  if (!body || typeof body !== "object") {
    return reply({ success: false, error: "اطلاعات رأی ناقص است." }, 400);
  }

  const input = body as { bossId?: unknown; rating?: unknown; voterId?: unknown };
  const bossId = typeof input.bossId === "string" ? input.bossId.trim() : "";
  const rating = Number(input.rating);
  const voterId = typeof input.voterId === "string" ? input.voterId.trim() : "";

  if (!BOSS_IDS.has(bossId)) {
    return reply({ success: false, error: "شناسهٔ باس معتبر نیست." }, 400);
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
    return reply({ success: false, error: "درجهٔ سختی باید عددی بین ۱ تا ۱۰ باشد." }, 400);
  }
  if (!/^[0-9a-f-]{36}$/i.test(voterId)) {
    return reply({ success: false, error: "شناسهٔ ناشناس معتبر نیست؛ صفحه را تازه‌سازی کن." }, 400);
  }

  const voterHash = hashVoterId(voterId);
  const { error: upsertError } = await supabaseServer
    .from("boss_difficulty_votes")
    .upsert(
      {
        boss_id: bossId,
        voter_hash: voterHash,
        rating,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "boss_id,voter_hash" },
    );

  if (upsertError) {
    return reply({
      success: false,
      error: "ثبت رأی در Supabase انجام نشد. ساختار جدول و دسترسی سرور را بررسی کن.",
      details: upsertError.message,
    }, 500);
  }

  const { data, error } = await supabaseServer.rpc("get_boss_difficulty_summary");
  if (error) return reply({ success: true, summary: null, summaryWarning: "رأی ذخیره شد اما دریافت آمار تازه ناموفق بود." });

  const summary = mapSummaries((data ?? []) as SummaryRow[])[bossId] ?? { count: 0, average: 0 };
  return reply({ success: true, summary });
}
