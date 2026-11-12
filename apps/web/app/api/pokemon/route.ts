import { NextResponse } from "next/server";
import { parseIds, parseType } from "@/lib/parseIds";
import { PokeApiError, getPokemonSummaries, listPokemonIdsByType } from "@/lib/pokeapi";

/**
 * `?ids=1,2,3` → summaries of those Pokémon.
 * `?type=fire` → national numbers of every Pokémon of that type.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  try {
    if (params.has("type")) {
      const type = parseType(params.get("type"));
      if (!type) return NextResponse.json({ error: "invalid_type" }, { status: 400 });
      return NextResponse.json(await listPokemonIdsByType(type));
    }

    const ids = parseIds(params.get("ids"));
    if (!ids) return NextResponse.json({ error: "invalid_ids" }, { status: 400 });
    return NextResponse.json(await getPokemonSummaries(ids));
  } catch (error) {
    if (error instanceof PokeApiError) {
      return NextResponse.json({ error: "upstream_unavailable" }, { status: 502 });
    }
    throw error;
  }
}
