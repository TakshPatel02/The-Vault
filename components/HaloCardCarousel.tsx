"use client";

import { useEffect, useRef } from "react";

export interface HaloCarouselImage {
  src: string;
  alt: string;
}

interface HaloCardCarouselProps {
  images: HaloCarouselImage[];
  onFirstDrag?: () => void;
}

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

function seededJitter(index: number) {
  let seed = (index * 9301 + 49297) >>> 0;
  seed = (seed * 1664525 + 1013904223) >>> 0;

  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return (seed / 4294967296) * 2 - 1;
  };

  return [random(), random(), random()];
}

export function HaloCardCarousel({ images, onFirstDrag }: HaloCardCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasReportedDrag = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const state = {
      width: 1200,
      height: 800,
      turn: 0,
      userTurn: 0,
      velocity: 0,
      pointerX: 0.5,
      pointerY: 0.5,
      pointerXT: 0.5,
      pointerYT: 0.5,
      hover: 0,
      hoverT: 0,
      dragging: false,
      lastX: 0,
      lastTime: 0,
    };

    const measure = () => {
      state.width = root.offsetWidth || 1200;
      state.height = root.offsetHeight || 800;
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(root);

    const onDown = (event: PointerEvent) => {
      state.dragging = true;
      state.lastX = event.clientX;
      state.lastTime = performance.now();
      state.velocity = 0;
      root.setPointerCapture?.(event.pointerId);
    };

    const onHover = (event: PointerEvent) => {
      state.hoverT = 1;
      const rect = root.getBoundingClientRect();
      state.pointerXT = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      state.pointerYT = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    };

    const onLeave = () => {
      state.hoverT = 0;
      state.pointerXT = 0.5;
      state.pointerYT = 0.5;
    };

    const onMove = (event: PointerEvent) => {
      if (!state.dragging) return;
      if (!hasReportedDrag.current) {
        hasReportedDrag.current = true;
        onFirstDrag?.();
      }

      const now = performance.now();
      const dx = event.clientX - state.lastX;
      const dt = Math.max(0.008, (now - state.lastTime) / 1000);
      state.lastX = event.clientX;
      state.lastTime = now;

      const unit = Math.min(state.width / 1200, state.height / 800) * 1.7;
      const delta = (dx / unit) * 0.0035;
      state.userTurn += delta;
      state.velocity = delta / dt;
    };

    const onUp = (event: PointerEvent) => {
      state.dragging = false;
      if (root.hasPointerCapture?.(event.pointerId)) {
        root.releasePointerCapture(event.pointerId);
      }
    };

    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onHover);
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    let frameId = 0;
    let lastTime = -1;
    let visible = true;

    const frame = (now: number) => {
      if (!visible) {
        frameId = 0;
        return;
      }

      const dt = lastTime < 0 ? 0 : Math.min(1 / 20, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;

      state.pointerX += (state.pointerXT - state.pointerX) * (1 - Math.exp(-dt * 6));
      state.pointerY += (state.pointerYT - state.pointerY) * (1 - Math.exp(-dt * 6));
      state.hover += (state.hoverT - state.hover) * (1 - Math.exp(-dt * 4));

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reducedMotion) {
        state.turn = (state.turn + 8 * DEG * dt) % TAU;
      }

      const damping = Math.exp(-dt * (0.5 + 50 / 12));
      if (!state.dragging) {
        state.userTurn += state.velocity * dt;
        state.velocity *= damping;
      }

      const hoverLean = state.hover * 0.9;
      const tilt = (30 + (state.pointerY - 0.5) * 12 * hoverLean) * DEG;
      const roll = -12 * DEG;
      const cosPitch = Math.cos(tilt);
      const sinPitch = Math.sin(tilt);
      const cosRoll = Math.cos(roll);
      const sinRoll = Math.sin(roll);
      const unit = Math.min(state.width / 1200, state.height / 800) * 1.7;
      const perspective = 1426 * unit;
      const radius = 285;
      const centerX = state.width / 2;
      const centerY = state.height * 0.42;
      const phi = state.turn + state.userTurn +
        (state.pointerX - 0.5) * 12 * DEG * hoverLean;
      const pitchBase = 22 * DEG;
      const sinPitchBase = Math.sin(pitchBase);
      const cosPitchBase = Math.cos(pitchBase);

      if (stageRef.current) {
        stageRef.current.style.perspective = `${perspective}px`;
        stageRef.current.style.perspectiveOrigin = `${centerX}px ${centerY}px`;
      }

      images.forEach((_image, index) => {
        const card = cardRefs.current[index];
        if (card) {
          const [heightJitter, , radiusJitter] = seededJitter(index);
          const theta = phi + (TAU * index) / images.length;
          const ringRadius = radius * (1 + (radiusJitter * 6) / 100);
          const x0 = ringRadius * Math.sin(theta);
          const z0 = ringRadius * Math.cos(theta);
          const y0 = heightJitter * 12;
          const y1 = y0 * cosPitch + z0 * sinPitch;
          const z1 = Math.min(z0 * cosPitch - y0 * sinPitch, perspective - 50);
          const x = centerX + (x0 * cosRoll - y1 * sinRoll) * unit;
          const y = centerY + (x0 * sinRoll + y1 * cosRoll) * unit;
          const z = z1 * unit;
          const scale = unit;
          const yaw = 18 * Math.sin(theta);

          card.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) translate(-50%, -50%) rotateY(${yaw.toFixed(3)}deg) scale(${scale.toFixed(4)})`;

          const yRing = x0 * Math.sin(-12 * DEG) +
            (y0 * cosPitchBase + z0 * sinPitchBase) * Math.cos(-12 * DEG);
          card.style.zIndex = String(100000 + Math.round(yRing * 10));
          const backDepth = Math.min(1, Math.max(0, (-z1 + radius) / (radius * 2)));
          card.style.opacity = (1 - backDepth * 0.35).toFixed(3);
          card.style.filter = `blur(${(backDepth * 1.5).toFixed(2)}px)`;
        }
      });

      frameId = requestAnimationFrame(frame);
    };

    const observer = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !frameId) {
            lastTime = -1;
            frameId = requestAnimationFrame(frame);
          }
        })
      : null;
    observer?.observe(root);
    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
      observer?.disconnect();
      resizeObserver.disconnect();
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onHover);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [images, onFirstDrag]);

  return (
    <div
      ref={rootRef}
      className="relative h-full w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
      aria-label="Draggable 3D carousel of The Vault images"
    >
      <div ref={stageRef} className="absolute inset-0" style={{ perspectiveOrigin: "50% 42%" }}>
        {images.map((image, index) => (
          <div
            key={image.src}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            className="absolute left-0 top-0 aspect-video w-40 overflow-hidden rounded-xs bg-bg-secondary"
            style={{
              transform: "translate3d(-9999px, -9999px, 0)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.12)",
              willChange: "transform, opacity, filter",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              draggable={false}
              className="block h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
