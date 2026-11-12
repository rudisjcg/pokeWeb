import { pokemonTypes } from "@/lib/pokemonTypes";
import { isTypeName, readableOn, typeColor } from "@/lib/typeColors";

type Props = { type: string; size?: "sm" | "md" };

export default function TypeBadge({ type, size = "md" }: Props) {
  const background = typeColor(type);
  const icon = isTypeName(type) ? pokemonTypes[type].image : null;
  const sizing = size === "sm" ? "h-6 pl-1 pr-2 text-[12px] gap-1" : "h-7 pl-1 pr-3 text-[13px] gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold capitalize ${sizing}`}
      style={{ background, color: readableOn(background) }}
    >
      {icon && <img src={icon} alt="" className={size === "sm" ? "w-4 h-4" : "w-5 h-5"} />}
      {type}
    </span>
  );
}
