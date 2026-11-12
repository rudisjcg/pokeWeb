/** Highest base stat any Pokémon has; stat bars are drawn against it. */
export const MAX_BASE_STAT = 255;

/** Width of a stat bar as a percentage, clamped to 0–100. */
export function statPercent(value: number, max = MAX_BASE_STAT): number {
  if (!Number.isFinite(value) || max <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((value / max) * 100)));
}

export function statTotal(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

const number = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 });

/** PokeAPI gives height in decimetres. */
export function formatHeight(decimetres: number): string {
  return `${number.format(decimetres / 10)} m`;
}

/** PokeAPI gives weight in hectograms. */
export function formatWeight(hectograms: number): string {
  return `${number.format(hectograms / 10)} kg`;
}
