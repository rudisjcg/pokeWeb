"use client";

import dynamic from "next/dynamic";

const ModelCanvas = dynamic(() => import("./ModelCanvas"), { ssr: false });

export default function PikachuCanvas() {
  return (
    <ModelCanvas
      modelUrl="/pokemon-pikachu/scene.gltf"
      className="max-w-[200px] md:block hidden"
      mobileQuery="(max-width: 200px)"
      scale={{ desktop: 0.1, mobile: 0.1 }}
      position={{ desktop: [0, -4.25, 0], mobile: [0, -4, 0] }}
    />
  );
}
