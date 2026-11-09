

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { findWeaponRequirements } from "./weaponRequirements";
import {
  WEAPON_CATEGORIES as PERSIAN_CATEGORIES,
  canonicalWeaponName,
  getWeaponCategory,
  isExcludedWeapon,
  isReferenceWeapon,
} from "./weaponReference";

type Attribute = "strength" | "dexterity" | "intelligence" | "faith";

type Weapon = {

  id?: string;

  name?: string;

  fileName?: string;

  image?: string;

  category?: string;

  weaponType?: string;

  description?: string;

  weight?: number | string;

  requirements?: Partial<Record<Attribute, number | string>>;

  scaling?: Partial<Record<Attribute, string>>;

  attack?: Record<string, number | string>;

  attackPower?: Record<string, number | string>;

  upgradeStats?: Array<{

    level: number;

    attack?: number | string;

    physical?: number | string;

    magic?: number | string;

    fire?: number | string;

    lightning?: number | string;

    dark?: number | string;

  }>;

  location?: string;

  acquisition?: string;

  bossSoul?: boolean;

  dlc?: string;

  upgradePath?: string;

};

type ApiPayload = {

  success?: boolean;

  weapons?: Weapon[];

  data?: Weapon[];

  allWeapons?: Weapon[];

  error?: string;

};

function cleanName(w: Weapon) {
  return canonicalWeaponName(w.name || w.fileName || "سلاح بدون نام");
}

function classify(w: Weapon): string {
  return getWeaponCategory(cleanName(w));
}

function isBossSoul(w: Weapon) {

  if (typeof w.bossSoul === "boolean") return w.bossSoul;

  const n = cleanName(w).toLowerCase();

  return /vordt|dancer|abyss watchers|wolnir|pontiff|aldritch|aldrich|yhorm|dragonslayer armour|dragonslayer armor|soul of cinder|twin princes|ludex|gundyr|oceiros|champion gundyr|nameless king|old demon king|curse-rotted|crystal sage|deacons|soultransposed|boss soul/.test(

    n,

  );

}

function numeric(value: unknown): number | null {

  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (

    typeof value === "string" &&

    value.trim() &&

    Number.isFinite(Number(value))

  ) {

    return Number(value);

  }

  return null;

}

function getAttack(w: Weapon, level: number) {

  const row = w.upgradeStats?.find((x) => x.level === level);

  if (row) return row;

  const source = w.attackPower || w.attack;

  if (source) {

    const value =

      source[String(level)] ??

      source[`+${level}`] ??

      source[`level${level}`];

    if (value !== undefined) return { level, attack: value };

  }

  return null;

}

function Stars({

  value,

  onChange,

  interactive = false,

}: {

  value: number;

  onChange?: (n: number) => void;

  interactive?: boolean;

}) {

  return (

    <span className="sg-stars" aria-label={`${value} از ۵`}>

      {[1, 2, 3, 4, 5].map((n) => (

        <button

          key={n}

          type="button"

          disabled={!interactive}

          onClick={() => onChange?.(n)}

          aria-label={`${n} ستاره`}

          className={n <= value ? "sg-star active" : "sg-star"}

        >

          ★

        </button>

      ))}

    </span>

  );

}

/* نمودار با حلقه‌های دایره‌ای و چندضلعی چهارگانه */

