import { convertToString } from "../../src/utils";

describe("convertToString", () => {
  it("should convert a number to a string", () => {
    expect(convertToString(42)).toBe("42");
  });

  it("should convert a boolean to a string", () => {
    expect(convertToString(true)).toBe("true");
    expect(convertToString(false)).toBe("false");
  });

  it("should convert a date to an ISO string", () => {
    const date = new Date("2023-01-01");
    expect(convertToString(date)).toBe(date.toISOString());
  });

  it("should convert an object to a string", () => {
    expect(convertToString({ key: "value" })).toBe("[object Object]");
  });
});
