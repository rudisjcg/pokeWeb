import { describe, expect, it } from "vitest";
import { NEUTRAL_TYPE_COLOR, readableOn, typeColor, typeStyle } from "./typeColors";

describe("typeColor", () => {
  it("returns the colour of a known type", () => {
    expect(typeColor("fire")).toBe("#ff6b3d");
  });

  it("falls back to a neutral colour for types outside the table", () => {
    expect(typeColor("stellar")).toBe(NEUTRAL_TYPE_COLOR);
    expect(typeColor("")).toBe(NEUTRAL_TYPE_COLOR);
  });
});

describe("readableOn", () => {
  it("picks dark text on a light background", () => {
    expect(readableOn("#f5d90a")).toBe("#05070f");
  });

  it("picks white text on a dark background", () => {
    expect(readableOn("#3b2a8c")).toBe("#ffffff");
  });
});

describe("typeStyle", () => {
  it("exposes both types as CSS variables", () => {
    expect(typeStyle(["grass", "poison"])).toEqual({
      "--type": typeColor("grass"),
      "--type-2": typeColor("poison"),
    });
  });

  it("repeats the first type when there is only one", () => {
    expect(typeStyle(["fire"])).toEqual({ "--type": "#ff6b3d", "--type-2": "#ff6b3d" });
  });

  it("uses the neutral colour when there are no types", () => {
    expect(typeStyle([])).toEqual({ "--type": NEUTRAL_TYPE_COLOR, "--type-2": NEUTRAL_TYPE_COLOR });
  });
});
