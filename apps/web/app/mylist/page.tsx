import type { Metadata } from "next";
import { redirect } from "next/navigation";
import FavoritesGrid from "@/components/mylist/FavoritesGrid";
import { listFavoriteIds } from "@/lib/favorites";
import { getPokemonSummaries } from "@/lib/pokeapi";
import { strings } from "@/lib/strings";
import { getCurrentProfile } from "@/lib/supabase/server";

export const metadata: Metadata = { title: strings.myList.title };

export default async function MyListPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/?login=1");

  const favorites = await getPokemonSummaries(await listFavoriteIds());

  return (
    <section className="max-w-page mx-auto px-4 sm:px-6 pt-10">
      <h1 className="text-[44px] sm:text-[56px] mb-8">{strings.myList.title}</h1>
      <FavoritesGrid username={profile.username} avatarUrl={profile.avatarUrl} initialFavorites={favorites} />
    </section>
  );
}
