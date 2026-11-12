import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** "type" outlines the panel with the current --type colour instead of the neutral line. */
  tone?: "default" | "type";
  /** Fills the panel with the diagonal type-colour wash instead of the flat surface. */
  slash?: boolean;
  className?: string;
  style?: CSSProperties;
};

/** Surface with two cut corners. The wrapper draws the 1px outline the clip-path would otherwise remove. */
export default function Panel({ children, tone = "default", slash = false, className = "", style }: Props) {
  const outline = tone === "type" ? "bg-type" : "bg-line";
  return (
    <div className={`cut p-px ${outline}`} style={style}>
      <div className={`cut h-full ${slash ? "type-slash" : "bg-ink-800"} ${className}`}>{children}</div>
    </div>
  );
}
