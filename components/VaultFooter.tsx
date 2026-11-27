"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const footerLinks = {
  find: [
    { label: "Portfolio", href: "https://takshpatel.vercel.app" },
    { label: "GitHub", href: "https://github.com/TakshPatel02" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/takshpatel02" },
    { label: "Blog", href: "https://takshpatel02.hashnode.dev" },
  ],
  work: [
    { label: "Mokuso", href: "https://mokuso-teal.vercel.app/" },
    { label: "Shipyard", href: "https://shipyard-fm.vercel.app/" },
    { label: "Koe", href: null },
    { label: "Kura", href: null },
  ],
};

const wordmarkImages = [
  "/images/image-31.jpg",
  "/images/image-8.jpg",
  "/images/image-24.jpg",
  "/images/image-1.jpg",
  "/images/image-4.jpg",
  "/images/image-10.jpg",
  "/images/image-22.jpg",
  "/images/image-29.jpg",
];

type FooterCard = {
  id: number;
  x: number;
  y: number;
  src: string;
  rotation: number;
};

type TrackCard = {
  id: number;
  src: string;
  rotation: number;
  reverse: boolean;
};

export function VaultFooter() {
  const [time, setTime] = useState("Ahmedabad · --:--");
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkAreaRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const trailIndex = useRef(0);
  const lastTrailTime = useRef(0);
  const lastTrailPosition = useRef<{ x: number; y: number } | null>(null);
  const cardTimers = useRef<number[]>([]);
  const trackTimers = useRef<number[]>([]);
  const [trailCards, setTrailCards] = useState<FooterCard[]>([]);
  const [trackCards, setTrackCards] = useState<TrackCard[]>([]);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const formatted = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date());
      setTime(`Ahmedabad · ${formatted}`);
    };

    updateTime();
    const interval = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => () => {
    cardTimers.current.forEach(window.clearTimeout);
    trackTimers.current.forEach(window.clearTimeout);
  }, []);

  const addCard = (x: number, y: number) => {
    if (showHint) setShowHint(false);
    const card: FooterCard = {
      id: Date.now() + Math.random(),
      x,
      y,
      src: wordmarkImages[trailIndex.current % wordmarkImages.length],
      rotation: -8 + Math.random() * 16,
    };
    trailIndex.current += 1;
    setTrailCards((cards) => [...cards.slice(-9), card]);

    const timer = window.setTimeout(() => {
      setTrailCards((cards) => cards.filter((item) => item.id !== card.id));
    }, 1000);
    cardTimers.current.push(timer);
  };

  // Desktop-only mouse move trail (scoped strictly to the lower wordmark area)
  const handleWordmarkMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 640) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const now = performance.now();
    if (now - lastTrailTime.current < 150) return;

    const previous = lastTrailPosition.current;
    const distance = previous
      ? Math.hypot(event.clientX - previous.x, event.clientY - previous.y)
      : Number.POSITIVE_INFINITY;
    if (distance < 48) return;

    lastTrailTime.current = now;
    lastTrailPosition.current = { x: event.clientX, y: event.clientY };
    addCard(event.clientX - 90, event.clientY - 50);
  };

  // Mobile: tapping any letter triggers an automatic choreographed track flow
  const triggerMobileTrackFlow = (letterIndex: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (showHint) setShowHint(false);

    // Clear any in-flight scheduled spawns so rapid taps stay crisp
    trackTimers.current.forEach(window.clearTimeout);
    trackTimers.current = [];

    // Flow right-to-left if tapped on right half, left-to-right if on left half
    const reverse = letterIndex >= 5;
    const count = 6;

    for (let i = 0; i < count; i += 1) {
      const spawnTimer = window.setTimeout(() => {
        const card: TrackCard = {
          id: Date.now() + Math.random() + i,
          src: wordmarkImages[(trailIndex.current + i) % wordmarkImages.length],
          rotation: reverse ? 3 - (i % 3) * 2.5 : -3 + (i % 3) * 2.5,
          reverse,
        };
        setTrackCards((prev) => [...prev.slice(-5), card]);

        const removeTimer = window.setTimeout(() => {
          setTrackCards((prev) => prev.filter((item) => item.id !== card.id));
        }, 1900);
        trackTimers.current.push(removeTimer);
      }, i * 260);

      trackTimers.current.push(spawnTimer);
    }

    trailIndex.current += count;
  };

  const handleLetterClick = (index: number) => {
    if (window.innerWidth < 640) {
      triggerMobileTrackFlow(index);
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative min-h-[85svh] overflow-hidden border-t border-[#d8d4cd] bg-[linear-gradient(0deg,#d9e1e4_0%,#edf0ef_52%,#f4f2ee_100%)] text-text-primary sm:min-h-[90svh]"
    >
      {/* ── Link area ── */}
      <div className="mx-auto max-w-350 px-6 pb-6 pt-12 sm:pb-10 sm:pt-16 lg:px-12 lg:pt-20">
        {/* Tagline + live time + back to ring — top-aligned on sm+ */}
        <div className="mb-9 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-start sm:justify-between lg:mb-14">
          <p className="max-w-56 font-display text-[26px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[28px]">
            Made slowly,
            <br />
            in Ahmedabad.
          </p>

          <div className="flex flex-col sm:items-end">
            <p className="font-mono text-[13px] leading-[1.1] text-[#77736d]">{time}</p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group mt-1 inline-flex min-h-11 items-center gap-2 font-mono text-[13px] text-[#111113] transition-opacity hover:opacity-60"
            >
              <span aria-hidden="true" className="transition-transform group-hover:-translate-y-1">↑</span>
              Back to the ring
            </button>
          </div>
        </div>

        {/* Find me + Other work side by side; Credits full width below on mobile */}
        <div className="grid grid-cols-2 gap-6 sm:gap-10 lg:grid-cols-[0.7fr_0.9fr_1.2fr]">
          <FooterColumn label="Find me" links={footerLinks.find} />
          <FooterColumn label="Other work" links={footerLinks.work} />

          <div className="col-span-2 mt-2 sm:mt-0 lg:col-span-1">
            <FooterLabel>Credits</FooterLabel>
            <p className="max-w-72 text-[15px] leading-[1.6] text-[#111113] sm:text-[16px]">
              Images are not mine.
              <br />
              Taste is.
            </p>
            <div className="mt-2 flex flex-col items-start sm:mt-4">
              <a
                href="mailto:takshpatel022@gmail.com"
                className="inline-flex min-h-11 items-center text-[15px] leading-[1.6] text-[#111113] underline decoration-[#77736d]/50 underline-offset-4 transition-opacity hover:opacity-60 sm:text-[16px]"
              >
                If an image is yours, tell me →
              </a>
              <a
                href="https://github.com/TakshPatel02/The-Vault"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-[15px] leading-[1.6] text-[#111113] underline decoration-[#77736d]/50 underline-offset-4 transition-opacity hover:opacity-60 sm:text-[16px]"
              >
                ★ Star it on GitHub →
              </a>
            </div>
            <p className="mt-2 font-mono text-[12px] text-[#77736d] sm:mt-4 sm:text-[13px]">
              Built with Next.js and Framer Motion.
            </p>
          </div>
        </div>
      </div>

      {/* ── Wordmark area (only area where desktop trail triggers) ── */}
      <div
        ref={wordmarkAreaRef}
        onMouseMove={handleWordmarkMouseMove}
        onMouseLeave={() => {
          lastTrailPosition.current = null;
        }}
        className="relative h-[36svh] min-h-48 overflow-hidden sm:h-[50svh] sm:min-h-72"
      >
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: showHint ? 1 : 0, y: showHint ? 0 : 4 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] text-[#77736d] sm:top-6"
          aria-hidden={!showHint}
        >
          <span className="sm:hidden">Tap any letter</span>
          <span className="hidden sm:inline">Move your cursor</span>
        </motion.p>

        {/* Mobile automatic track-flow cards */}
        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden sm:hidden">
          <AnimatePresence>
            {trackCards.map((card) => (
              <motion.div
                key={card.id}
                className="absolute top-[22%] aspect-video w-[46vw] max-w-50 overflow-hidden rounded-xl bg-bg-secondary shadow-[0_18px_40px_rgba(17,17,17,0.16)]"
                initial={{
                  left: card.reverse ? "105%" : "-50%",
                  y: 12,
                  opacity: 0,
                  scale: 0.88,
                  rotate: card.rotation,
                }}
                animate={{
                  left: card.reverse ? ["105%", "32%", "-55%"] : ["-50%", "28%", "105%"],
                  y: [12, -10, 8],
                  opacity: [0, 1, 1, 0],
                  scale: [0.88, 1, 0.92],
                  rotate: card.rotation,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.85,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.src}
                  alt=""
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Full-width wordmark — sized so "THE VAULT" never clips on mobile */}
        <div
          className="absolute inset-x-0 bottom-[-0.12em] flex select-none justify-center whitespace-nowrap px-2 text-center font-display text-[clamp(36px,17.5vw,300px)] font-bold leading-[0.72] tracking-[-0.07em] text-[#111113]"
          role="group"
          aria-label="THE VAULT interactive wordmark"
        >
          {"THE VAULT".split("").map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              ref={(element) => {
                letterRefs.current[index] = element;
              }}
              onClick={() => handleLetterClick(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleLetterClick(index);
                }
              }}
              role="button"
              tabIndex={0}
              className="inline-block cursor-pointer transition-transform duration-150 active:scale-95 sm:cursor-default sm:active:scale-100"
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </div>

        {/* Desktop cursor-trail cards */}
        <AnimatePresence>
          {trailCards.map((card) => (
            <motion.div
              key={card.id}
              className="pointer-events-none fixed z-500000 hidden h-37.5 w-65 overflow-hidden rounded-xl bg-bg-secondary shadow-[0_18px_44px_rgba(17,17,17,0.16)] sm:block"
              style={{ left: card.x, top: card.y }}
              initial={{ opacity: 0, scale: 0.72, y: 10, rotate: card.rotation }}
              animate={{ opacity: 1, scale: 1, y: -18, rotate: card.rotation }}
              exit={{ opacity: 0, scale: 0.92, y: -36 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.src} alt="" draggable={false} className="h-full w-full object-cover" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </footer>
  );
}

function FooterColumn({
  label,
  links,
}: {
  label: string;
  links: { label: string; href: string | null }[];
}) {
  return (
    <div>
      <FooterLabel>{label}</FooterLabel>
      <ul className="space-y-0">
        {links.map((link) => (
          <li key={link.label}>
            {link.href ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-[15px] text-[#111113] transition-opacity hover:opacity-60 sm:text-[16px]"
              >
                {link.label}
              </a>
            ) : (
              <span className="inline-flex min-h-11 items-center text-[15px] text-[#77736d] sm:text-[16px]">
                {link.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#77736d] sm:mb-5 sm:text-[12px]">
      {children}
    </p>
  );
}
