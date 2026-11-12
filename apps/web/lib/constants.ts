export const AVATARS: readonly string[] = Array.from(
  { length: 12 },
  (_, index) => `/assets/profilePictures/pfp${index + 1}.png`,
);

/** Shown when PokeAPI has no artwork for a Pokémon. */
export const FALLBACK_SPRITE = "/assets/025.png";
