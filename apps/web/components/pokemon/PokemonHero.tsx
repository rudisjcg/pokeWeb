import AddFavoriteButton from "@/components/AddFavoriteButton";
import { dexNumber } from "@/components/PokemonCard";
import TypeBadge from "@/components/ui/TypeBadge";
import { FALLBACK_SPRITE } from "@/lib/constants";
import type { PokemonDetail } from "@/lib/pokeapi.types";
import ParallaxArt from "./ParallaxArt";

/** Full-width header tinted with the Pokémon's type: number, name, types, artwork and the favorite action. */
export default function PokemonHero({ pokemon }: { pokemon: PokemonDetail }) {
  return (
    <header className="type-slash relative overflow-hidden border-b border-line">
      <div className="max-w-page mx-auto px-4 sm:px-6 py-10 md:py-14 grid items-center gap-6 md:grid-cols-[1fr_auto]">
        <div className="relative z-10">
          <p className="font-display font-bold text-[20px] text-type tabular-nums">{dexNumber(pokemon.id)}</p>
          <h1 className="capitalize text-[clamp(40px,8vw,88px)] break-words">{pokemon.name.replaceAll("-", " ")}</h1>
          <div className="flex flex-wrap gap-2 mt-4">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>
          <div className="mt-8">
            <AddFavoriteButton pokemonId={pokemon.id} pokemonName={pokemon.name} />
          </div>
        </div>
        <div className="relative justify-self-center md:justify-self-end">
          <span
            aria-hidden="true"
            className="absolute -inset-x-10 top-1/2 -translate-y-1/2 text-center font-display font-bold leading-none text-[clamp(120px,22vw,260px)] text-fg opacity-[0.06] select-none tabular-nums"
          >
            {String(pokemon.id).padStart(4, "0")}
          </span>
          <ParallaxArt
            src={pokemon.sprite ?? FALLBACK_SPRITE}
            alt={pokemon.name}
            transitionName={`pokemon-${pokemon.id}`}
          />
        </div>
      </div>
    </header>
  );
}
