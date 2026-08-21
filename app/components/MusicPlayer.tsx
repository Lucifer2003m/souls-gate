"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);

  // ذخیره و خواندن ولوم
  useEffect(() => {
    const savedVolume = localStorage.getItem("souls-gate-volume");

    if (savedVolume !== null) {
      const saved = Number(savedVolume);

      if (!Number.isNaN(saved) && saved >= 0 && saved <= 1) {
        setVolume(saved);

        if (audioRef.current) {
          audioRef.current.volume = saved;
        }
      }
    }
  }, []);

  // Play / Pause
  async function toggleMusic() {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      console.error("Music playback error:", error);
    }
  }

  // کنترل صدا
  function changeVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const newVolume = Number(e.target.value);

    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }

    // ذخیره ولوم
    localStorage.setItem("souls-gate-volume", String(newVolume));
  }

  return (
    <>
      {/* فایل موسیقی */}
      <audio
        ref={audioRef}
        src="/music/background.mp3"
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* موزیک پلیر */}
      <div className="fixed bottom-6 left-6 z-[100]">
        <div className="flex items-center gap-4 border border-[#c8a15b]/30 bg-[#080808]/95 px-4 py-3 shadow-2xl backdrop-blur-md">

          {/* انیمیشن */}
          <div className="flex h-8 items-center gap-1">
            {[1, 2, 3, 4, 5].map((bar) => (
              <span
                key={bar}
                className={`music-bar ${
                  playing ? "music-bar-playing" : ""
                }`}
                style={{
                  animationDelay: `${bar * 0.12}s`,
                }}
              />
            ))}
          </div>

          {/* Play / Pause */}
          <button
            type="button"
            onClick={toggleMusic}
            className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#c8a15b] text-lg text-black transition duration-200 hover:scale-105 active:scale-95"
            aria-label={playing ? "Pause music" : "Play music"}
          >
            {playing ? "⏸" : "▶"}
          </button>

          {/* اطلاعات */}
          <div className="hidden min-w-[130px] sm:block">
            <p className="text-[9px] tracking-[0.3em] text-[#c8a15b]">
              SOULS GATE
            </p>

            <p className="mt-1 text-xs font-bold text-white/80">
              Souls-Gate
            </p>
          </div>

          {/* کنترل صدا */}
          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <span className="text-sm text-white/50">
              {volume === 0 ? "🔇" : "🔊"}
            </span>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={changeVolume}
              className="volume-slider w-20"
              style={{
                background: `linear-gradient(
                  to right,
                  #c8a15b ${volume * 100}%,
                  rgba(255,255,255,0.12) ${volume * 100}%
                )`,
              }}
              aria-label="Volume"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .volume-slider {
          height: 3px;
          cursor: pointer;
          appearance: none;
          border-radius: 999px;
          outline: none;
        }

        .volume-slider::-webkit-slider-thumb {
          width: 10px;
          height: 10px;
          cursor: pointer;
          appearance: none;
          border-radius: 50%;
          background: #c8a15b;
          border: none;
        }

        .volume-slider::-moz-range-thumb {
          width: 10px;
          height: 10px;
          cursor: pointer;
          border-radius: 50%;
          background: #c8a15b;
          border: none;
        }

        .music-bar {
          width: 3px;
          height: 6px;
          background: rgba(200, 161, 91, 0.35);
          border-radius: 999px;
          transition: height 0.3s ease;
        }

        .music-bar-playing {
          animation: music-wave 0.8s ease-in-out infinite alternate;
          background: #c8a15b;
        }

        @keyframes music-wave {
          0% {
            height: 6px;
          }

          100% {
            height: 28px;
          }
        }
      `}</style>
    </>
  );
}