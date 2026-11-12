"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { GrPowerReset } from "react-icons/gr";
import CenterCanvas from "@/canvas/Center";
import PokemonCard from "@/components/PokemonCard";
import Tilt from "@/components/Tilt";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { styles } from "@/lib/constants";
import { fadeIn } from "@/lib/motion";
import type { PokemonName, PokemonSummary } from "@/lib/pokeapi.types";
import { strings } from "@/lib/strings";
import { sortNames, type SortOrder } from "./sortNames";

const INITIAL_VISIBLE = 12;
const PAGE_SIZE = 8;

type Props = {
  names: PokemonName[];
  initialSummaries: PokemonSummary[];
};

type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found"; id: number }
  | { status: "notFound" }
  | { status: "failed" };

async function fetchSummaries(ids: number[]): Promise<PokemonSummary[]> {
  const response = await fetch(`/api/pokemon?ids=${ids.join(",")}`);
  if (!response.ok) throw new Error(`Summaries request failed: ${response.status}`);
  return (await response.json()) as PokemonSummary[];
}

/** Resolves what the user typed (a name or a national number) to a Pokémon id. */
function resolveQuery(query: string, names: PokemonName[]): number | null {
  if (/^\d+$/.test(query)) {
    const id = Number(query);
    return names.some((entry) => entry.id === id) ? id : null;
  }
  return names.find((entry) => entry.name === query)?.id ?? null;
}

export default function PokedexBrowser({ names, initialSummaries }: Props) {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<SortOrder | "">("");
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const [search, setSearch] = useState<SearchState>({ status: "idle" });
  const [loadFailed, setLoadFailed] = useState(false);
  const [summaries, setSummaries] = useState<Map<number, PokemonSummary>>(
    () => new Map(initialSummaries.map((summary) => [summary.id, summary])),
  );

  const ordered = useMemo(() => (order === "" ? names : sortNames(names, order)), [names, order]);
  const shown = ordered.slice(0, visible);
  const missingKey = shown
    .filter((entry) => !summaries.has(entry.id))
    .map((entry) => entry.id)
    .join(",");

  useEffect(() => {
    if (missingKey === "") return;
    let cancelled = false;

    fetchSummaries(missingKey.split(",").map(Number))
      .then((loaded) => {
        if (cancelled) return;
        setLoadFailed(false);
        setSummaries((current) => {
          const next = new Map(current);
          for (const summary of loaded) next.set(summary.id, summary);
          return next;
        });
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [missingKey]);

  async function handleSearch() {
    const normalized = query.trim().toLowerCase();
    if (normalized === "") return;

    const id = resolveQuery(normalized, names);
    if (id === null) {
      setSearch({ status: "notFound" });
      return;
    }
    if (summaries.has(id)) {
      setSearch({ status: "found", id });
      return;
    }

    setSearch({ status: "loading" });
    try {
      const [summary] = await fetchSummaries([id]);
      if (!summary) {
        setSearch({ status: "notFound" });
        return;
      }
      setSummaries((current) => new Map(current).set(summary.id, summary));
      setSearch({ status: "found", id });
    } catch {
      setSearch({ status: "failed" });
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") void handleSearch();
  }

  function resetList() {
    setSearch({ status: "idle" });
    setQuery("");
  }

  const searching = search.status !== "idle";
  const found = search.status === "found" ? summaries.get(search.id) : undefined;

  return (
    <section className="relative w-full mx-auto h-full mb-12">
      <motion.div variants={fadeIn("right", "spring", 0, 0.75)}>
        <div className={`${styles.padding} bg-tertiary w-full relative h-fit rounded-lg`}>
          <div className="sm:flex items-center justify-center">
            <h2 className={`${styles.sectionSubText} text-center`}>{strings.pokedex.title}</h2>
            <CenterCanvas />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full sm:flex sm:justify-around sm:items-center">
              <div className="flex justify-center items-center gap-5 mb-5">
                <div className="form__group field">
                  <input
                    id="pokedex-search"
                    placeholder={strings.pokedex.searchPlaceholder}
                    className="form__field"
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <label className="form__label" htmlFor="pokedex-search">
                    {strings.pokedex.searchLabel}
                  </label>
                </div>
                <button
                  type="button"
                  aria-label={strings.pokedex.reset}
                  onClick={resetList}
                  className="p-2 rounded-md bg-white text-black hover:scale-105 transition-all cursor-pointer"
                >
                  <GrPowerReset />
                </button>
              </div>
              <select
                id="orderSelect"
                aria-label={strings.pokedex.orderDefault}
                className="w-[250px]"
                value={order}
                onChange={(event) => setOrder(event.target.value as SortOrder)}
              >
                <option value="" disabled>
                  {strings.pokedex.orderDefault}
                </option>
                <option value="asc">{strings.pokedex.orderAsc}</option>
                <option value="desc">{strings.pokedex.orderDesc}</option>
              </select>
            </div>

            <div
              data-testid="pokedex-results"
              className="flex flex-wrap justify-center items-center gap-2 p-2 mb-10 mt-10"
            >
              {search.status === "loading" && <SkeletonCard />}
              {search.status === "notFound" && <p role="status">{strings.pokedex.notFound}</p>}
              {search.status === "failed" && <p role="alert">{strings.pokedex.searchFailed}</p>}
              {found && (
                <Tilt className="xs:w-[350px]">
                  <PokemonCard pokemon={found} />
                </Tilt>
              )}
              {!searching &&
                shown.map((entry) => {
                  const summary = summaries.get(entry.id);
                  return (
                    <Tilt key={entry.id} className="xs:w-[350px]">
                      {summary ? <PokemonCard pokemon={summary} /> : <SkeletonCard />}
                    </Tilt>
                  );
                })}
            </div>

            {!searching && loadFailed && <p role="alert">{strings.pokedex.searchFailed}</p>}
            {!searching && visible < ordered.length && (
              <button type="button" className="btn" onClick={() => setVisible((value) => value + PAGE_SIZE)}>
                {strings.pokedex.loadMore}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
