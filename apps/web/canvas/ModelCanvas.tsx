"use client";

import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import Loader from "@/components/Loader";

type Vec3 = [number, number, number];

/**
 * The scenes were lit for three.js legacy lighting, which multiplied every
 * light by PI. Current three.js dropped that mode, so the factor is applied here
 * to keep the models as bright as they were.
 */
const LEGACY_LIGHT_SCALE = Math.PI;

export type ModelCanvasProps = {
  modelUrl: string;
  className: string;
  mobileQuery: string;
  scale: { desktop: number; mobile: number };
  position: { desktop: Vec3; mobile: Vec3 };
};

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, [query]);

  return matches;
}

function Model({
  modelUrl,
  scale,
  position,
}: {
  modelUrl: string;
  scale: number;
  position: Vec3;
}) {
  const gltf = useGLTF(modelUrl);

  return (
    <mesh>
      <hemisphereLight
        intensity={0.15 * LEGACY_LIGHT_SCALE}
        groundColor="yellow"
      />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={LEGACY_LIGHT_SCALE}
        castShadow
      />
      <pointLight intensity={0.5 * LEGACY_LIGHT_SCALE} />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={LEGACY_LIGHT_SCALE}
      />
      <primitive
        object={gltf.scene}
        scale={scale}
        position={position}
        rotation={[-0.01, 1.25, -0.02]}
      />
    </mesh>
  );
}

/** Auto-rotating 3D model viewer shared by the Pikachu and Pokécenter scenes. */
export default function ModelCanvas({
  modelUrl,
  className,
  mobileQuery,
  scale,
  position,
}: ModelCanvasProps) {
  const isMobile = useMediaQuery(mobileQuery);

  return (
    <div className={`relative ${className}`}>
      <Loader />
      <Canvas
        frameloop="demand"
        shadows
        camera={{ position: [20, 3, 5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={null}>
          <OrbitControls
            autoRotate
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Model
            modelUrl={modelUrl}
            scale={isMobile ? scale.mobile : scale.desktop}
            position={isMobile ? position.mobile : position.desktop}
          />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
}
