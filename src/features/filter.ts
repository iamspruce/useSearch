import { FilterOptions, Condition, Operator, SearchFeature } from "../types";
import { getFieldValue, normalizeCase } from "../utils";

/**
 * Creates a filter function that filters data based on the provided conditions.
 * @template T The type of data being filtered.
 * @param options Configuration for filtering behavior.
 * @returns A function that takes data and a query, returning a filtered array.
 */

const filter = <T>(options: FilterOptions): SearchFeature<T> => {
  const {
    conditions,
    caseSensitive = false,
    missingFieldBehavior = "skip",
  } = options;

  // Validate missingFieldBehavior
  if (!["skip", "exclude", "throw"].includes(missingFieldBehavior)) {
    throw new Error(
      `Invalid missingFieldBehavior: ${missingFieldBehavior}. Must be one of "skip", "exclude", or "throw".`
    );
  }

  // Validate conditions
  if (!conditions || !Array.isArray(conditions) || conditions.length === 0) {
    console.warn(
      "No conditions provided for filtering. Returning original data."
    );
    return (data: T[]) => data;
  }

  return (data: T[], _query: string): T[] => {
    if (data == null) {
      return [];
    }

    return data.filter((item) => {
      return conditions.every((condition) => {
        const { field, operator, value } = condition;

        // Validate condition
        if (!field || !operator) {
          console.warn(
            "Invalid condition: field or operator is missing. Skipping condition."
          );
          return true;
        }

        const fieldValue = getFieldValue(item, field);

        // Handle missing fields
        if (fieldValue === undefined) {
          switch (missingFieldBehavior) {
            case "skip":
              return true;
            case "exclude":
              return false;
            case "throw":
              throw new Error(`Field "${field}" does not exist in the data.`);
          }
        }

        // Handle null or undefined field values
        if (fieldValue == null) {
          return operator === "isNull";
        }

        // Convert field value and query value to strings for comparison
        const stringValue = String(fieldValue);
        const normalizedValue = normalizeCase(stringValue, caseSensitive);
        const normalizedQuery = normalizeCase(String(value), caseSensitive);

        // Apply the operator
        switch (operator) {
          case "equals":
            return normalizedValue === normalizedQuery;
          case "notEquals":
            return normalizedValue !== normalizedQuery;
          case "contains":
            return normalizedValue.includes(normalizedQuery);
          case "notContains":
            return !normalizedValue.includes(normalizedQuery);
          case "greaterThan":
            return Number(fieldValue) > Number(value);
          case "lessThan":
            return Number(fieldValue) < Number(value);
          case "greaterThanOrEquals":
            return Number(fieldValue) >= Number(value);
          case "lessThanOrEquals":
            return Number(fieldValue) <= Number(value);
          case "isNull":
            return fieldValue == null;
          default:
            throw new Error(`Unsupported operator: ${operator}`);
        }
      });
    });
  };
};

export default filter;
