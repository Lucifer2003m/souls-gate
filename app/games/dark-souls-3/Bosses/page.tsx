"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Boss = {
  id: string; name: string; subtitle: string;
  category: "main" | "optional" | "dlc";
  location: string; description: string; color: string;
};

const bosses: Boss[] = [
  { id: "gundyr", name: "Iudex Gundyr", subtitle: "THE FIRST JUDGE", category: "main", location: "Cemetery of Ash", description: "The first trial awaiting an Ashen One.", color: "#747d83" },
  { id: "vordt", name: "Vordt of the Boreal Valley", subtitle: "THE COLD EXECUTIONER", category: "main", location: "High Wall of Lothric", description: "A knight consumed by the cold of the Boreal Valley.", color: "#91a6bd" },
  { id: "greatwood", name: "Curse-Rotted Greatwood", subtitle: "THE ROTTEN CURSE", category: "optional", location: "Undead Settlement", description: "An ancient tree worshipped by the Undead.", color: "#87915a" },
  { id: "sage", name: "Crystal Sage", subtitle: "MASTER OF CRYSTALS", category: "main", location: "Road of Sacrifices", description: "A sorcerer wielding the power of crystal.", color: "#9a8bd5" },
  { id: "deacons", name: "Deacons of the Deep", subtitle: "THE DEEP CONGREGATION", category: "main", location: "Cathedral of the Deep", description: "A congregation protecting an ancient secret.", color: "#9c5555" },
  { id: "watchers", name: "Abyss Watchers", subtitle: "THE LEGION OF THE ABYSS", category: "main", location: "Farron Keep", description: "Warriors bound together by the blood of the wolf.", color: "#8c684c" },
  { id: "wolnir", name: "High Lord Wolnir", subtitle: "THE FALLEN MONARCH", category: "main", location: "Catacombs of Carthus", description: "A fallen lord swallowed by the abyss.", color: "#b0a17f" },
  { id: "old-demon-king", name: "Old Demon King", subtitle: "THE LAST OF HIS KIND", category: "optional", location: "Smouldering Lake", description: "An ancient demon guarding the embers of a dying age.", color: "#c46d3b" },
  { id: "pontiff", name: "Pontiff Sulyvahn", subtitle: "THE PROFANE PONTIFF", category: "main", location: "Irithyll of the Boreal Valley", description: "A tyrant wielding two blades of opposing power.", color: "#8b74a7" },
  { id: "yhorm", name: "Yhorm the Giant", subtitle: "THE LONELY GIANT", category: "main", location: "Profaned Capital", description: "A giant lord whose fate is tied to a forgotten promise.", color: "#777d82" },
  { id: "aldrich", name: "Aldrich, Devourer of Gods", subtitle: "THE DEVOURER", category: "main", location: "Anor Londo", description: "A saint who dreams of consuming the gods.", color: "#6f8d9e" },
  { id: "dancer", name: "Dancer of the Boreal Valley", subtitle: "THE SILENT DANCE", category: "main", location: "Lothric Castle", description: "A graceful and deadly knight of the Boreal Valley.", color: "#8c719d" },
  { id: "dragonslayer", name: "Dragonslayer Armour", subtitle: "THE ABANDONED GUARDIAN", category: "main", location: "Lothric Castle", description: "An empty suit of armour animated by an old duty.", color: "#9c8061" },
  { id: "oceiros", name: "Oceiros, the Consumed King", subtitle: "THE CONSUMED KING", category: "optional", location: "Consumed King's Garden", description: "A king driven to madness by his obsession.", color: "#8b9b9c" },
  { id: "champion-gundyr", name: "Champion Gundyr", subtitle: "THE UNKINDLED CHAMPION", category: "optional", location: "Untended Graves", description: "A fallen champion who never fulfilled his purpose.", color: "#858585" },
  { id: "ancient-wyvern", name: "Ancient Wyvern", subtitle: "THE ANCIENT BEAST", category: "main", location: "Archdragon Peak", description: "A colossal guardian of the ancient dragons.", color: "#8c9c83" },
  { id: "nameless-king", name: "Nameless King", subtitle: "THE GOD OF WAR", category: "optional", location: "Archdragon Peak", description: "A forgotten god who rides into the storm.", color: "#a4b5c4" },
  { id: "soul-of-cinder", name: "Soul of Cinder", subtitle: "THE FIRST FLAME", category: "main", location: "Kiln of the First Flame", description: "The embodiment of those who linked the First Flame.", color: "#d17a40" },
  { id: "champion-gravetender", name: "Champion's Gravetender", subtitle: "THE GRAVEKEEPER", category: "dlc", location: "Painted World of Ariandel", description: "A gravekeeper and a loyal companion of the depths.", color: "#8d9ba6" },
  { id: "friede", name: "Sister Friede", subtitle: "THE ASHEN SISTER", category: "dlc", location: "Painted World of Ariandel", description: "A mysterious sister hiding a terrible resolve.", color: "#b8b8c4" },
  { id: "demon-prince", name: "Demon Prince", subtitle: "THE LAST DEMONS", category: "dlc", location: "The Dreg Heap", description: "The remnants of a dying demonic age.", color: "#c85b37" },
  { id: "halflight", name: "Halflight, Spear of the Church", subtitle: "THE SACRED DEFENDER", category: "dlc", location: "The Ringed City", description: "The guardian of a sacred and ancient covenant.", color: "#9d87ad" },
  { id: "midir", name: "Darkeater Midir", subtitle: "THE ETERNAL DRAGON", category: "dlc", location: "The Ringed City", description: "An ancient dragon who has consumed the dark for ages.", color: "#718a94" },
  { id: "gael", name: "Slave Knight Gael", subtitle: "THE END OF THE WORLD", category: "dlc", location: "Filianore's Rest", description: "A slave knight pursuing the blood of the Dark Soul.", color: "#a35a49" },
];

