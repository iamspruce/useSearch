// Core hook
export { default as useSearch } from "./hooks/useSearch";

// Features
export { default as search } from "./features/search";
export { default as filter } from "./features/filter";
export { default as sort } from "./features/sort";
export { default as paginate } from "./features/paginate";
export { default as group } from "./features/group";

// Utils
export {
  getFieldValue,
  matchValue,
  useDebounce,
  normalizeCase,
  convertToString,
  getAllKeys,
} from "./utils";

// Fuzzy search algorithms
export {
  levenshteinFuzzySearch,
  nGramFuzzySearch,
  jaroWinklerFuzzySearch,
} from "./utils/fuzzySearch";

// Types
export * from "./types";
