import { typeBadgeClass } from "@/lib/constants";
import type { PokemonTypeName } from "@/lib/pokemonTypes";

export default function TypeBadge({ type }: { type: string }) {
  const color = typeBadgeClass[type as PokemonTypeName] ?? "bg-gray-400";
  return <span className={`${color} p-1 m-1 rounded-md text-[16px]`}>{type}</span>;
}
