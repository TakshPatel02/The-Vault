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
      isMobile: false,
    };

    const measure = () => {
      state.width = root.offsetWidth || 1200;
      state.height = root.offsetHeight || 800;
      state.isMobile = state.width < 640;
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(root);

    const onDown = (event: PointerEvent) => {
      state.dragging = true;
      state.lastX = event.clientX;
      state.lastTime = performance.now();
      state.velocity = 0;
      // Only capture on mouse so touch pan-y vertical scroll stays free
      if (event.pointerType === "mouse") {
        root.setPointerCapture?.(event.pointerId);
      }
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

      if (state.isMobile) {
        // Direct, responsive horizontal swipe sensitivity on narrow viewports
        const delta = (dx / Math.max(280, state.width)) * 2.4;
        state.userTurn += delta;
        state.velocity = delta / dt;
      } else {
        const unit = Math.min(state.width / 1200, state.height / 800) * 1.7;
        const delta = (dx / unit) * 0.0035;
        state.userTurn += delta;
        state.velocity = delta / dt;
      }
    };

    const onUp = (event: PointerEvent) => {
      state.dragging = false;
      if (event.pointerType === "mouse" && root.hasPointerCapture?.(event.pointerId)) {
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
    const entryDelay = 0;
    const entryDuration = 2400;
    const startAngle = -220 * DEG;
    let entryStart = 0;
    let idleSpeed = 0;
    const targetIdleSpeed = 8 * DEG;

    const frame = (now: number) => {
      if (!visible) {
        frameId = 0;
        return;
      }

      const dt = lastTime < 0 ? 0 : Math.min(1 / 20, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;
      if (!entryStart) entryStart = now;
      const entryElapsed = now - entryStart - entryDelay;
      const entryProgress = Math.min(1, Math.max(0, entryElapsed / entryDuration));
      const entryEase = 1 - Math.pow(1 - entryProgress, 4);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const entering = !reducedMotion && entryProgress < 1;
      const entryAngle = entering ? startAngle * (1 - entryEase) : 0;
      const radiusScale = entering ? 1.4 - 0.4 * entryEase : 1;

      state.pointerX += (state.pointerXT - state.pointerX) * (1 - Math.exp(-dt * 6));
      state.pointerY += (state.pointerYT - state.pointerY) * (1 - Math.exp(-dt * 6));
      state.hover += (state.hoverT - state.hover) * (1 - Math.exp(-dt * 4));

      if (reducedMotion) {
        idleSpeed = 0;
      } else {
        idleSpeed += (targetIdleSpeed - idleSpeed) * Math.min(1, dt * 3);
        state.turn = (state.turn + idleSpeed * dt) % TAU;
      }

      const damping = Math.exp(-dt * (0.5 + 50 / 12));
      if (!state.dragging) {
        state.userTurn += state.velocity * dt;
        state.velocity *= damping;
      }

      const mob = state.isMobile;
      const centerX = state.width / 2;

      if (mob) {
        // ── MOBILE: Sweeping 3D curved horizontal arc in the lower half ──
        // Avoids cramped circular ring & keeps upper 40% completely clear for headline.
        const activeCount = Math.min(images.length, 7);
        const centerY = state.height * 0.67;
        const cardBaseScale = (0.44 * state.width) / 160;
        const perspective = Math.max(700, state.width * 2.2);
        const phi = entryAngle * 0.45 + state.turn + state.userTurn;

        if (stageRef.current) {
          stageRef.current.style.perspective = `${perspective}px`;
          stageRef.current.style.perspectiveOrigin = `${centerX}px ${centerY}px`;
        }

        images.forEach((_image, index) => {
          const card = cardRefs.current[index];
          if (!card) return;

          if (index >= activeCount) {
            card.style.opacity = "0";
            card.style.pointerEvents = "none";
            card.style.transform = "translate3d(-9999px, -9999px, 0)";
            return;
          }

          const theta = phi + (TAU * index) / activeCount;
          const sinT = Math.sin(theta);
          const cosT = Math.cos(theta);

          // Gentle horizontal arc across the screen
          const x = centerX + sinT * (state.width * 0.44);
          // Front card sits slightly higher than side cards in a subtle arc
          const y = centerY + (1 - cosT) * (state.height * 0.032);
          const z = (cosT - 1) * 110;

          let entryScale = 1;
          let entryOpacity = 1;
          if (!reducedMotion) {
            const cardTime = now - entryStart - entryDelay - index * 90;
            const cardProgress = Math.min(1, Math.max(0, cardTime / 800));
            const cardEase = 1 - Math.pow(1 - cardProgress, 4);
            entryScale = 0.78 + 0.22 * cardEase;
            entryOpacity = cardEase;
          }

          const depthFactor = (cosT + 1) / 2;
          const scale = cardBaseScale * (0.72 + 0.28 * depthFactor) * entryScale;
          const yaw = -sinT * 24;

          // Fade back-half cards smoothly to 0 so they never clutter behind front cards
          const arcOpacity = Math.min(1, Math.max(0, (cosT + 0.2) / 0.55));
          const finalOpacity = arcOpacity * entryOpacity;
          const blur = Math.max(0, (1 - Math.max(0, cosT)) * 2.4);

          card.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) translate(-50%, -50%) rotateY(${yaw.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
          card.style.zIndex = String(100000 + Math.round(cosT * 1000));
          card.style.opacity = finalOpacity.toFixed(3);
          card.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
        });
      } else {
        // ── DESKTOP: Original 3D tilted halo ring ──
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
        const centerY = state.height * 0.42;
        const phi = entryAngle + state.turn + state.userTurn +
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
            const ringRadius = radius * radiusScale * (1 + (radiusJitter * 6) / 100);
            const x0 = ringRadius * Math.sin(theta);
            const z0 = ringRadius * Math.cos(theta);
            const y0 = heightJitter * 12;
            const y1 = y0 * cosPitch + z0 * sinPitch;
            const z1 = Math.min(z0 * cosPitch - y0 * sinPitch, perspective - 50);
            const x = centerX + (x0 * cosRoll - y1 * sinRoll) * unit;
            const y = centerY + (x0 * sinRoll + y1 * cosRoll) * unit;
            const z = z1 * unit;
            let entryScale = 1;
            let entryOpacity = 1;
            if (!reducedMotion) {
              const cardTime = now - entryStart - entryDelay - index * 120;
              const cardProgress = Math.min(1, Math.max(0, cardTime / 900));
              const cardEase = 1 - Math.pow(1 - cardProgress, 4);
              entryScale = 0.6 + 0.4 * cardEase;
              entryOpacity = cardEase;
            }
            const scale = unit * entryScale;
            const yaw = 18 * Math.sin(theta);

            card.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) translate(-50%, -50%) rotateY(${yaw.toFixed(3)}deg) scale(${scale.toFixed(4)})`;

            const yRing = x0 * Math.sin(-12 * DEG) +
              (y0 * cosPitchBase + z0 * sinPitchBase) * Math.cos(-12 * DEG);
            card.style.zIndex = String(100000 + Math.round(yRing * 10));
            const backDepth = Math.min(1, Math.max(0, (-z1 + radius) / (radius * 2)));
            card.style.opacity = ((1 - backDepth * 0.35) * entryOpacity).toFixed(3);
            card.style.filter = `blur(${(backDepth * 1.5).toFixed(2)}px)`;
          }
        });
      }

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
      className="relative h-full w-full cursor-grab select-none active:cursor-grabbing"
      style={{ touchAction: "pan-y" }}
      aria-label="Draggable 3D carousel of The Vault images"
    >
      <div ref={stageRef} className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={image.src}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            className="absolute left-0 top-0 aspect-video w-40 overflow-hidden rounded-sm bg-bg-secondary"
            style={{
              transform: "translate3d(-9999px, -9999px, 0)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0,0,0,0.06)",
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
