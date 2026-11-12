"use client";

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";

const MAX_TILT_DEGREES = 9;

type Props = { children: ReactNode; className?: string; style?: CSSProperties };

/**
 * Tilts its content towards the mouse and moves a holographic glare across it.
 * Touch input is ignored (a finger would tilt the card it is trying to tap) and
 * the CSS switches the effect off for people who prefer reduced motion.
 */
export default function HoloTilt({ children, className = "", style }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const element = ref.current;
    if (!element || event.pointerType !== "mouse") return;

    const box = element.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;

    element.style.setProperty("--rx", `${(0.5 - y) * 2 * MAX_TILT_DEGREES}deg`);
    element.style.setProperty("--ry", `${(x - 0.5) * 2 * MAX_TILT_DEGREES}deg`);
    element.style.setProperty("--mx", `${x * 100}%`);
    element.style.setProperty("--my", `${y * 100}%`);
    element.style.setProperty("--glare", "1");
  }

  function handleLeave() {
    const element = ref.current;
    if (!element) return;
    element.style.setProperty("--rx", "0deg");
    element.style.setProperty("--ry", "0deg");
    element.style.setProperty("--glare", "0");
  }

  return (
    <div ref={ref} className={`holo ${className}`} style={style} onPointerMove={handleMove} onPointerLeave={handleLeave}>
      {children}
    </div>
  );
}
