import type { EvolutionStage, PokemonDetail, PokemonName, PokemonSummary } from "./pokeapi.types";

const API = "https://pokeapi.co/api/v2";
const HOME_SPRITES = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home";
const ONE_DAY_SECONDS = 86400;

/** PokeAPI answered with an unexpected status, or could not be reached at all (`status` is null). */
export class PokeApiError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null) {
    super(message);
    this.name = "PokeApiError";
    this.status = status;
  }
}

type ApiPokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  sprites: { other?: { home?: { front_default?: string | null } } };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  species: { url: string };
};

type ApiChainLink = {
  species: { name: string; url: string };
  evolves_to: ApiChainLink[];
};

export function normalizeQuery(raw: string): string {
  return raw.trim().toLowerCase();
}

/** Fetches JSON with a 24 hour cache. Resolves to null on 404, throws PokeApiError otherwise. */
async function fetchJson<T>(url: string): Promise<T | null> {
  let response: Response;
  try {
    response = await fetch(url, { next: { revalidate: ONE_DAY_SECONDS } });
  } catch {
    throw new PokeApiError(`PokeAPI unreachable: ${url}`, null);
  }
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new PokeApiError(`PokeAPI responded ${response.status}: ${url}`, response.status);
  }
  return (await response.json()) as T;
}

function idFromUrl(url: string): number {
  const match = /\/(\d+)\/?$/.exec(url);
  return match?.[1] ? Number(match[1]) : 0;
}

function toDetail(pokemon: ApiPokemon): PokemonDetail {
  return {
    id: pokemon.id,
    name: pokemon.name,
    sprite: pokemon.sprites.other?.home?.front_default ?? null,
    types: pokemon.types.map(({ type }) => type.name),
    height: pokemon.height,
    weight: pokemon.weight,
    baseExperience: pokemon.base_experience,
    abilities: pokemon.abilities.map(({ ability }) => ability.name),
    stats: pokemon.stats.map(({ base_stat, stat }) => ({ name: stat.name, value: base_stat })),
    speciesUrl: pokemon.species.url,
  };
}

export async function listPokemonNames(): Promise<PokemonName[]> {
  const data = await fetchJson<{ results: { name: string; url: string }[] }>(`${API}/pokemon?limit=5000`);
  if (!data) throw new PokeApiError("PokeAPI pokemon list not found", 404);
  return data.results.map(({ name, url }) => ({ name, id: idFromUrl(url) }));
}

/** Looks a Pokémon up by national number or name. Null when it does not exist. */
export async function getPokemon(idOrName: string | number): Promise<PokemonDetail | null> {
  const query = normalizeQuery(String(idOrName));
  // PokeAPI names are lowercase letters, digits and hyphens; anything else cannot match.
  if (!/^[a-z0-9-]+$/.test(query)) return null;

  const pokemon = await fetchJson<ApiPokemon>(`${API}/pokemon/${query}`);
  return pokemon ? toDetail(pokemon) : null;
}

export async function getPokemonSummaries(ids: number[]): Promise<PokemonSummary[]> {
  const details = await Promise.all(ids.map((id) => getPokemon(id)));
  return details
    .filter((detail): detail is PokemonDetail => detail !== null)
    .map(({ id, name, sprite, types }) => ({ id, name, sprite, types }));
}

/** National numbers of every Pokémon of a type, ascending. Empty when the type does not exist. */
export async function listPokemonIdsByType(type: string): Promise<number[]> {
  if (!/^[a-z]+$/.test(type)) return [];

  const data = await fetchJson<{ pokemon: { pokemon: { url: string } }[] }>(`${API}/type/${type}`);
  if (!data) return [];
  return data.pokemon.map(({ pokemon }) => idFromUrl(pokemon.url)).sort((a, b) => a - b);
}

function flattenChain(link: ApiChainLink): EvolutionStage[] {
  const id = idFromUrl(link.species.url);
  const stage: EvolutionStage = { id, name: link.species.name, sprite: `${HOME_SPRITES}/${id}.png` };
  return [stage, ...link.evolves_to.flatMap(flattenChain)];
}

/** Every stage of the evolution line a species belongs to, base form first. */
export async function getEvolutionChain(speciesUrl: string): Promise<EvolutionStage[]> {
  const species = await fetchJson<{ evolution_chain: { url: string } | null }>(speciesUrl);
  if (!species?.evolution_chain) return [];

  const chain = await fetchJson<{ chain: ApiChainLink }>(species.evolution_chain.url);
  return chain ? flattenChain(chain.chain) : [];
}
