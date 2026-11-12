"use client";

import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import { strings } from "@/lib/strings";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type Props = { pokemonName: string; values: number[] };

export default function StatsChart({ pokemonName, values }: Props) {
  return (
    <Bar
      aria-label={`${strings.pokemon.stats}: ${pokemonName}`}
      data={{
        labels: [...strings.pokemon.statNames],
        datasets: [
          {
            label: pokemonName,
            data: values,
            backgroundColor: "rgba(255,0,0,1)",
            borderColor: "black",
            hoverBackgroundColor: "rgba(255,0,0,1)",
            hoverBorderColor: "black",
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { display: false },
          x: { ticks: { color: "#fff" }, grid: { display: false } },
        },
      }}
    />
  );
}
