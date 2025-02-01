import { normalizeCase } from "../../src/utils";

describe("normalizeCase", () => {
  it("should return the original string if case-sensitive", () => {
    expect(normalizeCase("Hello", true)).toBe("Hello");
  });

  it("should return the lowercase string if case-insensitive", () => {
    expect(normalizeCase("Hello", false)).toBe("hello");
  });
});
