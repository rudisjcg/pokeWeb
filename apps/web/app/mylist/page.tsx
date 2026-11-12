import type { Metadata } from "next";
import { redirect } from "next/navigation";
import FavoritesGrid from "@/components/mylist/FavoritesGrid";
import SectionWrapper from "@/components/SectionWrapper";
import { listFavoriteIds } from "@/lib/favorites";
import { getPokemonSummaries } from "@/lib/pokeapi";
import { strings } from "@/lib/strings";
import { getCurrentProfile } from "@/lib/supabase/server";

export const metadata: Metadata = { title: strings.nav.myList };

export default async function MyListPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/?login=1");

  const favorites = await getPokemonSummaries(await listFavoriteIds());

  return (
    <SectionWrapper>
      <FavoritesGrid username={profile.username} avatarUrl={profile.avatarUrl} initialFavorites={favorites} />
    </SectionWrapper>
  );
}
