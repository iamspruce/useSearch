import {
  jaroWinklerFuzzySearch,
  levenshteinFuzzySearch,
  nGramFuzzySearch,
} from "../../src";
import search from "../../src/features/search";
import { SearchOptions } from "../../src/types";

describe("search", () => {
  const data = [
    { name: "Alice", age: 25, city: "Wonderland" },
    { name: "Bob", age: 30, city: "Springfield" },
    { name: "Charlie", age: 35, city: "Gotham" },
    { name: "Diana", age: 40, city: "Metropolis" },
  ];

  // Test 1: Basic search (contains)
  it("should filter data using 'contains' strategy", () => {
    const options: SearchOptions = { match: "contains", fields: ["name"] };
    const searchFunction = search(options);
    const results = searchFunction(data, "li");
    expect(results).toEqual([
      { name: "Alice", age: 25, city: "Wonderland" },
      { name: "Charlie", age: 35, city: "Gotham" },
    ]);
  });

  // Test 2: Case-sensitive search
  it("should perform case-sensitive search", () => {
    const options: SearchOptions = {
      match: "contains",
      fields: ["name"],
      caseSensitive: true,
    };
    const searchFunction = search(options);
    const results = searchFunction(data, "alice");
    expect(results).toEqual([]); // No match because "Alice" != "alice"
  });

  // Test 3: Case-insensitive search
  it("should perform case-insensitive search", () => {
    const options: SearchOptions = {
      match: "contains",
      fields: ["name"],
      caseSensitive: false,
    };
    const searchFunction = search(options);
    const results = searchFunction(data, "alice");
    expect(results).toEqual([{ name: "Alice", age: 25, city: "Wonderland" }]);
  });

  // Test 4: Exact match
  it("should filter data using 'exact' strategy", () => {
    const options: SearchOptions = { match: "exact", fields: ["name"] };
    const searchFunction = search(options);
    const results = searchFunction(data, "Alice");
    expect(results).toEqual([{ name: "Alice", age: 25, city: "Wonderland" }]);
  });

  // Test 5: StartsWith match
  it("should filter data using 'startsWith' strategy", () => {
    const options: SearchOptions = { match: "startsWith", fields: ["city"] };
    const searchFunction = search(options);
    const results = searchFunction(data, "Won");
    expect(results).toEqual([{ name: "Alice", age: 25, city: "Wonderland" }]);
  });

  // Test 6: EndsWith match
  it("should filter data using 'endsWith' strategy", () => {
    const options: SearchOptions = { match: "endsWith", fields: ["city"] };
    const searchFunction = search(options);
    const results = searchFunction(data, "land");
    expect(results).toEqual([{ name: "Alice", age: 25, city: "Wonderland" }]);
  });

  // Test 7: Search across multiple fields
  it("should search across multiple fields", () => {
    const options: SearchOptions = {
      match: "contains",
      fields: ["name", "city"],
    };
    const searchFunction = search(options);
    const results = searchFunction(data, "spr");
    expect(results).toEqual([{ name: "Bob", age: 30, city: "Springfield" }]);
  });

  // Test 8: Custom matching function
  it("should use a custom matching function", () => {
    const customMatch = (field: string, value: any, query: string) => {
      if (field === "name") {
        return value.toLowerCase().startsWith(query.toLowerCase());
      }
      return false;
    };
    const options: SearchOptions = { match: customMatch, fields: ["name"] };
    const searchFunction = search(options);
    const results = searchFunction(data, "ch");
    expect(results).toEqual([{ name: "Charlie", age: 35, city: "Gotham" }]);
  });

  // Test 9: Empty query should return all data
  it("should return all data if the query is empty", () => {
    const options: SearchOptions = { match: "contains", fields: ["name"] };
    const searchFunction = search(options);
    const results = searchFunction(data, "");
    expect(results).toEqual(data);
  });

  // Test 12: Search nested fields
  it("should search nested fields using dot notation", () => {
    const nestedData = [
      { name: "Alice", address: { city: "Wonderland" } },
      { name: "Bob", address: { city: "Springfield" } },
    ];
    const options: SearchOptions = {
      match: "contains",
      fields: ["address.city"],
    };
    const searchFunction = search(options);
    const results = searchFunction(nestedData, "land");
    expect(results).toEqual([
      { name: "Alice", address: { city: "Wonderland" } },
    ]);
  });

  // Test 13: Search with objectToStringThreshold
  it("should respect objectToStringThreshold when converting objects to strings", () => {
    const complexData = [
      { name: "Alice", details: { age: 25, city: "Wonderland" } },
      { name: "Bob", details: { age: 30, city: "Springfield" } },
    ];
    const options: SearchOptions = {
      match: "contains",
      objectToStringThreshold: 1, // Only include the first key
    };
    const searchFunction = search(options);
    const results = searchFunction(complexData, "25");
    expect(results).toEqual([]); // "25" is in the second key, which is excluded
  });

  // Test 14: Handle non-string data types (numbers, booleans, dates)

  // Test 15: Handle empty data
  it("should return an empty array if the data is empty", () => {
    const options: SearchOptions = { match: "contains", fields: ["name"] };
    const searchFunction = search(options);
    expect(searchFunction([], "Alice")).toEqual([]);
  });

  // Test 16: Handle special characters in the query
  it("should handle special characters in the query", () => {
    const data = [
      { name: "Alice*", age: 25 },
      { name: "Bob?", age: 30 },
      { name: "Charlie.", age: 35 },
    ];
    const options: SearchOptions = { match: "contains", fields: ["name"] };
    const searchFunction = search(options);

    expect(searchFunction(data, "*")).toEqual([{ name: "Alice*", age: 25 }]);
    expect(searchFunction(data, "?")).toEqual([{ name: "Bob?", age: 30 }]);
    expect(searchFunction(data, ".")).toEqual([{ name: "Charlie.", age: 35 }]);
  });

  // Test 17: Handle large data sets efficiently
  it("should handle large data sets efficiently", () => {
    const largeData = Array.from({ length: 10000 }, (_, i) => ({
      name: `User${i}`,
      age: i,
    }));
    const options: SearchOptions = {
      match: "exact",
      fields: ["name", "age"],
    };
    const searchFunction = search(options);

    const results = searchFunction(largeData, "User999");
    expect(results).toEqual([{ name: "User999", age: 999 }]);
  });
  // Test 18: Handle missing fields gracefully
  it("should handle missing fields gracefully", () => {
    const data = [
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
    ];
    const options: SearchOptions = {
      match: "contains",
      fields: ["name", "city"],
    }; // "city" does not exist
    const searchFunction = search(options);

    expect(searchFunction(data, "Alice")).toEqual([{ name: "Alice", age: 25 }]);
  });

  // Test 19: Handle Unicode characters in the query and data
  it("should handle Unicode characters in the query and data", () => {
    const unicodeData = [
      { name: "Алиса", age: 25 }, // Cyrillic script
      { name: "こんにちは", age: 30 }, // Japanese script
      { name: "😊", age: 35 }, // Emoji
    ];
    const options: SearchOptions = { match: "contains", fields: ["name"] };
    const searchFunction = search(options);

    expect(searchFunction(unicodeData, "Алиса")).toEqual([
      { name: "Алиса", age: 25 },
    ]);
    expect(searchFunction(unicodeData, "こん")).toEqual([
      { name: "こんにちは", age: 30 },
    ]);
    expect(searchFunction(unicodeData, "😊")).toEqual([
      { name: "😊", age: 35 },
    ]);
  });

  // Test 20: Handle nested arrays in the data
  it("should handle nested arrays in the data", () => {
    const nestedArrayData = [
      { name: "Alice", tags: ["developer", "designer"] },
      { name: "Bob", tags: ["manager", "designer"] },
    ];
    const options: SearchOptions = { match: "contains", fields: ["tags"] };
    const searchFunction = search(options);

    expect(searchFunction(nestedArrayData, "designer")).toEqual(
      nestedArrayData
    );
    expect(searchFunction(nestedArrayData, "manager")).toEqual([
      { name: "Bob", tags: ["manager", "designer"] },
    ]);
  });

  // Test 21: Handle custom field accessors
  it("should handle custom field accessors", () => {
    const customData = [
      { name: "Alice", details: { age: 25 } },
      { name: "Bob", details: { age: 30 } },
    ];
    const options: SearchOptions = {
      match: "contains",
      fields: ["details.age"],
    };
    const searchFunction = search(options);

    expect(searchFunction(customData, "25")).toEqual([
      { name: "Alice", details: { age: 25 } },
    ]);
  });
});

