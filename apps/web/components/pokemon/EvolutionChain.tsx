import Link from "next/link";
import { Fragment } from "react";
import { FALLBACK_SPRITE } from "@/lib/constants";
import type { EvolutionStage } from "@/lib/pokeapi.types";
import { strings } from "@/lib/strings";

type Props = { stages: EvolutionStage[]; currentId: number };

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="w-6 h-6 text-muted shrink-0 max-sm:rotate-90" fill="none">
      <path d="M5 12h13m-5-6 6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
    </svg>
  );
}

export default function EvolutionChain({ stages, currentId }: Props) {
  if (stages.length <= 1) return <p className="text-muted">{strings.pokemon.noEvolution}</p>;

  return (
    <ol className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-3">
      {stages.map((stage, index) => {
        const current = stage.id === currentId;
        return (
          <Fragment key={stage.id}>
            {index > 0 && <Arrow />}
            <li>
              <Link
                href={`/pokemon/${stage.name}`}
                aria-current={current ? "page" : undefined}
                className={`flex flex-col items-center gap-1 p-3 min-w-[128px] border-2 transition-colors ${
                  current ? "border-type bg-ink-700" : "border-transparent hover:border-line"
                }`}
              >
                <img
                  src={stage.sprite ?? FALLBACK_SPRITE}
                  alt=""
                  loading="lazy"
                  width={104}
                  height={104}
                  className="w-[104px] h-[104px] object-contain"
                />
                <span className="font-display font-semibold capitalize">{stage.name.replaceAll("-", " ")}</span>
              </Link>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
