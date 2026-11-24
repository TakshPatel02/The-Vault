"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

const LINES = [
  "Quiet skies.",
  "Old machines.",
  "Rooms where someone is building something.",
];

const STATEMENT = LINES.join(" ");
const DIM = "#d8d4cd";
const LIT = "#111111";

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
          className="flex max-w-5xl flex-wrap justify-center gap-x-[0.3em] text-center font-display text-4xl font-medium leading-[1.1] tracking-[-0.03em] md:text-7xl"
          aria-label={STATEMENT}
        >
          {STATEMENT.split(" ").map((word, wordIndex) => {
            const wordStart = STATEMENT.split(" ")
              .slice(0, wordIndex)
              .reduce((length, previousWord) => length + previousWord.length + 1, 0);

            return (
              <span key={`${word}-${wordIndex}`} className="inline-flex whitespace-nowrap">
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
