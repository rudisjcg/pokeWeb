import { NextResponse } from "next/server";
import { parseIds } from "@/lib/parseIds";
import { PokeApiError, getPokemonSummaries } from "@/lib/pokeapi";

export async function GET(request: Request) {
  const ids = parseIds(new URL(request.url).searchParams.get("ids"));
  if (!ids) {
    return NextResponse.json({ error: "invalid_ids" }, { status: 400 });
  }

  try {
    return NextResponse.json(await getPokemonSummaries(ids));
  } catch (error) {
    if (error instanceof PokeApiError) {
      return NextResponse.json({ error: "upstream_unavailable" }, { status: 502 });
    }
    throw error;
  }
}
