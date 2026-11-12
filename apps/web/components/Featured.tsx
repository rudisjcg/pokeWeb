import { getPokemonSummaries } from "@/lib/pokeapi";
import FeaturedCarousel from "./FeaturedCarousel";
import SectionWrapper from "./SectionWrapper";

/** National numbers 524–533, the same ten the original home page showed. */
const FEATURED_IDS = Array.from({ length: 10 }, (_, index) => 524 + index);

export default async function Featured() {
  const pokemons = await getPokemonSummaries(FEATURED_IDS);

  return (
    <SectionWrapper id="featured">
      <FeaturedCarousel pokemons={pokemons} />
    </SectionWrapper>
  );
}
