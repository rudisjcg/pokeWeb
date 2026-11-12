import type { PokemonName } from "./pokeapi.types";

/** The entries just before and after a Pokémon in the national list; null at either end. */
export function neighbors(
  id: number,
  names: readonly PokemonName[],
): { prev: PokemonName | null; next: PokemonName | null } {
  const index = names.findIndex((entry) => entry.id === id);
  if (index === -1) return { prev: null, next: null };
  return { prev: names[index - 1] ?? null, next: names[index + 1] ?? null };
}
