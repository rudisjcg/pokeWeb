"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import Modal from "@/components/auth/Modal";
import TypeBadge from "@/components/ui/TypeBadge";
import { FALLBACK_SPRITE } from "@/lib/constants";
import { removeFavorite } from "@/lib/favorites";
import { fadeIn } from "@/lib/motion";
import type { PokemonSummary } from "@/lib/pokeapi.types";
import { strings } from "@/lib/strings";

type Props = {
  username: string;
  avatarUrl: string | null;
  initialFavorites: PokemonSummary[];
};

export default function FavoritesGrid({ username, avatarUrl, initialFavorites }: Props) {
  const { signOut } = useAuth();
  const [favorites, setFavorites] = useState(initialFavorites);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = favorites.find((pokemon) => pokemon.id === selectedId) ?? null;

  async function handleRemove(pokemon: PokemonSummary) {
    const previous = favorites;
    setFavorites((current) => current.filter((item) => item.id !== pokemon.id));
    setSelectedId(null);

    const result = await removeFavorite(pokemon.id).catch(() => ({ ok: false as const }));
    if (result.ok) {
      toast(strings.pokemon.removedToast(pokemon.name));
    } else {
      setFavorites(previous);
      toast.error(strings.pokemon.favoriteFailed);
    }
  }

  return (
    <section className="mt-20 flex flex-wrap gap-10 justify-center sm:h-[100vh]">
      <motion.div
        variants={fadeIn("right", "spring", 0, 0.75)}
        className="border w-[200px] h-fit rounded-md pb-4"
      >
        <div className="flex flex-col items-center gap-6 mt-5">
          <div className="border-2 border-gray-400 text-center flex justify-center items-center w-[150px] h-[150px] rounded-full">
            <img
              className="w-full h-full object-contain rounded-full "
              src={avatarUrl ?? FALLBACK_SPRITE}
              alt={strings.myList.avatarAlt}
            />
          </div>
          <h1>{username}</h1>
          <p className="text-left" data-testid="favorites-count">
            {strings.myList.count}: {favorites.length}
          </p>
          <button type="button" className="btn-default remove" onClick={() => void signOut()}>
            {strings.myList.signOut}
          </button>
        </div>
      </motion.div>

      <motion.div variants={fadeIn("left", "spring", 0, 0.75)} className="border w-[500px] h-[500px] overflow-y-auto">
        <div className="flex flex-wrap gap-5 p-3">
          {favorites.length === 0 ? (
            <p>{strings.myList.empty}</p>
          ) : (
            <ul className="flex flex-wrap gap-5 items-center">
              {favorites.map((pokemon) => (
                <li key={pokemon.id} className="shadow-inner">
                  <button
                    type="button"
                    data-testid="favorite-item"
                    aria-label={pokemon.name}
                    onClick={() => setSelectedId(pokemon.id)}
                  >
                    <img
                      className="w-[50px] bg-[#333638] border-2 border-[#1E1E1E] rounded-sm p-1"
                      src={pokemon.sprite ?? FALLBACK_SPRITE}
                      alt=""
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>

      <Modal open={selected !== null} onClose={() => setSelectedId(null)} label={selected?.name ?? ""}>
        {selected && (
          <div className="bg-[#333638] rounded-md h-[400px] px-6 flex flex-col justify-around items-center">
            <img className="w-[250px]" src={selected.sprite ?? FALLBACK_SPRITE} alt={selected.name} />
            <div className="flex justify-center items-center gap-2">
              <span>{selected.name}</span>
              <div className="flex gap-1">
                {selected.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-10">
              <Link className="btn-default" href={`/pokemon/${selected.name}`}>
                {strings.myList.details}
              </Link>
              <button type="button" onClick={() => void handleRemove(selected)} className="btn-default remove">
                {strings.myList.remove}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
