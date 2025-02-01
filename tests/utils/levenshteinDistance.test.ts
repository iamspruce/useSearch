import { levenshteinFuzzySearch } from "../../src/utils";

describe("levenshteinFuzzySearch", () => {
  it("should return 0 for identical strings", () => {
    expect(levenshteinFuzzySearch("kitten", "kitten")).toBe(0);
  });

  it("should return the length of the second string if the first string is empty", () => {
    expect(levenshteinFuzzySearch("", "kitten")).toBe(6);
  });

  it("should return the length of the first string if the second string is empty", () => {
    expect(levenshteinFuzzySearch("kitten", "")).toBe(6);
  });

  it("should return the correct distance for strings with one difference", () => {
    expect(levenshteinFuzzySearch("kitten", "sitten")).toBe(1); // Substitution
    expect(levenshteinFuzzySearch("kitten", "kittens")).toBe(1); // Insertion
    expect(levenshteinFuzzySearch("kittens", "kitten")).toBe(1); // Deletion
  });

  it("should return the correct distance for strings with multiple differences", () => {
    expect(levenshteinFuzzySearch("kitten", "sitting")).toBe(3); // Substitution + Insertion
    expect(levenshteinFuzzySearch("saturday", "sunday")).toBe(3); // Deletion + Substitution
  });

  it("should handle case sensitivity", () => {
    expect(levenshteinFuzzySearch("Kitten", "kitten")).toBe(1); // Case difference
  });

  it("should handle special characters", () => {
    expect(levenshteinFuzzySearch("café", "cafe")).toBe(1); // Special character substitution
  });

  it("should handle Unicode characters", () => {
    expect(levenshteinFuzzySearch("こんにちは", "こんにちわ")).toBe(1); // Unicode substitution
  });

  it("should handle long strings efficiently", () => {
    const str1 = "a".repeat(100);
    const str2 = "b".repeat(100);
    expect(levenshteinFuzzySearch(str1, str2)).toBe(100); // All characters are different
  });
});
