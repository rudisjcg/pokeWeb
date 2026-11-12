"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCanRender3d } from "@/lib/useCanRender3d";

const ArenaScene = dynamic(() => import("./ArenaScene"), { ssr: false });

/** The 3D arena when the device can show it, otherwise a still of the same scene. Decorative either way. */
export default function HeroCanvas() {
  const canRender = useCanRender3d();
  const [wide, setWide] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <div aria-hidden="true" className="w-full h-full cursor-grab active:cursor-grabbing">
      {canRender === true && <ArenaScene particles={wide} />}
      {canRender === false && (
        <img
          data-testid="hero-static"
          src="/assets/pikachu-static.png"
          alt=""
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
}
