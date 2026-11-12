import Link from "next/link";
import { FALLBACK_SPRITE } from "@/lib/constants";
import type { EvolutionStage } from "@/lib/pokeapi.types";

type Props = { stages: EvolutionStage[]; currentId: number };

export default function EvolutionChain({ stages, currentId }: Props) {
  return (
    <div className="flex flex-col gap-1 mt-10">
      <div className="flex flex-wrap justify-center items-center gap-1">
        {stages.map((stage) => (
          <Link key={stage.id} href={`/pokemon/${stage.name}`} aria-current={stage.id === currentId ? "page" : undefined}>
            <div
              className={`${
                stage.id === currentId ? "border-white bg-gray-500" : "border-gray-500"
              } border-4 bg-gray-900 rounded-full flex items-center justify-center transition-all`}
            >
              <img src={stage.sprite ?? FALLBACK_SPRITE} alt={stage.name} className="sm:w-[200px] w-[80px] p-2" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
