import Link from "next/link";
import { FALLBACK_SPRITE } from "@/lib/constants";
import type { PokemonSummary } from "@/lib/pokeapi.types";
import TypeBadge from "./ui/TypeBadge";

export default function PokemonCard({ pokemon }: { pokemon: PokemonSummary }) {
  return (
    <Link href={`/pokemon/${pokemon.name}`}>
      <div className="CardPoke border border-gray-800 rounded-tl-lg">
        <img src={pokemon.sprite ?? FALLBACK_SPRITE} alt={pokemon.name} width={198} height={198} />
        <h3 className="text-gray-400 text-[12px] ml-1">#{pokemon.id}</h3>
        <span className="m-1">{pokemon.name}</span>
        <span className="text-[10px] flex gap-2 ">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </span>
      </div>
    </Link>
  );
}