const filters = [
  { id: "all", label: "همهٔ باس‌ها" }, { id: "main", label: "اصلی" },
  { id: "optional", label: "اختیاری" }, { id: "dlc", label: "DLC" },
] as const;
const categoryLabels: Record<Boss["category"], string> = { main: "باس اصلی", optional: "باس اختیاری", dlc: "باس DLC" };
const STORAGE_KEY = "souls-gate-ds3-defeated-bosses";
const VOTES_STORAGE_KEY = "souls-gate:ds3-boss-difficulty-votes-v1";
const VOTER_STORAGE_KEY = "souls-gate:ds3-boss-anonymous-voter-v1";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let browserSupabase: SupabaseClient | null = null;

function getBrowserSupabase(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("تنظیمات عمومی Supabase پیدا نشد. NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY را در .env.local تنظیم کن.");
  }
  if (!browserSupabase) browserSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return browserSupabase;
}

type RatingSummary = { count: number; average: number };
type RatingMap = Record<string, RatingSummary>;
type MyVotes = Record<string, number>;

type RatingSummaryRow = {
  boss_id: string;
  vote_count: number | string;
  average_rating: number | string;
};

function mapSummaryRows(rows: unknown): RatingMap {
  const result: RatingMap = {};
  if (!Array.isArray(rows)) return result;
  for (const item of rows) {
    if (!item || typeof item !== "object") continue;
    const row = item as RatingSummaryRow;
    if (typeof row.boss_id !== "string") continue;
    result[row.boss_id] = {
      count: Number(row.vote_count) || 0,
      average: Math.round((Number(row.average_rating) || 0) * 10) / 10,
    };
  }
  return result;
}

function getVoterId(): string {
  try {
    const existing = window.localStorage.getItem(VOTER_STORAGE_KEY);
    if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
    const created = window.crypto?.randomUUID?.();
    if (created) {
      window.localStorage.setItem(VOTER_STORAGE_KEY, created);
      return created;
    }
  } catch {
    // Use a temporary identity if browser storage is unavailable.
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => { const random = Math.floor(Math.random() * 16); return (char === "x" ? random : (random & 0x3) | 0x8).toString(16); });
}


function difficultyColor(value: number) {
  const colors = [
    "#63c96b", // 1: سبز روشن
    "#43b95b", // 2: سبز
    "#269447", // 3: سبز تیره
    "#b7c943", // 4: لیمویی
    "#e0c341", // 5: زرد
    "#d9a52e", // 6: طلایی
    "#e58a32", // 7: نارنجی
    "#d9652f", // 8: نارنجی تیره
    "#d6453d", // 9: قرمز
    "#a91f2c", // 10: قرمز تیره
  ];
  const safeValue = Math.min(10, Math.max(1, Math.round(value || 1)));
  return colors[safeValue - 1];
}

