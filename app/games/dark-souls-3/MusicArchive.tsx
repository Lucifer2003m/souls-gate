"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Track = {
  id: string;
  title: string;
  filename: string;
  category: "main" | "ashes" | "ringed" | "unused" | "bonus";
  kind: "boss" | "ambient" | "special" | "unused";
  note: string;
};

const tracks: Track[] = [
  { id: "1-01", title: "Dark Souls III", filename: "1-01 Dark Souls III.mp3", category: "main", kind: "special", note: "Main Theme" },
  { id: "1-02", title: "Prologue", filename: "1-02 Prologue.flac", category: "main", kind: "special", note: "Opening" },
  { id: "1-03", title: "Premonition", filename: "1-03 Premonition.flac", category: "main", kind: "special", note: "Opening Sequence" },
  { id: "1-04", title: "Iudex Gundyr", filename: "1-04 Iudex Gundyr.flac", category: "main", kind: "boss", note: "Boss Theme" },
  { id: "1-05", title: "Firelink Shrine", filename: "1-05 Firelink Shrine.flac", category: "main", kind: "ambient", note: "Firelink Shrine" },
  { id: "1-06", title: "Vordt Of The Boreal Valley", filename: "1-06 Vordt Of The Boreal Valley.flac", category: "main", kind: "boss", note: "Boss Theme" },
  { id: "1-07", title: "Curse-Rotted Greatwood", filename: "1-07 Curse-Rotted Greatwood.flac", category: "main", kind: "boss", note: "Boss Theme" },
  { id: "1-08", title: "Crystal Sages", filename: "1-08 Crystal Sages.flac", category: "main", kind: "boss", note: "Boss Theme" },
  { id: "1-09", title: "High Lord Wolnir", filename: "1-09 High Lord Wolnir.flac", category: "main", kind: "boss", note: "Boss Theme" },
  { id: "1-10", title: "Old Demon King", filename: "1-10 Old Demon King.flac", category: "main", kind: "boss", note: "Boss Theme" },
  { id: "1-11", title: "Deacons Of The Deep", filename: "1-11 Deacons Of The Deep.flac", category: "main", kind: "boss", note: "Boss Theme" },
  { id: "1-12", title: "Abyss Watchers", filename: "1-12 Abyss Watchers.flac", category: "main", kind: "boss", note: "Boss Theme" },
  { id: "1-13", title: "E3 2015 Debut Trailer", filename: "1-13 E3 2015 Debut Trailer.flac", category: "bonus", kind: "special", note: "Trailer Music" },
  { id: "1-14", title: "Yhorm The Giant", filename: "1-14 Yhorm The Giant.flac", category: "main", kind: "boss", note: "Boss Theme" },
  { id: "1-15", title: "Pontiff Sulyvahn", filename: "1-15 Pontiff Sulyvahn.flac", category: "main", kind: "boss", note: "Boss Theme" },
  { id: "1-16", title: "Aldrich, Devourer Of Gods", filename: "1-16 Aldrich, Devourer Of Gods.flac", category: "main", kind: "boss", note: "Boss Theme" },
  { id: "1-17", title: "Dancer Of The Boreal Valley", filename: "1-17 Dancer Of The Boreal Valley.flac", category: "main", kind: "boss", note: "Boss Theme" },
  { id: "1-18", title: "Oceiros, The Consumed King", filename: "1-18 Oceiros, The Consumed King.flac", category: "main", kind: "boss", note: "Boss Theme" },
  { id: "1-19", title: "Secret Betrayal", filename: "1-19 Secret Betrayal.flac", category: "main", kind: "special", note: "Special Track" },
  { id: "1-20", title: "Ancient Wyvern", filename: "1-20 Ancient Wyvern.flac", category: "main", kind: "boss", note: "Boss Theme" },
  { id: "1-21", title: "Nameless King", filename: "1-21 Nameless King.flac", category: "main", kind: "boss", note: "Boss Theme" },
  { id: "1-22", title: "Dragonslayer Armour", filename: "1-22 Dragonslayer Armour.flac", category: "main", kind: "boss", note: "Boss Theme" },
  { id: "1-23", title: "Lorian, Elder Prince, Lothric, Younger Prince", filename: "1-23 Lorian, Elder Prince, Lothric, Younger Prince.flac", category: "main", kind: "boss", note: "Boss Theme" },
  { id: "1-24", title: "Soul Of Cinder", filename: "1-24 Soul Of Cinder.flac", category: "main", kind: "boss", note: "Final Boss Theme" },
  { id: "1-25", title: "Epilogue", filename: "1-25 Epilogue.flac", category: "main", kind: "special", note: "Epilogue" },
  { id: "2-01", title: "Dark Souls III (Demo Version)", filename: "2-01 Dark Souls III (Demo version).flac", category: "bonus", kind: "special", note: "Demo Version" },
  { id: "2-02", title: "Unused Track 1", filename: "2-02 Unused Track 1.flac", category: "unused", kind: "unused", note: "Unused Music" },
  { id: "2-03", title: "Unused Track 2", filename: "2-03 Unused Track 2.flac", category: "unused", kind: "unused", note: "Unused Music" },
  { id: "2-04", title: "Unused Track 3", filename: "2-04 Unused Track 3.flac", category: "unused", kind: "unused", note: "Unused Music" },
  { id: "2-05", title: "Unused Track 4", filename: "2-05 Unused Track 4.flac", category: "unused", kind: "unused", note: "Unused Music" },
  { id: "2-06", title: "Unused Track 5", filename: "2-06 Unused Track 5.flac", category: "unused", kind: "unused", note: "Unused Music" },
  { id: "2-07", title: "Unused Track 6", filename: "2-07 Unused Track 6.flac", category: "unused", kind: "unused", note: "Unused Music" },
  { id: "2-08", title: "Dragonslayer Armour (Unused Version)", filename: "2-08 Dragonslayer Armour (unused version).flac", category: "unused", kind: "unused", note: "Unused Boss Version" },
  { id: "2-09", title: "Champion's Gravetender & Gravetender Greatwolf", filename: "2-09 Champion's Gravetender & Gravetender Greatwolf.flac", category: "ashes", kind: "boss", note: "Ashes of Ariandel · Boss Theme" },
  { id: "2-10", title: "Sister Friede And Father Ariandel", filename: "2-10 Sister Friede and Father Ariandel.flac", category: "ashes", kind: "boss", note: "Ashes of Ariandel · Boss Theme" },
  { id: "2-11", title: "Slave Knight Gael (Transitory Lands Version)", filename: "2-11 Slave Knight Gael (Transitory Lands ver.).flac", category: "ringed", kind: "boss", note: "The Ringed City · Alternate Version" },
  { id: "2-12", title: "Unused Track 7", filename: "2-12 Unused Track 7.flac", category: "unused", kind: "unused", note: "Unused Music" },
  { id: "2-13", title: "Unused Track 8", filename: "2-13 Unused Track 8.flac", category: "unused", kind: "unused", note: "Unused Music" },
  { id: "2-14", title: "Demon Prince", filename: "2-14 Demon Prince.flac", category: "ringed", kind: "boss", note: "The Ringed City · Boss Theme" },
  { id: "2-15", title: "Halflight, Spear Of The Church", filename: "2-15 Halflight, Spear of the Church.flac", category: "ringed", kind: "boss", note: "The Ringed City · Boss Theme" },
  { id: "2-16", title: "Darkeater Midir", filename: "2-16 Darkeater Midir.flac", category: "ringed", kind: "boss", note: "The Ringed City · Boss Theme" },
  { id: "2-17", title: "Unused Track 10", filename: "2-17 Unused Track 10.flac", category: "unused", kind: "unused", note: "Unused Music" },
  { id: "2-18", title: "Unused Track 9", filename: "2-18 Unused Track 9.flac", category: "unused", kind: "unused", note: "Unused Music" },
  { id: "2-19", title: "Slave Knight Gael", filename: "2-19 Slave Knight Gael.flac", category: "ringed", kind: "boss", note: "The Ringed City · Boss Theme" },
  { id: "2-20", title: "Epilogue (Alternative Edit)", filename: "2-20 Epilogue (Alternative Edit).flac", category: "bonus", kind: "special", note: "Alternative Epilogue" },
];

