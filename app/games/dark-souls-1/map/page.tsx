"use client";

import { useMemo, useState } from "react";

type PointType = "bonfire" | "boss" | "npc" | "secret";

type MapPoint = {
  id: string;
  name: string;
  type: PointType;
  x: number;
  y: number;
  description: string;
};

type Area = {
  id: string;
  name: string;
  subtitle: string;
  x: number;
  y: number;
};

const areas: Area[] = [
  {
    id: "undead-asylum",
    name: "NORTHERN UNDEAD ASYLUM",
    subtitle: "THE BEGINNING",
    x: 47,
    y: 8,
  },
  {
    id: "firelink",
    name: "FIRELINK SHRINE",
    subtitle: "THE CENTRAL HUB",
    x: 48,
    y: 30,
  },
  {
    id: "undead-burg",
    name: "UNDEAD BURG",
    subtitle: "THE CITY OF THE UNDEAD",
    x: 47,
    y: 48,
  },
  {
    id: "undead-parish",
    name: "UNDEAD PARISH",
    subtitle: "THE FIRST BELL",
    x: 68,
    y: 43,
  },
  {
    id: "darkroot-garden",
    name: "DARKROOT GARDEN",
    subtitle: "THE FOREST",
    x: 82,
    y: 28,
  },
  {
    id: "darkroot-basin",
    name: "DARKROOT BASIN",
    subtitle: "THE BASIN",
    x: 82,
    y: 52,
  },
  {
    id: "depths",
    name: "THE DEPTHS",
    subtitle: "BELOW THE BURG",
    x: 32,
    y: 61,
  },
  {
    id: "blighttown",
    name: "BLIGHTTOWN",
    subtitle: "THE SWAMP",
    x: 23,
    y: 78,
  },
  {
    id: "new-londo",
    name: "NEW LONDO RUINS",
    subtitle: "THE FLOODED CITY",
    x: 67,
    y: 72,
  },
  {
    id: "valley-drakes",
    name: "VALLEY OF DRakes",
    subtitle: "THE VALLEY",
    x: 84,
    y: 72,
  },
  {
    id: "catacombs",
    name: "THE CATACOMBS",
    subtitle: "THE GRAVE",
    x: 55,
    y: 68,
  },
  {
    id: "anor-londo",
    name: "ANOR LONDO",
    subtitle: "THE CITY OF GODS",
    x: 72,
    y: 13,
  },
];

const connections = [
  ["undead-asylum", "firelink"],
  ["firelink", "undead-burg"],
  ["undead-burg", "undead-parish"],
  ["undead-burg", "depths"],
  ["undead-burg", "darkroot-basin"],
  ["undead-parish", "darkroot-garden"],
  ["darkroot-garden", "darkroot-basin"],
  ["darkroot-basin", "valley-drakes"],
  ["depths", "blighttown"],
  ["blighttown", "new-londo"],
  ["new-londo", "valley-drakes"],
  ["firelink", "new-londo"],
  ["firelink", "catacombs"],
  ["catacombs", "blighttown"],
  ["undead-parish", "anor-londo"],
];

const points: MapPoint[] = [
  {
    id: "firelink-bonfire",
    name: "FIRELINK SHRINE BONFIRE",
    type: "bonfire",
    x: 48,
    y: 35,
    description:
      "یکی از مهم‌ترین نقاط استراحت و مرکز رفت‌وآمد Lordran.",
  },
  {
    id: "burg-bonfire",
    name: "UNDEAD BURG BONFIRE",
    type: "bonfire",
    x: 43,
    y: 51,
    description:
      "Bonfire اصلی بخش بالایی Undead Burg.",
  },
  {
    id: "parish-bonfire",
    name: "UNDEAD PARISH BONFIRE",
    type: "bonfire",
    x: 65,
    y: 48,
    description:
      "Bonfire نزدیک کلیسای Undead Parish.",
  },
  {
    id: "asylum-demon",
    name: "ASYLUM DEMON",
    type: "boss",
    x: 47,
    y: 12,
    description:
      "اولین Boss مهم مسیر Chosen Undead.",
  },
  {
    id: "taurus-demon",
    name: "TAURUS DEMON",
    type: "boss",
    x: 48,
    y: 43,
    description:
      "Boss منطقه Upper Undead Burg.",
  },
  {
    id: "gargoyles",
    name: "BELL GARGOYLES",
    type: "boss",
    x: 69,
    y: 37,
    description:
      "نبرد مهم در Undead Parish و نگهبان اولین Bell of Awakening.",
  },
  {
    id: "solaire",
    name: "SOLAIRE OF ASTORA",
    type: "npc",
    x: 54,
    y: 46,
    description:
      "یکی از شناخته‌شده‌ترین NPCهای Dark Souls که در مسیر Undead Burg با او روبه‌رو می‌شوی.",
  },
  {
    id: "andre",
    name: "ANDRE OF ASTORA",
    type: "npc",
    x: 64,
    y: 53,
    description:
      "Blacksmith مهم در Undead Parish.",
  },
  {
    id: "crow",
    name: "THE GIANT CROW",
    type: "secret",
    x: 54,
    y: 25,
    description:
      "مسیر بازگشت به Northern Undead Asylum از Firelink Shrine.",
  },
];

