export default function SkeletonCard({ size = "md" }: { size?: "md" | "sm" }) {
  return <div aria-hidden="true" className={`cut skeleton ${size === "sm" ? "h-[132px]" : "h-[248px]"} w-full`} />;
}
