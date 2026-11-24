"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

const LINES = [
  "Quiet skies. Old machines.",
  "Rooms where someone",
  "is building something.",
];

const STATEMENT = LINES.join(" ");
const DIM = "#d8d4cd";
const LIT = "#111111";
const CHIPS = {
  skies: { src: "/images/image-31.jpg", alt: "Open sky", afterWord: "Quiet" },
  machines: { src: "/images/image-8.jpg", alt: "Classic car", afterWord: "Old" },
  building: { src: "/images/image-24.jpg", alt: "Design workspace", afterWord: "is" },
};

export function VaultStatement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const characters = STATEMENT.split("");
  const characterCount = characters.length;

  return (
    <section ref={ref} className="relative h-[150vh] bg-bg-primary text-text-primary">
      <div className="sticky top-0 flex h-svh items-center justify-center px-6">
        <p
          className="w-full max-w-250 text-center font-display text-[clamp(28px,3.8vw,58px)] font-medium leading-[1.35] tracking-[-0.03em]"
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
                  const chip = Object.values(CHIPS).find((item) => item.afterWord === word);

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
    </section>
  );
}

function StatementCharacter({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const color = useTransform(progress, range, [DIM, LIT]);

  return (
    <motion.span style={{ color }} aria-hidden="true">
      {children}
    </motion.span>
  );
}

function StatementChip({
  src,
  alt,
  progress,
  range,
}: {
  src: string;
  alt: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const width = useTransform(progress, range, ["0em", "1.8em"]);

  return (
    <motion.span
      className="inline-block h-[0.62em] align-middle overflow-hidden rounded-full bg-bg-secondary"
      style={{ width }}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} draggable={false} className="h-full w-full object-cover" />
    </motion.span>
  );
}
