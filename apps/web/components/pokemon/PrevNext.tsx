import Link from "next/link";
import { dexNumber } from "@/components/PokemonCard";
import type { PokemonName } from "@/lib/pokeapi.types";
import { strings } from "@/lib/strings";

type Props = { prev: PokemonName | null; next: PokemonName | null };

function NeighborLink({ entry, label, align }: { entry: PokemonName; label: string; align: "left" | "right" }) {
  return (
    <Link
      href={`/pokemon/${entry.name}`}
      aria-label={`${label}: ${entry.name}`}
      className={`cut cut-sm bg-ink-800 hover:bg-ink-700 px-5 py-3 min-h-[64px] flex flex-col justify-center ${
        align === "right" ? "items-end text-right col-start-2" : "items-start"
      }`}
    >
      <span className="text-muted text-[13px]">
        {label} {dexNumber(entry.id)}
      </span>
      <span className="font-display font-semibold capitalize">{entry.name.replaceAll("-", " ")}</span>
    </Link>
  );
}

export default function PrevNext({ prev, next }: Props) {
  if (!prev && !next) return null;
  return (
    <nav aria-label={strings.pokemon.neighborsLabel} className="grid grid-cols-2 gap-3">
      {prev && <NeighborLink entry={prev} label={strings.pokemon.previous} align="left" />}
      {next && <NeighborLink entry={next} label={strings.pokemon.next} align="right" />}
    </nav>
  );
}
