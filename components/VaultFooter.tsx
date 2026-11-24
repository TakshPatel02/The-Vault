"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const footerLinks = {
  find: [
    { label: "Portfolio", href: "https://takshpatel.vercel.app" },
    { label: "GitHub", href: "https://github.com/TakshPatel02" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/takshpatel02" },
    { label: "Blog", href: null },
  ],
  work: [
    { label: "Mokuso", href: null },
    { label: "Shipyard", href: null },
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

export function VaultFooter() {
  const [time, setTime] = useState("Ahmedabad · --:--");
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const trailIndex = useRef(0);
  const lastTrailTime = useRef(0);
  const lastTrailPosition = useRef<{ x: number; y: number } | null>(null);
  const cardTimers = useRef<number[]>([]);
  const [trailCards, setTrailCards] = useState<FooterCard[]>([]);
  const [showHint, setShowHint] = useState(true);

  type FooterCard = {
    id: number;
    x: number;
    y: number;
    src: string;
    rotation: number;
  };

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

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const lowerAreaStart = bounds.top + bounds.height * 0.4;
    if (event.clientY < lowerAreaStart) return;
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

  const handleClick = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    letterRefs.current.forEach((letter, index) => {
      if (!letter) return;
      const timer = window.setTimeout(() => {
        const bounds = letter.getBoundingClientRect();
        addCard(bounds.left + bounds.width / 2 - 70, bounds.top - 20);
      }, index * 60);
      cardTimers.current.push(timer);
    });
  };

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90svh] overflow-hidden border-t border-[#d8d4cd] bg-[linear-gradient(0deg,#d9e1e4_0%,#edf0ef_52%,#f4f2ee_100%)] text-text-primary"
    >
      <div className="mx-auto grid min-h-[40svh] max-w-350 grid-cols-1 gap-10 px-6 pb-10 pt-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.7fr_0.9fr_1.2fr] lg:px-12 lg:pt-20">
        <div className="flex min-h-44 flex-col justify-between">
          <p className="max-w-56 font-display text-[28px] font-medium leading-[1.05] tracking-[-0.03em]">
            Made slowly,
            <br />
            in Ahmedabad.
          </p>

          <div className="mt-10 lg:mt-0">
            <p className="mb-4 font-mono text-[13px] text-[#77736d]">{time}</p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-2 font-mono text-[13px] text-[#111113] transition-opacity hover:opacity-60"
            >
              <span aria-hidden="true" className="transition-transform group-hover:-translate-y-1">↑</span>
              Back to the ring
            </button>
          </div>
        </div>

        <FooterColumn label="Find me" links={footerLinks.find} />
        <FooterColumn label="Other work" links={footerLinks.work} />

        <div>
          <FooterLabel>Credits</FooterLabel>
          <p className="max-w-72 text-[16px] leading-[1.6] text-[#111113]">
            Images are not mine.
            <br />
            Taste is.
          </p>
          <a
            href="mailto:hello@takshpatel.dev"
            className="mt-5 inline-block max-w-80 text-[16px] leading-[1.6] text-[#111113] underline decoration-[#77736d]/50 underline-offset-4 transition-opacity hover:opacity-60"
          >
            If an image is yours, tell me →
          </a>
          <p className="mt-5 font-mono text-[13px] text-[#77736d]">
            Built with Next.js and Framer Motion.
          </p>
        </div>
      </div>

      <div className="relative h-[50svh] min-h-72 overflow-hidden">
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: showHint ? 1 : 0, y: showHint ? 0 : 4 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute left-1/2 top-6 z-20 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#77736d]"
          aria-hidden={!showHint}
        >
          Move your cursor
        </motion.p>
        <div
          ref={wordmarkRef}
          className="absolute inset-x-[-2%] bottom-[-0.12em] select-none whitespace-nowrap text-center font-display text-[clamp(150px,18vw,300px)] font-bold leading-[0.72] tracking-[-0.07em] text-[#111113]"
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") handleClick();
          }}
        >
          {"THE VAULT".split("").map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              ref={(element) => {
                letterRefs.current[index] = element;
              }}
              className="inline-block"
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </div>

        <AnimatePresence>
          {trailCards.map((card) => (
            <motion.div
              key={card.id}
              className="pointer-events-none fixed z-500000 h-37.5 w-65 overflow-hidden rounded-xl bg-bg-secondary shadow-[0_18px_44px_rgba(17,17,17,0.16)]"
              style={{ left: card.x, top: card.y }}
              initial={{ opacity: 0, scale: 0.72, y: 10, rotate: card.rotation }}
              animate={{ opacity: 1, scale: 1, y: -18, rotate: card.rotation }}
              exit={{ opacity: 0, scale: 0.92, y: -36 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
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
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.href ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[16px] text-[#111113] transition-opacity hover:opacity-60"
              >
                {link.label}
              </a>
            ) : (
              <span className="text-[16px] text-[#77736d]">{link.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 font-mono text-[12px] uppercase tracking-[0.18em] text-[#77736d]">
      {children}
    </p>
  );
}
