# `useSearch`

## **Table of Contents**

1. [Overview](#overview)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Core Features](#core-features)
   - [Debouncing](#debouncing)
   - [Fuzzy Search](#fuzzy-search)
   - [Filtering](#filtering)
   - [Sorting & Pagination](#sorting--pagination)
5. [Advanced Usage](#advanced-usage)
   - [Custom Search Logic](#custom-search-logic)
   - [Deeply Nested Data](#deeply-nested-data)
   - [Error Handling](#error-handling)
6. [API Reference](#api-reference)
   - [`useSearch`](#usearch)
   - [`search`](#search)
   - [`filter`](#filter)
   - [`sort`](#sort)
   - [`paginate`](#paginate)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)
9. [TypeScript Support](#typescript-support)
10. [Performance Tips](#performance-tips)
11. [Testing](#testing)
12. [Comparison with Alternatives](#comparison-with-alternatives)
13. [FAQ](#faq)
14. [Roadmap](#roadmap)
15. [Contributing](#contributing)
16. [Changelog](#changelog)
17. [Community & Support](#community--support)
18. [License](#license)

---

## **Overview**

`useSearch` is a lightweight and flexible React hook that makes searching and filtering data a breeze. It’s built with a modular, pipeline-based approach, so you can add features as needed without worrying about breaking anything.

With `useSearch`, you can:

- Quickly search through structured data.
- Apply filters without messing with custom operators.
- Easily extend it with features like ranking, sorting, and more.

Whether you're building an interactive search UI or just need a solid search tool, `useSearch` is designed to keep things simple, fast, and scalable.

---

**Key Features**:

- **Debounced search** (customizable delay)
- **Fuzzy search** (Levenshtein, Jaro-Winkler, N-Gram, or custom algorithms)
- **Filtering** with conditional logic (`>`, `<`, `contains`, etc.)
- **Sorting**, **pagination**, and **grouping**
- Graceful error handling and warnings
- Optimized for large datasets

---

## Installation

Getting started is simple! Install `useSearch` using npm or yarn:

```bash
npm install use-search-hook
# or
yarn add use-search-hook
```

Once installed, you’re ready to plug it into your project.

---

## **Quick Start**

### 1. **Simple Search**

Search an array of objects with debouncing (default: 150ms):

```tsx
import { useSearch, search } from "use-search-hook";

const ProductList = ({ products }) => {
  const [query, setQuery] = useState("");
  const results = useSearch(
    products,
    query,
    search({
      fields: ["name", "description"], // Search these fields
      match: "contains", // Strategy: "contains", "exact", "fuzzy"
    })
  );

  return (
    <>
      <input onChange={(e) => setQuery(e.target.value)} />
      {results.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </>
  );
};
```

---

## **Core Features**

### 1. **Debouncing**

Control how frequently search updates occur:

```ts
useSearch(
  data,
  query,
  300, // Debounce for 300ms
  search({ ... })
);
```

### 2. **Fuzzy Search**

Fuzzy search helps find results that are **close but not exact** matches, making it useful for handling typos, variations in spelling, and user input flexibility. This library includes **three built-in fuzzy search algorithms**, and you can also provide your own custom algorithm.

### **Choosing the Right Algorithm**

Each algorithm has different strengths and is suited for specific situations:

| Algorithm                | Best for...                                                                                          | Notes                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Levenshtein Distance** | Handling typos and small edits (e.g., "color" vs. "colour")                                          | Measures how many insertions, deletions, or substitutions are needed to match words. |
| **Jaro-Winkler**         | Matching short names, fuzzy user searches, and correcting transpositions (e.g., "Brian" vs. "Brain") | Gives extra weight to common prefixes.                                               |
| **N-Gram Similarity**    | Partial word matching and autocomplete-like suggestions (e.g., "prog" matching "programming")        | Breaks words into overlapping chunks and compares them.                              |

---

## **1. Levenshtein Distance**

The **Levenshtein Distance** algorithm measures the number of **insertions, deletions, or substitutions** needed to transform one word into another. The fewer edits required, the more similar the words are.

✅ **Best for:** Correcting typos and detecting near matches.

🔹 **Example:**

- `"hello"` → `"helo"` → **1 edit (deletion)**
- `"kitten"` → `"sitting"` → **3 edits (substitutions, insertions)**

**How it works:**

1. Convert both the **value** and **query** to lowercase.
2. Compute the **Levenshtein distance**.
3. Normalize the score to a range between `0` and `1`, where `1` means an exact match.

```ts
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
```

📌 **When to use:**

- Handling user typos (`"accommodation"` vs. `"acomodation"`)
- Searching for product names with minor spelling errors

---

## **2. Jaro-Winkler Distance**

The **Jaro-Winkler algorithm** improves upon **Jaro Distance** by giving more weight to words that **start with the same characters**. It’s useful for detecting common **misspellings, transpositions, and short name variations**.

✅ **Best for:** Matching names and short words where small mistakes happen often.

🔹 **Example:**

- `"marhta"` → `"martha"` (letters swapped, but still very similar)
- `"Dwayne"` → `"Duane"` (similar sound and prefix)

**How it works:**

1. Finds matching characters within a certain range.
2. Counts **transpositions** (swapped letters).
3. Gives extra weight if the words share a **common prefix**.

```ts
export const jaroWinklerFuzzySearch = (
  value: string,
  query: string
): number => {
  return jaroWinklerDistance(value.toLowerCase(), query.toLowerCase());
};
```

📌 **When to use:**

- Matching **people’s names** (`"Johnathan"` vs. `"Jonathan"`)
- Handling **swapped letters** (`"Brian"` vs. `"Brain"`)

---

## **3. N-Gram Similarity**

The **N-Gram approach** breaks words into **overlapping letter groups (n-grams)** and compares the overlap between two words. It’s useful for **autocomplete features and partial matches**.

✅ **Best for:** Matching **partial words and autocomplete** suggestions.

🔹 **Example:**  
Using **bigrams (2-letter n-grams)**:

- `"hello"` → `["he", "el", "ll", "lo"]`
- `"help"` → `["he", "el", "lp"]`

**How it works:**

1. Convert both **value** and **query** to lowercase.
2. Split words into **n-grams** (default: bigrams).
3. Count how many n-grams overlap.
4. Compute a similarity score between `0` and `1`.

```ts
export const nGramFuzzySearch = (value: string, query: string): number => {
  const n = 2; // Bigram by default
  const valueGrams = generateNGrams(value.toLowerCase(), n);
  const queryGrams = generateNGrams(query.toLowerCase(), n);

  const intersection = valueGrams.filter((gram) => queryGrams.includes(gram));
  return intersection.length / Math.max(valueGrams.length, queryGrams.length);
};
```

📌 **When to use:**

- **Autocomplete search** (e.g., `"pro"` matching `"programming"`)
- **Matching partial words** (e.g., `"photo"` matching `"photography"`)

---

## **Using a Custom Algorithm**

If none of these algorithms fit your needs, you can **provide your own custom fuzzy search function**. Your function should take two strings (`value` and `query`) and return a **similarity score between 0 and 1**.

🔹 **Example Custom Function:**

```ts
const customFuzzySearch = (value: string, query: string): number => {
  // Example: simple case-insensitive substring match
  return value.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
};
```

To use your custom function, pass it to the search system like this:

```ts
useSearch(data, query, { fuzzySearch: customFuzzySearch });
```

Each fuzzy search algorithm has its strengths:

- **Levenshtein Distance** → Best for fixing **typos and small edits**.
- **Jaro-Winkler Distance** → Best for **matching names and detecting transpositions**.
- **N-Gram Similarity** → Best for **autocomplete and partial matches**.

You can **choose the right algorithm** based on your use case, or even provide **your own** if needed! 🚀

### 3. **Filtering**

Apply conditional logic to refine results:

```ts
import { filter } from "use-search-hook";

filter({
  conditions: [
    { field: "price", operator: "lessThan", value: 100 },
    { field: "category", operator: "equals", value: "electronics" },
  ],
  missingFieldBehavior: "exclude", // Handle missing fields
});
```

### 4. **Sorting & Pagination**

Combine multiple features:

```ts
useSearch(
  data,
  query,
  search({ ... }),
  sort({ field: 'price', order: 'asc' }),
  paginate({ pageSize: 10, page: 2 })
);
```

---

## **Advanced Usage**

### 1. **Custom Search Logic**

Define your own matching function:

```ts
search({
  match: (field, value, query) => {
    // Custom logic (e.g., regex, external API)
    return field === "email" ? value.endsWith(query) : false;
  },
});
```

### 2. **Deeply Nested Data**

Search nested fields using dot notation:

```ts
search({
  fields: ["user.profile.name", "metadata.tags[0]"],
});
```

### 3. **Error Handling**

The hook gracefully handles edge cases:

- Invalid `data` → Returns empty array + console warning
- Non-string `query` → Throws error
- Missing features → Returns original data

---

Here’s the updated API documentation with the new features included in the same conversational and structured style:

---

## **API Reference**

### **`useSearch`**

The `useSearch` hook is your go-to solution for searching, filtering, sorting, grouping, and paginating data effortlessly.

#### **Usage**

```ts
function useSearch<T>(
  data: T | T[],
  query: string,
  debounceTime?: number,
  ...features: SearchFeature<T>[]
): T[];
```

#### **Parameters**

| Parameter      | Type                 | Description                                                      |
| -------------- | -------------------- | ---------------------------------------------------------------- |
| `data`         | `T` \| `T[]`         | The data you want to search (single object or an array).         |
| `query`        | `string`             | The search term entered by the user.                             |
| `debounceTime` | `number`             | Debounce time (in milliseconds)                                  |
| `features`     | `SearchFeature<T>[]` | Additional search, filter, sort, group, or pagination functions. |

---

## **Features**

### **Search: `search(options: SearchOptions)`**

Fine-tune how the search works with custom match strategies, case sensitivity, and field selection.

| Option                    | Type                                                | Default      | Description                                                                            |
| ------------------------- | --------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------- |
| `match`                   | `"contains"` \| `"startsWith"` \| `"exact"` \| `fn` | `"contains"` | Defines how search terms match data. Use a built-in strategy or a custom function.     |
| `fields`                  | `string[]`                                          | `All keys`   | Specifies which fields to search within.                                               |
| `caseSensitive`           | `boolean`                                           | `false`      | Whether the search should distinguish between uppercase and lowercase letters.         |
| `objectToStringThreshold` | `number`                                            | `10`         | Converts objects with more than this number of nested keys into strings for searching. |

---

### **Filtering: `filter(options: FilterOptions)`**

Narrow down search results by applying conditions like “greater than,” “equals,” or “contains.”

| Option                 | Type                                 | Default      | Description                                                                                 |
| ---------------------- | ------------------------------------ | ------------ | ------------------------------------------------------------------------------------------- |
| `conditions`           | `Condition[]`                        | **Required** | An array of conditions that specify filtering rules (`field`, `operator`, `value`).         |
| `caseSensitive`        | `boolean`                            | `false`      | Determines if comparisons should be case-sensitive.                                         |
| `missingFieldBehavior` | `"skip"` \| `"exclude"` \| `"throw"` | `"skip"`     | Defines what happens when a field is missing. Skip it, exclude the item, or throw an error. |

---

### **Sorting: `sort(options: SortOptions)`**

Sorts your data based on a specific field, either in ascending or descending order.

| Option       | Type                | Default      | Description                                                         |
| ------------ | ------------------- | ------------ | ------------------------------------------------------------------- |
| `field`      | `string`            | **Required** | The field used for sorting.                                         |
| `order`      | `"asc"` \| `"desc"` | `"asc"`      | The order of sorting: ascending (`"asc"`) or descending (`"desc"`). |
| `nullsFirst` | `boolean`           | `false`      | Whether to place `null` or `undefined` values first.                |

---

### **Grouping: `group(options: GroupOptions)`**

Organizes data into groups based on a specific field. If a field is missing, items are placed under a default group.

| Option            | Type     | Default      | Description                                                   |
| ----------------- | -------- | ------------ | ------------------------------------------------------------- |
| `field`           | `string` | **Required** | The field used for grouping data.                             |
| `defaultGroupKey` | `string` | `"Other"`    | The default group name for items missing the specified field. |

---

### **Pagination: `paginate(options: PaginationOptions)`**

Limits the number of items displayed at a time and allows users to navigate between pages.

| Option     | Type     | Default | Description               |
| ---------- | -------- | ------- | ------------------------- |
| `pageSize` | `number` | `10`    | Number of items per page. |
| `page`     | `number` | `1`     | The current page number.  |

---

## **Best Practices**

### 1. **Understand React’s Re-Renders & Memoization**

In React, every time a component re-renders, it **recreates arrays and objects** unless they are memoized. This means that even if two arrays have the same content, React will treat them as different because they have new memory references.

For example, if you pass an **array of features** like this:

```tsx
const data = [...]; // Some array of items
const results = useSearch(data, query, [
  search({ fields: ["name"] }),
  filter({ conditions: [...] }),
]);
```

React will **recreate** the array every time the component re-renders. Since `useSearch` sees a new array reference, it treats it as a different input, potentially triggering unnecessary recalculations.

#### **How to Fix This? Memoize the Features Array**

To prevent this, wrap the features in `useMemo()`, so they are only re-created when needed:

```tsx
const features = useMemo(() => [
  search({ fields: ["name"] }),
  filter({ conditions: [...] }),
], []);

const results = useSearch(data, query, ...features);
```

This way, `features` remains stable across renders, avoiding unnecessary updates.

---

### 2. **Memoize the Data Array (When Not Using `useState`)**

If you are passing a static array as `data`, React may recreate the array on every render, even if the contents haven’t changed. This can also cause unnecessary recomputation inside `useSearch`.

#### **Example of What to Avoid:**

```tsx
const results = useSearch(
  [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ],
  query,
  ...features
);
```

Every render creates a **new array reference**, even though the contents are the same!

#### **How to Fix This? Use `useMemo()`**

Instead, memoize the data array:

```tsx
const data = useMemo(
  () => [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ],
  []
);

const results = useSearch(data, query, ...features);
```

If your data is dynamic (e.g., fetched from an API), use `useState`:

```tsx
const [data, setData] = useState([]);

useEffect(() => {
  fetchData().then(setData);
}, []);
```

This ensures that `data` is **only updated when new data is fetched** rather than being re-created every render.

---

### 3. **Optimize Large Datasets**

When working with large datasets, you should:

- **Use `paginate()`** to limit the number of items displayed at a time.
- **Avoid expensive logic** inside custom `match` functions to keep searches fast.

---

### 4. **Debounce Wisely**

Adding a debounce prevents rapid re-renders when users type quickly. Choose a debounce time based on your dataset size:

- **Small datasets:** `150ms`
- **Large datasets:** `300-500ms`

Use `useSearch` with a debounce like this:

```tsx
const results = useSearch(data, query, 300, ...features);
```

This ensures that the search only updates after the user **stops typing for 300ms**, improving performance.

---

## **Troubleshooting**

### **No Results Returned**

1. Ensure `data` is an array.
2. Check `fields` in `search()` match your data structure.
3. Verify `query` is a string.

### **Performance Issues**

- Use `paginate()` to reduce DOM nodes.
- Simplify nested `fields` paths.

---

## **TypeScript Support**

`useSearch` is fully typed and supports generics for seamless integration with TypeScript.

```ts
interface Product {
  id: string;
  name: string;
  price: number;
}

const results = useSearch<Product>(products, query, search({ ... }));
```

---

## **Performance Tips**

- Use `paginate()` to limit the number of rendered items.
- Avoid deeply nested fields in `search()` for faster lookups.
- Memoize the `features` array to prevent unnecessary re-renders.

---

## **Testing**

### Mocking `useSearch`

```ts
jest.mock("use-search", () => ({
  useSearch: jest.fn(() => mockResults),
}));
```

### Example Test Case

```ts
test("filters products by name", () => {
  const results = useSearch(products, "laptop", search({ fields: ["name"] }));
  expect(results).toEqual([{ id: 1, name: "Laptop", price: 999 }]);
});
```

---

## **FAQ**

### Can I use `useSearch` with non-array data?

Yes! `useSearch` accepts both arrays and single objects.

### How do I customize the debounce time?

Pass the debounce time (in milliseconds) as the third argument to `useSearch`.

---

## **Roadmap**

- [x] Add grouping functionality.
- [x] Improve TypeScript type inference.

---

## **Contributing**

Found a bug or want to improve the hook?  
Contribute on [GitHub](https://github.com/iamspruce/useSearch).

---

## **Changelog**

See the [Changelog](https://github.com/iamspruce/useSearch/changelog) for updates and release notes.

---

## **Community & Support**

- [GitHub Issues](https://github.com/iamspruce/useSearch/issues)

---

## **License**

MIT
