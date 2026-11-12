import Link from "next/link";
import { ViewTransition } from "react";
import { FALLBACK_SPRITE } from "@/lib/constants";
import type { PokemonSummary } from "@/lib/pokeapi.types";
import { typeStyle } from "@/lib/typeColors";
import HoloTilt from "./HoloTilt";
import TypeBadge from "./ui/TypeBadge";

type Props = { pokemon: PokemonSummary; size?: "md" | "sm" };

export function dexNumber(id: number): string {
  return `#${String(id).padStart(4, "0")}`;
}

/** Holographic card linking to a Pokémon's page, tinted with its type colours. */
export default function PokemonCard({ pokemon, size = "md" }: Props) {
  const compact = size === "sm";

  const image = (
    <img
      src={pokemon.sprite ?? FALLBACK_SPRITE}
      alt=""
      loading="lazy"
      width={compact ? 96 : 176}
      height={compact ? 96 : 176}
      className={`absolute object-contain drop-shadow-[0_12px_18px_rgb(0_0_0/0.55)] ${
        compact ? "right-2 bottom-2 w-24 h-24" : "right-1 bottom-2 w-44 h-44"
      }`}
    />
  );
  // Full-size cards share their artwork with the Pokémon page header, so the
  // browser can morph one into the other during navigation.
  const artwork = compact ? (
    image
  ) : (
    <ViewTransition name={`pokemon-${pokemon.id}`} share="morph" default="none">
      {image}
    </ViewTransition>
  );

  return (
    <HoloTilt style={typeStyle(pokemon.types)} className="h-full">
      <Link
        href={`/pokemon/${pokemon.name}`}
        data-testid="pokemon-card"
        className={`cut type-slash relative block h-full overflow-hidden ${compact ? "min-h-[132px] p-4" : "min-h-[248px] p-5"}`}
      >
        <span className="font-display font-semibold text-muted text-[14px] tabular-nums">
          {dexNumber(pokemon.id)}
        </span>
        <h3
          className={`capitalize break-words max-w-[62%] ${compact ? "text-[18px] mt-0.5" : "text-[24px] mt-1"}`}
        >
          {pokemon.name.replaceAll("-", " ")}
        </h3>
        <div
          className={`flex flex-col items-start gap-1.5 ${compact ? "mt-2" : "absolute left-5 bottom-5"}`}
        >
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} size="sm" />
          ))}
        </div>
        {artwork}
        <span className="holo-glare" aria-hidden="true" />
      </Link>
    </HoloTilt>
  );
}