function RequirementRadar({

  requirements,

}: {

  requirements?: Weapon["requirements"];

}) {

  const center = 150;

  const radius = 155;

  const attributes = [

    {

      key: "strength",

      label: "STRENGTH",

      fa: "قدرت",

      angle: -90,

      color: "#c9a45b",

    },

    {

      key: "dexterity",

      label: "DEXTERITY",

      fa: "چابکی",

      angle: 180,

      color: "#91c7a5",

    },

    {

      key: "faith",

      label: "FAITH",

      fa: "ایمان",

      angle: 0,

      color: "#d6a1e8",

    },

    {

      key: "intelligence",

      label: "INTELLIGENCE",

      fa: "هوش",

      angle: 90,

      color: "#8dbde8",

    },

  ] as const;

  const stats = attributes.map((attribute) => {

    const value = numeric(requirements?.[attribute.key]);

    const n = value === null ? null : Math.max(0, Math.min(99, value));

    const radians = (attribute.angle * Math.PI) / 180;

    const distance = radius * ((n ?? 0) /60);

    return {

      ...attribute,

      n,

      x: center + Math.cos(radians) * distance,

      y: center + Math.sin(radians) * distance,

      axisX: center + Math.cos(radians) * radius,

      axisY: center + Math.sin(radians) * radius,

      labelX: center + Math.cos(radians) * 125,

      labelY: center + Math.sin(radians) * 125,

    };

  });

  const hasData = stats.some((stat) => stat.n !== null);

  return (

    <div className="sg-radar-wrap">

      <svg

        className="sg-radar"

        viewBox="0 0 300 300"

        role="img"

        aria-label="نمودار دایره‌ای نیازمندی‌های ویژگی"

      >

        <defs>

          <radialGradient id="sgRadarBackground">

            <stop offset="0%" stopColor="#302719" />

            <stop offset="100%" stopColor="#11100e" />

          </radialGradient>

          <filter id="sgRadarGlow">

            <feGaussianBlur stdDeviation="3" result="blur" />

            <feMerge>

              <feMergeNode in="blur" />

              <feMergeNode in="SourceGraphic" />

            </feMerge>

          </filter>

        </defs>

        <circle

          cx={center}

          cy={center}

          r={radius + 8}

          fill="url(#sgRadarBackground)"

          stroke="#51412a"

          strokeWidth="1"

        />

        {/* حلقه‌های دایره‌ای پس‌زمینه */}

        {[0.25, 0.5, 0.75, 1].map((fraction) => (

          <circle

            key={fraction}

            cx={center}

            cy={center}

            r={radius * fraction}

            fill="none"

            stroke={fraction === 1 ? "#927343" : "#51432e"}

            strokeWidth={fraction === 1 ? 1.5 : 1}

            strokeDasharray={fraction === 1 ? undefined : "3 5"}

          />

        ))}

        {/* چهار محور اصلی */}

        {stats.map((stat) => (

          <line

            key={`axis-${stat.key}`}

            x1={center}

            y1={center}

            x2={stat.axisX}

            y2={stat.axisY}

            stroke="#79623b"

            strokeWidth="1.2"

          />

        ))}

        {/* چهارضلعی داده‌ها؛ حلقه‌های پس‌زمینه همچنان دایره‌ای هستند */}

        {hasData && (

          <polygon

            points={stats.map((stat) => `${stat.x},${stat.y}`).join(" ")}

            fill="#c8a15b"

            fillOpacity="0.16"

            stroke="#c8a15b"

            strokeWidth="2"

            strokeLinejoin="round"

            filter="url(#sgRadarGlow)"

          />

        )}

        {/* نقاط داده‌ها بدون خطوط رنگی اضافه از مرکز */}

        {stats.map((stat) => (

          <g key={stat.key}>

            {stat.n !== null && (

              <circle

                cx={stat.x}

                cy={stat.y}

                r="5"

                fill={stat.color}

                stroke="#17130d"

                strokeWidth="2"

                filter="url(#sgRadarGlow)"

              />

            )}

          </g>

        ))}

        {/* عنوان‌ها و مقادیر */}

        {stats.map((stat) => (

          <g key={`label-${stat.key}`}>

            <text

              x={stat.labelX}

              y={stat.labelY}

              fill={stat.color}

              fontSize="9"

              fontWeight="700"

              textAnchor="middle"

              dominantBaseline="middle"

            >

              {stat.label}

            </text>

            <text

              x={stat.labelX}

              y={stat.labelY + (stat.angle === 90 ? 14 : -14)}

              fill="#f1e8d5"

              fontSize="12"

              fontWeight="700"

              textAnchor="middle"

              dominantBaseline="middle"

            >

              {stat.n === null ? "—" : `${stat.n}/99`}

            </text>

          </g>

        ))}

        <circle cx={center} cy={center} r="4" fill="#f0d38d" />

        <circle

          cx={center}

          cy={center}

          r="8"

          fill="none"

          stroke="#c8a15b"

          strokeOpacity=".4"

        />

      </svg>

      <div className="sg-radar-legend">

        هر محور از صفر تا ۹۹ است. مقدارهای بالاتر، نقطه را از مرکز دورتر می‌کنند.

      </div>

      {!hasData && (

        <div className="sg-radarnote">

          اطلاعات نیازمندی این مورد هنوز در API ثبت نشده است.

        </div>

      )}

      <div className="sg-radar-key">

        {stats.map((stat) => (

          <div className="sg-radar-keyitem" key={stat.key}>

            <span

              className="sg-radar-dot"

              style={{ background: stat.color }}

            />

            <span>{stat.fa}</span>

            <strong>{stat.n === null ? "—" : stat.n}</strong>

          </div>

        ))}

      </div>

      <style jsx>{`

        .sg-radar-key {

          display: grid;

          grid-template-columns: repeat(2, minmax(0, 1fr));

          gap: 8px;

          width: 100%;

          max-width: 320px;

          margin-top: 8px;

        }

        .sg-radar-keyitem {

          display: flex;

          align-items: center;

          gap: 7px;

          padding: 8px 10px;

          border: 1px solid #393022;

          border-radius: 7px;

          background: #11100e;

          color: #cfc3ad;

          font-size: 11px;

        }

        .sg-radar-keyitem strong {

          margin-right: auto;

          color: #f1e8d5;

        }

        .sg-radar-dot {

          width: 8px;

          height: 8px;

          border-radius: 50%;

          flex: 0 0 8px;

        }

      `}</style>

    </div>

  );

}

