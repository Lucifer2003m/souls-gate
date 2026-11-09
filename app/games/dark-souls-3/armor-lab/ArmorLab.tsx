
"use client";
/* eslint-disable @next/next/no-img-element */

// app/games/dark-souls-3/armor-lab/ArmorLab.tsx

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import {
  armorSets as fallbackArmorSets,
  buildArmorSetsFromStorage,
  getPlacements,
  slots,
  statDefs,
  type ArmorApiItem,
  type ArmorPiece,
  type ArmorSet,
  type Placement,
  type SlotId,
} from "./armor-data";

const API_URL = "/games/dark-souls-3/armor-lab/api";
const BASE_BODY: string | null = null;
const GLUE_LIGHTING = true;
const SHOW_CALIBRATION = process.env.NODE_ENV !== "production";
const STORAGE_KEY = "souls-gate:armor-calibration";
const FADE_TOP = "linear-gradient(to bottom, transparent 0%, #000 22%)";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d6ad64]";

const initialEquipped = Object.fromEntries(
  slots.map((slot) => [slot.id, fallbackArmorSets[0]?.id ?? ""])
) as Record<SlotId, string>;

const initialEnabled = Object.fromEntries(
  slots.map((slot) => [slot.id, true])
) as Record<SlotId, boolean>;

const embers = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37 + 11) % 96,
  size: 2 + (i % 3),
  delay: (i * 0.9) % 8,
  duration: 7 + (i % 5) * 1.6,
  drift: (i % 2 === 0 ? 1 : -1) * (12 + ((i * 7) % 34)),
}));

const css = `
.sg-stage { --px: 0; --py: 0; }

.sg-layer {
  position: absolute;
  cursor: pointer;
  transition: opacity .35s ease, transform .35s ease, translate .25s ease-out;
}

.sg-breathe {
  animation: sg-breathe 6s ease-in-out infinite;
  transform-origin: 50% 100%;
}

.sg-floor {
  background: radial-gradient(ellipse at center, rgba(0,0,0,.8) 0%, rgba(0,0,0,0) 70%);
  filter: blur(6px);
}

.sg-ember {
  position: absolute;
  border-radius: 9999px;
  background: #f0b25a;
  box-shadow: 0 0 8px 2px rgba(240,178,90,.55);
  opacity: 0;
  animation: sg-ember linear infinite;
}

.sg-piece-list {
  scrollbar-width: thin;
  scrollbar-color: #a47b40 #101419;
}

.sg-piece-list::-webkit-scrollbar { width: 6px; }
.sg-piece-list::-webkit-scrollbar-track {
  background: #101419;
  border-radius: 999px;
}
.sg-piece-list::-webkit-scrollbar-thumb {
  background: #a47b40;
  border-radius: 999px;
}
.sg-piece-list::-webkit-scrollbar-thumb:hover { background: #d6ad64; }

@keyframes sg-breathe {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-3px) scale(1.004); }
}

@keyframes sg-ember {
  0% { transform: translate(0, 0); opacity: 0; }
  12% { opacity: .85; }
  100% { transform: translate(var(--drift), -480px); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .sg-breathe, .sg-ember { animation: none; }
  .sg-ember { display: none; }
  .sg-layer { translate: none !important; transition: opacity .2s ease; }
}
`;

function pieceOf(
  setId: string,
  slot: SlotId,
  sets: ArmorSet[]
): ArmorPiece {
  const set = sets.find((item) => item.id === setId) ?? sets[0];

  if (set?.pieces?.[slot]) {
    return set.pieces[slot];
  }

  // جلوگیری از خطا در صورت ناقص بودن یک ست دریافتی از API
  const fallbackSet = fallbackArmorSets[0];

  if (fallbackSet?.pieces?.[slot]) {
    return fallbackSet.pieces[slot];
  }

  return {
    id: `${setId || "unknown"}-${slot}`,
    name: "قطعه ناموجود",
    english: "Unavailable Piece",
    image: "",
    thumb: "",
  } as ArmorPiece;
}

const fmt = (n: number) => String(Number(n.toFixed(1)));

