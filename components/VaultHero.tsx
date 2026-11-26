"use client";

import { useCallback, useState } from "react";
import { HaloCardCarousel } from "@/components/HaloCardCarousel";

const vaultImages = [
  { src: "/images/image-1.jpg", alt: "The Vault archive frame 01", label: "QUIET HORIZON" },
  { src: "/images/image-2.jpg", alt: "The Vault archive frame 02", label: "COASTAL DRIFT" },
  { src: "/images/image-3.jpg", alt: "The Vault archive frame 03", label: "EMPTY ROAD" },
  { src: "/images/image-4.jpg", alt: "The Vault archive frame 04", label: "STILL WATER" },
  { src: "/images/image-5.jpg", alt: "The Vault archive frame 05", label: "GOLDEN HOUR" },
  { src: "/images/image-6.jpg", alt: "The Vault archive frame 06", label: "OPEN SKY" },
  { src: "/images/image-7.jpg", alt: "The Vault archive frame 07", label: "SUNSET TARMAC" },
  { src: "/images/image-8.jpg", alt: "The Vault archive frame 08", label: "OLD MACHINE" },
];

export function VaultHero() {
  const [hasDragged, setHasDragged] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const handleFirstDrag = useCallback(() => setHasDragged(true), []);

  const currentImage = vaultImages[activeIndex] ?? vaultImages[0];
  const counter = `${String(activeIndex + 1).padStart(2, "0")} / ${String(vaultImages.length).padStart(2, "0")}`;

  return (
    <main className="relative flex h-[86svh] w-full flex-col justify-center overflow-hidden bg-bg-primary pb-14 text-text-primary sm:block sm:h-svh sm:pb-0">
      {/* ── Brand mark ── */}
      <header className="absolute left-5 top-5 z-400000 sm:left-10 sm:top-8 md:left-12 md:top-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-primary sm:text-xs md:text-sm">
          the-vault
        </p>
      </header>

      {/*
        ── Unified center group on mobile (headline + 40px gap + carousel + caption) ──
        DESKTOP: headline stays centered over the full-height 3D ring
      */}
      <section
        className="pointer-events-none relative z-99900 px-6 text-center sm:absolute sm:inset-x-0 sm:top-1/2 sm:translate-y-[-52%] sm:px-10"
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

      {/* ── 3D carousel ── */}
      <div className="relative mt-9 h-[40vw] max-h-48.75 min-h-37.5 w-full sm:mt-0 sm:h-full sm:max-h-none sm:min-h-0">
        <HaloCardCarousel
          images={vaultImages}
          onFirstDrag={handleFirstDrag}
          onActiveIndexChange={setActiveIndex}
        />
      </div>

      {/* ── Mobile static caption under carousel ── */}
      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted sm:hidden">
        {currentImage.label} &middot; {counter}
      </p>

      {/* ── Interaction hint & mobile scroll cue ── */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-400000 flex -translate-x-1/2 flex-col items-center gap-2 sm:bottom-8">
        <div
          className={`transition-all duration-500 ease-out ${
            hasDragged ? "max-h-0 translate-y-2 overflow-hidden opacity-0" : "max-h-12 translate-y-0 opacity-100"
          }`}
          aria-hidden={hasDragged}
        >
          <div className="vault-hint flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-bg-primary/90 px-4 py-2 font-mono text-[10px] tracking-[0.08em] text-text-secondary shadow-[0_8px_24px_rgba(17,17,17,0.08)] backdrop-blur-sm sm:text-xs">
            <span aria-hidden="true">↔</span>
            <span className="sm:hidden">Swipe. Let it spin.</span>
            <span className="hidden sm:inline">Drag. Let it spin.</span>
          </div>
        </div>

        <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted sm:hidden">
          &darr; Scroll
        </span>
      </div>
    </main>
  );
}
