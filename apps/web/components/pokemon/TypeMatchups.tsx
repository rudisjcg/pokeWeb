import TypeBadge from "@/components/ui/TypeBadge";
import { pokemonTypes, type PokemonTypeName } from "@/lib/pokemonTypes";
import { strings } from "@/lib/strings";
import { isTypeName } from "@/lib/typeColors";

function Group({ label, types }: { label: string; types: PokemonTypeName[] }) {
  if (types.length === 0) return null;
  return (
    <div className="grid sm:grid-cols-[11rem_1fr] gap-x-4 gap-y-2 items-start">
      <dt className="text-muted text-[14px] sm:pt-1">{label}</dt>
      <dd className="flex flex-wrap gap-1.5">
        {types.map((type) => (
          <TypeBadge key={type} type={type} size="sm" />
        ))}
      </dd>
    </div>
  );
}

/** How each of the Pokémon's own types fares against the others. */
export default function TypeMatchups({ types }: { types: string[] }) {
  return (
    <div className="flex flex-col gap-8">
      {types.filter(isTypeName).map((type) => {
        const matchup = pokemonTypes[type];
        return (
          <div key={type}>
            <TypeBadge type={type} />
            <dl className="flex flex-col gap-3 mt-4">
              <Group label={strings.pokemon.strength} types={matchup.strength} />
              <Group label={strings.pokemon.weakness} types={matchup.weakness} />
              <Group label={strings.pokemon.resistance} types={matchup.resistance} />
              <Group label={strings.pokemon.vulnerable} types={matchup.vulnerable} />
            </dl>
          </div>
        );
      })}
    </div>
  );
}
