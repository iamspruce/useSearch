import { matchValue } from "../../src/utils";
import { MatchStrategy } from "../../src/types";

describe("matchValue", () => {
  it("should match using 'exact' strategy", () => {
    expect(matchValue("hello", "hello", "exact", false)).toBe(true);
    expect(matchValue("hello", "HELLO", "exact", true)).toBe(false);
  });

  it("should match using 'startsWith' strategy", () => {
    expect(matchValue("hello", "he", "startsWith", false)).toBe(true);
    expect(matchValue("hello", "HE", "startsWith", true)).toBe(false);
  });

  it("should match using 'endsWith' strategy", () => {
    expect(matchValue("hello", "lo", "endsWith", false)).toBe(true);
    expect(matchValue("hello", "LO", "endsWith", true)).toBe(false);
  });

  it("should match using 'contains' strategy", () => {
    expect(matchValue("hello", "ell", "contains", false)).toBe(true);
    expect(matchValue("hello", "ELL", "contains", true)).toBe(false);
  });

  it("should throw an error for an unsupported strategy", () => {
    expect(() =>
      matchValue("hello", "he", "invalid" as MatchStrategy, false)
    ).toThrow("Unsupported match type: invalid");
  });
});
