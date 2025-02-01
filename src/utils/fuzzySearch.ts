/**
 * Built-in fuzzy search algorithms.
 */

/**
 * Levenshtein Distance-based fuzzy search.
 * @param value The target string.
 * @param query The search query.
 * @returns A score between 0 and 1.
 */
export const levenshteinFuzzySearch = (
  value: string,
  query: string
): number => {
  const valueLength = value.length;
  const queryLength = query.length;

  if (queryLength === 0) return 1; // Empty query matches everything

  const distance = levenshteinDistance(
    value.toLowerCase(),
    query.toLowerCase()
  );
  const maxDistance = Math.max(valueLength, queryLength);
  return 1 - distance / maxDistance;
};

/**
 * Jaro-Winkler Distance-based fuzzy search.
 * @param value The target string.
 * @param query The search query.
 * @returns A score between 0 and 1.
 */
export const jaroWinklerFuzzySearch = (
  value: string,
  query: string
): number => {
  return jaroWinklerDistance(value.toLowerCase(), query.toLowerCase());
};

/**
 * N-Gram-based fuzzy search.
 * @param value The target string.
 * @param query The search query.
 * @returns A score between 0 and 1.
 */
export const nGramFuzzySearch = (value: string, query: string): number => {
  const n = 2; // Bigram by default
  const valueGrams = generateNGrams(value.toLowerCase(), n);
  const queryGrams = generateNGrams(query.toLowerCase(), n);

  const intersection = valueGrams.filter((gram) => queryGrams.includes(gram));
  return intersection.length / Math.max(valueGrams.length, queryGrams.length);
};

// Helper function to calculate Levenshtein distance
const levenshteinDistance = (a: string, b: string): number => {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array.from({ length: b.length + 1 }, () => 0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // Deletion
        matrix[i][j - 1] + 1, // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return matrix[a.length][b.length];
};

// Helper function to calculate Jaro-Winkler distance
const jaroWinklerDistance = (a: string, b: string): number => {
  const jaroDistance = calculateJaroDistance(a, b);
  const prefixScale = 0.1; // Scaling factor for common prefix
  const prefixLength = getCommonPrefixLength(a, b, 4);

  return jaroDistance + prefixLength * prefixScale * (1 - jaroDistance);
};

const calculateJaroDistance = (a: string, b: string): number => {
  const matchDistance = Math.floor(Math.max(a.length, b.length) / 2) - 1;
  const aMatches = new Array(a.length).fill(false);
  const bMatches = new Array(b.length).fill(false);

  let matches = 0;
  let transpositions = 0;

  for (let i = 0; i < a.length; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, b.length);

    for (let j = start; j < end; j++) {
      if (!bMatches[j] && a[i] === b[j]) {
        aMatches[i] = true;
        bMatches[j] = true;
        matches++;
        break;
      }
    }
  }

  if (matches === 0) return 0;

  let k = 0;
  for (let i = 0; i < a.length; i++) {
    if (aMatches[i]) {
      while (!bMatches[k]) k++;
      if (a[i] !== b[k]) transpositions++;
      k++;
    }
  }

  return (
    (matches / a.length +
      matches / b.length +
      (matches - transpositions / 2) / matches) /
    3
  );
};

const getCommonPrefixLength = (
  a: string,
  b: string,
  maxLength: number
): number => {
  let prefixLength = 0;
  while (prefixLength < maxLength && a[prefixLength] === b[prefixLength]) {
    prefixLength++;
  }
  return prefixLength;
};

// Helper function to generate N-Grams
const generateNGrams = (str: string, n: number): string[] => {
  const grams: string[] = [];
  for (let i = 0; i <= str.length - n; i++) {
    grams.push(str.slice(i, i + n));
  }
  return grams;
};
