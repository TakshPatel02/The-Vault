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
];

const STATEMENT = LINES.join(" ");
const DIM = "#d8d4cd";
const LIT = "#111111";
const CHIPS = {
  skies: { src: "/images/image-31.jpg", alt: "Open sky", afterWord: "Quiet", focusWords: ["Quiet", "skies."] },
  machines: { src: "/images/image-8.jpg", alt: "Classic car", afterWord: "Old", focusWords: ["Old", "machines."] },
  building: { src: "/images/image-24.jpg", alt: "Design workspace", afterWord: "is", focusWords: ["is", "building", "something."] },
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

  const focusedWords = activeChip ? CHIPS[activeChip].focusWords : null;

  return (
    <section ref={ref} className="relative h-[150vh] bg-bg-primary text-text-primary">
      <div className="sticky top-0 flex h-svh items-center justify-center px-6">
        <p
          className="w-full max-w-300 text-center font-display text-[clamp(36px,5vw,72px)] font-medium leading-[1.28] tracking-[-0.03em]"
          aria-label={STATEMENT}
        >
          {LINES.map((line, lineIndex) => {
            const lineStart = LINES
              .slice(0, lineIndex)
              .reduce((length, previousLine) => length + previousLine.length + 1, 0);

            return (
              <span key={line} className="block whitespace-nowrap">
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

                  return (
                    <span key={`${word}-${wordIndex}`}>
                      <span className="inline-flex whitespace-nowrap">
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
                        <>
                          {" "}
                          <StatementChip
                            src={chip.src}
                            alt={chip.alt}
                            progress={scrollYProgress}
                            chipKey={chipKey}
                            activeChip={activeChip}
                            onPreviewEnter={(event) => {
                              if (!chipKey) return;
                              setActiveChip(chipKey);
                              handlePreviewMove(event);
                            }}
                            onPreviewMove={handlePreviewMove}
                            onPreviewLeave={() => setActiveChip(null)}
                            range={[
                              wordStart / characterCount,
                              (wordStart + word.length) / characterCount,
                            ]}
                          />
                          {" "}
                        </>
                      )}
                      {!chip && " "}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </p>
      </div>

      <AnimatePresence>
        {activeChip && (
          <motion.div
            className="pointer-events-none fixed left-0 top-0 z-500000 aspect-video w-[clamp(250px,28vw,400px)] overflow-hidden rounded-xl border border-border bg-bg-secondary shadow-[0_30px_80px_rgba(17,17,17,0.18)]"
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
  range: [number, number];
}) {
  const width = useTransform(progress, range, ["0em", "1.8em"]);

  return (
    <motion.span
      className="inline-block h-[0.68em] align-middle overflow-hidden rounded-full bg-bg-secondary"
      style={{ width }}
      onMouseEnter={onPreviewEnter}
      onMouseMove={onPreviewMove}
      onMouseLeave={onPreviewLeave}
      aria-label={alt}
    >
      <motion.img
        src={src}
        alt=""
        draggable={false}
        className="h-full w-full object-cover"
        animate={{ scale: activeChip === chipKey ? 1.12 : 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </motion.span>
  );
}
