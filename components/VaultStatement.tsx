"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

const LINES = [
  "Quiet skies. Old machines.",
  "Rooms where someone",
  "is building something.",
  "Empty roads.",
  "Planes waiting for the sun to go down.",
  "Light that looks like it's about to say something.",
];
const LINE_GROUPS = [LINES.slice(0, 3), LINES.slice(3)];

const STATEMENT = LINES.join(" ");
const DIM = "#d8d4cd";
const LIT = "#111111";
const CHIPS = {
  skies: { src: "/images/image-31.jpg", alt: "Open sky", afterWord: "Quiet", focusWords: ["Quiet", "skies."] },
  machines: { src: "/images/image-8.jpg", alt: "Classic car", afterWord: "Old", focusWords: ["Old", "machines."] },
  building: { src: "/images/image-24.jpg", alt: "Design workspace", afterWord: "is", focusWords: ["is", "building", "something."] },
  roads: { src: "/images/image-3.jpg", alt: "Empty road", afterWord: "Empty", focusWords: ["Empty", "roads."] },
  planes: { src: "/images/image-7.jpg", alt: "Planes waiting for sunset", afterWord: "the", focusWords: ["Planes", "waiting", "for", "the", "sun", "to", "go", "down."] },
  light: { src: "/images/image-9.jpg", alt: "Light at dusk", afterWord: "like", focusWords: ["Light", "that", "looks", "like", "it's", "about", "to", "say", "something."] },
} satisfies Record<string, {
  src: string;
  alt: string;
  afterWord: string;
  focusWords: string[];
}>;

type ChipKey = keyof typeof CHIPS;

