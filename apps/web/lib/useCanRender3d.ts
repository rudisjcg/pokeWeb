"use client";

import { useEffect, useState } from "react";

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Whether the 3D scenes should mount: null until checked in the browser, false
 * without WebGL or when the visitor prefers reduced motion.
 */
export function useCanRender3d(): boolean | null {
  const [canRender, setCanRender] = useState<boolean | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setCanRender(!reducedMotion.matches && hasWebGL());
    update();
    reducedMotion.addEventListener("change", update);
    return () => reducedMotion.removeEventListener("change", update);
  }, []);

  return canRender;
}
