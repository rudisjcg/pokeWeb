import type { PokemonTypeName } from "./pokemonTypes";

export const styles = {
  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-16 py-10",

  heroHeadText:
    "font-black text-white lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] mt-2",
  heroSubText:
    "text-[#f4dc26] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]",

  sectionHeadText:
    "text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]",
  sectionSubText:
    "sm:text-[32px] text-[14px] text-secondary uppercase tracking-wider",
} as const;

/** Tailwind classes for each Pokémon type badge. */
export const typeBadgeClass: Record<PokemonTypeName, string> = {
  normal: "bg-gray-400",
  fighting: "bg-orange-500",
  flying: "bg-blue-300",
  poison: "bg-purple-600",
  ground: "bg-amber-800",
  rock: "bg-yellow-800",
  bug: "bg-green-600",
  ghost: "bg-purple-600",
  steel: "bg-slate-500",
  fire: "bg-red-500",
  water: "bg-blue-600 text-white",
  grass: "bg-green-400",
  electric: "bg-yellow-300",
  psychic: "bg-pink-500",
  ice: "bg-sky-300",
  dragon: "bg-cyan-500",
  dark: "bg-neutral-900",
  fairy: "bg-pink-300",
};

export const AVATARS: readonly string[] = Array.from(
  { length: 12 },
  (_, index) => `/assets/profilePictures/pfp${index + 1}.png`,
);

export const FALLBACK_SPRITE = "/assets/025.png";
