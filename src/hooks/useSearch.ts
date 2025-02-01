import React from "react";
import { SearchFeature } from "../types";
import { useDebounce } from "../utils";

/**
 * A custom React hook for searching and filtering data.
 * @template T The type of data being searched.
 * @param data The data to search through.
 * @param query The search query.
 * @param debounceTimeOrFeature Either the debounce time (number) or the first search feature.
 * @param features Additional search features (e.g., filter, search).
 * @returns The filtered and searched data.
 */
function useSearch<T>(
  data: T | T[],
  query: string,
  debounceTimeOrFeature?: number | SearchFeature<T>,
  ...features: SearchFeature<T>[]
): T[] {
  // Validate inputs
  if (data == null) {
    console.warn("`data` is null or undefined. Returning an empty array.");
    return [];
  }

  if (typeof query !== "string") {
    throw new Error("`query` must be a string.");
  }

  // Determine if the third argument is a number (debounceTime) or a feature
  let debounceTime: number;
  let allFeatures: SearchFeature<T>[];

  if (typeof debounceTimeOrFeature === "number") {
    // If the third argument is a number, use it as the debounce time
    debounceTime = debounceTimeOrFeature;
    allFeatures = features;
  } else {
    // If the third argument is not a number, treat it as the first feature
    debounceTime = 150; // Default debounce time
    allFeatures = debounceTimeOrFeature
      ? [debounceTimeOrFeature, ...features]
      : features;
  }

  // If no features are provided, return the original data
  if (!allFeatures || allFeatures.length === 0) {
    console.warn("No search features provided. Returning the original data.");
    return Array.isArray(data) ? data : [data];
  }

  // Use the custom debounce hook with the specified or default timing
  const debouncedQuery = useDebounce(query, debounceTime);

  return React.useMemo(() => {
    // Convert data to an array if it isn't already
    const dataArray = Array.isArray(data) ? data : [data];

    try {
      // Apply each feature to the data array
      return allFeatures.reduce(
        (acc, feature) => feature(acc, debouncedQuery),
        dataArray
      );
    } catch (error) {
      console.error("Error applying search features:", error);
      return dataArray; // Return original data in case of errors
    }
  }, [data, debouncedQuery, allFeatures]);
}

export default useSearch;
