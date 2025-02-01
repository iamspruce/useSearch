/**
 * Represents a search feature function that filters data based on a query.
 * @template T The type of data being searched.
 */
export type SearchFeature<T> = (data: T[], query: string) => T[];

/**
 * Configuration options for the `useSearch` hook.
 */
export interface UseSearchOptions {
  /**
   * The debounce timeout in milliseconds.
   * @default 300
   */
  debounceTimeout?: number;
}

/**
 * Defines the strategies for matching a query against a value.
 */
export type MatchStrategy =
  | "exact" // Matches the entire value exactly
  | "startsWith" // Matches if the value starts with the query
  | "endsWith" // Matches if the value ends with the query
  | "contains" // Matches if the value contains the query
  | "fuzzy"; // Matches using fuzzy search

/**
 * Defines the operators for filtering data.
 */
export type Operator =
  | "equals" // Equal to
  | "notEquals" // Not equal to
  | "contains" // Contains the value
  | "notContains" // Does not contain the value
  | "greaterThan" // Greater than
  | "lessThan" // Less than
  | "greaterThanOrEquals" // Greater than or equal to
  | "lessThanOrEquals" // Less than or equal to
  | "isNull"; // Is null or undefined

/**
 * Configuration options for the search function.
 */
export interface SearchOptions {
  /**
   * The matching strategy to use.
   * @default "contains"
   */
  match?:
    | MatchStrategy
    | ((field: string, value: any, query: string) => boolean);

  /**
   * The fields to search within. If not provided, the entire object will be searched.
   */
  fields?: string | string[];

  /**
   * Whether the search is case-sensitive.
   * @default false
   */
  caseSensitive?: boolean;

  /**
   * The maximum number of keys in an object before it is converted to a string for searching.
   * @default 10
   */
  objectToStringThreshold?: number;

  /**
   * Options for fuzzy search.
   */
  fuzzyOptions?: {
    /**
     * The similarity threshold for fuzzy matching (0 = no match, 1 = exact match).
     * @default 0.6
     */
    threshold?: number;

    /**
     * A custom fuzzy search function.
     */
    fuzzySearchFn?: (value: string, query: string) => number; // Returns a score between 0 and 1
  };
}

/**
 * Represents a condition for filtering data.
 */
export interface Condition {
  /**
   * The field to apply the condition to.
   */
  field: string;

  /**
   * The operator to use for the condition.
   */
  operator: Operator;

  /**
   * The value to compare against.
   */
  value: any;
}

/**
 * Configuration options for the filter function.
 */
export interface FilterOptions {
  /**
   * The conditions to apply for filtering.
   */
  conditions: Condition[];

  /**
   * Whether to ignore case when comparing string values.
   * @default false
   */
  caseSensitive?: boolean;

  /**
   * How to handle missing fields in the data.
   * - "skip": Skip the condition (treat as true).
   * - "exclude": Exclude the item (treat as false).
   * - "throw": Throw an error.
   * @default "skip"
   */
  missingFieldBehavior?: "skip" | "exclude" | "throw";
}

/**
 * Configuration options for the sort function.
 */
export interface SortOptions {
  /**
   * The field to sort by.
   */
  field: string;

  /**
   * The sort order.
   * @default "asc"
   */
  order?: "asc" | "desc";

  /**
   * Whether to place null/undefined values first.
   * @default false
   */
  nullsFirst?: boolean;
}

/**
 * Configuration options for the paginate function.
 */
export interface PaginationOptions {
  /**
   * The number of items per page.
   * @default 10
   */
  pageSize?: number;

  /**
   * The current page number.
   * @default 1
   */
  page?: number;
}

/**
 * Configuration options for the group function.
 */
export interface GroupOptions {
  /**
   * The field to group by.
   */
  field: string;

  /**
   * The default group key for items with missing or null fields.
   * @default "Other"
   */
  defaultGroupKey?: string;
}

/**
 * Represents a utility function to extract a value from an object based on a field path.
 */
export type GetFieldValueFn = (item: any, field: string) => any;

/**
 * Represents a utility function to match a value against a query based on a strategy.
 */
export type MatchValueFn = (
  value: string,
  query: string,
  matchType: MatchStrategy,
  caseSensitive: boolean
) => boolean;

/**
 * Utility functions used by the search and filter features.
 */
export interface SearchUtils {
  /**
   * Retrieves the value of a nested field from an object.
   */
  getFieldValue: GetFieldValueFn;

  /**
   * Matches a value against a query using a specified strategy.
   */
  matchValue: MatchValueFn;
}
