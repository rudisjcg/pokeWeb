import { describe, expect, it } from "vitest";
import { MAX_IDS_PER_REQUEST, parseIds, parseType } from "./parseIds";

describe("parseIds", () => {
  it("parses a comma separated list", () => {
    expect(parseIds("1,25,150")).toEqual([1, 25, 150]);
  });

  it("removes duplicates keeping the first occurrence", () => {
    expect(parseIds("25,1,25")).toEqual([25, 1]);
  });

  it("rejects a missing or empty parameter", () => {
    expect(parseIds(null)).toBeNull();
    expect(parseIds("")).toBeNull();
  });

  it("rejects anything that is not a positive integer", () => {
    expect(parseIds("1,abc")).toBeNull();
    expect(parseIds("0")).toBeNull();
    expect(parseIds("-3")).toBeNull();
    expect(parseIds("1.5")).toBeNull();
    expect(parseIds("1,,2")).toBeNull();
  });

  it("rejects more ids than the per-request limit", () => {
    const tooMany = Array.from({ length: MAX_IDS_PER_REQUEST + 1 }, (_, index) => index + 1).join(",");
    expect(parseIds(tooMany)).toBeNull();
  });
});

describe("parseType", () => {
  it("accepts a known type", () => {
    expect(parseType("fire")).toBe("fire");
  });

  it("rejects anything that is not exactly one of the 18 types", () => {
    expect(parseType("FIRE")).toBeNull();
    expect(parseType("lava")).toBeNull();
    expect(parseType("")).toBeNull();
    expect(parseType(null)).toBeNull();
  });
});
