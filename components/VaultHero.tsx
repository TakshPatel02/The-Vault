"use client";

import { useCallback, useState } from "react";
import { HaloCardCarousel } from "@/components/HaloCardCarousel";

const vaultImages = Array.from({ length: 9 }, (_, index) => ({
  src: `/images/image-${index + 1}.jpg`,
  alt: `The Vault archive frame ${String(index + 1).padStart(2, "0")}`,
}));

export function VaultHero() {
  const [hasDragged, setHasDragged] = useState(false);
  const handleFirstDrag = useCallback(() => setHasDragged(true), []);

  return (
    <main className="relative h-svh w-full overflow-hidden bg-bg-primary text-text-primary">
      {/* ── Brand mark ── */}
      <header className="absolute left-5 top-5 z-400000 sm:left-10 sm:top-8 md:left-12 md:top-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-primary sm:text-xs md:text-sm">
          the-vault
        </p>
      </header>

      {/* ── 3D carousel ── */}
      <HaloCardCarousel images={vaultImages} onFirstDrag={handleFirstDrag} />

      {/*
        ── Hero headline ──
        Pure CSS responsive positioning so SSR & first paint match immediately
        with zero layout shift / reload glitch.
        MOBILE  : pinned in upper zone (top-[16%])
        DESKTOP : vertically centered with slight upward nudge
      */}
      <section
        className="pointer-events-none absolute inset-x-0 top-[16%] z-99900 px-6 text-center sm:top-1/2 sm:translate-y-[-52%] sm:px-10"
        aria-label="Hero headline"
      >
        <h1
          className="vault-hero-line font-display text-[clamp(40px,11.5vw,56px)] font-medium leading-[0.92] tracking-[-0.03em] text-text-primary sm:text-[clamp(48px,5.5vw,84px)]"
          style={{ animationDelay: "0ms" }}
        >
          Places I&apos;d
        </h1>
        <h1
          className="vault-hero-line font-serif text-[clamp(40px,11.5vw,56px)] font-normal italic leading-[0.92] tracking-[-0.03em] text-text-primary sm:text-[clamp(48px,5.5vw,84px)]"
          style={{ animationDelay: "120ms" }}
        >
          rather be.
        </h1>
        <p
          className="vault-hero-line mt-3 font-display text-[13px] leading-relaxed tracking-[0.02em] text-text-secondary sm:mt-5 sm:text-[15px] md:text-[16px]"
          style={{ animationDelay: "250ms" }}
        >
          A few frames I never got tired of.
        </p>
      </section>

      {/* ── Interaction hint ── */}
      <div
        className={`pointer-events-none absolute bottom-6 left-1/2 z-400000 -translate-x-1/2 transition-all duration-500 ease-out sm:bottom-8 ${
          hasDragged ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"
        }`}
        aria-hidden={hasDragged}
      >
        <div className="vault-hint flex items-center gap-2 rounded-full border border-border bg-bg-primary/90 px-4 py-2 font-mono text-[10px] tracking-[0.08em] text-text-secondary shadow-[0_8px_24px_rgba(17,17,17,0.08)] backdrop-blur-sm sm:text-xs">
          <span aria-hidden="true">↔</span>
          <span className="sm:hidden">Swipe. Let it spin.</span>
          <span className="hidden sm:inline">Drag. Let it spin.</span>
        </div>
      </div>
    </main>
  );
}