describe("search (no fields specified)", () => {
  // Test 1: Case-Insensitive Search Without Specified Fields
  it("should perform case-insensitive search when no fields are specified", () => {
    const data = [
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
    ];
    const options: SearchOptions = { match: "contains", caseSensitive: false };
    const searchFunction = search(options);

    // Search for "alice" (case-insensitive)
    expect(searchFunction(data, "alice")).toEqual([{ name: "Alice", age: 25 }]);

    // Search for "BOB" (case-insensitive)
    expect(searchFunction(data, "BOB")).toEqual([{ name: "Bob", age: 30 }]);
  });

  // Test 2: Case-Sensitive Search Without Specified Fields
  it("should perform case-sensitive search when no fields are specified", () => {
    const data = [
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
    ];
    const options: SearchOptions = { match: "contains", caseSensitive: true };
    const searchFunction = search(options);

    // Search for "alice" (case-sensitive, no match)
    expect(searchFunction(data, "alice")).toEqual([]);

    // Search for "Alice" (case-sensitive, match)
    expect(searchFunction(data, "Alice")).toEqual([{ name: "Alice", age: 25 }]);
  });

  // Test 3: Search with Non-String Values Without Specified Fields
  it("should handle non-string values when no fields are specified", () => {
    const data = [
      {
        name: "Alice",
        age: 25,
        isActive: true,
        createdAt: new Date("2023-01-01"),
      },
      {
        name: "Bob",
        age: 30,
        isActive: false,
        createdAt: new Date("2023-02-02"),
      },
    ];
    const options: SearchOptions = { match: "contains", caseSensitive: false };
    const searchFunction = search(options);

    // Search for "25" (number)
    expect(searchFunction(data, "25")).toEqual([data[0]]);

    // Search for "true" (boolean)
    expect(searchFunction(data, "true")).toEqual([data[0]]);

    // Search for "2023-01" (date)
    expect(searchFunction(data, "2023-01")).toEqual([data[0]]);
  });

  // Test 4: Search with Nested Objects Without Specified Fields
  it("should handle nested objects when no fields are specified", () => {
    const data = [
      { name: "Alice", details: { age: 25, city: "Wonderland" } },
      { name: "Bob", details: { age: 30, city: "Springfield" } },
    ];
    const options: SearchOptions = { match: "contains", caseSensitive: false };
    const searchFunction = search(options);

    // Search for "wonderland" (nested field value)
    expect(searchFunction(data, "wonderland")).toEqual([data[0]]);

    // Search for "30" (nested field value)
    expect(searchFunction(data, "30")).toEqual([data[1]]);
  });

  // Test 5: Search with Special Characters Without Specified Fields
  it("should handle special characters when no fields are specified", () => {
    const data = [
      { name: "Alice*", age: 25 },
      { name: "Bob?", age: 30 },
      { name: "Charlie.", age: 35 },
    ];
    const options: SearchOptions = { match: "contains", caseSensitive: false };
    const searchFunction = search(options);

    // Search for "*" (special character)
    expect(searchFunction(data, "*")).toEqual([{ name: "Alice*", age: 25 }]);

    // Search for "?" (special character)
    expect(searchFunction(data, "?")).toEqual([{ name: "Bob?", age: 30 }]);

    // Search for "." (special character)
    expect(searchFunction(data, ".")).toEqual([{ name: "Charlie.", age: 35 }]);
  });
});

