export type PokemonSummary = {
  id: number;
  name: string;
  sprite: string | null;
  types: string[];
};

export type PokemonDetail = PokemonSummary & {
  height: number;
  weight: number;
  baseExperience: number | null;
  abilities: string[];
  stats: { name: string; value: number }[];
  speciesUrl: string;
};

export type EvolutionStage = {
  id: number;
  name: string;
  sprite: string | null;
};

export type PokemonName = { id: number; name: string };
