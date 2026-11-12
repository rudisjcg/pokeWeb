import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EvolutionChain from "@/components/pokemon/EvolutionChain";
import PokemonHero from "@/components/pokemon/PokemonHero";
import PrevNext from "@/components/pokemon/PrevNext";
import TypeMatchups from "@/components/pokemon/TypeMatchups";
import Panel from "@/components/ui/Panel";
import StatBar from "@/components/ui/StatBar";
import { neighbors } from "@/lib/neighbors";
import { getEvolutionChain, getPokemon, listPokemonNames } from "@/lib/pokeapi";
import { formatHeight, formatWeight, statTotal } from "@/lib/stats";
import { strings } from "@/lib/strings";
import { typeStyle } from "@/lib/typeColors";

export const revalidate = 86400;

// Nothing is prebuilt: each Pokémon page is rendered on its first visit and then cached.
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const pokemon = await getPokemon(id);
  if (!pokemon) return { title: strings.errors.notFoundTitle };

  const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  return { title: `${name} #${pokemon.id}` };
}

export default async function PokemonPage({ params }: Props) {
  const { id } = await params;
  const pokemon = await getPokemon(id);
  if (!pokemon) notFound();

  const [evolution, names] = await Promise.all([getEvolutionChain(pokemon.speciesUrl), listPokemonNames()]);
  const { prev, next } = neighbors(pokemon.id, names);
  const statValues = pokemon.stats.map((stat) => stat.value);

  return (
    <article style={typeStyle(pokemon.types)}>
      <PokemonHero pokemon={pokemon} />

      <div className="max-w-page mx-auto px-4 sm:px-6 py-10 grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Panel className="p-6 sm:p-8">
          <h2 className="text-[26px] mb-6">{strings.pokemon.stats}</h2>
          <div className="flex flex-col gap-4">
            {pokemon.stats.map((stat, index) => (
              <StatBar key={stat.name} label={strings.pokemon.statNames[index] ?? stat.name} value={stat.value} />
            ))}
          </div>
          <p className="mt-6 pt-4 border-t border-line flex justify-between font-display font-semibold">
            <span>{strings.pokemon.total}</span>
            <span data-testid="stat-total" className="tabular-nums text-[20px]">
              {statTotal(statValues)}
            </span>
          </p>
        </Panel>

        <Panel className="p-6 sm:p-8">
          <h2 className="text-[26px] mb-6">{strings.pokemon.data}</h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
            <dt className="text-muted">{strings.pokemon.height}</dt>
            <dd className="font-medium">{formatHeight(pokemon.height)}</dd>
            <dt className="text-muted">{strings.pokemon.weight}</dt>
            <dd className="font-medium">{formatWeight(pokemon.weight)}</dd>
            <dt className="text-muted">{strings.pokemon.baseExperience}</dt>
            <dd className="font-medium">{pokemon.baseExperience ?? "—"}</dd>
            <dt className="text-muted">{strings.pokemon.abilities}</dt>
            <dd className="font-medium capitalize">
              {pokemon.abilities.map((ability) => ability.replaceAll("-", " ")).join(", ")}
            </dd>
          </dl>
        </Panel>

        <Panel className="p-6 sm:p-8 lg:col-span-2">
          <h2 className="text-[26px] mb-6">{strings.pokemon.evolution}</h2>
          <EvolutionChain stages={evolution} currentId={pokemon.id} />
        </Panel>

        <Panel className="p-6 sm:p-8 lg:col-span-2">
          <h2 className="text-[26px] mb-6">{strings.pokemon.matchups}</h2>
          <TypeMatchups types={pokemon.types} />
        </Panel>

        <div className="lg:col-span-2">
          <PrevNext prev={prev} next={next} />
        </div>
      </div>
    </article>
  );
}