const filterLabels: Record<PointType | "all", string> = {
  all: "ALL",
  bonfire: "BONFIRES",
  boss: "BOSSES",
  npc: "NPCS",
  secret: "SECRETS",
};

const pointIcons: Record<PointType, string> = {
  bonfire: "🔥",
  boss: "☠",
  npc: "♙",
  secret: "✦",
};

export default function DarkSoulsMapPage() {
  const [selectedArea, setSelectedArea] = useState<Area | null>(areas[1]);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [filter, setFilter] = useState<PointType | "all">("all");
  const [zoom, setZoom] = useState(1);

  const visiblePoints = useMemo(() => {
    if (filter === "all") return points;

    return points.filter((point) => point.type === filter);
  }, [filter]);

  const getArea = (id: string) => {
    return areas.find((area) => area.id === id);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#030303] text-white">

      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-xl">

        <div className="mx-auto flex h-16 max-w-[1800px] items-center justify-between px-5">

          <div>
            <p className="text-[8px] tracking-[0.4em] text-[#c8a15b]">
              SOULS GATE
            </p>

            <h1 className="mt-1 text-sm font-black tracking-[0.2em]">
              DARK SOULS I
            </h1>
          </div>

          <div className="hidden text-center sm:block">
            <p className="text-[8px] tracking-[0.4em] text-white/25">
              WORLD MAP
            </p>

            <p className="mt-1 text-xs font-bold tracking-[0.3em] text-[#c8a15b]">
              LORDRAN
            </p>
          </div>

          <div className="text-right">
            <p className="text-[8px] text-white/20">
              DISCOVERY
            </p>

            <p className="mt-1 text-xs font-bold">
              {points.length} MARKERS
            </p>
          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="flex min-h-screen pt-16">

        {/* ===================================================
            MAP
        ==================================================== */}

        <section className="relative min-h-[calc(100vh-64px)] flex-1 overflow-hidden">

          {/* atmospheric background */}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,161,91,0.09),transparent_50%)]" />

          <div className="absolute inset-0 opacity-[0.08]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              }}
            />
          </div>

          {/* MAP CONTROLS */}

          <div className="absolute left-5 top-5 z-40 flex flex-col gap-2">

            <button
              type="button"
              onClick={() =>
                setZoom((value) => Math.min(value + 0.15, 1.8))
              }
              className="h-10 w-10 border border-white/10 bg-black/70 text-lg text-white/60 backdrop-blur transition hover:border-[#c8a15b] hover:text-[#c8a15b]"
            >
              +
            </button>

            <button
              type="button"
              onClick={() =>
                setZoom((value) => Math.max(value - 0.15, 0.7))
              }
              className="h-10 w-10 border border-white/10 bg-black/70 text-lg text-white/60 backdrop-blur transition hover:border-[#c8a15b] hover:text-[#c8a15b]"
            >
              −
            </button>

          </div>

          {/* FILTERS */}

          <div className="absolute right-5 top-5 z-40 flex max-w-[calc(100%-80px)] flex-wrap justify-end gap-2">

            {(
              ["all", "bonfire", "boss", "npc", "secret"] as const
            ).map((type) => (

              <button
                key={type}
                type="button"
                onClick={() => setFilter(type)}
                className={`border px-3 py-2 text-[8px] font-bold tracking-[0.15em] backdrop-blur transition ${
                  filter === type
                    ? "border-[#c8a15b] bg-[#c8a15b] text-black"
                    : "border-white/10 bg-black/70 text-white/40 hover:border-[#c8a15b]/50 hover:text-[#c8a15b]"
                }`}
              >
                {filterLabels[type]}
              </button>

            ))}

          </div>

          {/* =================================================
              MAP CANVAS
          ================================================== */}

          <div className="absolute inset-0 overflow-auto">

            <div
              className="relative h-[1000px] min-w-[1100px] origin-center transition-transform duration-300"
              style={{
                transform: `scale(${zoom})`,
              }}
            >

              {/* MAP TERRAIN */}

              <div className="absolute inset-[8%] rounded-[45%] border border-[#c8a15b]/10 bg-[radial-gradient(ellipse_at_center,rgba(80,65,40,0.12),transparent_65%)]" />

              <div className="absolute left-[15%] top-[20%] h-[280px] w-[280px] rounded-full bg-[#c8a15b]/[0.025] blur-3xl" />

              <div className="absolute bottom-[10%] right-[15%] h-[350px] w-[350px] rounded-full bg-blue-950/10 blur-3xl" />

              {/* =================================================
                  CONNECTION LINES
              ================================================== */}

              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 1000 1000"
                preserveAspectRatio="none"
              >

                {connections.map(([fromId, toId]) => {

                  const from = getArea(fromId);
                  const to = getArea(toId);

                  if (!from || !to) return null;

                  return (
                    <line
                      key={`${fromId}-${toId}`}
                      x1={`${from.x * 10}`}
                      y1={`${from.y * 10}`}
                      x2={`${to.x * 10}`}
                      y2={`${to.y * 10}`}
                      stroke="rgba(200,161,91,0.22)"
                      strokeWidth="2"
                      strokeDasharray="5 8"
                    />
                  );

                })}

              </svg>

              {/* =================================================
                  AREA NODES
              ================================================== */}

              {areas.map((area) => {

                const active = selectedArea?.id === area.id;

                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => {
                      setSelectedArea(area);
                      setSelectedPoint(null);
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                      active ? "z-30 scale-110" : "z-20"
                    }`}
                    style={{
                      left: `${area.x}%`,
                      top: `${area.y}%`,
                    }}
                  >

                    <div
                      className={`relative flex h-24 w-24 items-center justify-center rounded-full border transition-all duration-300 ${
                        active
                          ? "border-[#c8a15b] bg-[#c8a15b]/10 shadow-[0_0_45px_rgba(200,161,91,0.2)]"
                          : "border-white/10 bg-[#070707]/90 hover:border-[#c8a15b]/60"
                      }`}
                    >

                      {active && (
                        <div className="absolute inset-[-10px] rounded-full border border-[#c8a15b]/10" />
                      )}

                      <div className="text-center">

                        <div
                          className={`text-[8px] font-black tracking-[0.12em] ${
                            active
                              ? "text-[#c8a15b]"
                              : "text-white/60"
                          }`}
                        >
                          {area.name}
                        </div>

                        <div className="mt-2 text-[6px] tracking-[0.15em] text-white/20">
                          {area.subtitle}
                        </div>

                      </div>

                    </div>

                  </button>
                );
              })}

              {/* =================================================
                  MAP POINTS
              ================================================== */}

              {visiblePoints.map((point) => (

                <button
                  key={point.id}
                  type="button"
                  onClick={() => setSelectedPoint(point)}
                  className={`absolute z-40 -translate-x-1/2 -translate-y-1/2 transition duration-300 hover:scale-125 ${
                    selectedPoint?.id === point.id
                      ? "scale-125"
                      : ""
                  }`}
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                  }}
                >

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border bg-black/90 text-sm shadow-lg ${
                      point.type === "bonfire"
                        ? "border-orange-500/50"
                        : point.type === "boss"
                          ? "border-red-500/50"
                          : point.type === "npc"
                            ? "border-blue-400/50"
                            : "border-[#c8a15b]/50"
                    }`}
                  >
                    {pointIcons[point.type]}
                  </div>

                </button>

              ))}

              {/* MAP TITLE */}

              <div className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">

                <p className="text-[9px] tracking-[0.6em] text-[#c8a15b]/40">
                  THE LAND OF
                </p>

                <h2 className="mt-3 text-5xl font-black tracking-[0.2em] text-white/[0.04]">
                  LORDRAN
                </h2>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            INFORMATION PANEL
        ==================================================== */}

        <aside className="hidden w-[360px] shrink-0 border-l border-white/10 bg-[#070707] lg:block">

          <div className="sticky top-16 flex h-[calc(100vh-64px)] flex-col">

            {/* PANEL HEADER */}

            <div className="border-b border-white/10 p-7">

              <p className="text-[8px] tracking-[0.4em] text-[#c8a15b]">
                LORDRAN DATABASE
              </p>

              <h2 className="mt-3 text-2xl font-black">
                {selectedPoint
                  ? selectedPoint.name
                  : selectedArea?.name || "SELECT AN AREA"}
              </h2>

            </div>

            {/* PANEL CONTENT */}

            <div className="flex-1 overflow-y-auto p-7">

              {selectedPoint ? (

                <div>

                  <div className="flex items-center gap-3">

                    <span className="text-2xl">
                      {pointIcons[selectedPoint.type]}
                    </span>

                    <div>

                      <p className="text-[8px] tracking-[0.3em] text-white/20">
                        {filterLabels[selectedPoint.type]}
                      </p>

                      <p className="mt-1 text-xs font-bold text-[#c8a15b]">
                        DISCOVERED LOCATION
                      </p>

                    </div>

                  </div>

                  <div className="mt-8 border-t border-white/5 pt-7">

                    <p className="text-xs leading-8 text-white/40">
                      {selectedPoint.description}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPoint(null)}
                    className="mt-8 border border-white/10 px-5 py-3 text-[8px] tracking-[0.2em] text-white/40 transition hover:border-[#c8a15b] hover:text-[#c8a15b]"
                  >
                    BACK TO AREA
                  </button>

                </div>

              ) : selectedArea ? (

                <div>

                  <p className="text-[9px] tracking-[0.35em] text-[#c8a15b]">
                    {selectedArea.subtitle}
                  </p>

                  <div className="mt-8 space-y-4">

                    <InfoRow label="AREA" value={selectedArea.name} />

                    <InfoRow
                      label="MAP STATUS"
                      value="DISCOVERABLE"
                    />

                    <InfoRow
                      label="MARKERS"
                      value={String(
                        points.filter(
                          (point) =>
                            Math.abs(point.x - selectedArea.x) < 8 &&
                            Math.abs(point.y - selectedArea.y) < 8
                        ).length
                      )}
                    />

                  </div>

                  <div className="mt-10">

                    <p className="text-[8px] tracking-[0.3em] text-white/20">
                      CONNECTED AREAS
                    </p>

                    <div className="mt-4 space-y-2">

                      {connections
                        .filter(
                          ([from, to]) =>
                            from === selectedArea.id ||
                            to === selectedArea.id
                        )
                        .map(([from, to]) => {

                          const otherId =
                            from === selectedArea.id ? to : from;

                          const other = getArea(otherId);

                          if (!other) return null;

                          return (
                            <button
                              key={other.id}
                              type="button"
                              onClick={() => setSelectedArea(other)}
                              className="flex w-full items-center justify-between border border-white/5 bg-white/[0.02] px-4 py-3 text-left transition hover:border-[#c8a15b]/40"
                            >

                              <span className="text-[9px] font-bold text-white/40">
                                {other.name}
                              </span>

                              <span className="text-[#c8a15b]">
                                →
                              </span>

                            </button>
                          );
                        })}

                    </div>

                  </div>

                </div>

              ) : (

                <p className="text-sm text-white/30">
                  یک منطقه را از روی نقشه انتخاب کن.
                </p>

              )}

            </div>

            {/* LEGEND */}

            <div className="border-t border-white/10 p-6">

              <p className="text-[8px] tracking-[0.3em] text-white/20">
                MAP LEGEND
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">

                {(
                  ["bonfire", "boss", "npc", "secret"] as PointType[]
                ).map((type) => (

                  <div
                    key={type}
                    className="flex items-center gap-2 text-[8px] text-white/30"
                  >
                    <span>
                      {pointIcons[type]}
                    </span>

                    {filterLabels[type]}

                  </div>

                ))}

              </div>

            </div>

          </div>

        </aside>

      </div>

    </main>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-4">

      <span className="text-[8px] tracking-[0.25em] text-white/20">
        {label}
      </span>

      <span className="max-w-[190px] text-right text-[9px] font-bold text-white/50">
        {value}
      </span>

    </div>
  );
}