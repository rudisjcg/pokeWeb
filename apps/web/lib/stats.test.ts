import { describe, expect, it } from "vitest";
import { formatHeight, formatWeight, statPercent, statTotal } from "./stats";

describe("statPercent", () => {
  it("scales a base stat against 255", () => {
    expect(statPercent(255)).toBe(100);
    expect(statPercent(51)).toBe(20);
  });

  it("stays between 0 and 100 for out-of-range values", () => {
    expect(statPercent(300)).toBe(100);
    expect(statPercent(-5)).toBe(0);
    expect(statPercent(Number.NaN)).toBe(0);
  });
});

describe("statTotal", () => {
  it("adds the base stats", () => {
    expect(statTotal([35, 55, 40, 50, 50, 90])).toBe(320);
    expect(statTotal([])).toBe(0);
  });
});

describe("formatHeight", () => {
  it("converts decimetres to metres with a decimal comma", () => {
    expect(formatHeight(4)).toBe("0,4 m");
    expect(formatHeight(20)).toBe("2 m");
  });
});

describe("formatWeight", () => {
  it("converts hectograms to kilograms with a decimal comma", () => {
    expect(formatWeight(60)).toBe("6 kg");
    expect(formatWeight(69)).toBe("6,9 kg");
  });
});
