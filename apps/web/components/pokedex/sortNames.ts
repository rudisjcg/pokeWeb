import type { PokemonName } from "@/lib/pokeapi.types";

export type SortOrder = "asc" | "desc";

/** Alphabetical copy of the list; the input is left untouched. */
export function sortNames(list: readonly PokemonName[], order: SortOrder): PokemonName[] {
  const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name));
  return order === "asc" ? sorted : sorted.reverse();
}
