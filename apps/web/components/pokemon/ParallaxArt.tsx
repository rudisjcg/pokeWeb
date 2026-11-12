"use client";

import { ViewTransition, useEffect, useRef } from "react";

type Props = { src: string; alt: string; transitionName: string };

const MAX_SHIFT_PX = 14;

/** Artwork that drifts a few pixels against the pointer, giving the header some depth. */
export default function ParallaxArt({ src, alt, transitionName }: Props) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    function handleMove(event: PointerEvent) {
      const image = ref.current;
      if (!image) return;
      const x = (event.clientX / window.innerWidth - 0.5) * -2 * MAX_SHIFT_PX;
      const y = (event.clientY / window.innerHeight - 0.5) * -2 * MAX_SHIFT_PX;
      image.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <ViewTransition name={transitionName} share="morph" default="none">
      <img
        ref={ref}
        src={src}
        alt={alt}
        width={420}
        height={420}
        className="relative w-[min(72vw,420px)] aspect-square object-contain drop-shadow-[0_30px_40px_rgb(0_0_0/0.6)] transition-[translate] duration-200 ease-out"
      />
    </ViewTransition>
  );
}
