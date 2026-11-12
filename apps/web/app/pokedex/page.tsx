import type { Metadata } from "next";
import PokedexBrowser from "@/components/pokedex/PokedexBrowser";
import SectionWrapper from "@/components/SectionWrapper";
import { getPokemonSummaries, listPokemonNames } from "@/lib/pokeapi";
import { strings } from "@/lib/strings";

export const revalidate = 86400;

export const metadata: Metadata = { title: strings.nav.pokedex };

export default async function PokedexPage() {
  const names = await listPokemonNames();
  const initialSummaries = await getPokemonSummaries(names.slice(0, 12).map((entry) => entry.id));

  return (
    <SectionWrapper>
      <PokedexBrowser names={names} initialSummaries={initialSummaries} />
    </SectionWrapper>
  );
}
