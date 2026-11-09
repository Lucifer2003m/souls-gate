import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function reply(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", Pragma: "no-cache" },
  });
}

function hashVoterId(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export async function GET() {
  const { data, error } = await supabaseServer.rpc("get_armor_vote_summary");
  if (error) {
    return reply({ success: false, error: "خلاصهٔ رأی‌ها دریافت نشد. ابتدا SQL فایل armor-votes.sql را در Supabase اجرا کن.", details: error.message }, 500);
  }

  const ratings: Record<string, { count: number; average: number }> = {};
  for (const row of (data ?? []) as Array<{ armor_set_id: string; vote_count: number | string; average_rating: number | string }>) {
    ratings[row.armor_set_id] = {
      count: Number(row.vote_count) || 0,
      average: Math.round((Number(row.average_rating) || 0) * 100) / 100,
    };
  }
  return reply({ success: true, ratings });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reply({ success: false, error: "بدنهٔ درخواست JSON معتبر نیست." }, 400);
  }

  if (!body || typeof body !== "object") return reply({ success: false, error: "اطلاعات رأی ناقص است." }, 400);
  const input = body as { setId?: unknown; rating?: unknown; voterId?: unknown };
  const setId = typeof input.setId === "string" ? input.setId.trim() : "";
  const rating = Number(input.rating);
  const voterId = typeof input.voterId === "string" ? input.voterId.trim() : "";

  if (!setId || setId.length > 180 || !/^[a-zA-Z0-9][a-zA-Z0-9 _.:()'!-]{0,179}$/.test(setId)) {
    return reply({ success: false, error: "شناسهٔ ست معتبر نیست." }, 400);
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return reply({ success: false, error: "امتیاز باید عددی بین ۱ تا ۵ باشد." }, 400);
  }
  if (!/^[0-9a-f-]{36}$/i.test(voterId)) {
    return reply({ success: false, error: "شناسهٔ ناشناس معتبر نیست؛ صفحه را تازه‌سازی کن." }, 400);
  }

  const voterHash = hashVoterId(voterId);
  const { error: upsertError } = await supabaseServer
    .from("armor_votes")
    .upsert(
      { armor_set_id: setId, voter_hash: voterHash, rating, updated_at: new Date().toISOString() },
      { onConflict: "armor_set_id,voter_hash" }
    );

  if (upsertError) {
    return reply({ success: false, error: "ثبت رأی در Supabase انجام نشد. ساختار جدول و دسترسی سرور را بررسی کن.", details: upsertError.message }, 500);
  }

  const { data: summaryData, error: summaryError } = await supabaseServer.rpc("get_armor_vote_summary");
  if (summaryError) return reply({ success: true, summary: null, summaryWarning: "رأی ذخیره شد اما دریافت آمار تازه ناموفق بود." });

  const summaryRow = ((summaryData ?? []) as Array<{ armor_set_id: string; vote_count: number | string; average_rating: number | string }>).find((row) => row.armor_set_id === setId);
  const summary = summaryRow ? {
    count: Number(summaryRow.vote_count) || 0,
    average: Math.round((Number(summaryRow.average_rating) || 0) * 100) / 100,
  } : { count: 0, average: 0 };
  return reply({ success: true, summary });
}
