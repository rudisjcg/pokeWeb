"use client";

import { Bounds, Center, OrbitControls, Sparkles, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import type { Group, PointLight } from "three";

const VOLT = "#f5d90a";
const MODEL_URL = "/pokemon-pikachu/scene.gltf";

/** A light that drifts towards wherever the pointer is over the scene. */
function PointerLight() {
  const light = useRef<PointLight>(null);

  useFrame(({ pointer }) => {
    if (!light.current) return;
    light.current.position.x += (pointer.x * 9 - light.current.position.x) * 0.08;
    light.current.position.y += (4 + pointer.y * 5 - light.current.position.y) * 0.08;
  });

  return <pointLight ref={light} position={[0, 4, 8]} intensity={160} color="#fff3b0" />;
}

function Rings() {
  const outer = useRef<Group>(null);

  useFrame((_, delta) => {
    if (outer.current) outer.current.rotation.y -= delta * 0.25;
  });

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[3.3, 3.42, 96]} />
        <meshBasicMaterial color={VOLT} />
      </mesh>
      <group ref={outer} position={[0, 0.02, 0]}>
        {/* Dashed outer ring: twelve short arcs. */}
        {Array.from({ length: 12 }, (_, index) => (
          <mesh key={index} rotation={[-Math.PI / 2, 0, (index * Math.PI) / 6]}>
            <ringGeometry args={[4.15, 4.25, 12, 1, 0, Math.PI / 10]} />
            <meshBasicMaterial color={VOLT} transparent opacity={0.55} />
          </mesh>
        ))}
      </group>
    </>
  );
}

function Arena({ particles }: { particles: boolean }) {
  const pikachu = useGLTF(MODEL_URL);

  return (
    <>
      <Bounds fit clip margin={1.05}>
        <group>
          <Center top>
            <primitive object={pikachu.scene} scale={0.1} rotation={[0, 0.9, 0]} />
          </Center>
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[3.7, 4.1, 0.5, 64]} />
            <meshStandardMaterial color="#141b30" metalness={0.6} roughness={0.35} />
          </mesh>
          <Rings />
        </group>
      </Bounds>
      {particles && <Sparkles count={70} scale={[12, 8, 12]} position={[0, 3.5, 0]} size={5} speed={0.35} color={VOLT} />}
    </>
  );
}

/** Pauses rendering while the canvas is scrolled out of view or the tab is hidden. */
function useVisible<T extends Element>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let onScreen = true;
    const update = () => setVisible(onScreen && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? true;
      update();
    });

    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return { ref, visible };
}

/** The home page scene: Pikachu on a lit arena platform. Drag to turn it. */
export default function ArenaScene({ particles = true }: { particles?: boolean }) {
  const { ref, visible } = useVisible<HTMLDivElement>();

  return (
    <div ref={ref} className="w-full h-full">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [14, 6, 16], fov: 28 }}
        gl={{ antialias: true, alpha: true }}
      >
        <hemisphereLight intensity={2.2} color="#dfe6ff" groundColor="#1b2338" />
        <directionalLight position={[8, 12, 10]} intensity={3} />
        <PointerLight />
        <Suspense fallback={null}>
          <Arena particles={particles} />
        </Suspense>
        <OrbitControls
          makeDefault
          autoRotate
          autoRotateSpeed={0.9}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.15}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