const filters = [
  { id: "all", label: "ALL TRACKS" },
  { id: "main", label: "MAIN GAME" },
  { id: "ashes", label: "ASHES OF ARIANDEL" },
  { id: "ringed", label: "THE RINGED CITY" },
  { id: "unused", label: "UNUSED" },
  { id: "bonus", label: "SPECIAL" },
] as const;

const storageBase = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/game-assets/ds3/music/`
  : "";

function getTrackUrl(filename: string) {
  return storageBase + encodeURIComponent(filename);
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export default function MusicArchive() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentId, setCurrentId] = useState("1-01");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackError, setPlaybackError] = useState("");

  const currentTrack = tracks.find((track) => track.id === currentId) ?? tracks[0];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("souls-gate-ds3-music-favorites-v1");
      if (saved) setFavorites(JSON.parse(saved));
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("souls-gate-ds3-music-favorites-v1", JSON.stringify(favorites));
    } catch {
      // Favorites remain available for this session if storage is unavailable.
    }
  }, [favorites]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = getTrackUrl(currentTrack.filename);
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    setPlaybackError("");
  }, [currentId, currentTrack.filename]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    if (isPlaying) {
      void audio.play().catch(() => {
        setIsPlaying(false);
        setPlaybackError("پخش انجام نشد؛ مسیر فایل و آپلود آن در Supabase را بررسی کن.");
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, volume, currentId]);

  const visibleTracks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tracks.filter((track) => {
      const matchesFilter = activeFilter === "all" || track.category === activeFilter;
      const matchesFavorite = !showFavorites || favorites.includes(track.id);
      const matchesSearch =
        !query ||
        `${track.id} ${track.title} ${track.note}`.toLowerCase().includes(query);
      return matchesFilter && matchesFavorite && matchesSearch;
    });
  }, [activeFilter, favorites, search, showFavorites]);

  const playTrack = (track: Track) => {
    setCurrentId(track.id);
    setIsPlaying(true);
    setPlaybackError("");
  };

  const playNext = () => {
    const index = tracks.findIndex((track) => track.id === currentId);
    setCurrentId(tracks[(index + 1) % tracks.length].id);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    const index = tracks.findIndex((track) => track.id === currentId);
    setCurrentId(tracks[(index - 1 + tracks.length) % tracks.length].id);
    setIsPlaying(true);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
    );
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <div className="space-y-7 text-[#eee6d5]">
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={playNext}
        onError={() => {
          if (isPlaying) setPlaybackError("فایل پیدا نشد یا هنوز در مسیر Supabase بارگذاری نشده است.");
        }}
      />

      <section className="relative isolate overflow-hidden border border-[#c8a15b]/35 bg-[#090a08]">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-65"
          style={{ backgroundImage: "url('/images/ds3/music-hero.jpg')" }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/75 to-[#171207]/55" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_40%,rgba(221,164,47,0.22),transparent_48%)]" />
        <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.2fr_.8fr] lg:items-end lg:p-12">
          <div>
            <p className="text-[10px] tracking-[0.32em] text-[#d9b66f]">THE SOUND OF A DYING AGE</p>
            <h3 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[#f2e5c8] sm:text-5xl">
              THE SOUNDTRACK
              <span className="mt-1 block text-[#d7ad58]">ARCHIVE</span>
            </h3>
            <p dir="rtl" className="mt-5 max-w-xl text-sm leading-8 text-white/75">
              از آتش نخستین تا پایان عصر خاکستر؛ موسیقی باس‌ها، سرزمین‌ها و دو بسته الحاقی Dark Souls III.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <span className="border border-[#c8a15b]/40 bg-black/45 px-3 py-2 text-[10px] tracking-widest text-[#e2c27e]">45 TRACKS</span>
              <span className="border border-white/15 bg-black/45 px-3 py-2 text-[10px] tracking-widest text-white/65">FLAC COLLECTION</span>
              <span className="border border-white/15 bg-black/45 px-3 py-2 text-[10px] tracking-widest text-white/65">2 DLCs</span>
            </div>
          </div>
          <div className="border border-[#c8a15b]/25 bg-black/55 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[10px] tracking-[0.2em] text-[#d8b66e]">
              <span>NOW SELECTED</span>
              <span>{currentTrack.id}</span>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-[#c8a15b]/45 bg-[#c8a15b]/10 font-serif text-3xl text-[#e3bd72]">♫</div>
              <div className="min-w-0">
                <p className="truncate font-serif text-lg text-[#f0e4cc]">{currentTrack.title}</p>
                <p className="mt-1 text-xs text-white/50">{currentTrack.note}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPlaying((value) => !value)}
              className="mt-5 w-full border border-[#c8a15b]/55 bg-[#c8a15b]/10 px-4 py-3 text-xs tracking-[0.18em] text-[#f0d18a] transition hover:bg-[#c8a15b]/20"
            >
              {isPlaying ? "Ⅱ  PAUSE TRACK" : "▶  PLAY SELECTED TRACK"}
            </button>
          </div>
        </div>
      </section>

      {!storageBase && (
        <div dir="rtl" className="border border-red-400/30 bg-red-950/20 p-4 text-sm leading-7 text-red-200">
          آدرس Supabase در متغیر NEXT_PUBLIC_SUPABASE_URL پیدا نشد. این متغیر باید در فایل .env.local تعریف شده باشد.
        </div>
      )}

      <section className="border border-[#c8a15b]/25 bg-black/45 p-4 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.25em] text-[#d8b66e]">THE COLLECTION</p>
            <h3 className="mt-2 font-serif text-2xl text-[#f0e8dc]">Music Library</h3>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search track or boss..."
              aria-label="Search music"
              className="min-w-0 border border-white/15 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#c8a15b]/60 sm:w-64"
            />
            <button
              type="button"
              onClick={() => setShowFavorites((value) => !value)}
              className={`border px-4 py-3 text-xs tracking-wider transition ${showFavorites ? "border-[#c8a15b] bg-[#c8a15b]/15 text-[#e8c77f]" : "border-white/15 text-white/65 hover:border-[#c8a15b]/50"}`}
            >
              {showFavorites ? "★ FAVORITES ON" : "☆ FAVORITES"}
            </button>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`shrink-0 border px-3 py-2 text-[9px] tracking-[0.12em] transition ${activeFilter === filter.id ? "border-[#c8a15b]/70 bg-[#c8a15b]/15 text-[#e7c77e]" : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-2 md:grid-cols-2">
          {visibleTracks.map((track) => {
            const selected = track.id === currentId;
            const favorite = favorites.includes(track.id);
            return (
              <div
                key={track.id}
                className={`flex min-w-0 items-center gap-3 border p-3 transition ${selected ? "border-[#c8a15b]/65 bg-[#c8a15b]/10" : "border-white/10 bg-white/[0.025] hover:border-[#c8a15b]/35 hover:bg-white/[0.045]"}`}
              >
                <button
                  type="button"
                  onClick={() => playTrack(track)}
                  aria-label={`Play ${track.title}`}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center border text-sm ${selected ? "border-[#c8a15b]/60 bg-[#c8a15b]/15 text-[#e8c77f]" : "border-white/15 text-[#d8b66e] hover:border-[#c8a15b]/50"}`}
                >
                  {selected && isPlaying ? "Ⅱ" : "▶"}
                </button>
                <button type="button" onClick={() => playTrack(track)} className="min-w-0 flex-1 text-left">
                  <span className="flex items-center gap-2">
                    <span className="text-[9px] tracking-wider text-[#c8a15b]/75">{track.id}</span>
                    {selected && <span className="h-1.5 w-1.5 rounded-full bg-[#e6bd68]" />}
                  </span>
                  <span className={`mt-1 block truncate text-sm ${selected ? "text-[#f0d18a]" : "text-white/85"}`}>{track.title}</span>
                  <span className="mt-1 block truncate text-[10px] text-white/40">{track.note}</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(track.id)}
                  aria-label={favorite ? "Remove favorite" : "Add favorite"}
                  className={`shrink-0 px-2 py-2 text-lg ${favorite ? "text-[#e6bd68]" : "text-white/30 hover:text-[#e6bd68]"}`}
                >
                  {favorite ? "★" : "☆"}
                </button>
              </div>
            );
          })}
          {visibleTracks.length === 0 && (
            <p dir="rtl" className="col-span-full border border-white/10 px-4 py-10 text-center text-sm text-white/50">
              قطعه‌ای با این جست‌وجو یا فیلتر پیدا نشد.
            </p>
          )}
        </div>
      </section>

      <section className="sticky bottom-3 z-30 border border-[#c8a15b]/45 bg-[#090a08]/95 p-4 shadow-[0_12px_50px_rgba(0,0,0,.55)] backdrop-blur-xl sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#c8a15b]/40 bg-[#c8a15b]/10 text-2xl text-[#e2bd73]">♫</div>
            <div className="min-w-0">
              <p className="truncate font-serif text-sm text-[#f0e4cc]">{currentTrack.title}</p>
              <p className="mt-1 text-[10px] tracking-wider text-white/45">{currentTrack.id} · {currentTrack.filename.toLowerCase().endsWith(".mp3") ? "MP3" : "FLAC"}</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center justify-center gap-5">
              <button type="button" onClick={playPrevious} aria-label="Previous track" className="text-lg text-white/65 transition hover:text-[#e6c47e]">|◀</button>
              <button type="button" onClick={() => setIsPlaying((value) => !value)} aria-label={isPlaying ? "Pause" : "Play"} className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c8a15b]/65 bg-[#c8a15b]/10 text-lg text-[#f0d18a] transition hover:bg-[#c8a15b]/20">
                {isPlaying ? "Ⅱ" : "▶"}
              </button>
              <button type="button" onClick={playNext} aria-label="Next track" className="text-lg text-white/65 transition hover:text-[#e6c47e]">▶|</button>
            </div>
            <div className="flex items-center gap-3 text-[10px] tabular-nums text-white/45">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={Math.min(currentTime, duration || 0)}
                onChange={(event) => seek(Number(event.target.value))}
                aria-label="Track progress"
                className="h-1 min-w-0 flex-1 cursor-pointer accent-[#c8a15b]"
              />
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 lg:w-36">
            <span className="text-xs text-[#d8b66e]">♫</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              aria-label="Volume"
              className="w-24 cursor-pointer accent-[#c8a15b]"
            />
          </div>
        </div>
        {playbackError && <p dir="rtl" className="mt-3 text-xs text-amber-200/80">{playbackError}</p>}
      </section>
    </div>
  );
}