export function VaultStatement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const characters = STATEMENT.split("");
  const characterCount = characters.length;
  const [activeChip, setActiveChip] = useState<ChipKey | null>(null);
  const [hasTappedChip, setHasTappedChip] = useState(false);
  const previewX = useMotionValue(0);
  const previewY = useMotionValue(0);
  const previewRotate = useMotionValue(0);
  const previewSpringX = useSpring(previewX, { stiffness: 150, damping: 20 });
  const previewSpringY = useSpring(previewY, { stiffness: 150, damping: 20 });
  const previewSpringRotate = useSpring(previewRotate, { stiffness: 150, damping: 20 });
  const lastPreviewX = useRef(0);

  const handlePreviewMove = (event: React.MouseEvent) => {
    previewX.set(event.clientX + 24);
    previewY.set(event.clientY + 24);
    const tilt = Math.max(-8, Math.min(8, (event.clientX - lastPreviewX.current) * 0.35));
    previewRotate.set(tilt);
    lastPreviewX.current = event.clientX;
  };

  const handleChipTap = (chipKey: ChipKey) => {
    setHasTappedChip(true);
    setActiveChip((current) => (current === chipKey ? null : chipKey));
  };

  const focusedWords = activeChip ? CHIPS[activeChip].focusWords : null;

  return (
    <section
      ref={ref}
      className="relative h-[145svh] bg-bg-primary text-text-primary sm:h-[150vh]"
      onClick={() => {
        if (activeChip && window.innerWidth < 640) {
          setActiveChip(null);
        }
      }}
    >
      <div className="sticky top-0 flex h-svh items-center justify-center px-6 sm:px-12 lg:px-20">
        <p
          className="mx-auto w-full max-w-350 text-center font-display text-[clamp(26px,6.8vw,38px)] font-medium leading-[1.22] tracking-[-0.03em] sm:text-[clamp(36px,3.8vw,60px)] sm:leading-[1.18]"
          aria-label={STATEMENT}
        >
          {LINE_GROUPS.map((group, groupIndex) => (
            <span key={groupIndex} className={`block ${groupIndex > 0 ? "mt-7 sm:mt-11" : ""}`}>
              {group.map((line) => {
                const lineIndex = LINES.indexOf(line);
                const lineStart = LINES
                  .slice(0, lineIndex)
                  .reduce((length, previousLine) => length + previousLine.length + 1, 0);

                return (
                  <span key={line} className="block whitespace-normal lg:whitespace-nowrap">
                    {line.split(" ").map((word, wordIndex) => {
                      const wordsBefore = line
                        .split(" ")
                        .slice(0, wordIndex)
                        .reduce((length, previousWord) => length + previousWord.length + 1, 0);
                      const wordStart = lineStart + wordsBefore;
                      const chipEntry = (Object.entries(CHIPS) as [ChipKey, (typeof CHIPS)[ChipKey]][])
                        .find(([, item]) => item.afterWord === word);
                      const chipKey = chipEntry?.[0];
                      const chip = chipEntry?.[1];
                      const dimmed = focusedWords !== null &&
                        !Array.from(focusedWords).includes(word);
                      const emphasized = lineIndex === LINES.length - 1 && wordIndex >= 4;

                      return (
                        <span key={`${word}-${wordIndex}`}>
                          <span className={`inline-flex whitespace-nowrap ${emphasized ? "font-serif italic" : ""}`}>
                            {word.split("").map((character, characterIndex) => {
                              const absoluteIndex = wordStart + characterIndex;
                              const start = absoluteIndex / characterCount;
                              const end = (absoluteIndex + 1) / characterCount;

                              return (
                                <StatementCharacter
                                  key={`${wordIndex}-${characterIndex}`}
                                  progress={scrollYProgress}
                                  range={[start, end]}
                                  dimmed={dimmed}
                                >
                                  {character}
                                </StatementCharacter>
                              );
                            })}
                          </span>
                          {chip && (
                            <StatementChip
                              src={chip.src}
                              alt={chip.alt}
                              progress={scrollYProgress}
                              chipKey={chipKey}
                              activeChip={activeChip}
                              onPreviewEnter={(event) => {
                                if (window.innerWidth < 640 || !chipKey) return;
                                setActiveChip(chipKey);
                                handlePreviewMove(event);
                              }}
                              onPreviewMove={(event) => {
                                if (window.innerWidth < 640) return;
                                handlePreviewMove(event);
                              }}
                              onPreviewLeave={() => {
                                if (window.innerWidth < 640) return;
                                setActiveChip(null);
                              }}
                              onTap={(event) => {
                                if (window.innerWidth >= 640 || !chipKey) return;
                                event.stopPropagation();
                                handleChipTap(chipKey);
                              }}
                              range={[
                                wordStart / characterCount,
                                (wordStart + word.length) / characterCount,
                              ]}
                            />
                          )}
                          {!chip && " "}
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </span>
          ))}
        </p>

        {/* Mobile subtle tap hint */}
        <p
          className={`pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#77736d] transition-opacity duration-300 sm:hidden ${
            hasTappedChip || activeChip ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden={hasTappedChip || Boolean(activeChip)}
        >
          Tap any frame
        </p>

        {/* Mobile centered editorial preview card */}
        <AnimatePresence>
          {activeChip && (
            <motion.div
              key={`mobile-${activeChip}`}
              className="pointer-events-auto absolute bottom-8 left-1/2 z-500000 w-[78vw] max-w-[320px] -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-surface-elevated p-1.5 shadow-[0_24px_60px_rgba(17,17,17,0.2)] sm:hidden"
              initial={{ opacity: 0, y: 18, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.94 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => {
                event.stopPropagation();
                setActiveChip(null);
              }}
            >
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={CHIPS[activeChip].src}
                  alt={CHIPS[activeChip].alt}
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between px-2 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#77736d]">
                <span>{CHIPS[activeChip].alt}</span>
                <span>Tap to close</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop cursor-following preview card */}
      <AnimatePresence>
        {activeChip && (
          <motion.div
            className="pointer-events-none fixed left-0 top-0 z-500000 hidden aspect-video w-[clamp(250px,28vw,400px)] overflow-hidden rounded-xl border border-border bg-bg-secondary shadow-[0_30px_80px_rgba(17,17,17,0.18)] sm:block"
            style={{
              x: previewSpringX,
              y: previewSpringY,
              rotate: previewSpringRotate,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CHIPS[activeChip].src}
              alt={CHIPS[activeChip].alt}
              draggable={false}
              className="h-full w-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function StatementCharacter({
  children,
  progress,
  range,
  dimmed,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  dimmed: boolean;
}) {
  const color = useTransform(progress, range, [DIM, LIT]);

  return (
    <motion.span
      animate={{ opacity: dimmed ? 0.25 : 1 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      style={{ color }}
      aria-hidden="true"
    >
      {children}
    </motion.span>
  );
}

function StatementChip({
  src,
  alt,
  progress,
  chipKey,
  activeChip,
  onPreviewEnter,
  onPreviewMove,
  onPreviewLeave,
  onTap,
  range,
}: {
  src: string;
  alt: string;
  progress: MotionValue<number>;
  chipKey: ChipKey | undefined;
  activeChip: ChipKey | null;
  onPreviewEnter: (event: React.MouseEvent<HTMLSpanElement>) => void;
  onPreviewMove: (event: React.MouseEvent) => void;
  onPreviewLeave: () => void;
  onTap: (event: React.MouseEvent<HTMLSpanElement>) => void;
  range: [number, number];
}) {
  const width = useTransform(progress, range, ["0em", "2.8em"]);
  const isActive = activeChip === chipKey;

  return (
    <motion.span
      className={`mx-[0.14em] inline-block h-[0.84em] cursor-pointer align-middle overflow-hidden rounded-full bg-bg-secondary transition-shadow duration-200 ${
        isActive ? "ring-1 ring-text-primary/40" : ""
      }`}
      style={{ width }}
      whileTap={{ scale: 0.94 }}
      onMouseEnter={onPreviewEnter}
      onMouseMove={onPreviewMove}
      onMouseLeave={onPreviewLeave}
      onClick={onTap}
      aria-label={alt}
      role="button"
      tabIndex={0}
    >
      <motion.img
        src={src}
        alt=""
        draggable={false}
        className="h-full w-full object-cover"
        animate={{ scale: isActive ? 1.12 : 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </motion.span>
  );
}
