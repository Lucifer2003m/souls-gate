"use client";

import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <a href="/#home" className="group">
          <div className="text-lg font-black tracking-[0.22em]">
            SOULS <span className="text-[#c8a15b]">GATE</span>
          </div>

          <div className="mt-1 text-[7px] tracking-[0.45em] text-white/30 transition group-hover:text-[#c8a15b]/60">
            ENTER THE DARKNESS
          </div>
        </a>

        {/* منوی دسکتاپ */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="/#home"
            className="group relative text-sm text-white/60 transition hover:text-white"
          >
            خانه
            <span className="absolute -bottom-2 left-0 h-px w-0 bg-[#c8a15b] transition-all duration-300 group-hover:w-full" />
          </a>

          <a
            href="/#games"
            className="group relative text-sm text-white/60 transition hover:text-white"
          >
            بازی‌ها
            <span className="absolute -bottom-2 left-0 h-px w-0 bg-[#c8a15b] transition-all duration-300 group-hover:w-full" />
          </a>

          <a
            href="/#about"
            className="group relative text-sm text-white/60 transition hover:text-white"
          >
            درباره
            <span className="absolute -bottom-2 left-0 h-px w-0 bg-[#c8a15b] transition-all duration-300 group-hover:w-full" />
          </a>

          <a
            href="/#stream"
            className="border border-[#c8a15b]/40 px-5 py-2 text-sm text-[#c8a15b] transition duration-300 hover:bg-[#c8a15b] hover:text-black"
          >
            استریم
          </a>
        </div>

        {/* دکمه موبایل */}
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-white/10 transition hover:border-[#c8a15b]/50 md:hidden"
          aria-label="باز کردن منو"
        >
          <span className="block h-px w-5 bg-white" />
          <span className="block h-px w-5 bg-white" />
          <span className="block h-px w-3 self-end bg-[#c8a15b]" />
        </button>
      </nav>

      {/* منوی موبایل */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-black/90 px-6 py-6 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-6 text-right">
            <a
              href="/#home"
              onClick={() => setMenuOpen(false)}
              className="text-white/70 transition hover:text-[#c8a15b]"
            >
              خانه
            </a>

            <a
              href="/#games"
              onClick={() => setMenuOpen(false)}
              className="text-white/70 transition hover:text-[#c8a15b]"
            >
              بازی‌ها
            </a>

            <a
              href="/#about"
              onClick={() => setMenuOpen(false)}
              className="text-white/70 transition hover:text-[#c8a15b]"
            >
              درباره
            </a>

            <a
              href="/#stream"
              onClick={() => setMenuOpen(false)}
              className="text-[#c8a15b]"
            >
              استریم
            </a>
          </div>
        </div>
      )}
    </header>
  );
}