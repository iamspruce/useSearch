import { SortOptions, SearchFeature } from "../types";

/**
 * Creates a sorting function that sorts data based on the provided options.
 * @template T The type of data being sorted.
 * @param options Configuration for sorting behavior.
 * @param options.field The field to sort by.
 * @param options.order The sort order. Can be "asc" (ascending) or "desc" (descending). Defaults to "asc".
 * @param options.nullsFirst Whether to place null/undefined values first. Defaults to false.
 * @returns A function that takes data and returns a sorted array.
 */
const sort = <T>(options: SortOptions): SearchFeature<T> => {
  const { field, order = "asc", nullsFirst = false } = options;

  return (data: T[], _query: string): T[] => {
    return [...data].sort((a, b) => {
      const aValue = (a as any)[field];
      const bValue = (b as any)[field];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return nullsFirst ? -1 : 1;
      if (bValue == null) return nullsFirst ? 1 : -1;

      // Compare values
      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });
  };
};

export default sort;
