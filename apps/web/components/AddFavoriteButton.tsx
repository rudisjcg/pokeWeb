"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { addFavorite } from "@/lib/favorites";
import { strings } from "@/lib/strings";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./auth/AuthProvider";
import Button from "./ui/Button";

type Props = { pokemonId: number; pokemonName: string };

export default function AddFavoriteButton({ pokemonId, pokemonName }: Props) {
  const { profile, loading, openLogin } = useAuth();
  const [added, setAdded] = useState(false);
  const [pending, setPending] = useState(false);
  const userId = profile?.id;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    void createClient()
      .from("favorites")
      .select("pokemon_id")
      .eq("user_id", userId)
      .eq("pokemon_id", pokemonId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data) setAdded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, pokemonId]);

  async function handleClick() {
    if (pending) return;
    if (!profile) {
      openLogin();
      return;
    }

    setPending(true);
    setAdded(true);
    const result = await addFavorite(pokemonId).catch(() => ({ ok: false as const, reason: "failed" as const }));
    setPending(false);

    if (result.ok) {
      toast(strings.pokemon.addedToast(pokemonName));
      return;
    }
    setAdded(false);
    if (result.reason === "unauthenticated") {
      openLogin();
    } else {
      toast.error(strings.pokemon.favoriteFailed);
    }
  }

  const inList = Boolean(profile) && added;

  return (
    <Button onClick={handleClick} disabled={loading || inList} variant={inList ? "ghost" : "primary"}>
      {inList ? strings.pokemon.added : strings.pokemon.add}
    </Button>
  );
}
