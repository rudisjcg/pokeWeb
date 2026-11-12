import { isTypeName } from "./typeColors";
import type { PokemonTypeName } from "./pokemonTypes";

export const MAX_IDS_PER_REQUEST = 24;

/** Parses the `ids` query parameter. Null when it is missing, malformed or too long. */
export function parseIds(raw: string | null): number[] | null {
  if (!raw) return null;

  const parts = raw.split(",");
  if (!parts.every((part) => /^[1-9]\d*$/.test(part))) return null;

  const ids = [...new Set(parts.map(Number))];
  return ids.length <= MAX_IDS_PER_REQUEST ? ids : null;
}

/** Parses the `type` query parameter. Null unless it is exactly one of the 18 known types. */
export function parseType(raw: string | null): PokemonTypeName | null {
  return raw !== null && isTypeName(raw) ? raw : null;
}
