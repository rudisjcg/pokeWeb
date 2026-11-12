"use client";

import { useState } from "react";
import { toast } from "sonner";
import CenterCanvas from "@/canvas/Center";
import { useAuth } from "@/components/auth/AuthProvider";
import Modal from "@/components/auth/Modal";
import { dexNumber } from "@/components/PokemonCard";
import Button from "@/components/ui/Button";
import Panel from "@/components/ui/Panel";
import TypeBadge from "@/components/ui/TypeBadge";
import { FALLBACK_SPRITE } from "@/lib/constants";
import { removeFavorite } from "@/lib/favorites";
import type { PokemonSummary } from "@/lib/pokeapi.types";
import { strings } from "@/lib/strings";
import { typeStyle } from "@/lib/typeColors";

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
    <div className="grid gap-8 lg:grid-cols-[280px_1fr] items-start">
      <Panel className="p-6 flex lg:flex-col items-center gap-5 lg:text-center">
        <img
          className="w-24 h-24 lg:w-36 lg:h-36 rounded-full object-contain bg-ink-950 border-2 border-volt"
          src={avatarUrl ?? FALLBACK_SPRITE}
          alt={strings.myList.avatarAlt}
        />
        <div className="flex flex-col gap-1 lg:items-center">
          <p className="font-display font-bold text-[24px] break-all">{username}</p>
          <p className="text-muted" data-testid="favorites-count">
            {strings.myList.count(favorites.length)}
          </p>
          <Button variant="ghost" className="mt-3" onClick={() => void signOut()}>
            {strings.myList.signOut}
          </Button>
        </div>
      </Panel>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-start gap-4">
          <CenterCanvas className="w-full max-w-[420px] h-[260px]" />
          <h2 className="text-[30px]">{strings.myList.emptyTitle}</h2>
          <p className="text-muted max-w-[48ch]">{strings.myList.empty}</p>
          <Button href="/pokedex">{strings.myList.goToPokedex}</Button>
        </div>
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {favorites.map((pokemon) => (
            <li key={pokemon.id} style={typeStyle(pokemon.types)}>
              <button
                type="button"
                data-testid="favorite-item"
                onClick={() => setSelectedId(pokemon.id)}
                className="cut type-slash relative w-full min-h-[132px] p-4 text-left overflow-hidden hover:brightness-125 transition-[filter]"
              >
                <span className="font-display font-semibold text-muted text-[14px] tabular-nums">
                  {dexNumber(pokemon.id)}
                </span>
                <span className="block font-display font-bold text-[18px] capitalize max-w-[60%] break-words">
                  {pokemon.name.replaceAll("-", " ")}
                </span>
                <img
                  src={pokemon.sprite ?? FALLBACK_SPRITE}
                  alt=""
                  loading="lazy"
                  className="absolute right-2 bottom-2 w-24 h-24 object-contain drop-shadow-[0_10px_14px_rgb(0_0_0/0.55)]"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal open={selected !== null} onClose={() => setSelectedId(null)} label={selected?.name ?? ""} className="w-[420px]">
        {selected && (
          <Panel tone="type" slash style={typeStyle(selected.types)} className="p-6 flex flex-col items-center gap-4">
            <img className="w-[220px] h-[220px] object-contain" src={selected.sprite ?? FALLBACK_SPRITE} alt="" />
            <h2 className="text-[28px] capitalize">{selected.name.replaceAll("-", " ")}</h2>
            <div className="flex gap-1.5">
              {selected.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <Button href={`/pokemon/${selected.name}`} variant="ghost">
                {strings.myList.details}
              </Button>
              <Button variant="danger" onClick={() => void handleRemove(selected)}>
                {strings.myList.remove}
              </Button>
            </div>
          </Panel>
        )}
      </Modal>
    </div>
  );
}
