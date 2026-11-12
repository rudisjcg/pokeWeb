import { afterEach, describe, expect, it, vi } from "vitest";
import {
  PokeApiError,
  getEvolutionChain,
  getPokemon,
  getPokemonSummaries,
  listPokemonNames,
  normalizeQuery,
} from "./pokeapi";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

const pikachuPayload = {
  id: 25,
  name: "pikachu",
  height: 4,
  weight: 60,
  base_experience: 112,
  sprites: { other: { home: { front_default: "https://img.test/25.png" } } },
  types: [{ slot: 1, type: { name: "electric" } }],
  abilities: [{ ability: { name: "static" } }, { ability: { name: "lightning-rod" } }],
  stats: [
    { base_stat: 35, stat: { name: "hp" } },
    { base_stat: 55, stat: { name: "attack" } },
  ],
  species: { url: "https://pokeapi.co/api/v2/pokemon-species/25/" },
};

function stubFetch(handler: (url: string) => Response | Promise<Response>) {
  const mock = vi.fn((input: string | URL | Request) => Promise.resolve(handler(String(input))));
  vi.stubGlobal("fetch", mock);
  return mock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("normalizeQuery", () => {
  it("trims and lowercases", () => {
    expect(normalizeQuery(" Pikachu ")).toBe("pikachu");
  });
});

describe("getPokemon", () => {
  it("maps the API payload to a PokemonDetail", async () => {
    stubFetch(() => jsonResponse(pikachuPayload));

    await expect(getPokemon("pikachu")).resolves.toEqual({
      id: 25,
      name: "pikachu",
      sprite: "https://img.test/25.png",
      types: ["electric"],
      height: 4,
      weight: 60,
      baseExperience: 112,
      abilities: ["static", "lightning-rod"],
      stats: [
        { name: "hp", value: 35 },
        { name: "attack", value: 55 },
      ],
      speciesUrl: "https://pokeapi.co/api/v2/pokemon-species/25/",
    });
  });

  it("requests the normalized name with a 24 hour cache", async () => {
    const fetchMock = stubFetch(() => jsonResponse(pikachuPayload));

    await getPokemon(" Pikachu ");

    expect(fetchMock).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon/pikachu", {
      next: { revalidate: 86400 },
    });
  });

  it("returns null when the pokemon does not exist", async () => {
    stubFetch(() => new Response("Not Found", { status: 404 }));

    await expect(getPokemon("zzz")).resolves.toBeNull();
  });

  it("returns null for an empty query without calling the API", async () => {
    const fetchMock = stubFetch(() => jsonResponse(pikachuPayload));

    await expect(getPokemon("   ")).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns null for a query that cannot be a name or number", async () => {
    const fetchMock = stubFetch(() => jsonResponse(pikachuPayload));

    await expect(getPokemon("../type/1")).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throws PokeApiError with the status on a server error", async () => {
    stubFetch(() => new Response("down", { status: 503 }));

    const error = await getPokemon(1).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(PokeApiError);
    expect((error as PokeApiError).status).toBe(503);
  });

  it("throws PokeApiError with a null status when the network fails", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("fetch failed"))));

    const error = await getPokemon(1).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(PokeApiError);
    expect((error as PokeApiError).status).toBeNull();
  });

  it("uses a null sprite when the API has no home artwork", async () => {
    stubFetch(() => jsonResponse({ ...pikachuPayload, sprites: { other: {} } }));

    const pokemon = await getPokemon(25);

    expect(pokemon?.sprite).toBeNull();
  });
});

describe("listPokemonNames", () => {
  it("extracts the id from each resource URL", async () => {
    stubFetch(() =>
      jsonResponse({
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
        ],
      }),
    );

    await expect(listPokemonNames()).resolves.toEqual([
      { name: "bulbasaur", id: 1 },
      { name: "pikachu", id: 25 },
    ]);
  });
});

describe("getPokemonSummaries", () => {
  it("keeps the requested order and skips pokemon that do not exist", async () => {
    stubFetch((url) => {
      if (url.endsWith("/pokemon/25")) return jsonResponse(pikachuPayload);
      if (url.endsWith("/pokemon/1")) return jsonResponse({ ...pikachuPayload, id: 1, name: "bulbasaur" });
      return new Response("Not Found", { status: 404 });
    });

    const summaries = await getPokemonSummaries([25, 999999, 1]);

    expect(summaries).toEqual([
      { id: 25, name: "pikachu", sprite: "https://img.test/25.png", types: ["electric"] },
      { id: 1, name: "bulbasaur", sprite: "https://img.test/25.png", types: ["electric"] },
    ]);
  });
});

describe("getEvolutionChain", () => {
  it("flattens a linear chain in order", async () => {
    stubFetch((url) => {
      if (url.includes("pokemon-species")) {
        return jsonResponse({ evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/1/" } });
      }
      return jsonResponse({
        chain: {
          species: { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
          evolves_to: [
            {
              species: { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon-species/2/" },
              evolves_to: [
                {
                  species: { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon-species/3/" },
                  evolves_to: [],
                },
              ],
            },
          ],
        },
      });
    });

    const chain = await getEvolutionChain("https://pokeapi.co/api/v2/pokemon-species/1/");

    expect(chain.map((stage) => stage.name)).toEqual(["bulbasaur", "ivysaur", "venusaur"]);
    expect(chain.map((stage) => stage.id)).toEqual([1, 2, 3]);
  });

  it("includes every branch of a branching chain", async () => {
    stubFetch((url) => {
      if (url.includes("pokemon-species")) {
        return jsonResponse({ evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/67/" } });
      }
      return jsonResponse({
        chain: {
          species: { name: "eevee", url: "https://pokeapi.co/api/v2/pokemon-species/133/" },
          evolves_to: [
            { species: { name: "vaporeon", url: "https://pokeapi.co/api/v2/pokemon-species/134/" }, evolves_to: [] },
            { species: { name: "jolteon", url: "https://pokeapi.co/api/v2/pokemon-species/135/" }, evolves_to: [] },
          ],
        },
      });
    });

    const chain = await getEvolutionChain("https://pokeapi.co/api/v2/pokemon-species/133/");

    expect(chain.map((stage) => stage.name)).toEqual(["eevee", "vaporeon", "jolteon"]);
  });
});
