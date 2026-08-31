"use client";

import { useState } from "react";
import Image from "next/image";

interface VaultImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export function VaultImage({ src, alt, priority = false }: VaultImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {/* Skeleton Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full h-full bg-border/20 animate-pulse" />
        </div>
      )}

      {/* Actual Image */}
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-contain transition-opacity duration-700 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="(max-width: 768px) 100vw, 33vw"
        priority={priority}
        onLoad={() => setIsLoaded(true)}
      />
    </>
  );
}
