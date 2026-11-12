"use client";

import type { ReactNode } from "react";
import ParallaxTilt from "react-parallax-tilt";

type Props = { className?: string; children: ReactNode };

export default function Tilt({ className, children }: Props) {
  return <ParallaxTilt className={className}>{children}</ParallaxTilt>;
}
