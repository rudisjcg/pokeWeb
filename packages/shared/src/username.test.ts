import { describe, expect, it } from "vitest";
import { validateUsername } from "./username";

describe("validateUsername", () => {
  it("accepts letters, numbers and underscore", () => {
    expect(validateUsername("ash_99")).toEqual({ ok: true, username: "ash_99" });
  });

  it("trims surrounding whitespace before validating", () => {
    expect(validateUsername("  ash  ")).toEqual({ ok: true, username: "ash" });
  });

  it("rejects names shorter than 3 characters", () => {
    expect(validateUsername("ab")).toEqual({ ok: false, reason: "length" });
  });

  it("rejects names longer than 20 characters", () => {
    expect(validateUsername("a".repeat(21))).toEqual({ ok: false, reason: "length" });
  });

  it("rejects inner spaces", () => {
    expect(validateUsername("ash ketchum")).toEqual({ ok: false, reason: "chars" });
  });

  it("rejects accented letters", () => {
    expect(validateUsername("ásh")).toEqual({ ok: false, reason: "chars" });
  });
});
