"use client";

import dynamic from "next/dynamic";
import { useCanRender3d } from "@/lib/useCanRender3d";

const CenterScene = dynamic(() => import("./CenterScene"), { ssr: false });

/** Decorative Pokémon Center. Renders nothing without WebGL or with reduced motion. */
export default function CenterCanvas({ className = "" }: { className?: string }) {
  const canRender = useCanRender3d();
  if (!canRender) return null;

  return (
    <div aria-hidden="true" className={className}>
      <CenterScene />
    </div>
  );
}