describe("search (fuzzy search)", () => {
  const data = [
    { name: "Alice", age: 25, city: "Wonderland" },
    { name: "Bob", age: 30, city: "Springfield" },
    { name: "Charlie", age: 35, city: "Gotham" },
    { name: "Diana", age: 40, city: "Metropolis" },
  ];

  it("should filter data using 'fuzzy' strategy with default algorithm", () => {
    const options: SearchOptions = {
      match: "fuzzy",
      fields: ["name"],
    };
    const searchFunction = search(options);

    // Fuzzy match for "Ali" (close to "Alice")
    expect(searchFunction(data, "Ali")).toEqual([
      { name: "Alice", age: 25, city: "Wonderland" },
      { name: "Charlie", age: 35, city: "Gotham" },
    ]);

    // Fuzzy match for "Charli" (close to "Charlie")
    expect(searchFunction(data, "Charli")).toEqual([
      { name: "Charlie", age: 35, city: "Gotham" },
    ]);

    // No match for "Xyz" (not close to any name)
    expect(searchFunction(data, "Xyz")).toEqual([]);
  });

  it("should use a custom fuzzy search function", () => {
    const customFuzzySearch = (value: string, query: string): number => {
      // Simple custom fuzzy search: match if the query is a substring
      return value.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
    };

    const options: SearchOptions = {
      match: "fuzzy",
      fields: ["name"],
      fuzzyOptions: {
        fuzzySearchFn: customFuzzySearch,
        threshold: 0.5,
      },
    };
    const searchFunction = search(options);

    // Match for "lice" (substring of "Alice")
    expect(searchFunction(data, "lice")).toEqual([
      { name: "Alice", age: 25, city: "Wonderland" },
    ]);

    // No match for "Xyz" (not a substring of any name)
    expect(searchFunction(data, "Xyz")).toEqual([]);
  });

  it("should respect the fuzzy search threshold", () => {
    const options: SearchOptions = {
      match: "fuzzy",
      fields: ["name"],
      fuzzyOptions: {
        threshold: 0.8, // Higher threshold for stricter matching
      },
    };
    const searchFunction = search(options);

    // No match for "Ali" (score is below the threshold)
    expect(searchFunction(data, "Ali")).toEqual([]);

    // Match for "Alice" (exact match, score is 1)
    expect(searchFunction(data, "Alice")).toEqual([
      { name: "Alice", age: 25, city: "Wonderland" },
    ]);
  });

  it("should perform fuzzy search on nested fields", () => {
    const nestedData = [
      { name: "Alice", address: { city: "Wonderland" } },
      { name: "Bob", address: { city: "Springfield" } },
    ];
    const options: SearchOptions = {
      match: "fuzzy",
      fields: ["address.city"],
    };
    const searchFunction = search(options);

    // Fuzzy match for "Wondrland" (close to "Wonderland")
    expect(searchFunction(nestedData, "Wondrland")).toEqual([
      { name: "Alice", address: { city: "Wonderland" } },
    ]);

    // No match for "Xyz" (not close to any city)
    expect(searchFunction(nestedData, "Xyz")).toEqual([]);
  });
  it("should filter data using 'fuzzy' strategy with Jaro-Winkler algorithm", () => {
    const options: SearchOptions = {
      match: "fuzzy",
      fields: ["name"],
      fuzzyOptions: {
        fuzzySearchFn: jaroWinklerFuzzySearch,
        threshold: 0.7,
      },
    };
    const searchFunction = search(options);

    expect(searchFunction(data, "Ali")).toEqual([
      { name: "Alice", age: 25, city: "Wonderland" },
    ]);
    expect(searchFunction(data, "Charli")).toEqual([
      { name: "Charlie", age: 35, city: "Gotham" },
    ]);
    expect(searchFunction(data, "Xyz")).toEqual([]);
  });

  // Test 29: N-Gram Fuzzy Search
  it("should filter data using 'fuzzy' strategy with N-Gram algorithm", () => {
    const options: SearchOptions = {
      match: "fuzzy",
      fields: ["name"],
      fuzzyOptions: {
        fuzzySearchFn: nGramFuzzySearch,
        threshold: 0.5,
      },
    };
    const searchFunction = search(options);

    expect(searchFunction(data, "Ali")).toEqual([
      { name: "Alice", age: 25, city: "Wonderland" },
    ]);
    expect(searchFunction(data, "Charli")).toEqual([
      { name: "Charlie", age: 35, city: "Gotham" },
    ]);
    expect(searchFunction(data, "Xyz")).toEqual([]);
  });

  // Test 30: Compare All Three Algorithms
  it("should compare results of all three fuzzy search algorithms", () => {
    const levenshteinOptions: SearchOptions = {
      match: "fuzzy",
      fields: ["name"],
      fuzzyOptions: {
        fuzzySearchFn: levenshteinFuzzySearch,
        threshold: 0.6,
      },
    };
    const levenshteinSearch = search(levenshteinOptions);

    const jaroWinklerOptions: SearchOptions = {
      match: "fuzzy",
      fields: ["name"],
      fuzzyOptions: {
        fuzzySearchFn: jaroWinklerFuzzySearch,
        threshold: 0.7,
      },
    };
    const jaroWinklerSearch = search(jaroWinklerOptions);

    const nGramOptions: SearchOptions = {
      match: "fuzzy",
      fields: ["name"],
      fuzzyOptions: {
        fuzzySearchFn: nGramFuzzySearch,
        threshold: 0.5,
      },
    };
    const nGramSearch = search(nGramOptions);

    // Query: "Ali"
    expect(levenshteinSearch(data, "Ali")).toEqual([
      { name: "Alice", age: 25, city: "Wonderland" },
    ]);
    expect(jaroWinklerSearch(data, "Ali")).toEqual([
      { name: "Alice", age: 25, city: "Wonderland" },
    ]);
    expect(nGramSearch(data, "Ali")).toEqual([
      { name: "Alice", age: 25, city: "Wonderland" },
    ]);

    // Query: "Charli"
    expect(levenshteinSearch(data, "Charli")).toEqual([
      { name: "Charlie", age: 35, city: "Gotham" },
    ]);
    expect(jaroWinklerSearch(data, "Charli")).toEqual([
      { name: "Charlie", age: 35, city: "Gotham" },
    ]);
    expect(nGramSearch(data, "Charli")).toEqual([
      { name: "Charlie", age: 35, city: "Gotham" },
    ]);

    // Query: "Xyz"
    expect(levenshteinSearch(data, "Xyz")).toEqual([]);
    expect(jaroWinklerSearch(data, "Xyz")).toEqual([]);
    expect(nGramSearch(data, "Xyz")).toEqual([]);
  });
});
