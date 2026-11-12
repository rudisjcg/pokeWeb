import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AddFavoriteButton from "@/components/AddFavoriteButton";
import EvolutionChain from "@/components/pokemon/EvolutionChain";
import StatsChart from "@/components/pokemon/StatsChart";
import TypeMatchups from "@/components/pokemon/TypeMatchups";
import SectionWrapper from "@/components/SectionWrapper";
import Tilt from "@/components/Tilt";
import { FALLBACK_SPRITE, styles } from "@/lib/constants";
import { getEvolutionChain, getPokemon } from "@/lib/pokeapi";
import { strings } from "@/lib/strings";

export const revalidate = 86400;

// Nothing is prebuilt: each Pokémon page is rendered on its first visit and then cached.
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const pokemon = await getPokemon(decodeURIComponent(id));
  if (!pokemon) return { title: strings.errors.notFoundTitle };

  const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  return { title: `${name} #${pokemon.id}` };
}

export default async function PokemonPage({ params }: Props) {
  const { id } = await params;
  const pokemon = await getPokemon(decodeURIComponent(id));
  if (!pokemon) notFound();

  const evolution = await getEvolutionChain(pokemon.speciesUrl);

  return (
    <SectionWrapper>
      <section className="relative w-full h-auto mx-auto">
        <div className="mt-10">
          <div className={`${styles.padding} bg-tertiary w-full relative h-fit rounded-lg`}>
            <div className="flex justify-center items-center gap-10">
              <div className="flex items-center gap-2">
                <h1 className="w-fit text-center text-[24px] uppercase">{pokemon.name} </h1>
                <span className="text-[16px] text-gray-400">#{pokemon.id}</span>
              </div>
              <AddFavoriteButton />
            </div>
            <div className="w-[100%] flex flex-col gap-5">
              <div className="w-full flex flex-wrap justify-center items-end">
                <div className="md:w-[50%]">
                  <Tilt>
                    <img src={pokemon.sprite ?? FALLBACK_SPRITE} alt={pokemon.name} className="w-[350px]" />
                  </Tilt>
                </div>
                <div className="md:w-[50%]">
                  <div className={` max-h-[300px] p-2 ${styles.padding}`}>
                    <h2 className={styles.sectionSubText}>{strings.pokemon.stats}</h2>
                    <StatsChart pokemonName={pokemon.name} values={pokemon.stats.map((stat) => stat.value)} />
                  </div>
                </div>
              </div>
              <div className="w-full h-fit mt-10">
                <h2 className={`${styles.sectionSubText} text-center`}>{strings.pokemon.details}</h2>
                <EvolutionChain stages={evolution} currentId={pokemon.id} />
                <div className="flex flex-wrap justify-center items-center gap-5 mb-10 mt-20">
                  <div className={`${styles.padding} flex gap-2  bg-primary w-fit p-1 rounded-lg `}>
                    <div className="w-fit">
                      <p>
                        {strings.pokemon.height}: {pokemon.height}
                      </p>
                      <p>
                        {strings.pokemon.weight}: {pokemon.weight}
                      </p>
                      <p>
                        {strings.pokemon.baseExperience}: {pokemon.baseExperience ?? "—"}
                      </p>
                      <p>{strings.pokemon.abilities}:</p>
                      <ul>
                        {pokemon.abilities.map((ability) => (
                          <li key={ability}> {ability}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <TypeMatchups types={pokemon.types} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SectionWrapper>
  );
}
