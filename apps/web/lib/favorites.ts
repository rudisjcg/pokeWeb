"use server";

import { revalidatePath } from "next/cache";
import { createClient, getCurrentUserId } from "./supabase/server";

export type FavoriteResult = { ok: true } | { ok: false; reason: "unauthenticated" | "invalid" | "failed" };

function isPokemonId(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

/** Adds a Pokémon to the signed-in user's list. Adding one that is already there succeeds. */
export async function addFavorite(pokemonId: number): Promise<FavoriteResult> {
  if (!isPokemonId(pokemonId)) return { ok: false, reason: "invalid" };

  const userId = await getCurrentUserId();
  if (!userId) return { ok: false, reason: "unauthenticated" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("favorites")
    .upsert({ user_id: userId, pokemon_id: pokemonId }, { onConflict: "user_id,pokemon_id", ignoreDuplicates: true });
  if (error) return { ok: false, reason: "failed" };

  revalidatePath("/mylist");
  return { ok: true };
}

export async function removeFavorite(pokemonId: number): Promise<FavoriteResult> {
  if (!isPokemonId(pokemonId)) return { ok: false, reason: "invalid" };

  const userId = await getCurrentUserId();
  if (!userId) return { ok: false, reason: "unauthenticated" };

  const supabase = await createClient();
  const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("pokemon_id", pokemonId);
  if (error) return { ok: false, reason: "failed" };

  revalidatePath("/mylist");
  return { ok: true };
}

/** Ids of the signed-in user's favorites, most recently added first. Empty when signed out. */
export async function listFavoriteIds(): Promise<number[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("favorites")
    .select("pokemon_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error("Could not load favorites");

  return data.map((row) => row.pokemon_id);
}
