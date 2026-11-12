"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import PokemonCard from "@/components/PokemonCard";
import Button from "@/components/ui/Button";
import SkeletonCard from "@/components/ui/SkeletonCard";
import TypeBadge from "@/components/ui/TypeBadge";
import type { PokemonName, PokemonSummary } from "@/lib/pokeapi.types";
import type { PokemonTypeName } from "@/lib/pokemonTypes";
import { strings } from "@/lib/strings";
import { TYPE_NAMES } from "@/lib/typeColors";
import { sortNames, type SortOrder } from "./sortNames";

const PAGE_SIZE = 12;

type Props = {
  names: PokemonName[];
  initialSummaries: PokemonSummary[];
};

type Order = "number" | SortOrder;

type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found"; id: number }
  | { status: "notFound" }
  | { status: "failed" };

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return (await response.json()) as T;
}

/** Resolves what the user typed (a name or a national number) to a Pokémon id. */
function resolveQuery(query: string, names: PokemonName[]): number | null {
  if (/^\d+$/.test(query)) {
    const id = Number(query);
    return names.some((entry) => entry.id === id) ? id : null;
  }
  const slug = query.replaceAll(" ", "-");
  return names.find((entry) => entry.name === slug)?.id ?? null;
}

export default function PokedexBrowser({ names, initialSummaries }: Props) {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<Order>("number");
  const [type, setType] = useState<PokemonTypeName | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [search, setSearch] = useState<SearchState>({ status: "idle" });
  const [loadFailed, setLoadFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [idsByType, setIdsByType] = useState<Map<PokemonTypeName, Set<number>>>(() => new Map());
  const [summaries, setSummaries] = useState<Map<number, PokemonSummary>>(
    () => new Map(initialSummaries.map((summary) => [summary.id, summary])),
  );

  const typeIds = type ? idsByType.get(type) : undefined;
  const typeLoading = type !== null && typeIds === undefined && !loadFailed;

  useEffect(() => {
    if (!type || idsByType.has(type)) return;
    let cancelled = false;

    fetchJson<number[]>(`/api/pokemon?type=${type}`)
      .then((ids) => {
        if (cancelled) return;
        setLoadFailed(false);
        setIdsByType((current) => new Map(current).set(type, new Set(ids)));
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [type, idsByType, retry]);

  const filtered = useMemo(() => {
    const ofType = type ? names.filter((entry) => typeIds?.has(entry.id)) : names;
    return order === "number" ? ofType : sortNames(ofType, order);
  }, [names, type, typeIds, order]);

  const shown = filtered.slice(0, visible);
  const missingKey = shown
    .filter((entry) => !summaries.has(entry.id))
    .map((entry) => entry.id)
    .join(",");

  useEffect(() => {
    if (missingKey === "") return;
    let cancelled = false;

    fetchJson<PokemonSummary[]>(`/api/pokemon?ids=${missingKey}`)
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
  }, [missingKey, retry]);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      const [summary] = await fetchJson<PokemonSummary[]>(`/api/pokemon?ids=${id}`);
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

  function clearSearch() {
    setSearch({ status: "idle" });
    setQuery("");
  }

  function chooseType(next: PokemonTypeName | null) {
    setType(next);
    setVisible(PAGE_SIZE);
    setLoadFailed(false);
  }

  const searching = search.status !== "idle";
  const found = search.status === "found" ? summaries.get(search.id) : undefined;
  const chipBase = "min-h-[44px] px-1 rounded-full flex items-center outline-offset-2 transition-opacity";

  return (
    <div>
      <div className="sticky top-[var(--nav-height)] z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-ink-950/90 backdrop-blur-md border-b border-line">
        <div className="flex flex-wrap items-end gap-3">
          <form onSubmit={handleSearch} role="search" className="flex items-end gap-2 flex-1 min-w-[260px]">
            <div className="flex flex-col gap-1.5 flex-1">
              <label htmlFor="pokedex-search" className="text-[14px] font-medium text-muted">
                {strings.pokedex.searchLabel}
              </label>
              <input
                id="pokedex-search"
                type="search"
                autoComplete="off"
                placeholder={strings.pokedex.searchPlaceholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-h-[44px] px-4 bg-ink-800 border border-line text-fg placeholder:text-muted/60"
              />
            </div>
            <Button type="submit">{strings.pokedex.search}</Button>
            {searching && (
              <Button variant="ghost" onClick={clearSearch}>
                {strings.pokedex.reset}
              </Button>
            )}
          </form>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pokedex-order" className="text-[14px] font-medium text-muted">
              {strings.pokedex.orderLabel}
            </label>
            <select
              id="pokedex-order"
              value={order}
              onChange={(event) => setOrder(event.target.value as Order)}
              className="min-h-[44px] px-3 bg-ink-800 border border-line text-fg"
            >
              <option value="number">{strings.pokedex.orderNumber}</option>
              <option value="asc">{strings.pokedex.orderAsc}</option>
              <option value="desc">{strings.pokedex.orderDesc}</option>
            </select>
          </div>
        </div>

        <div role="group" aria-label={strings.pokedex.typeLabel} className="rail mt-3 !gap-1 pb-1">
          <button
            type="button"
            aria-pressed={type === null}
            onClick={() => chooseType(null)}
            className={`${chipBase} px-4 font-semibold text-[13px] ${
              type === null ? "bg-volt text-ink-950" : "bg-ink-700 text-fg"
            }`}
          >
            {strings.pokedex.allTypes}
          </button>
          {TYPE_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={type === name}
              aria-label={name}
              onClick={() => chooseType(name)}
              className={`${chipBase} ${type === null || type === name ? "opacity-100" : "opacity-40 hover:opacity-80"} ${
                type === name ? "ring-2 ring-volt ring-offset-2 ring-offset-ink-950" : ""
              }`}
            >
              <TypeBadge type={name} />
            </button>
          ))}
        </div>
      </div>

      {!searching && !typeLoading && (
        <p className="text-muted text-[14px] mt-6" aria-live="polite">
          {strings.pokedex.count(Math.min(visible, filtered.length), filtered.length)}
        </p>
      )}

      <div
        data-testid="pokedex-results"
        className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5 mt-4 min-h-[248px]"
      >
        {search.status === "loading" && <SkeletonCard />}
        {search.status === "notFound" && (
          <p role="status" className="col-span-full">
            {strings.pokedex.notFound}
          </p>
        )}
        {search.status === "failed" && (
          <p role="alert" className="col-span-full">
            {strings.pokedex.searchFailed}
          </p>
        )}
        {found && <PokemonCard pokemon={found} />}
        {!searching && typeLoading && Array.from({ length: 8 }, (_, index) => <SkeletonCard key={index} />)}
        {!searching &&
          !typeLoading &&
          shown.map((entry) => {
            const summary = summaries.get(entry.id);
            return summary ? <PokemonCard key={entry.id} pokemon={summary} /> : <SkeletonCard key={entry.id} />;
          })}
      </div>

      {!searching && loadFailed && (
        <div role="alert" className="mt-6 flex flex-wrap items-center gap-4">
          <p>{strings.pokedex.searchFailed}</p>
          <Button
            variant="ghost"
            onClick={() => {
              setLoadFailed(false);
              setRetry((count) => count + 1);
            }}
          >
            {strings.pokedex.retry}
          </Button>
        </div>
      )}

      {!searching && !typeLoading && visible < filtered.length && (
        <div className="mt-10 flex justify-center">
          <Button variant="ghost" size="lg" onClick={() => setVisible((value) => value + PAGE_SIZE)}>
            {strings.pokedex.loadMore}
          </Button>
        </div>
      )}
    </div>
  );
}
