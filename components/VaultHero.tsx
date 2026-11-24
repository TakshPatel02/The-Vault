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
      <header className="absolute left-6 top-6 z-400000 sm:left-10 sm:top-8 md:left-12 md:top-10">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-text-primary sm:text-sm">
          the-vault
        </p>
      </header>

      <HaloCardCarousel images={vaultImages} onFirstDrag={handleFirstDrag} />

      <section className="pointer-events-none absolute inset-0 z-99900 flex -translate-y-8 items-center justify-center px-6 text-center md:-translate-y-10">
        <div className="w-full px-4 py-6">
          <h1
            className="vault-hero-line font-display text-[clamp(48px,5.5vw,84px)] font-medium leading-[0.95] tracking-[-0.03em] text-text-primary"
            style={{ animationDelay: "0ms" }}
          >
            Places I&apos;d
          </h1>
          <h1
            className="vault-hero-line -mt-1 font-serif text-[clamp(48px,5.5vw,84px)] font-normal italic leading-[0.95] tracking-[-0.03em] text-text-primary"
            style={{ animationDelay: "100ms" }}
          >
            rather be.
          </h1>
          <p
            className="vault-hero-line mt-5 font-display text-[15px] leading-relaxed tracking-[0.02em] text-[#555555] sm:text-[16px]"
            style={{ animationDelay: "200ms" }}
          >
            A few frames I never got tired of.
          </p>
        </div>
      </section>

      <div
        className={`pointer-events-none absolute bottom-6 left-1/2 z-400000 -translate-x-1/2 transition-all duration-500 sm:bottom-8 ${
          hasDragged ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
        }`}
        aria-hidden={hasDragged}
      >
        <div className="flex items-center gap-2 rounded-full border border-border bg-bg-primary/90 px-4 py-2 font-mono text-xs tracking-[0.08em] text-text-secondary shadow-[0_8px_24px_rgba(17,17,17,0.08)] backdrop-blur-sm">
          <span aria-hidden="true">↔</span>
          <span>Drag. Let it spin.</span>
        </div>
      </div>
    </main>
  );
}
