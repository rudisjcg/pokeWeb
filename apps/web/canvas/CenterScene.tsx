"use client";

import { Bounds, Center, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

const MODEL_URL = "/pokecenter/scene.gltf";

function PokeCenter() {
  const center = useGLTF(MODEL_URL);
  return (
    <Bounds fit clip margin={1.1}>
      <Center>
        <primitive object={center.scene} />
      </Center>
    </Bounds>
  );
}

/** Slowly turning Pokémon Center, used where a page has nothing else to show. */
export default function CenterScene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [10, 6, 12], fov: 30 }} gl={{ alpha: true }}>
      <hemisphereLight intensity={1.4} color="#dfe6ff" groundColor="#1b2338" />
      <directionalLight position={[6, 12, 8]} intensity={2.4} />
      <Suspense fallback={null}>
        <PokeCenter />
      </Suspense>
      <OrbitControls makeDefault autoRotate autoRotateSpeed={1.2} enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
