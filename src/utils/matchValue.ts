import { MatchStrategy } from "../types";

/**
 * Matches a value against a query using a specified strategy.
 * @param value The value to match against.
 * @param query The search query.
 * @param matchType The matching strategy (e.g., "contains", "startsWith", "exact").
 * @param caseSensitive Whether the match is case-sensitive.
 * @returns `true` if the value matches the query, otherwise `false`.
 */
export default function matchValue(
  value: string,
  query: string,
  matchType: MatchStrategy,
  caseSensitive: boolean
): boolean {
  const normalizedValue = caseSensitive ? value : value.toLowerCase();
  const normalizedQuery = caseSensitive ? query : query.toLowerCase();

  switch (matchType) {
    case "exact":
      return normalizedValue === normalizedQuery;
    case "startsWith":
      return normalizedValue.startsWith(normalizedQuery);
    case "endsWith":
      return normalizedValue.endsWith(normalizedQuery);
    case "contains":
      return normalizedValue.includes(normalizedQuery);
    default:
      throw new Error(`Unsupported match type: ${matchType}`);
  }
}
