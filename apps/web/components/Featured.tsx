import { getPokemonSummaries } from "@/lib/pokeapi";
import { strings } from "@/lib/strings";
import PokemonCard from "./PokemonCard";

/** National numbers 524–533, the same ten the original home page showed. */
const FEATURED_IDS = Array.from({ length: 10 }, (_, index) => 524 + index);

export default async function Featured() {
  const pokemons = await getPokemonSummaries(FEATURED_IDS);

  return (
    <section className="max-w-page mx-auto px-4 sm:px-6 pt-16">
      <h2 className="text-[36px] sm:text-[44px]">{strings.home.featured}</h2>
      <p className="text-muted mt-2">{strings.home.featuredIntro}</p>
      <ul className="rail mt-8 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
        {pokemons.map((pokemon) => (
          <li key={pokemon.id} className="w-[270px]">
            <PokemonCard pokemon={pokemon} />
          </li>
        ))}
      </ul>
    </section>
  );
}
