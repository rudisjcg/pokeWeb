"use client";

import { useProgress } from "@react-three/drei";

/** Loading percentage shown over a 3D canvas while its model downloads. */
export default function Loader() {
  const { active, progress } = useProgress();
  if (!active) return null;

  return (
    <span className="canvas-load absolute inset-0 flex items-center justify-center pointer-events-none">
      <p style={{ fontSize: 14, color: "#f1f1f1", fontWeight: 800 }}>{progress.toFixed(2)}%</p>
    </span>
  );
}