function ArmorImage({
  src,
  alt,
  className,
  style,
  loading,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  style?: CSSProperties;
  loading?: "eager" | "lazy";
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        aria-label={alt || "تصویر در دسترس نیست"}
        title={alt || "تصویر در دسترس نیست"}
        className={`flex h-full w-full items-center justify-center bg-black/20 text-center text-[10px] text-gray-600 ${className ?? ""}`}
      >
        تصویر در دسترس نیست
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      draggable={false}
      className={className}
      style={style}
      onError={() => setFailed(true)}
    />
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex items-center gap-3 text-xs text-gray-400">
      <span className="w-12 shrink-0">{label}</span>
      <input
        dir="ltr"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="min-w-0 flex-1 accent-[#d6ad64]"
      />
      <span className="w-10 shrink-0 text-left tabular-nums text-gray-300">
        {Number(value.toFixed(2))}
      </span>
    </label>
  );
}

export default function ArmorLab() {
  const [availableArmorSets, setAvailableArmorSets] =
    useState<ArmorSet[]>(fallbackArmorSets);
  const [armorLoading, setArmorLoading] = useState(true);
  const [armorError, setArmorError] = useState("");
  const [armorSource, setArmorSource] = useState<"api" | "fallback">(
    "fallback"
  );

  const [selected, setSelected] = useState<SlotId>("chest");
  const [hovered, setHovered] = useState<SlotId | null>(null);
  const [equipped, setEquipped] =
    useState<Record<SlotId, string>>(initialEquipped);
  const [enabled, setEnabled] =
    useState<Record<SlotId, boolean>>(initialEnabled);
  const [scale, setScale] = useState(100);
  const [calibrating, setCalibrating] = useState(false);
  const [overrides, setOverrides] = useState<
    Record<string, Partial<Placement>>
  >({});
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [openPicker, setOpenPicker] = useState<SlotId | null>("chest");

  const stageRef = useRef<HTMLDivElement>(null);

  // دریافت قطعات زره از API متصل به Supabase Storage
  useEffect(() => {
    let cancelled = false;

    async function loadArmor() {
      setArmorLoading(true);
      setArmorError("");

      try {
        const response = await fetch(API_URL, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          let details = "";

          try {
            const errorBody = await response.json();
            details =
              errorBody?.details ||
              errorBody?.error ||
              errorBody?.message ||
              "";
          } catch {
            // پاسخ خطا ممکن است JSON نباشد.
          }

          throw new Error(
            `درخواست API ناموفق بود (HTTP ${response.status}).${
              details ? ` ${details}` : ""
            }`
          );
        }

        const result: {
          success?: boolean;
          armor?: ArmorApiItem[];
          total?: number;
          error?: string;
          message?: string;
          details?: string;
          debug?: {
            failedImages?: Array<{
              fileName?: string;
              error?: string | null;
            }>;
          };
        } = await response.json();

        if (result.success !== true || !Array.isArray(result.armor)) {
          throw new Error(
            result.details ||
              result.error ||
              result.message ||
              "ساختار پاسخ API معتبر نیست."
          );
        }

        if (result.armor.length === 0) {
          throw new Error(
            "API پاسخ داد، اما هیچ تصویر زرهی پیدا نشد. پوشه ds3/armor در Bucket game-assets را بررسی کن."
          );
        }

        const loadedSets = buildArmorSetsFromStorage(result.armor);

        if (loadedSets.length === 0) {
          throw new Error(
            `از ${result.armor.length} فایل دریافتی، هیچ گروه زرهی ساخته نشد. نام فایل‌ها و دسته‌بندی قطعات را بررسی کن.`
          );
        }

        if (cancelled) return;

        setAvailableArmorSets(loadedSets);
        setArmorSource("api");
        setEquipped(
          Object.fromEntries(
            slots.map((slot) => [slot.id, loadedSets[0].id])
          ) as Record<SlotId, string>
        );

        const failedImages = result.debug?.failedImages ?? [];

        if (failedImages.length > 0) {
          setArmorError(
            `${failedImages.length} تصویر در پاسخ API URL معتبر نداشت. اولین فایل: ${
              failedImages[0]?.fileName ?? "نامشخص"
            }`
          );
        }
      } catch (error) {
        if (cancelled) return;

        setAvailableArmorSets(fallbackArmorSets);
        setArmorSource("fallback");
        setEquipped(initialEquipped);
        setArmorError(
          error instanceof Error
            ? error.message
            : "خطای ناشناخته هنگام بارگذاری زره‌ها."
        );
      } finally {
        if (!cancelled) setArmorLoading(false);
      }
    }

    void loadArmor();

    return () => {
      cancelled = true;
    };
  }, []);

  // بازیابی تنظیمات کالیبراسیون ذخیره‌شده
  useEffect(() => {
    if (!SHOW_CALIBRATION) {
      setHydrated(true);
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        const parsed: unknown = JSON.parse(raw);

        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          setOverrides(parsed as Record<string, Partial<Placement>>);
        }
      }
    } catch {
      // تنظیمات نامعتبر نادیده گرفته می‌شوند.
    }

    setHydrated(true);
  }, []);

  // ذخیره تنظیمات کالیبراسیون
  useEffect(() => {
    if (!SHOW_CALIBRATION || !hydrated) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch {
      // ممکن است localStorage در دسترس نباشد.
    }
  }, [overrides, hydrated]);

  const slotLabel = (id: SlotId) =>
    slots.find((slot) => slot.id === id)?.label ?? id;

  const activePiece = pieceOf(
    equipped[selected],
    selected,
    availableArmorSets
  );

  const setIds = Array.from(new Set(Object.values(equipped)));

  const currentSet =
    setIds.length === 1
      ? availableArmorSets.find((set) => set.id === setIds[0]) ??
        availableArmorSets[0]
      : null;

  const title = currentSet ? currentSet.name : "ست ترکیبی";
  const subtitle = currentSet ? currentSet.english : "Custom Set";

  const intro = currentSet
    ? currentSet.description
    : "ترکیبی از قطعات ست‌های مختلف. هر قطعه را مستقل انتخاب کن.";

  const fullImage = currentSet?.fullImage;

  const showFull =
    Boolean(fullImage) &&
    slots.every((slot) => enabled[slot.id]) &&
    !calibrating;

  const pieceStats = statDefs.flatMap((definition) => {
    const value = activePiece.stats?.[definition.key];

    return typeof value === "number"
      ? [{ label: definition.label, value }]
      : [];
  });

  const totalStats = statDefs
    .map((definition) => {
      const known = slots
        .filter((slot) => enabled[slot.id])
        .map(
          (slot) =>
            pieceOf(
              equipped[slot.id],
              slot.id,
              availableArmorSets
            ).stats?.[definition.key]
        )
        .filter((value): value is number => typeof value === "number");

      return {
        label: definition.label,
        total: known.length
          ? known.reduce((a, b) => a + b, 0)
          : null,
      };
    })
    .filter(
      (row): row is { label: string; total: number } =>
        row.total !== null
    );

  function togglePiece(id: SlotId) {
    setEnabled((current) => ({
      ...current,
      [id]: !current[id],
    }));
  }

  function choosePiece(slot: SlotId, setId: string) {
    setEquipped((current) => ({
      ...current,
      [slot]: setId,
    }));

    setSelected(slot);
  }

  function cycleSet(slot: SlotId, direction: 1 | -1) {
    if (availableArmorSets.length <= 1) return;

    setEquipped((current) => {
      const currentIndex = availableArmorSets.findIndex(
        (set) => set.id === current[slot]
      );

      const safeIndex = currentIndex < 0 ? 0 : currentIndex;
      const nextIndex =
        (safeIndex + direction + availableArmorSets.length) %
        availableArmorSets.length;

      return {
        ...current,
        [slot]: availableArmorSets[nextIndex].id,
      };
    });
  }

  function randomize() {
    if (availableArmorSets.length === 0) return;

    setEquipped(
      Object.fromEntries(
        slots.map((slot) => [
          slot.id,
          availableArmorSets[
            Math.floor(Math.random() * availableArmorSets.length)
          ].id,
        ])
      ) as Record<SlotId, string>
    );

    setEnabled(initialEnabled);
  }

  function resetAll() {
    if (availableArmorSets.length === 0) return;

    const firstSetId = availableArmorSets[0].id;

    setEquipped(
      Object.fromEntries(
        slots.map((slot) => [slot.id, firstSetId])
      ) as Record<SlotId, string>
    );

    setEnabled(initialEnabled);
    setSelected("chest");
    setOpenPicker("chest");
    setScale(100);
    setCalibrating(false);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const element = stageRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    element.style.setProperty(
      "--px",
      ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3)
    );

    element.style.setProperty(
      "--py",
      ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3)
    );
  }

  function handlePointerLeave() {
    const element = stageRef.current;
    if (!element) return;

    element.style.setProperty("--px", "0");
    element.style.setProperty("--py", "0");
  }

  // کالیبراسیون
  const pieceKey = (slot: SlotId) => `${equipped[slot]}:${slot}`;

  function placementsFor(slot: SlotId): Placement[] {
    return getPlacements(
      equipped[slot],
      slot,
      pieceOf(equipped[slot], slot, availableArmorSets)
    ).map((base, index) => ({
      ...base,
      ...overrides[`${pieceKey(slot)}:${index}`],
    }));
  }

  function updateOverride(key: string, patch: Partial<Placement>) {
    setOverrides((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...patch,
      },
    }));
  }

  function resetSlotOverrides() {
    const prefix = `${pieceKey(selected)}:`;

    setOverrides((current) =>
      Object.fromEntries(
        Object.entries(current).filter(
          ([key]) => !key.startsWith(prefix)
        )
      )
    );
  }

  async function copyLayout() {
    const groups = new Set(
      Object.keys(overrides).map((key) =>
        key.split(":").slice(0, 2).join(":")
      )
    );

    const output: Record<string, Placement[]> = {};

    groups.forEach((group) => {
      const [setId, slot] = group.split(":") as [string, SlotId];

      if (!slots.some((item) => item.id === slot)) return;

      output[group] = getPlacements(
        setId,
        slot,
        pieceOf(setId, slot, availableArmorSets)
      ).map((base, index) => ({
        ...base,
        ...overrides[`${group}:${index}`],
      }));
    });

    const outputText = JSON.stringify(output, null, 2);

    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      console.log(outputText);
      setCopied(false);
    }
  }

  // رندر لایه‌های شوالیه
  function renderLayers(slot: SlotId) {
    const piece = pieceOf(equipped[slot], slot, availableArmorSets);
    const isOn = enabled[slot];
    const isSelected = selected === slot;
    const isHovered = hovered === slot;

    return placementsFor(slot).map((placement, index) => {
      const glow = isSelected
        ? "drop-shadow(0 0 12px rgba(214,173,100,0.45))"
        : isHovered
          ? "drop-shadow(0 0 8px rgba(214,173,100,0.28))"
          : "drop-shadow(0 6px 10px rgba(0,0,0,0.45))";

      return (
        <div
          key={`${slot}-${equipped[slot]}-${index}`}
          className="sg-layer"
          onClick={() => setSelected(slot)}
          onPointerEnter={() => setHovered(slot)}
          onPointerLeave={() =>
            setHovered((current) => (current === slot ? null : current))
          }
          style={
            {
              left: `${placement.left}%`,
              top: `${placement.top}%`,
              width: `${placement.width}%`,
              height: `${placement.height}%`,
              zIndex: placement.z,
              translate: `calc(var(--px) * ${placement.depth}px) calc(var(--py) * ${placement.depth * 0.6}px)`,
              opacity: isOn ? 1 : 0,
              transform: isOn
                ? "none"
                : "translateY(-14px) scale(0.98)",
              pointerEvents: isOn ? "auto" : "none",
            } as CSSProperties
          }
        >
          <ArmorImage
            src={piece.image}
            alt={`${slotLabel(slot)} ${piece.english}`}
            className="h-full w-full select-none object-contain"
            style={{
              transform: `rotate(${placement.rotate ?? 0}deg) scaleX(${placement.flipX ? -1 : 1})`,
              filter: `brightness(${placement.brightness ?? 1}) ${glow}`,
              WebkitMaskImage: placement.fadeTop ? FADE_TOP : undefined,
              maskImage: placement.fadeTop ? FADE_TOP : undefined,
            }}
          />
        </div>
      );
    });
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#080a0d] text-[#e9dfce]">
      <style>{css}</style>

      {/* وضعیت اتصال به دیتابیس */}
      <div className="mx-auto max-w-[1500px] px-4 pt-4 lg:px-7">
        {armorLoading ? (
          <div
            role="status"
            className="rounded-lg border border-[#a47b40]/30 bg-[#101419] px-4 py-3 text-sm text-[#d6ad64]"
          >
            در حال دریافت قطعات زره از Supabase...
          </div>
        ) : armorSource === "api" ? (
          <div className="rounded-lg border border-emerald-700/40 bg-emerald-950/20 px-4 py-3 text-sm leading-6 text-emerald-300">
            اتصال برقرار است؛ {availableArmorSets.length} گروه زره از دیتابیس
            بارگذاری شد.
            {armorError && (
              <p className="mt-1 text-xs text-amber-300">{armorError}</p>
            )}
          </div>
        ) : (
          <div
            role="status"
            className="rounded-lg border border-amber-700/40 bg-amber-950/20 px-4 py-3 text-sm leading-6 text-amber-200"
          >
            <p className="font-semibold">استفاده از ست آزمایشی</p>
            <p className="mt-1 text-xs text-amber-100/80">
              دریافت زره از API انجام نشد: {armorError || "خطای نامشخص"}
            </p>
            <p className="mt-1 text-xs text-amber-100/70">
              مسیر API مورد انتظار: {API_URL}
            </p>
            <p className="mt-1 text-xs text-amber-100/70">
              فایل API باید در مسیر
              {" "}
              app/games/dark-souls-3/armor-lab/api/route.ts
              {" "}
              قرار داشته باشد.
            </p>
          </div>
        )}
      </div>

      <section className="mx-auto grid max-w-[1500px] gap-5 p-4 lg:grid-cols-[280px_minmax(0,1fr)_290px] lg:p-7">
        {/* فهرست تجهیزات */}
        <aside className="order-2 h-fit rounded-xl border border-[#a47b40]/40 bg-[#101419]/95 p-4 lg:order-1">
          <h2 className="mb-4 border-b border-[#a47b40]/30 pb-4 text-lg font-bold text-[#d8b477]">
            تجهیزات شوالیه
          </h2>

          <div className="space-y-3">
            {slots.map((slot) => {
              const piece = pieceOf(
                equipped[slot.id],
                slot.id,
                availableArmorSets
              );

              const isOn = enabled[slot.id];
              const isOpen = openPicker === slot.id;

              return (
                <div
                  key={slot.id}
                  className={`rounded-lg border p-2 transition ${
                    selected === slot.id
                      ? "border-[#d6ad64] bg-[#382b1a]/60"
                      : "border-white/10 bg-black/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(slot.id);
                      setOpenPicker(slot.id);
                    }}
                    aria-expanded={isOpen}
                    className={`flex w-full items-center gap-3 text-right ${focusRing}`}
                  >
                    <span className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-black/40">
                      <ArmorImage
                        src={piece.thumb ?? piece.image}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">
                        {slot.label}
                      </span>
                      <span className="mt-1 block break-words text-xs text-gray-500">
                        {piece.english}
                      </span>
                    </span>

                    <span className="text-xs text-[#d6ad64]">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {availableArmorSets.length > 1 && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => cycleSet(slot.id, -1)}
                        aria-label={`ست قبلی برای ${slot.label}`}
                        className={`shrink-0 rounded-md border border-white/10 px-2 py-1.5 text-xs text-gray-400 hover:border-[#c8a15b] ${focusRing}`}
                      >
                        قبلی
                      </button>

                      <select
                        value={equipped[slot.id]}
                        onChange={(event) =>
                          choosePiece(slot.id, event.target.value)
                        }
                        aria-label={`ست ${slot.label}`}
                        className={`min-w-0 flex-1 rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-gray-300 ${focusRing}`}
                      >
                        {availableArmorSets.map((set) => (
                          <option key={set.id} value={set.id}>
                            {set.name}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => cycleSet(slot.id, 1)}
                        aria-label={`ست بعدی برای ${slot.label}`}
                        className={`shrink-0 rounded-md border border-white/10 px-2 py-1.5 text-xs text-gray-400 hover:border-[#c8a15b] ${focusRing}`}
                      >
                        بعدی
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setSelected(slot.id);
                      setOpenPicker((current) =>
                        current === slot.id ? null : slot.id
                      );
                    }}
                    aria-expanded={isOpen}
                    className={`mt-2 flex w-full items-center justify-between rounded-md border px-3 py-2 text-xs transition ${focusRing} ${
                      isOpen
                        ? "border-[#d6ad64] bg-[#382b1a]/40 text-[#d6ad64]"
                        : "border-white/10 text-gray-400 hover:border-[#c8a15b]"
                    }`}
                  >
                    <span>
                      {isOpen ? "بستن فهرست قطعات" : "مرور تمام قطعات"}
                    </span>
                    <span aria-hidden>{isOpen ? "▲" : "▼"}</span>
                  </button>

                  {isOpen && (
                    <div className="mt-2 overflow-hidden rounded-lg border border-[#a47b40]/30 bg-[#080a0d]">
                      <div className="border-b border-white/10 px-3 py-2">
                        <p className="text-xs font-semibold text-[#d6ad64]">
                          انتخاب {slot.label}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-500">
                          برای مشاهده قطعات بیشتر اسکرول کن
                        </p>
                      </div>

                      <div className="sg-piece-list max-h-64 overflow-y-auto overscroll-contain p-2">
                        <div className="space-y-1.5">
                          {availableArmorSets.map((set) => {
                            const candidate = set.pieces[slot.id];
                            const isEquipped = equipped[slot.id] === set.id;

                            if (!candidate) return null;

                            return (
                              <button
                                key={`${slot.id}-${set.id}`}
                                type="button"
                                onClick={() => choosePiece(slot.id, set.id)}
                                aria-pressed={isEquipped}
                                className={`flex w-full items-center gap-3 rounded-md border p-2 text-right transition ${focusRing} ${
                                  isEquipped
                                    ? "border-[#d6ad64] bg-[#382b1a]/60"
                                    : "border-white/[0.06] bg-white/[0.02] hover:border-[#a47b40]/60 hover:bg-white/[0.04]"
                                }`}
                              >
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded border border-white/10 bg-black/40">
                                  <ArmorImage
                                    src={candidate.thumb ?? candidate.image}
                                    alt=""
                                    loading="lazy"
                                    className="h-full w-full object-contain"
                                  />
                                </span>

                                <span className="min-w-0 flex-1">
                                  <span
                                    className={`block text-xs font-semibold ${
                                      isEquipped
                                        ? "text-[#e8c989]"
                                        : "text-gray-300"
                                    }`}
                                  >
                                    {candidate.english}
                                  </span>
                                  <span className="mt-1 block text-[10px] text-gray-500">
                                    {set.name}
                                  </span>
                                </span>

                                {isEquipped && (
                                  <span className="shrink-0 text-xs text-[#d6ad64]">
                                    ✓
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="border-t border-white/10 px-3 py-2 text-[10px] text-gray-500">
                        {availableArmorSets.length} گزینه در فهرست
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => togglePiece(slot.id)}
                    aria-pressed={isOn}
                    className={`mt-2 w-full rounded-md border px-3 py-1.5 text-xs transition ${focusRing} ${
                      isOn
                        ? "border-[#a47b40]/50 text-[#d6ad64]"
                        : "border-white/10 text-gray-500"
                    }`}
                  >
                    {isOn ? "✓ نمایش روی شوالیه" : "＋ نمایش قطعه"}
                  </button>
                </div>
              );
            })}
          </div>

          {availableArmorSets.length > 1 && (
            <button
              type="button"
              onClick={randomize}
              className={`mt-4 w-full rounded-lg border border-white/15 px-4 py-3 text-sm text-gray-300 transition hover:border-[#c8a15b] ${focusRing}`}
            >
              ترکیب تصادفی
            </button>
          )}

          <button
            type="button"
            onClick={resetAll}
            className={`mt-3 w-full rounded-lg border border-[#c8a15b]/40 px-4 py-3 text-sm text-[#d6ad64] transition hover:bg-[#c8a15b]/10 ${focusRing}`}
          >
            بازنشانی تجهیزات
          </button>
        </aside>

        {/* صحنه شوالیه */}
        <section className="order-1 min-w-0 lg:order-2">
          <div className="relative overflow-hidden rounded-xl border border-[#a47b40]/40 bg-[#0c1115]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,_#33352f_0%,_#171c20_42%,_#080a0d_80%)]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#8a5926]/10 to-transparent" />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              {embers.map((ember, index) => (
                <span
                  key={index}
                  className="sg-ember"
                  style={
                    {
                      left: `${ember.left}%`,
                      bottom: "6%",
                      width: ember.size,
                      height: ember.size,
                      animationDelay: `${ember.delay}s`,
                      animationDuration: `${ember.duration}s`,
                      "--drift": `${ember.drift}px`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>

            <div
              ref={stageRef}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              className="sg-stage relative flex min-h-[610px] items-center justify-center overflow-hidden px-2 py-6 sm:min-h-[720px]"
            >
              {GLUE_LIGHTING && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-20"
                  style={{
                    mixBlendMode: "soft-light",
                    background:
                      "radial-gradient(ellipse at 50% 34%, rgba(255,226,170,0.22) 0%, rgba(255,226,170,0) 55%), linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)",
                  }}
                />
              )}

              <div
                className="relative aspect-[4/5] w-full max-w-[490px] transition-transform duration-300"
                style={{ transform: `scale(${scale / 100})` }}
              >
                <div
                  aria-hidden
                  className="sg-floor pointer-events-none absolute z-0"
                  style={{
                    left: "20%",
                    bottom: "0%",
                    width: "60%",
                    height: "6%",
                  }}
                />

                <div className="sg-breathe absolute inset-0">
                  {BASE_BODY && (
                    <ArmorImage
                      src={BASE_BODY}
                      alt=""
                      className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none object-contain"
                    />
                  )}

                  {fullImage && (
                    <div
                      className="sg-layer"
                      aria-hidden={!showFull}
                      style={
                        {
                          left: 0,
                          top: 0,
                          width: "100%",
                          height: "100%",
                          zIndex: 1,
                          translate:
                            "calc(var(--px) * 8px) calc(var(--py) * 5px)",
                          opacity: showFull ? 1 : 0,
                          pointerEvents: "none",
                        } as CSSProperties
                      }
                    >
                      <ArmorImage
                        src={fullImage}
                        alt={currentSet?.english ?? ""}
                        className="h-full w-full select-none object-contain"
                        style={{
                          filter:
                            "drop-shadow(0 6px 10px rgba(0,0,0,0.45))",
                        }}
                      />
                    </div>
                  )}

                  <div
                    className="absolute inset-0"
                    style={{
                      zIndex: 2,
                      opacity: showFull ? 0 : 1,
                      transition: "opacity .35s ease",
                      pointerEvents: showFull ? "none" : "auto",
                    }}
                  >
                    {slots.map((slot) => renderLayers(slot.id))}
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 z-10 rounded-[45%] border border-white/[0.035]" />
              </div>
            </div>

            {/* نوار پایین صحنه */}
            <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/30 px-4 py-4">
              <div>
                <p className="text-xs text-gray-500">قطعه انتخاب‌شده</p>
                <p className="mt-1 font-semibold text-[#d6ad64]">
                  {slotLabel(selected)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {SHOW_CALIBRATION && (
                  <button
                    type="button"
                    onClick={() =>
                      setCalibrating((current) => !current)
                    }
                    aria-pressed={calibrating}
                    className={`ml-2 rounded-lg border px-3 py-2 text-xs transition ${focusRing} ${
                      calibrating
                        ? "border-[#d6ad64] text-[#d6ad64]"
                        : "border-white/15 text-gray-400 hover:border-[#c8a15b]"
                    }`}
                  >
                    کالیبراسیون
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setScale((current) => Math.max(75, current - 5))
                  }
                  className={`h-9 w-9 rounded-lg border border-white/15 text-lg hover:border-[#c8a15b] ${focusRing}`}
                  aria-label="کوچک کردن شوالیه"
                >
                  −
                </button>

                <span className="min-w-12 text-center text-xs text-gray-400">
                  {scale}٪
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setScale((current) => Math.min(110, current + 5))
                  }
                  className={`h-9 w-9 rounded-lg border border-white/15 text-lg hover:border-[#c8a15b] ${focusRing}`}
                  aria-label="بزرگ کردن شوالیه"
                >
                  +
                </button>
              </div>
            </div>

            {/* پنل کالیبراسیون */}
            {SHOW_CALIBRATION && calibrating && (
              <div className="relative space-y-4 border-t border-white/10 bg-black/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#d6ad64]">
                    کالیبراسیون: {slotLabel(selected)}
                    <span className="mr-2 text-xs font-normal text-gray-500">
                      {activePiece.english}
                    </span>
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={resetSlotOverrides}
                      className={`rounded-md border border-white/15 px-3 py-1.5 text-xs text-gray-400 hover:border-[#c8a15b] ${focusRing}`}
                    >
                      بازنشانی این قطعه
                    </button>

                    <button
                      type="button"
                      onClick={copyLayout}
                      className={`rounded-md border border-[#c8a15b]/50 px-3 py-1.5 text-xs text-[#d6ad64] hover:bg-[#c8a15b]/10 ${focusRing}`}
                    >
                      {copied ? "کپی شد ✓" : "کپی چیدمان (JSON)"}
                    </button>
                  </div>
                </div>

                {placementsFor(selected).map((placement, index, all) => {
                  const key = `${pieceKey(selected)}:${index}`;

                  return (
                    <div
                      key={key}
                      className="space-y-2 rounded-lg border border-white/10 bg-black/20 p-3"
                    >
                      {all.length > 1 && (
                        <p className="text-xs text-gray-500">
                          لایه {index + 1}
                        </p>
                      )}

                      <Slider
                        label="چپ"
                        value={placement.left}
                        min={-20}
                        max={100}
                        step={0.5}
                        onChange={(value) =>
                          updateOverride(key, { left: value })
                        }
                      />

                      <Slider
                        label="بالا"
                        value={placement.top}
                        min={-20}
                        max={100}
                        step={0.5}
                        onChange={(value) =>
                          updateOverride(key, { top: value })
                        }
                      />

                      <Slider
                        label="عرض"
                        value={placement.width}
                        min={5}
                        max={120}
                        step={0.5}
                        onChange={(value) =>
                          updateOverride(key, { width: value })
                        }
                      />

                      <Slider
                        label="ارتفاع"
                        value={placement.height}
                        min={5}
                        max={120}
                        step={0.5}
                        onChange={(value) =>
                          updateOverride(key, { height: value })
                        }
                      />

                      <Slider
                        label="چرخش"
                        value={placement.rotate ?? 0}
                        min={-45}
                        max={45}
                        step={0.5}
                        onChange={(value) =>
                          updateOverride(key, { rotate: value })
                        }
                      />

                      <Slider
                        label="روشنایی"
                        value={placement.brightness ?? 1}
                        min={0.6}
                        max={1.4}
                        step={0.02}
                        onChange={(value) =>
                          updateOverride(key, { brightness: value })
                        }
                      />
                    </div>
                  );
                })}

                <p className="text-xs leading-6 text-gray-500">
                  هر قطعه را جداگانه تنظیم کن. تنظیمات با رفرش باقی
                  می‌مانند. خروجی «کپی چیدمان» را در pieceLayouts فایل
                  armor-data.ts قرار بده.
                </p>
              </div>
            )}
          </div>

          <p className="mt-3 text-center text-xs leading-6 text-gray-500">
            پیش‌نمایش آزمایشی لایه‌ها · ممکن است محل بعضی قطعات به
            کالیبراسیون نیاز داشته باشد.
          </p>
        </section>

        {/* اطلاعات قطعات */}
        <aside className="order-3 h-fit rounded-xl border border-[#a47b40]/40 bg-[#101419]/95 p-5">
          <p className="text-xs tracking-[0.2em] text-[#c8a15b]">
            {subtitle.toUpperCase()}
          </p>

          <h2 className="mt-3 text-2xl font-bold">{title}</h2>

          {intro && (
            <p className="mt-4 text-sm leading-7 text-gray-400">
              {intro}
            </p>
          )}

          <div className="my-5 h-px bg-[#a47b40]/30" />

          <h3 className="mb-3 font-semibold text-[#d6ad64]">
            جزئیات قطعه
          </h3>

          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="font-semibold">{slotLabel(selected)}</p>
            <p className="mt-2 text-xs text-gray-500">
              {activePiece.english}
            </p>

            {activePiece.description && (
              <p className="mt-4 text-sm leading-7 text-gray-300">
                {activePiece.description}
              </p>
            )}

            {pieceStats.length > 0 && (
              <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
                {pieceStats.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-3"
                  >
                    <dt className="text-gray-400">{row.label}</dt>
                    <dd className="tabular-nums text-[#d6ad64]">
                      {fmt(row.value)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="my-5 h-px bg-[#a47b40]/30" />

          <h3 className="mb-3 font-semibold text-[#d6ad64]">
            وضعیت قطعات
          </h3>

          <div className="space-y-3">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="min-w-0">
                  <span className="block text-gray-300">
                    {slot.label}
                  </span>
                  <span className="mt-0.5 block break-words text-xs text-gray-500">
                    {
                      pieceOf(
                        equipped[slot.id],
                        slot.id,
                        availableArmorSets
                      ).english
                    }
                  </span>
                </span>

                <span
                  className={`shrink-0 ${
                    enabled[slot.id] ? "text-[#d6ad64]" : "text-gray-600"
                  }`}
                >
                  {enabled[slot.id] ? "فعال" : "پنهان"}
                </span>
              </div>
            ))}
          </div>

          {totalStats.length > 0 && (
            <>
              <div className="my-5 h-px bg-[#a47b40]/30" />
              <h3 className="mb-3 font-semibold text-[#d6ad64]">
                مجموع قطعات فعال
              </h3>

              <dl className="space-y-3 text-sm">
                {totalStats.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-3"
                  >
                    <dt className="text-gray-300">{row.label}</dt>
                    <dd className="tabular-nums text-[#d6ad64]">
                      {fmt(row.total)}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          <div className="mt-6 rounded-lg border border-[#a47b40]/30 bg-[#211b13]/50 p-3">
            <p className="text-xs leading-6 text-[#c8b18c]">
              مرحله آزمایشی: لایه‌بندی تصاویر. تنظیم دقیق تناسب بدن و
              اتصال طبیعی قطعات در مرحله بعد انجام می‌شود.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
