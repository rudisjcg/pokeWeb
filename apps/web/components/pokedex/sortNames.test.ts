import { describe, expect, it } from "vitest";
import { sortNames } from "./sortNames";

const list = [
  { id: 25, name: "pikachu" },
  { id: 1, name: "bulbasaur" },
  { id: 150, name: "mewtwo" },
];

describe("sortNames", () => {
  it("sorts A to Z", () => {
    expect(sortNames(list, "asc").map((item) => item.name)).toEqual(["bulbasaur", "mewtwo", "pikachu"]);
  });

  it("sorts Z to A", () => {
    expect(sortNames(list, "desc").map((item) => item.name)).toEqual(["pikachu", "mewtwo", "bulbasaur"]);
  });

  it("does not mutate the input", () => {
    sortNames(list, "asc");
    expect(list.map((item) => item.id)).toEqual([25, 1, 150]);
  });
});
