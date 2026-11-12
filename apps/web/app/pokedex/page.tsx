import type { Metadata } from "next";
import PokedexBrowser from "@/components/pokedex/PokedexBrowser";
import { getPokemonSummaries, listPokemonNames } from "@/lib/pokeapi";
import { strings } from "@/lib/strings";

export const revalidate = 86400;

export const metadata: Metadata = { title: strings.pokedex.title };

export default async function PokedexPage() {
  const names = await listPokemonNames();
  const initialSummaries = await getPokemonSummaries(names.slice(0, 12).map((entry) => entry.id));

  return (
    <section className="max-w-page mx-auto px-4 sm:px-6 pt-10">
      <h1 className="text-[44px] sm:text-[56px]">{strings.pokedex.title}</h1>
      <p className="text-muted mt-2 mb-6">{strings.pokedex.intro}</p>
      <PokedexBrowser names={names} initialSummaries={initialSummaries} />
    </section>
  );
}
