import { describe, expect, it } from "vitest";
import { neighbors } from "./neighbors";

const names = [
  { id: 1, name: "bulbasaur" },
  { id: 2, name: "ivysaur" },
  { id: 3, name: "venusaur" },
  { id: 10001, name: "deoxys-attack" },
];

describe("neighbors", () => {
  it("returns the pokemon before and after", () => {
    expect(neighbors(2, names)).toEqual({ prev: names[0], next: names[2] });
  });

  it("has no previous for the first pokemon", () => {
    expect(neighbors(1, names)).toEqual({ prev: null, next: names[1] });
  });

  it("has no next for the last pokemon", () => {
    expect(neighbors(10001, names)).toEqual({ prev: names[2], next: null });
  });

  it("returns nothing for an id that is not in the list", () => {
    expect(neighbors(999, names)).toEqual({ prev: null, next: null });
  });
});
