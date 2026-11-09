"use client";
import { useMemo, useState } from "react";
import { ENEMIES, CATEGORY_LABEL, type Enemy } from "./enemies-data";

export default function EnemyArchive() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Enemy["category"] | "all">("all");
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return ENEMIES.filter(
      (e) =>
        (cat === "all" || e.category === cat) &&
        (!s ||
          e.name.toLowerCase().includes(s) ||
          e.nameFa.includes(s) ||
          e.areas.some((a) => a.toLowerCase().includes(s)))
    );
  }, [q, cat]);

  return (
    <div dir="rtl" className="space-y-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="جستجوی دشمن یا منطقه..."
        className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2 text-sm"
      />
      <div className="flex flex-wrap gap-2">
        {(["all", ...Object.keys(CATEGORY_LABEL)] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c as any)}
            className={`px-3 py-1 rounded-full text-xs border ${
              cat === c ? "bg-amber-600 border-amber-500" : "border-white/20"
            }`}
          >
            {c === "all" ? "همه" : CATEGORY_LABEL[c as Enemy["category"]]}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((e) => (
          <div key={e.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <button className="w-full text-right" onClick={() => setOpen(open === e.id ? null : e.id)}>
              <div className="font-bold">{e.nameFa}</div>
              <div className="text-xs opacity-60">{e.name}</div>
            </button>
            {open === e.id && (
              <div className="mt-3 space-y-1 text-sm">
                <p>منطقه: {e.areas.join("، ")}</p>
                <p>ضعف: {e.weakTo.join("، ") || "—"}</p>
                <p>مقاومت: {e.resists.join("، ") || "—"}</p>
                <p>دراپ: {e.drops.join("، ") || "—"}</p>
                {e.souls != null && <p>سول: {e.souls}</p>}
                <p className="opacity-80">{e.notes}</p>
              </div>
            )}
          </div>
        ))}
        {list.length === 0 && <p className="opacity-60">چیزی پیدا نشد.</p>}
      </div>
    </div>
  );
}