"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface VaultImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  index?: number;
}

export function VaultImage({ src, alt, priority = false, index = 0 }: VaultImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {/* Skeleton Loader */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-4"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-full h-full bg-border/20 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Image */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.02 }}
        transition={{
          duration: 0.8,
          delay: index * 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={priority}
          onLoad={() => setIsLoaded(true)}
        />
      </motion.div>
    </>
  );
}
