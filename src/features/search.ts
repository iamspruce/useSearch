import { SearchOptions, MatchStrategy, SearchFeature } from "../types";
import {
  getFieldValue,
  matchValue,
  normalizeCase,
  convertToString,
  getAllKeys,
} from "../utils";
import { levenshteinFuzzySearch } from "../utils/fuzzySearch";

// Define valid MatchStrategy values for runtime validation
const validMatchStrategies: MatchStrategy[] = [
  "exact",
  "startsWith",
  "endsWith",
  "contains",
  "fuzzy",
];

/**
 * Creates a search function that filters data based on the provided options and query.
 * @param options Configuration for search behavior.
 * @returns A function that takes data and a query, returning a filtered array.
 */

const search = <T>(
  options: SearchOptions = {
    match: "contains",
    caseSensitive: false,
    objectToStringThreshold: 10,
  }
): SearchFeature<T> => {
  const {
    match = "contains",
    fields,
    caseSensitive = false,
    objectToStringThreshold = 10,
    fuzzyOptions = {
      threshold: 0.4,
      fuzzySearchFn: levenshteinFuzzySearch,
    },
  } = options;

  // Validate fields
  if (fields && typeof fields !== "string" && !Array.isArray(fields)) {
    throw new Error(
      `Invalid fields: ${fields}. Must be a string, an array of strings, or undefined.`
    );
  }

  // Validate match
  if (
    match &&
    typeof match !== "function" &&
    !validMatchStrategies.includes(match as MatchStrategy)
  ) {
    throw new Error(
      `Invalid match: ${match}. Must be a MatchStrategy, a function, or undefined.`
    );
  }

  return (data: T[], query: string): T[] => {
    if (data == null || query == null) {
      return data;
    }

    const trimmedQuery = String(query).trim();
    if (trimmedQuery === "") {
      return data;
    }

    const normalizedQuery = normalizeCase(trimmedQuery, caseSensitive);

    return data.filter((item) => {
      const fieldsArray = fields
        ? Array.isArray(fields)
          ? fields
          : [fields]
        : getAllKeys(item, objectToStringThreshold);

      return fieldsArray.some((field) => {
        const fieldValue = getFieldValue(item, field);
        if (fieldValue == null) return false;

        const stringValue = convertToString(fieldValue);
        const normalizedValue = normalizeCase(stringValue, caseSensitive);

        // Handle custom matching function
        if (typeof match === "function") {
          return match(field, stringValue, normalizedQuery);
        }

        // Handle fuzzy search
        if (match === "fuzzy") {
          const fuzzySearchFn =
            fuzzyOptions.fuzzySearchFn || levenshteinFuzzySearch;
          const threshold = fuzzyOptions.threshold ?? 0.6;
          const score = fuzzySearchFn(normalizedValue, normalizedQuery);

          return score >= threshold;
        }

        // Handle predefined MatchStrategy
        return matchValue(
          normalizedValue,
          normalizedQuery,
          match,
          caseSensitive
        );
      });
    });
  };
};

export default search;
