import { pokemonTypes, type PokemonTypeName } from "@/lib/pokemonTypes";
import { strings } from "@/lib/strings";

function isKnownType(type: string): type is PokemonTypeName {
  return type in pokemonTypes;
}

export default function TypeMatchups({ types }: { types: string[] }) {
  return (
    <div className="flex flex-wrap gap-5">
      {types.filter(isKnownType).map((type) => {
        const matchup = pokemonTypes[type];
        return (
          <div key={type}>
            <div className="flex sm:justify-start justify-center items-center gap-1">
              <img className="w-[50px]" src={matchup.image} alt="" />
              <span>{type}</span>
            </div>
            <ul>
              <li>
                {strings.pokemon.resistance}: {matchup.resistance.join(", ")}
              </li>
              <li>
                {strings.pokemon.strength}: {matchup.strength.join(", ")}
              </li>
              <li>
                {strings.pokemon.vulnerable}: {matchup.vulnerable.join(", ")}
              </li>
              <li>
                {strings.pokemon.weakness}: {matchup.weakness.join(", ")}
              </li>
            </ul>
          </div>
        );
      })}
    </div>
  );
}
