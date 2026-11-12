import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** "type" outlines the panel with the current --type colour instead of the neutral line. */
  tone?: "default" | "type";
  className?: string;
  style?: CSSProperties;
};

/** Surface with two cut corners. The wrapper draws the 1px outline the clip-path would otherwise remove. */
export default function Panel({ children, tone = "default", className = "", style }: Props) {
  const outline = tone === "type" ? "bg-type" : "bg-line";
  return (
    <div className={`cut p-px ${outline}`} style={style}>
      <div className={`cut bg-ink-800 h-full ${className}`}>{children}</div>
    </div>
  );
}