export default function WeaponsArchive() {

  const [weapons, setWeapons] = useState<Weapon[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [query, setQuery] = useState("");

  const [category, setCategory] = useState("all");

  const [specialOnly, setSpecialOnly] = useState(false);

  const [selected, setSelected] = useState<Weapon | null>(null);

  const [compareIds, setCompareIds] = useState<string[]>([]);

  const [level, setLevel] = useState(10);

  const [ratings, setRatings] = useState<

    Record<string, { sum: number; count: number; mine?: number }>

  >({});

  const [sort, setSort] = useState("name");

  const [categoryStrip, setCategoryStrip] = useState<HTMLDivElement | null>(

    null,

  );

  const [draggingCategories, setDraggingCategories] = useState(false);

  const [dragStartX, setDragStartX] = useState(0);

  const [dragScrollLeft, setDragScrollLeft] = useState(0);

  // مشخص می‌کند حرکت کاربر کشیدن نوار بوده یا کلیک معمولی

  const dragMovedRef = useRef(false);

  useEffect(() => {

    try {

      const saved = localStorage.getItem(

        "souls-gate-ds3-weapon-ratings-v1",

      );

      if (saved) setRatings(JSON.parse(saved));

    } catch {}

  }, []);

  useEffect(() => {

    if (!selected) return;

    const previous = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {

      if (event.key === "Escape") setSelected(null);

    };

    window.addEventListener("keydown", onKey);

    return () => {

      document.body.style.overflow = previous;

      window.removeEventListener("keydown", onKey);

    };

  }, [selected]);

  useEffect(() => {

    const controller = new AbortController();

    (async () => {

      setLoading(true);

      setError("");

      try {

        const res = await fetch(

          "/games/dark-souls-3/weapons/api",

          {

            cache: "no-store",

            signal: controller.signal,

          },

        );

        if (!res.ok) {

          throw new Error(`API پاسخ ${res.status} برگرداند.`);

        }

        const json = (await res.json()) as ApiPayload;

        const list = json.weapons || json.allWeapons || json.data || [];

        if (!Array.isArray(list)) {

          throw new Error("ساختار پاسخ API قابل‌شناسایی نیست.");

        }

       setWeapons(
          list
            // نمایش فقط ۲۲۱ سلاح مرجع؛ سپر و موارد اضافه مثل Torch حذف می‌شوند.
            .filter((w) => {
              const sourceName = w.name || w.fileName;
              return !isExcludedWeapon(sourceName) && isReferenceWeapon(sourceName);
            })
            .map((w) => {
              const name = cleanName(w);
              const requirements = findWeaponRequirements(name);

              console.log(
                "[Souls Gate] Weapon:",
                name,
                "Category:",
                getWeaponCategory(name),
                "Requirements:",
                requirements
              );

              return {
                ...w,
                name,
                category: getWeaponCategory(name),
                requirements: {
                  ...w.requirements,
                  ...(requirements
                    ? {
                        strength: requirements.strength,
                        dexterity: requirements.dexterity,
                      }
                    : {}),
                },
              };
            })
        );

        if (!list.length) {

          setError(

            json.error ||

              "API هیچ موردی برنگرداند. مسیر پوشه تصاویر و پاسخ API را بررسی کن.",

          );

        }

      } catch (e) {

        if (!controller.signal.aborted) {

          setError(

            e instanceof Error

              ? e.message

              : "دریافت اطلاعات ناموفق بود.",

          );

        }

      } finally {

        if (!controller.signal.aborted) setLoading(false);

      }

    })();

    return () => controller.abort();

  }, []);

  const keyOf = (w: Weapon) =>

    w.id || w.fileName || w.image || cleanName(w);

  const filtered = useMemo(() => {

    let list = weapons.filter((w) =>

      cleanName(w).toLowerCase().includes(query.trim().toLowerCase()),

    );

    if (category !== "all") {

      list = list.filter((w) => classify(w) === category);

    }

    if (specialOnly) {

      list = list.filter(isBossSoul);

    }

    if (sort === "rating") {

      list = [...list].sort((a, b) => {

        const ar = ratings[keyOf(a)];

        const br = ratings[keyOf(b)];

        return (

          (br?.count ? br.sum / br.count : 0) -

          (ar?.count ? ar.sum / ar.count : 0)

        );

      });

    } else {

      list = [...list].sort((a, b) =>

        cleanName(a).localeCompare(cleanName(b)),

      );

    }

    return list;

  }, [weapons, query, category, specialOnly, sort, ratings]);

  const rate = (w: Weapon, stars: number) => {

    const key = keyOf(w);

    setRatings((old) => {

      const prev = old[key];

      const next = prev?.mine

        ? {

            sum: prev.sum - prev.mine + stars,

            count: prev.count,

            mine: stars,

          }

        : {

            sum: (prev?.sum || 0) + stars,

            count: (prev?.count || 0) + 1,

            mine: stars,

          };

      const all = { ...old, [key]: next };

      try {

        localStorage.setItem(

          "souls-gate-ds3-weapon-ratings-v1",

          JSON.stringify(all),

        );

      } catch {}

      return all;

    });

  };

  const toggleCompare = (w: Weapon) => {

    const id = keyOf(w);

    setCompareIds((old) =>

      old.includes(id)

        ? old.filter((x) => x !== id)

        : old.length < 3

          ? [...old, id]

          : old,

    );

  };

  const compared = compareIds

    .map((id) => weapons.find((w) => keyOf(w) === id))

    .filter(Boolean) as Weapon[];

  const selectedRating = selected

    ? ratings[keyOf(selected)]

    : undefined;

  return (

    <div dir="rtl" className="sg-page">

      <style jsx global>{`

        .sg-page {

          min-height: 100vh;

          background: radial-gradient(

            ellipse at 50% -15%,

            #352a1b 0,

            #171512 38%,

            #0b0b0c 78%

          );

          color: #e9e2d5;

          padding: 28px clamp(14px, 3vw, 42px) 60px;

          font-family: Tahoma, Arial, sans-serif;

        }

        .sg-wrap {

          max-width: 1500px;

          margin: auto;

        }

        .sg-kicker {

          color: #c8a15b;

          letter-spacing: 3px;

          font-size: 11px;

          text-align: center;

        }

        .sg-title {

          text-align: center;

          font-family: Georgia, serif;

          letter-spacing: 3px;

          font-size: clamp(30px, 4vw, 54px);

          margin: 9px 0;

          color: #e4c783;

          text-shadow: 0 3px 25px #000;

        }

        .sg-subtitle {

          text-align: center;

          color: #a7a093;

          margin: 0 auto 28px;

          max-width: 760px;

          line-height: 1.9;

          font-size: 13px;

        }

        .sg-controls {

          display: grid;

          grid-template-columns: minmax(200px, 1fr) minmax(170px, 0.6fr) auto auto;

          gap: 10px;

          margin-bottom: 18px;

        }

        .sg-input,

        .sg-select {

          width: 100%;

          background: #151411;

          color: #e9e2d5;

          border: 1px solid #51452f;

          border-radius: 8px;

          padding: 12px;

          font: inherit;

          outline: none;

        }

        .sg-input:focus,

        .sg-select:focus {

          border-color: #c8a15b;

        }

        .sg-toggle {

          background: #211c14;

          border: 1px solid #64502f;

          color: #dfc27f;

          border-radius: 8px;

          padding: 10px 14px;

          cursor: pointer;

        }

        .sg-toggle.active {

          background: #59421d;

          color: #fff0c2;

          border-color: #d4ae60;

        }

        .sg-cats {

          display: flex;

          gap: 8px;

          overflow-x: auto;

          padding: 4px 0 14px;

          margin-bottom: 14px;

          scrollbar-color: #806438 #151411;

          cursor: grab;

          user-select: none;

          scroll-behavior: smooth;

          overscroll-behavior-x: contain;

          touch-action: pan-x;

        }

        .sg-cats.dragging {

          cursor: grabbing;

          scroll-behavior: auto;

        }

        .sg-cats::-webkit-scrollbar {

          height: 7px;

        }

        .sg-cats::-webkit-scrollbar-thumb {

          background: #806438;

          border-radius: 10px;

        }

        .sg-cats::-webkit-scrollbar-track {

          background: #151411;

          border-radius: 10px;

        }

        .sg-cat {

          flex: 0 0 auto;

          white-space: nowrap;

          background: #151411;

          border: 1px solid #3b352a;

          color: #bdb4a3;

          padding: 9px 13px;

          border-radius: 20px;

          cursor: pointer;

          font-size: 12px;

          font-family: inherit;

          position: relative;

          z-index: 1;

        }

        .sg-cat.active {

          background: #4a381c;

          border-color: #c8a15b;

          color: #ffe5a3;

        }

        .sg-info {

          display: flex;

          justify-content: space-between;

          gap: 12px;

          flex-wrap: wrap;

          color: #a7a093;

          font-size: 12px;

          margin: 8px 0 16px;

        }

        .sg-grid {

          display: grid;

          grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));

          gap: 12px;

        }

        .sg-card {

          position: relative;

          background: linear-gradient(155deg, #211e19, #101011 70%);

          border: 1px solid #393126;

          border-radius: 10px;

          padding: 12px 10px 13px;

          min-width: 0;

          text-align: center;

          transition:

            transform 0.18s,

            border-color 0.18s,

            box-shadow 0.18s;

          cursor: pointer;

        }

        .sg-card:hover {

          transform: translateY(-3px);

          border-color: #a78345;

          box-shadow: 0 10px 26px #0008;

        }

        .sg-card.boss {

          border-color: #8d6730;

          background: linear-gradient(145deg, #332515, #15110d 70%);

        }

        .sg-card.boss:before {

          content: "سلاح Soul باس";

          position: absolute;

          top: 7px;

          right: 7px;

          background: #68491d;

          color: #ffe1a0;

          border: 1px solid #b88c45;

          border-radius: 4px;

          font-size: 9px;

          padding: 4px 6px;

          z-index: 1;

        }

        .sg-imagebox {

          height: 112px;

          display: flex;

          align-items: center;

          justify-content: center;

          margin: 8px 0 10px;

        }

        .sg-image {

          max-width: 100%;

          max-height: 105px;

          object-fit: contain;

          filter: drop-shadow(0 7px 8px #000b);

          transform: scale(1.08);

        }

        .sg-noimage {

          color: #786d5a;

          font-size: 12px;

        }

        .sg-name {

          font-size: 13px;

          line-height: 1.6;

          min-height: 42px;

          color: #eee2c8;

          overflow-wrap: anywhere;

        }

        .sg-type {

          font-size: 10px;

          color: #9d927d;

          margin: 4px 0 8px;

        }

        .sg-cardfoot {

          display: flex;

          justify-content: space-between;

          align-items: center;

          gap: 5px;

        }

        .sg-mini {

          font-size: 10px;

          color: #c7a762;

        }

        .sg-comparebtn {

          background: transparent;

          border: 1px solid #51452f;

          color: #c9bda7;

          border-radius: 5px;

          font-size: 10px;

          padding: 5px 7px;

          cursor: pointer;

        }

        .sg-comparebtn.on {

          background: #4c391d;

          color: #ffe2a0;

          border-color: #b88c45;

        }

        .sg-stars {

          display: inline-flex;

          gap: 1px;

          direction: ltr;

        }

        .sg-star {

          border: 0;

          background: none;

          padding: 0 1px;

          color: #514a3c;

          font-size: 17px;

          line-height: 1;

          cursor: default;

        }

        .sg-star.active {

          color: #d7ad50;

        }

        .sg-rating {

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 5px;

          margin: 7px 0 2px;

        }

        .sg-rating small {

          color: #a79c88;

          font-size: 10px;

        }

        .sg-panel {

          margin-top: 26px;

          border: 1px solid #5d4a2d;

          border-radius: 12px;

          background: linear-gradient(145deg, #1b1813, #101011);

          padding: clamp(16px, 3vw, 28px);

          box-shadow: 0 20px 50px #0005;

        }

        .sg-panelhead {

          display: flex;

          justify-content: space-between;

          gap: 16px;

          align-items: start;

          flex-wrap: wrap;

        }

        .sg-panel h2 {

          font-size: 25px;

          color: #e6c57b;

          margin: 0 0 8px;

        }

        .sg-panel h3 {

          font-size: 16px;

          color: #d9bb78;

          margin: 22px 0 10px;

        }

        .sg-muted {

          color: #aaa08f;

          font-size: 12px;

          line-height: 1.9;

        }

        .sg-stats {

          display: grid;

          grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));

          gap: 9px;

          margin-top: 16px;

        }

        .sg-stat {

          background: #100f0d;

          border: 1px solid #342c20;

          border-radius: 8px;

          padding: 12px;

        }

        .sg-stat b {

          display: block;

          color: #e1c17a;

          font-size: 11px;

          margin-bottom: 7px;

        }

        .sg-stat span {

          font-size: 14px;

        }

        .sg-tablewrap {

          overflow-x: auto;

        }

        .sg-table {

          width: 100%;

          border-collapse: collapse;

          font-size: 12px;

          min-width: 500px;

        }

        .sg-table th,

        .sg-table td {

          padding: 10px;

          border-bottom: 1px solid #342e24;

          text-align: right;

        }

        .sg-table th {

          color: #d8bb7a;

          background: #211b13;

        }

        .sg-table td {

          color: #d4cbbb;

        }

        .sg-table input {

          accent-color: #c8a15b;

        }

        .sg-ratebuttons {

          display: flex;

          align-items: center;

          gap: 8px;

          flex-wrap: wrap;

        }

        .sg-ratebuttons .sg-star {

          font-size: 26px;

          cursor: pointer;

        }

        .sg-action {

          background: #49371c;

          border: 1px solid #b48b48;

          color: #ffe2a0;

          border-radius: 7px;

          padding: 9px 12px;

          cursor: pointer;

          font: inherit;

          font-size: 12px;

        }

        .sg-empty {

          padding: 38px 16px;

          text-align: center;

          border: 1px dashed #544630;

          border-radius: 10px;

          color: #b2a58e;

          line-height: 2;

        }

        .sg-compare {

          margin-top: 24px;

        }

        .sg-comparegrid {

          display: grid;

          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));

          gap: 12px;

        }

        .sg-comparecard {

          border: 1px solid #51432c;

          background: #14120f;

          padding: 14px;

          border-radius: 9px;

        }

        .sg-loading {

          color: #d7bc7d;

          text-align: center;

          padding: 30px;

        }

        .sg-error {

          color: #e8b4a6;

          background: #2b1714;

          border: 1px solid #754139;

          padding: 13px;

          border-radius: 8px;

          margin: 12px 0;

          font-size: 12px;

          line-height: 1.8;

        }

        .sg-modal-backdrop {

          position: fixed;

          inset: 0;

          z-index: 1000;

          background: rgba(4, 4, 5, 0.82);

          backdrop-filter: blur(9px);

          display: flex;

          align-items: center;

          justify-content: center;

          padding: clamp(8px, 2vw, 24px);

          animation: sg-fade 0.18s ease-out;

        }

        .sg-modal {

          position: relative;

          width: min(1120px, 100%);

          max-height: 92vh;

          overflow: auto;

          border: 1px solid #796039;

          border-radius: 15px;

          background: radial-gradient(

            ellipse at 80% 0%,

            #342719 0,

            #171511 42%,

            #0d0d0e 100%

          );

          box-shadow: 0 30px 100px #000c;

          animation: sg-rise 0.22s ease-out;

        }

        .sg-modal .sg-panel {

          margin: 0;

          border: 0;

          box-shadow: none;

          background: transparent;

          border-radius: 0;

        }

        .sg-modal-close {

          position: sticky;

          top: 10px;

          float: left;

          margin: 10px 10px -45px 10px;

          z-index: 2;

          background: #201a12;

          border: 1px solid #806438;

          color: #f3d58f;

          border-radius: 50%;

          width: 36px;

          height: 36px;

          font-size: 21px;

          cursor: pointer;

        }

        .sg-modal-intro {

          display: grid;

          grid-template-columns: minmax(180px, 0.7fr) minmax(0, 1.5fr);

          gap: 20px;

          align-items: center;

          padding: 25px 25px 0;

        }

        .sg-modal-art {

          min-height: 200px;

          display: flex;

          align-items: center;

          justify-content: center;

          background: radial-gradient(

            ellipse,

            #4b3920 0,

            #18140f 52%,

            transparent 74%

          );

          border: 1px solid #4c3b23;

          border-radius: 12px;

        }

        .sg-modal-art img {

          max-width: 95%;

          max-height: 230px;

          object-fit: contain;

          filter: drop-shadow(0 12px 20px #000b);

        }

        .sg-modal-body {

          padding: 0 25px 25px;

        }

        .sg-radar-wrap {

          display: flex;

          flex-direction: column;

          align-items: center;

          gap: 8px;

          padding: 8px 0;

        }

        .sg-radar {

          width: min(100%, 330px);

          height: auto;

          overflow: visible;

        }

        .sg-radar-legend {

          font-size: 11px;

          color: #a79b86;

          line-height: 1.8;

          text-align: center;

          max-width: 400px;

        }

        .sg-modal .sg-panel h2 {

          padding-left: 38px;

        }

        .sg-modal .sg-panelhead {

          padding-top: 8px;

        }

        .sg-profile-columns {

          display: grid;

          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

          gap: 18px;

        }

        .sg-subpanel {

          border: 1px solid #393022;

          background: #11100e;

          border-radius: 10px;

          padding: 15px;

          min-width: 0;

        }

        .sg-subpanel h3 {

          margin-top: 4px !important;

        }

        .sg-leveltable {

          width: 100%;

          border-collapse: collapse;

          font-size: 12px;

        }

        .sg-leveltable th,

        .sg-leveltable td {

          text-align: right;

          padding: 9px;

          border-bottom: 1px solid #352d21;

        }

        .sg-leveltable th {

          color: #d8bb7a;

        }

        .sg-leveltable td {

          color: #d4cbbb;

        }

        .sg-leveltable tr.current {

          background: #44341d;

        }

        .sg-leveltable tr.current td {

          color: #ffe3a0;

        }

        .sg-radarnote {

          font-size: 10px;

          color: #a79b86;

          line-height: 1.7;

        }

        @keyframes sg-fade {

          from {

            opacity: 0;

          }

          to {

            opacity: 1;

          }

        }

        @keyframes sg-rise {

          from {

            opacity: 0;

            transform: translateY(12px) scale(0.99);

          }

          to {

            opacity: 1;

            transform: translateY(0) scale(1);

          }

        }

        @media (max-width: 760px) {

          .sg-modal-intro {

            grid-template-columns: 1fr;

            padding: 18px 16px 0;

          }

          .sg-modal-art {

            min-height: 150px;

          }

          .sg-modal-art img {

            max-height: 170px;

          }

          .sg-modal-body {

            padding: 0 16px 18px;

          }

          .sg-profile-columns {

            grid-template-columns: 1fr;

          }

          .sg-modal {

            max-height: 96vh;

          }

          .sg-controls {

            grid-template-columns: 1fr 1fr;

          }

          .sg-grid {

            grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));

            gap: 8px;

          }

          .sg-card {

            padding: 10px 7px;

          }

          .sg-imagebox {

            height: 95px;

          }

          .sg-image {

            max-height: 90px;

          }

          .sg-page {

            padding-inline: 12px;

          }

        }

      `}</style>

      <div className="sg-wrap">

        <div className="sg-kicker">

          THE KINGDOM OF LOTHRIC · ARMORY ARCHIVE

        </div>

        <h1 className="sg-title">اسلحه خانه دارک سولز ۳</h1>

        <p className="sg-subtitle">

          آرشیو سلاح‌ها، امتیاز بازیکنان، مقایسه تجهیزات و بررسی اطلاعات

          ارتقا؛ با تمرکز بر نسخه اصلی و بسته‌های الحاقی.

        </p>

        <div className="sg-controls">

          <input

            className="sg-input"

            value={query}

            onChange={(e) => setQuery(e.target.value)}

            placeholder="جست‌وجوی نام..."

            aria-label="جست‌وجو"

          />

          <select

            className="sg-select"

            value={sort}

            onChange={(e) => setSort(e.target.value)}

            aria-label="مرتب‌سازی"

          >

            <option value="name">مرتب‌سازی: نام</option>

            <option value="rating">مرتب‌سازی: بالاترین امتیاز</option>

          </select>

          <button

            type="button"

            className={`sg-toggle ${specialOnly ? "active" : ""}`}

            onClick={() => setSpecialOnly((v) => !v)}

          >

            {specialOnly ? "✓ فقط موارد ویژه" : "موارد ویژه"}

          </button>

          <button

            type="button"

            className="sg-toggle"

            onClick={() => {

              setQuery("");

              setCategory("all");

              setSpecialOnly(false);

              setSort("name");

            }}

          >

            پاک‌کردن فیلترها

          </button>

        </div>

        {/* دسته‌بندی‌ها: کلیک مستقل از کشیدن نوار */}

        <div

          className={`sg-cats ${draggingCategories ? "dragging" : ""}`}

          role="tablist"

          aria-label="دسته‌بندی"

          onWheel={(e) => {

            if (

              categoryStrip &&

              Math.abs(e.deltaY) > Math.abs(e.deltaX)

            ) {

              e.preventDefault();

              categoryStrip.scrollLeft += e.deltaY;

            }

          }}

          onPointerDown={(e) => {

            if (

              e.pointerType === "mouse" &&

              e.button === 0 &&

              categoryStrip

            ) {

              dragMovedRef.current = false;

              setDraggingCategories(true);

              setDragStartX(e.clientX);

              setDragScrollLeft(categoryStrip.scrollLeft);

            }

          }}

          onPointerUp={() => setDraggingCategories(false)}

          onPointerLeave={() => setDraggingCategories(false)}

          onPointerCancel={() => setDraggingCategories(false)}

          onClickCapture={(e) => {

            if (dragMovedRef.current) {

              e.preventDefault();

              e.stopPropagation();

              dragMovedRef.current = false;

            }

          }}

          ref={setCategoryStrip}

        >

          {Object.entries(PERSIAN_CATEGORIES).map(([id, label]) => (

            <button

              key={id}

              type="button"

              draggable={false}

              role="tab"

              aria-selected={category === id}

              className={`sg-cat ${category === id ? "active" : ""}`}

              onClick={() => setCategory(id)}

            >

              {label}

              {` (${id === "all" ? weapons.length : weapons.filter((w) => classify(w) === id).length})`}

            </button>

          ))}

        </div>

        <div className="sg-info">

          <span>{filtered.length} مورد نمایش داده می‌شود</span>

          <span>برای مقایسه حداکثر ۳ مورد انتخاب کن</span>

        </div>

        {loading && (

          <div className="sg-loading">در حال بارگذاری آرشیو...</div>

        )}

        {!!error && (

          <div className="sg-error">

            {error}

            <br />

            مسیر API: <code>/games/dark-souls-3/weapons-test/api</code>

          </div>

        )}

        {!loading && filtered.length === 0 && (

          <div className="sg-empty">

            موردی پیدا نشد یا API هنوز فهرست را برنگردانده است.

            <br />

            مسیر API: <code>/games/dark-souls-3/weapons-test/api</code>

          </div>

        )}

        <section className="sg-grid" aria-label="فهرست">

          {filtered.map((w) => {

            const id = keyOf(w);

            const rating = ratings[id];

            const average = rating?.count ? rating.sum / rating.count : 0;

            const boss = isBossSoul(w);

            const chosen = compareIds.includes(id);

            return (

              <article

                key={id}

                className={`sg-card ${boss ? "boss" : ""}`}

                onClick={() => setSelected(w)}

                tabIndex={0}

                onKeyDown={(e) => {

                  if (e.key === "Enter") setSelected(w);

                }}

              >

                <div className="sg-imagebox">

                  {w.image ? (

                    <img

                      className="sg-image"

                      src={w.image}

                      alt={cleanName(w)}

                      loading="lazy"

                      onError={(e) => {

                        e.currentTarget.style.display = "none";

                      }}

                    />

                  ) : (

                    <span className="sg-noimage">

                      تصویر موجود نیست

                    </span>

                  )}

                </div>

                <div className="sg-name">{cleanName(w)}</div>

                <div className="sg-type">

                  {PERSIAN_CATEGORIES[classify(w)] || "سلاح"}

                  {w.dlc ? ` · ${w.dlc}` : ""}

                </div>

                <div className="sg-rating">

                  <Stars value={Math.round(average)} />

                  <small>

                    {rating?.count

                      ? `${average.toFixed(1)} (${rating.count})`

                      : "بدون رأی"}

                  </small>

                </div>

                <div className="sg-cardfoot">

                  <span className="sg-mini">

                    {boss ? "✦ ویژه" : "آرشیو"}

                  </span>

                  <button

                    type="button"

                    className={`sg-comparebtn ${chosen ? "on" : ""}`}

                    onClick={(e) => {

                      e.stopPropagation();

                      toggleCompare(w);

                    }}

                  >

                    {chosen ? "✓ انتخاب شد" : "مقایسه +"}

                  </button>

                </div>

              </article>

            );

          })}

        </section>

        {selected && (

          <div

            className="sg-modal-backdrop"

            onMouseDown={(e) => {

              if (e.target === e.currentTarget) setSelected(null);

            }}

          >

            <section

              className="sg-modal"

              role="dialog"

              aria-modal="true"

              aria-label={`پروفایل ${cleanName(selected)}`}

            >

              <button

                type="button"

                className="sg-modal-close"

                onClick={() => setSelected(null)}

                aria-label="بستن پروفایل"

              >

                ×

              </button>

              <div className="sg-modal-intro">

                <div className="sg-modal-art">

                  {selected.image ? (

                    <img

                      src={selected.image}

                      alt={cleanName(selected)}

                      onError={(e) => {

                        e.currentTarget.style.display = "none";

                      }}

                    />

                  ) : (

                    <span className="sg-noimage">

                      تصویر موجود نیست

                    </span>

                  )}

                </div>

                <div>

                  <div

                    className="sg-kicker"

                    style={{ textAlign: "right", letterSpacing: 2 }}

                  >

                    ITEM DOSSIER

                  </div>

                  <h2

                    style={{

                      color: "#e6c57b",

                      fontSize: "clamp(24px,3vw,36px)",

                      margin: "8px 0",

                    }}

                  >

                    {cleanName(selected)}

                  </h2>

                  <p className="sg-muted">

                    {PERSIAN_CATEGORIES[classify(selected)] ||

                      "سایر موارد"}

                    {isBossSoul(selected) ? " · مورد ویژه" : ""}

                    {selected.dlc ? ` · ${selected.dlc}` : ""}

                  </p>

                  <div

                    className="sg-rating"

                    style={{ justifyContent: "flex-start" }}

                  >

                    <Stars

                      value={Math.round(

                        selectedRating?.count

                          ? selectedRating.sum / selectedRating.count

                          : 0,

                      )}

                    />

                    <small>

                      {selectedRating?.count

                        ? `${(

                            selectedRating.sum / selectedRating.count

                          ).toFixed(1)} از ۵ · ${selectedRating.count} رأی`

                        : "هنوز رأیی ثبت نشده"}

                    </small>

                  </div>

                </div>

              </div>

              <div className="sg-modal-body">

                <div className="sg-stats">

                  <div className="sg-stat">

                    <b>وزن</b>

                    <span>{selected.weight ?? "ثبت نشده"}</span>

                  </div>

                  <div className="sg-stat">

                    <b>مسیر ارتقا</b>

                    <span>

                      {selected.upgradePath || "اطلاعات ثبت نشده"}

                    </span>

                  </div>

                  <div className="sg-stat">

                    <b>مقدار ثبت‌شده در سطح +{level}</b>

                    <span>

                      {(() => {

                        const stat = getAttack(selected, level);

                        return stat

                          ? String(

                              stat.attack ??

                                stat.physical ??

                                "داده موجود",

                            )

                          : "ثبت نشده";

                      })()}

                    </span>

                  </div>

                </div>

                <div

                  className="sg-profile-columns"

                  style={{ marginTop: 18 }}

                >

                  <div className="sg-subpanel">

                    <h3>نمودار دایره‌ای نیازمندی‌ها</h3>

                    // این بخش برای تنظیم اندازه و نمایش استت‌های سلاح روی رادار است.

                    {/* نمودار به داده‌های واقعی مورد انتخاب‌شده وصل است */}

                    <RequirementRadar

                      requirements={selected.requirements}

                    />

                    <div className="sg-radarnote">

                      هر محور مستقل است و حلقه‌های دایره‌ای مقیاس نمایش

                      را مشخص می‌کنند.

                    </div>

                  </div>

                  <div className="sg-subpanel">

                    <h3>نیازمندی‌های ثبت‌شده</h3>

                    <div className="sg-stats">

                      <div className="sg-stat">

                        <b>Strength · STR</b>

                        <span>

                          {selected.requirements?.strength ?? "—"} / 99

                        </span>

                      </div>

                      <div className="sg-stat">

                        <b>Dexterity · DEX</b>

                        <span>

                          {selected.requirements?.dexterity ?? "—"} / 99

                        </span>

                      </div>

                      <div className="sg-stat">

                        <b>Faith · FTH</b>

                        <span>

                          {selected.requirements?.faith ?? "—"} / 99

                        </span>

                      </div>

                      <div className="sg-stat">

                        <b>Intelligence · INT</b>

                        <span>

                          {selected.requirements?.intelligence ?? "—"} / 99

                        </span>

                      </div>

                    </div>

                    <h3>Scaling</h3>

                    <p className="sg-muted">

                      STR {selected.scaling?.strength ?? "—"} · DEX{" "}

                      {selected.scaling?.dexterity ?? "—"} · FTH{" "}

                      {selected.scaling?.faith ?? "—"} · INT{" "}

                      {selected.scaling?.intelligence ?? "—"}

                    </p>

                  </div>

                </div>

                <div

                  className="sg-subpanel"

                  style={{ marginTop: 18 }}

                >

                  <h3>امتیازدهی کاربران</h3>

                  <div className="sg-ratebuttons">

                    <Stars

                      value={selectedRating?.mine || 0}

                      interactive

                      onChange={(n) => rate(selected, n)}

                    />

                    <span className="sg-muted">

                      برای ثبت یا تغییر امتیاز، روی ستاره‌ها کلیک کن.

                      امتیاز در همین مرورگر ذخیره می‌شود.

                    </span>

                  </div>

                </div>

                <div

                  className="sg-subpanel"

                  style={{ marginTop: 18 }}

                >

                  <h3>اطلاعات سطح انتخابی</h3>

                  <div

                    className="sg-ratebuttons"

                    style={{ marginBottom: 12 }}

                  >

                    <label

                      htmlFor="weapon-level"

                      className="sg-muted"

                    >

                      سطح انتخابی:{" "}

                      <strong style={{ color: "#e1c17a" }}>

                        +{level}

                      </strong>

                    </label>

                    <input

                      id="weapon-level"

                      type="range"

                      min="0"

                      max="10"

                      step="1"

                      value={level}

                      onChange={(e) =>

                        setLevel(Number(e.target.value))

                      }

                    />

                  </div>

                  {(() => {

                    const stat = getAttack(selected, level);

                    if (!stat) {

                      return (

                        <div className="sg-empty">

                          اطلاعات این سطح در API موجود نیست؛ مقدار

                          ساختگی نمایش داده نمی‌شود.

                        </div>

                      );

                    }

                    const entries = Object.entries(stat).filter(

                      ([key, value]) =>

                        key !== "level" && value !== undefined,

                    );

                    return (

                      <div className="sg-stats">

                        {entries.map(([key, value]) => (

                          <div className="sg-stat" key={key}>

                            <b>

                              {(

                                {

                                  attack: "مقدار کلی",

                                  physical: "فیزیکی",

                                  magic: "جادویی",

                                  fire: "آتش",

                                  lightning: "صاعقه",

                                  dark: "تاریکی",

                                } as Record<string, string>

                              )[key] || key}

                            </b>

                            <span>{String(value)}</span>

                          </div>

                        ))}

                      </div>

                    );

                  })()}

                </div>

                <div

                  className="sg-subpanel"

                  style={{ marginTop: 18 }}

                >

                  <h3>محل پیدا کردن / روش دریافت</h3>

                  <p className="sg-muted">

                    {selected.location ||

                      selected.acquisition ||

                      "اطلاعات ثبت نشده است."}

                  </p>

                  {selected.description && (

                    <>

                      <h3>توضیحات</h3>

                      <p className="sg-muted">

                        {selected.description}

                      </p>

                    </>

                  )}

                </div>

              </div>

            </section>

          </div>

        )}

        <section className="sg-panel sg-compare">

          <div className="sg-panelhead">

            <div>

              <h2 style={{ fontSize: 22 }}>

                مقایسه موارد انتخاب‌شده

              </h2>

              <p className="sg-muted">

                حداکثر سه مورد را از کارت‌ها انتخاب کن تا اطلاعات

                ثبت‌شده کنار هم نمایش داده شوند.

              </p>

            </div>

            <button

              type="button"

              className="sg-action"

              onClick={() => setCompareIds([])}

            >

              پاک‌کردن مقایسه

            </button>

          </div>

          {compared.length === 0 ? (

            <div className="sg-empty">

              هنوز موردی برای مقایسه انتخاب نکردی.

            </div>

          ) : (

            <div className="sg-comparegrid">

              {compared.map((w) => {

                const rating = ratings[keyOf(w)];

                const stat = getAttack(w, level);

                return (

                  <div

                    className="sg-comparecard"

                    key={keyOf(w)}

                  >

                    <h3 style={{ marginTop: 0 }}>

                      {cleanName(w)}

                    </h3>

                    <div className="sg-muted">

                      {PERSIAN_CATEGORIES[classify(w)] || "سلاح"}

                    </div>

                    <div className="sg-stats">

                      <div className="sg-stat">

                        <b>وزن</b>

                        <span>{w.weight ?? "—"}</span>

                      </div>

                      <div className="sg-stat">

                        <b>امتیاز</b>

                        <span>

                          {rating?.count

                            ? `${(

                                rating.sum / rating.count

                              ).toFixed(1)} / 5`

                            : "بدون رأی"}

                        </span>

                      </div>

                      <div className="sg-stat">

                        <b>مقدار ثبت‌شده در +{level}</b>

                        <span>

                          {stat

                            ? String(

                                stat.attack ??

                                  stat.physical ??

                                  "داده موجود",

                              )

                            : "—"}

                        </span>

                      </div>

                    </div>

                    <button

                      type="button"

                      className="sg-comparebtn"

                      style={{ marginTop: 12 }}

                      onClick={() =>

                        setCompareIds((old) =>

                          old.filter((id) => id !== keyOf(w)),

                        )

                      }

                    >

                      حذف از مقایسه

                    </button>

                  </div>

                );

              })}

            </div>

          )}

        </section>

        <p

          className="sg-muted"

          style={{ textAlign: "center", marginTop: 24 }}

        >

          Souls Gate · داده‌های ناموجود به‌صورت صریح مشخص شده‌اند.

        </p>

      </div>

     </div>

  );

}