function difficultyLabel(value: number) {
  if (value <= 3) return "آسان";
  if (value <= 6) return "متوسط";
  if (value <= 8) return "سخت";
  return "بسیار سخت";
}

function DifficultyPicker({ value, onRate, disabled = false }: {
  value: number;
  onRate: (rating: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="difficulty-picker" role="group" aria-label="انتخاب درجهٔ سختی از ۱ تا ۱۰" dir="ltr">
      {Array.from({ length: 10 }, (_, index) => {
        const rating = index + 1;
        return (
          <button
            key={rating}
            type="button"
            className={rating <= value ? "difficulty-choice is-selected" : "difficulty-choice"}
            style={rating <= value ? {
              "--difficulty-color": difficultyColor(rating),
              borderColor: difficultyColor(rating),
              color: "#100b05",
              background: difficultyColor(rating),
            } as React.CSSProperties : { "--difficulty-color": difficultyColor(rating) } as React.CSSProperties}
            onClick={() => onRate(rating)}
            disabled={disabled}
            aria-label={`سختی ${rating} از ۱۰`}
            aria-pressed={value === rating}
            title={`${rating} از ۱۰`}
          >{rating}</button>
        );
      })}
    </div>
  );
}

export default function BossesPage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [defeated, setDefeated] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [ratings, setRatings] = useState<RatingMap>({});
  const [myVotes, setMyVotes] = useState<MyVotes>({});
  const [voterId, setVoterId] = useState("");
  const [ratingBusy, setRatingBusy] = useState<string | null>(null);
  const [ratingError, setRatingError] = useState("");
  const [ratingNotice, setRatingNotice] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setDefeated(parsed.filter((id): id is string => typeof id === "string" && bosses.some((boss) => boss.id === id)));
      }
    } catch { /* Ignore invalid saved progress. */ }
    finally { setReady(true); }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(defeated)); }
    catch { /* The page remains usable if browser storage is unavailable. */ }
  }, [defeated, ready]);

  useEffect(() => {
    let cancelled = false;
    const id = getVoterId();
    setVoterId(id);
    try {
      const savedVotes = localStorage.getItem(VOTES_STORAGE_KEY);
      if (savedVotes) {
        const parsed: unknown = JSON.parse(savedVotes);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const valid: MyVotes = {};
          for (const [bossId, value] of Object.entries(parsed)) {
            if (bosses.some((boss) => boss.id === bossId) && Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 10) valid[bossId] = Number(value);
          }
          setMyVotes(valid);
        }
      }
    } catch { /* Ignore invalid local vote preferences. */ }

    (async () => {
      try {
        const supabase = getBrowserSupabase();
        const { data, error } = await supabase.rpc("get_boss_difficulty_summary");
        if (error) throw error;
        if (!cancelled) setRatings(mapSummaryRows(data));
      } catch (error) {
        if (!cancelled) setRatingError(error instanceof Error ? error.message : "دریافت رأی‌های کاربران ناموفق بود.");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function submitDifficulty(bossId: string, rating: number) {
    if (!voterId || ratingBusy) return;
    setRatingBusy(bossId);
    setRatingError("");
    setRatingNotice("");
    try {
      const supabase = getBrowserSupabase();
      const { data, error } = await supabase.rpc("submit_boss_difficulty_vote", {
        p_boss_id: bossId,
        p_rating: rating,
        p_voter_id: voterId,
      });
      if (error) throw new Error(error.message);
      const nextVotes = { ...myVotes, [bossId]: rating };
      setMyVotes(nextVotes);
      try { localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(nextVotes)); }
      catch { /* The database vote remains saved even if local storage is blocked. */ }
      const savedSummary = Array.isArray(data) ? data[0] : data;
      if (savedSummary && typeof savedSummary === "object" && "vote_count" in savedSummary) {
        setRatings((current) => ({
          ...current,
          [bossId]: {
            count: Number(savedSummary.vote_count) || 0,
            average: Math.round((Number(savedSummary.average_rating) || 0) * 10) / 10,
          },
        }));
      } else {
        const { data: refreshed, error: refreshError } = await supabase.rpc("get_boss_difficulty_summary");
        if (refreshError) throw new Error(refreshError.message);
        setRatings(mapSummaryRows(refreshed));
      }
      setRatingNotice("رأی سختی تو ثبت شد. ممنون از مشارکتت!");
    } catch (error) {
      setRatingError(error instanceof Error ? error.message : "ثبت رأی انجام نشد.");
    } finally {
      setRatingBusy(null);
    }
  }

  useEffect(() => {
    if (!selectedBoss) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setSelectedBoss(null); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [selectedBoss]);

  const visibleBosses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return bosses.filter((boss) => (filter === "all" || boss.category === filter) && (!query || boss.name.toLocaleLowerCase().includes(query) || boss.location.toLocaleLowerCase().includes(query) || boss.subtitle.toLocaleLowerCase().includes(query)));
  }, [filter, search]);

  function toggleDefeated(id: string) {
    setDefeated((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }
  const progress = Math.round((defeated.length / bosses.length) * 100);

  return (
    <main className="boss-page" dir="rtl">
      <header className="archive-header">
        <span className="archive-eyebrow">DARK SOULS III · FIELD RECORDS</span>
        <div className="header-ornament" aria-hidden="true">✦ ━━━━━━━━━ ◆ ━━━━━━━━━ ✦</div>
        <h1>آرشیو باس‌ها</h1>
        <p>پروندهٔ نگهبانان، اربابان و ارواح جهان خاکستر</p>
        <div className="header-stats">
          <div><strong>{bosses.length}</strong><span>باس در آرشیو</span></div><span className="stat-divider" />
          <div><strong>{defeated.length}</strong><span>شکست‌داده‌شده</span></div><span className="stat-divider" />
          <div><strong>{progress}%</strong><span>پیشرفت</span></div>
        </div>
        <div className="progress-track" aria-label={`پیشرفت ${progress} درصد`}><span style={{ width: `${progress}%` }} /></div>
      </header>

      <section className="archive-content" aria-label="فهرست باس‌ها">
        <div className="archive-tools">
          <div className="filter-tabs" aria-label="فیلتر باس‌ها">
            {filters.map((item) => <button type="button" key={item.id} className={filter === item.id ? "filter-active" : ""} onClick={() => setFilter(item.id)} aria-pressed={filter === item.id}>{item.label}</button>)}
          </div>
          <label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جست‌وجوی باس یا منطقه..." aria-label="جست‌وجوی باس یا منطقه" />{search && <button type="button" onClick={() => setSearch("")} aria-label="پاک کردن جست‌وجو">×</button>}</label>
        </div>
        <div className="archive-caption"><span>RECORDS OF THE FALLEN</span><span>{visibleBosses.length} پرونده</span></div>
        {ratingError && <p className="rating-message rating-error" role="status">{ratingError} اگر جدول رأی‌ها را هنوز در Supabase نساخته‌ای، ابتدا فایل SQL را اجرا کن.</p>}
        {ratingNotice && <p className="rating-message" role="status">{ratingNotice}</p>}
        <div className="boss-grid">
          {visibleBosses.map((boss) => {
            const isDefeated = defeated.includes(boss.id);
            const number = String(bosses.findIndex((item) => item.id === boss.id) + 1).padStart(2, "0");
            const initials = boss.name.split(/[\s,]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("");
            return <article key={boss.id} className={`boss-card ${isDefeated ? "boss-defeated" : ""}`} style={{ "--boss-color": boss.color } as React.CSSProperties}>
              <button type="button" className="boss-card-main" onClick={() => setSelectedBoss(boss)} aria-label={`نمایش جزئیات ${boss.name}`}>
                <div className="boss-art"><span className="art-halo" /><span className="art-sigil" aria-hidden="true">✦</span><span className="art-monogram" aria-hidden="true">{initials}</span><span className="boss-number">{number}</span>{isDefeated && <span className="defeated-stamp">DEFEATED</span>}<span className="boss-category">{categoryLabels[boss.category]}</span></div>
                <div className="boss-info"><span className="boss-subtitle">{boss.subtitle}</span><h2>{boss.name}</h2><span className="boss-location">⌖ {boss.location}</span><span className="card-bottom">مشاهدهٔ پرونده <span aria-hidden="true">↗</span></span></div>
              </button>
              <div className="card-actions">
                <div className="difficulty-summary">
                  <span>سختی از دید کاربران</span>
                  <strong style={ratings[boss.id]?.count ? { color: difficultyColor(ratings[boss.id].average) } : undefined}>
                    {ratings[boss.id]?.count ? `${ratings[boss.id].average.toFixed(1)} / 10 · ${difficultyLabel(ratings[boss.id].average)}` : "هنوز رأیی ثبت نشده"}
                  </strong>
                  <small>{ratings[boss.id]?.count ? `${ratings[boss.id].count} رأی` : "اولین نفر باش"}</small>
                </div>
                <DifficultyPicker value={myVotes[boss.id] ?? 0} onRate={(rating) => void submitDifficulty(boss.id, rating)} disabled={ratingBusy !== null} />
                <span className="difficulty-hint">{myVotes[boss.id] ? `رأی تو: ${myVotes[boss.id]} از ۱۰ · برای تغییر، عدد دیگری بزن` : "سختی این باس را از ۱ تا ۱۰ انتخاب کن"}</span>
                <button type="button" className={`defeated-button ${isDefeated ? "is-defeated" : ""}`} onClick={() => toggleDefeated(boss.id)} aria-pressed={isDefeated}>{isDefeated ? "✓ شکست داده شد" : "ثبت شکست باس"}</button>
              </div>
            </article>;
          })}
        </div>
        {visibleBosses.length === 0 && <div className="empty-state"><span aria-hidden="true">☽</span><h2>باسی پیدا نشد</h2><p>عبارت جست‌وجو یا فیلتر انتخاب‌شده را تغییر بده.</p><button type="button" onClick={() => { setSearch(""); setFilter("all"); }}>نمایش همهٔ باس‌ها</button></div>}
      </section>

      <footer className="archive-footer"><span>SOULS GATE</span><span>IN THE AGE OF FIRE, NOTHING LASTS FOREVER</span><span aria-hidden="true">✦</span></footer>

      {selectedBoss && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedBoss(null); }}>
        <section className="boss-modal" role="dialog" aria-modal="true" aria-labelledby="boss-modal-title">
          <button type="button" className="modal-close" onClick={() => setSelectedBoss(null)} aria-label="بستن پرونده">×</button>
          <div className="modal-art" style={{ "--boss-color": selectedBoss.color } as React.CSSProperties}><span className="modal-sigil" aria-hidden="true">✦</span><span className="modal-monogram" aria-hidden="true">{selectedBoss.name.split(/[\s,]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("")}</span><span className="modal-art-caption">BOSS DOSSIER</span></div>
          <div className="modal-content"><span className="boss-subtitle">{selectedBoss.subtitle}</span><h2 id="boss-modal-title">{selectedBoss.name}</h2><span className="boss-location">⌖ {selectedBoss.location}</span><div className="modal-divider" /><h3>دربارهٔ باس</h3><p>{selectedBoss.description}</p><div className="modal-detail"><span>دسته‌بندی</span><strong>{categoryLabels[selectedBoss.category]}</strong></div><div className="modal-detail"><span>میانگین سختی کاربران</span><strong style={ratings[selectedBoss.id]?.count ? { color: difficultyColor(ratings[selectedBoss.id].average) } : undefined}>{ratings[selectedBoss.id]?.count ? `${ratings[selectedBoss.id].average.toFixed(1)} / 10 · ${difficultyLabel(ratings[selectedBoss.id].average)} · ${ratings[selectedBoss.id].count} رأی` : "هنوز رأیی ثبت نشده"}</strong></div><h3 className="modal-rating-title">سختی این باس از نظر تو</h3><DifficultyPicker value={myVotes[selectedBoss.id] ?? 0} onRate={(rating) => void submitDifficulty(selectedBoss.id, rating)} disabled={ratingBusy !== null} /><p className="difficulty-hint modal-rating-hint">{myVotes[selectedBoss.id] ? `رأی فعلی تو ${myVotes[selectedBoss.id]} از ۱۰ است؛ می‌توانی تغییرش بدهی.` : "یک عدد از ۱ (آسان) تا ۱۰ (بسیار سخت) انتخاب کن."}</p><p className="modal-note">این پرونده فعلاً شامل اطلاعات پایه است؛ جزئیات مبارزه، مقاومت‌ها، نقاط ضعف، پاداش‌ها و تصاویر اختصاصی هنوز اضافه نشده‌اند.</p><button type="button" className="modal-defeated-button" onClick={() => toggleDefeated(selectedBoss.id)}>{defeated.includes(selectedBoss.id) ? "✓ این باس را شکست داده‌ام" : "ثبت به‌عنوان باس شکست‌داده‌شده"}</button></div>
        </section>
      </div>}

      <style jsx global>{`
        .boss-page{--sg-gold:#c8a15b;min-height:100vh;padding:54px clamp(14px,4vw,64px) 30px;overflow:clip;color:#e9e0d0;background:radial-gradient(ellipse at 50% 0%,#332217 0%,transparent 38%),#090908;font-family:inherit}
        .archive-header{max-width:850px;margin:0 auto 38px;text-align:center}.archive-eyebrow{color:#a78651;font:10px Georgia,serif;letter-spacing:3px;direction:ltr;display:inline-block}.header-ornament{margin:14px auto;color:#765b37;font-size:10px;letter-spacing:2px;direction:ltr}.archive-header h1{margin:0;color:#e2c18a;font:400 clamp(28px,4vw,44px) Georgia,serif}.archive-header>p{margin:12px 0 22px;color:#a49a89;font-size:13px}
        .header-stats{display:flex;align-items:center;justify-content:center;gap:clamp(18px,4vw,52px);margin-top:24px}.header-stats>div{display:flex;flex-direction:column;gap:5px}.header-stats strong{color:#d8b67d;font:400 25px Georgia,serif}.header-stats span:not(.stat-divider){color:#938878;font-size:11px}.stat-divider{width:1px;height:34px;background:linear-gradient(transparent,#8b6a3d,transparent)}.progress-track{width:min(340px,80%);height:3px;margin:18px auto 0;overflow:hidden;background:#2a2118}.progress-track span{display:block;height:100%;background:var(--sg-gold);transition:width .25s ease}
        .archive-content{max-width:1450px;margin:0 auto}.archive-tools{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;margin-bottom:24px;padding:15px 0;border-block:1px solid #3a3024}.filter-tabs{display:flex;flex-wrap:wrap;gap:8px}.filter-tabs button{padding:9px 15px;border:1px solid #393025;border-radius:2px;color:#a59a89;background:#0c0b09;font:inherit;font-size:12px;cursor:pointer;transition:.2s}.filter-tabs button:hover,.filter-tabs .filter-active{border-color:#947345;color:#e3c18a;background:#261b11}.search-box{display:flex;min-width:min(100%,270px);align-items:center;gap:8px;padding:0 12px;border:1px solid #393025;color:#bfa16c;background:#0a0908}.search-box>span{font-size:23px}.search-box input{width:100%;min-height:40px;border:0;outline:0;color:#e5d8c5;background:transparent;font:inherit;font-size:12px}.search-box input::placeholder{color:#70685d}.search-box button{border:0;color:#bfa16c;background:transparent;font-size:20px;cursor:pointer}.archive-caption{display:flex;justify-content:space-between;margin-bottom:13px;color:#87775f;font-size:10px}.archive-caption span:first-child{direction:ltr;font-family:Georgia,serif;letter-spacing:2px}
        .boss-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}.boss-card{min-width:0;overflow:hidden;border:1px solid #493927;background:linear-gradient(180deg,#14110e,#0b0a09);box-shadow:0 10px 30px #0004;transition:border-color .25s,transform .25s,box-shadow .25s}.boss-card:hover{transform:translateY(-3px);border-color:#a9844f;box-shadow:0 14px 35px #0008}.boss-card-main{display:block;width:100%;padding:0;border:0;color:inherit;background:transparent;text-align:right;cursor:pointer}.boss-art{position:relative;display:flex;height:190px;align-items:center;justify-content:center;overflow:hidden;isolation:isolate;background:radial-gradient(ellipse at 50% 38%,color-mix(in srgb,var(--boss-color) 42%,transparent),transparent 48%),linear-gradient(155deg,#20201d,#0c0c0b 62%,#21160f)}.boss-art:before{position:absolute;z-index:-1;inset:0;content:"";opacity:.45;background:repeating-linear-gradient(0deg,transparent 0 22px,#d7c7a308 23px 24px)}.art-halo{position:absolute;top:14%;left:50%;width:145px;height:145px;transform:translateX(-50%);border:1px solid color-mix(in srgb,var(--boss-color) 60%,transparent);border-radius:50%;opacity:.5;box-shadow:inset 0 0 30px #0008;transition:transform .4s,opacity .4s}.boss-card:hover .art-halo{transform:translateX(-50%) scale(1.08);opacity:.85}.art-sigil{position:absolute;top:19%;color:var(--boss-color);font-size:24px;opacity:.65}.art-monogram{position:relative;z-index:1;color:color-mix(in srgb,var(--boss-color) 65%,#e2d4bb);font:clamp(48px,4vw,70px) Georgia,serif;letter-spacing:4px;text-shadow:0 4px 18px #000,0 0 30px var(--boss-color);opacity:.8;direction:ltr}.boss-number{position:absolute;top:11px;left:11px;color:#d1b581;font:12px Georgia,serif;direction:ltr}.boss-category{position:absolute;right:11px;bottom:11px;padding:5px 8px;border:1px solid #b99a6540;color:#d8bd8c;background:#080706d9;font-size:10px}.defeated-stamp{position:absolute;top:11px;right:11px;padding:5px 7px;border:1px solid #c8a15b90;color:#f0d29a;background:#100c08e8;font:9px Georgia,serif;letter-spacing:1px;direction:ltr}.boss-defeated .boss-art{box-shadow:inset 0 0 0 2px #c8a15b55}
        .boss-info{padding:15px 14px 10px}.boss-subtitle{color:#b08a51;font:9px Georgia,serif;letter-spacing:1px;direction:ltr;display:inline-block}.boss-info h2{min-height:46px;margin:8px 0;color:#e3d7c4;font:400 16px/1.45 Georgia,serif;direction:ltr;text-align:left}.boss-location{display:block;color:#8c8477;font-size:11px}.card-bottom{display:flex;align-items:center;justify-content:space-between;margin-top:14px;padding-top:11px;border-top:1px solid #34291e;color:#a68a60;font-size:11px}.card-bottom span{font-size:17px;direction:ltr}.card-actions{display:flex;flex-direction:column;gap:11px;padding:11px 14px 14px;border-top:1px solid #2c241b;background:#0a0908}.difficulty-summary{display:flex;align-items:center;justify-content:space-between;gap:6px;color:#938878;font-size:10px}.difficulty-summary strong{color:#d8b67d;font-size:12px;font-weight:500}.difficulty-summary small{color:#827565;font-size:9px}.difficulty-picker{display:flex;justify-content:space-between;gap:3px;direction:ltr}.difficulty-choice{flex:1;min-width:0;padding:5px 0;border:1px solid #51432f;border-radius:2px;color:#a99b83;background:#100d09;font:10px Georgia,serif;cursor:pointer;transition:background .15s,border-color .15s,color .15s}.difficulty-choice:hover{border-color:var(--difficulty-color);color:var(--difficulty-color)}.difficulty-choice.is-selected{box-shadow:0 0 9px color-mix(in srgb,var(--difficulty-color) 30%,transparent);font-weight:700}.difficulty-choice:disabled{cursor:wait;opacity:.55}.difficulty-hint{display:block;color:#857765;font-size:9px;line-height:1.7}.rating-message{max-width:1450px;margin:-10px auto 18px;padding:10px 12px;border:1px solid #5a482d;color:#d8bd8c;background:#191209;font-size:12px}.rating-error{border-color:#73453a;color:#d9a08e}.modal-rating-title{margin-top:18px!important}.modal-rating-hint{margin:8px 0 12px;text-align:right}.defeated-button,.modal-defeated-button{min-height:36px;border:1px solid #57442d;color:#b8a17d;background:#17110b;font:inherit;font-size:11px;cursor:pointer;transition:.2s}.defeated-button:hover,.defeated-button.is-defeated,.modal-defeated-button:hover{border-color:#c8a15b;color:#f0d7a3;background:#30200e}
        .empty-state{padding:65px 20px;color:#a39782;text-align:center}.empty-state>span{color:#b28b50;font-size:34px}.empty-state h2{color:#e1d1b8;font-weight:400}.empty-state p{font-size:12px}.empty-state button{padding:9px 14px;border:1px solid #705431;color:#e6c993;background:#25190d;cursor:pointer}.archive-footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;max-width:1450px;margin:45px auto 0;padding-top:18px;border-top:1px solid #33271b;color:#776349;font:9px Georgia,serif;letter-spacing:2px;direction:ltr}.archive-footer span:last-child{color:#c8a15b}
        .modal-backdrop{position:fixed;z-index:1000;inset:0;display:flex;align-items:center;justify-content:center;overflow-y:auto;padding:18px;background:#020202ed;backdrop-filter:blur(7px)}.boss-modal{position:relative;display:grid;width:min(800px,100%);max-height:90vh;grid-template-columns:.8fr 1.2fr;overflow-y:auto;border:1px solid #705431;background:#0e0c09;box-shadow:0 20px 100px #000;direction:ltr}.modal-close{position:absolute;z-index:2;top:9px;right:9px;width:35px;height:35px;border:1px solid #6a5233;color:#e1c28d;background:#0a0908e8;font-size:24px;cursor:pointer}.modal-art{position:relative;display:flex;min-height:350px;align-items:center;justify-content:center;overflow:hidden;background:radial-gradient(ellipse at 50% 40%,color-mix(in srgb,var(--boss-color) 42%,transparent),transparent 50%),linear-gradient(155deg,#24201a,#0b0a09 70%)}.modal-art:before{position:absolute;inset:18px;content:"";border:1px solid #c8a15b50}.modal-sigil{position:absolute;top:27%;color:var(--boss-color);font-size:38px}.modal-monogram{color:color-mix(in srgb,var(--boss-color) 70%,#e7d8bd);font:80px Georgia,serif;text-shadow:0 0 35px var(--boss-color)}.modal-art-caption{position:absolute;bottom:30px;color:#a78a5a;font:10px Georgia,serif;letter-spacing:3px}.modal-content{padding:42px 28px 28px;direction:rtl}.modal-content h2{margin:10px 0;color:#e6d4b6;font:400 clamp(22px,3vw,30px) Georgia,serif;direction:ltr;text-align:right}.modal-divider{height:1px;margin:20px 0;background:linear-gradient(90deg,transparent,#8b673c,transparent)}.modal-content h3{color:#d0af76;font-size:14px;font-weight:400}.modal-content>p{color:#a49a89;font-size:12px;line-height:2}.modal-detail{display:flex;justify-content:space-between;gap:15px;padding:12px 0;border-bottom:1px solid #34291e;font-size:11px}.modal-detail span{color:#8d8375}.modal-detail strong{color:#d9bd8b;font-weight:400}.modal-content .modal-note{margin-top:18px;padding:11px;border-right:2px solid #8d693b;background:#17110b;font-size:11px}.modal-defeated-button{width:100%;min-height:42px;margin-top:12px;border-color:#8e6c3e;color:#e6c993;background:#25190d}
        @media(min-width:1500px){.boss-grid{grid-template-columns:repeat(5,minmax(0,1fr))}}@media(max-width:1050px){.boss-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.boss-art{height:175px}}@media(max-width:700px){.boss-page{padding:35px 12px 22px}.archive-header{margin-bottom:27px}.archive-header>p{font-size:12px}.header-stats{gap:14px}.header-stats strong{font-size:22px}.header-stats span:not(.stat-divider){font-size:10px}.archive-tools{align-items:stretch}.filter-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.filter-tabs button{padding:9px 8px}.search-box{min-width:100%}.boss-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.boss-art{height:145px}.art-halo{width:110px;height:110px}.art-monogram{font-size:46px}.boss-info{padding:12px 10px 9px}.boss-info h2{min-height:55px;font-size:14px}.boss-location{min-height:30px;font-size:10px}.boss-subtitle{font-size:8px;letter-spacing:.5px}.boss-category{right:7px;bottom:7px;font-size:9px}.boss-number{top:8px;left:8px}.card-actions{padding:10px}.difficulty-summary{font-size:9px}.difficulty-summary strong{font-size:11px}.difficulty-choice{font-size:9px;padding:5px 0}.defeated-button{font-size:10px}.boss-modal{grid-template-columns:1fr;max-height:92vh}.modal-art{min-height:170px}.modal-art:before{inset:12px}.modal-sigil{top:18%}.modal-monogram{font-size:62px}.modal-art-caption{bottom:18px}.modal-content{padding:25px 18px 20px}.archive-footer{justify-content:center;text-align:center}}@media(max-width:360px){.boss-grid{grid-template-columns:1fr}.boss-art{height:180px}.boss-info h2{min-height:0}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}}
      `}</style>
    </main>
  );
}
