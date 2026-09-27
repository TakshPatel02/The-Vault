"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedGridCellProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export function AnimatedGridCell({ children, index, className = "" }: AnimatedGridCellProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedBarProps {
  children: ReactNode;
  className?: string;
  direction?: "down" | "up";
}

export function AnimatedBar({ children, className = "", direction = "down" }: AnimatedBarProps) {
  const yStart = direction === "down" ? -15 : 15;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: yStart }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
