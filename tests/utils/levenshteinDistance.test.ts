import { levenshteinDistance } from "../../src/utils";

describe("levenshteinDistance", () => {
  it("should return 0 for identical strings", () => {
    expect(levenshteinDistance("kitten", "kitten")).toBe(0);
  });

  it("should return the length of the second string if the first string is empty", () => {
    expect(levenshteinDistance("", "kitten")).toBe(6);
  });

  it("should return the length of the first string if the second string is empty", () => {
    expect(levenshteinDistance("kitten", "")).toBe(6);
  });

  it("should return the correct distance for strings with one difference", () => {
    expect(levenshteinDistance("kitten", "sitten")).toBe(1); // Substitution
    expect(levenshteinDistance("kitten", "kittens")).toBe(1); // Insertion
    expect(levenshteinDistance("kittens", "kitten")).toBe(1); // Deletion
  });

  it("should return the correct distance for strings with multiple differences", () => {
    expect(levenshteinDistance("kitten", "sitting")).toBe(3); // Substitution + Insertion
    expect(levenshteinDistance("saturday", "sunday")).toBe(3); // Deletion + Substitution
  });

  it("should handle case sensitivity", () => {
    expect(levenshteinDistance("Kitten", "kitten")).toBe(1); // Case difference
  });

  it("should handle special characters", () => {
    expect(levenshteinDistance("café", "cafe")).toBe(1); // Special character substitution
  });

  it("should handle Unicode characters", () => {
    expect(levenshteinDistance("こんにちは", "こんにちわ")).toBe(1); // Unicode substitution
  });

  it("should handle long strings efficiently", () => {
    const str1 = "a".repeat(100);
    const str2 = "b".repeat(100);
    expect(levenshteinDistance(str1, str2)).toBe(100); // All characters are different
  });
});
