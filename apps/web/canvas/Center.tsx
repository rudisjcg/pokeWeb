"use client";

import dynamic from "next/dynamic";

const ModelCanvas = dynamic(() => import("./ModelCanvas"), { ssr: false });

export default function CenterCanvas() {
  return (
    <ModelCanvas
      modelUrl="/pokecenter/scene.gltf"
      className="max-w-[250px] md:block hidden"
      mobileQuery="(max-width: 400px)"
      scale={{ desktop: 4, mobile: 0.6 }}
      position={{ desktop: [0, -0.25, 0], mobile: [0, -4, 0] }}
    />
  );
}
