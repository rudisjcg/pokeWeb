import type { CSSProperties } from "react";
import type { PokemonTypeName } from "./pokemonTypes";

/** Colour of each Pokémon type, tuned to stay vivid on the dark Arena background. */
const TYPE_COLORS: Record<PokemonTypeName, string> = {
  normal: "#b7b89a",
  fire: "#ff6b3d",
  water: "#3d9bff",
  electric: "#ffd23d",
  grass: "#5fd35f",
  ice: "#7fe3e6",
  fighting: "#e0483c",
  poison: "#b25fd6",
  ground: "#d9a85b",
  flying: "#9db4ff",
  psychic: "#ff5c9a",
  bug: "#a9c93a",
  rock: "#b8a05a",
  ghost: "#7a62c9",
  dragon: "#6a5cff",
  dark: "#75645c",
  steel: "#9fb6c7",
  fairy: "#ff9ad5",
};

/** Used for types the table does not know (new games add some, such as "stellar"). */
export const NEUTRAL_TYPE_COLOR = "#7c86a8";

export const TYPE_NAMES = Object.keys(TYPE_COLORS) as PokemonTypeName[];

export function isTypeName(value: string): value is PokemonTypeName {
  return value in TYPE_COLORS;
}

export function typeColor(type: string): string {
  return isTypeName(type) ? TYPE_COLORS[type] : NEUTRAL_TYPE_COLOR;
}

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => {
    const value = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const [red = 0, green = 0, blue = 0] = channels;
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

const DARK_TEXT = "#05070f";
const LIGHT_TEXT = "#ffffff";

/** Whichever of the two text colours has the higher contrast on a `#rrggbb` background. */
export function readableOn(hex: string): typeof DARK_TEXT | typeof LIGHT_TEXT {
  const background = relativeLuminance(hex);
  const contrastWithDark = (background + 0.05) / (relativeLuminance(DARK_TEXT) + 0.05);
  const contrastWithLight = 1.05 / (background + 0.05);
  return contrastWithDark >= contrastWithLight ? DARK_TEXT : LIGHT_TEXT;
}

/** CSS variables that tint a card or page with a Pokémon's type colours. */
export function typeStyle(types: string[]): CSSProperties {
  const first = typeColor(types[0] ?? "");
  const second = types[1] ? typeColor(types[1]) : first;
  return { "--type": first, "--type-2": second } as CSSProperties;
}
