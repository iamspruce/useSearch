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

Let me know if you’d like any tweaks! 🚀earch is designed to keep things simple, fast, and scalable.

**Key Features**:

- **Debounced search** (customizable delay)
- **Fuzzy search** (Levenshtein, Jaro-Winkler, N-Gram, or custom algorithms)
- **Filtering** with conditional logic (`>`, `<`, `contains`, etc.)
- **Sorting**, **pagination**, and **grouping**
- Graceful error handling and warnings
- Optimized for large datasets

---

## **Installation**

```bash
npm install useSearch
```

---

## **Quick Start**

### 1. **Simple Search**

Search an array of objects with debouncing (default: 150ms):

```tsx
import { useSearch, search } from "use-search";

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

Use built-in algorithms or provide your own:

```ts
search({
  match: "fuzzy",
  fuzzyOptions: {
    threshold: 0.4, // Match similarity threshold (0-1)
    fuzzySearchFn: yourCustomAlgorithm, // Optional
  },
});
```

### 3. **Filtering**

Apply conditional logic to refine results:

```ts
import { filter } from "use-search";

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

## **API Reference**

### **`useSearch`**

```ts
function useSearch<T>(
  data: T | T[],
  query: string,
  debounceTimeOrFeature?: number | SearchFeature<T>,
  ...features: SearchFeature<T>[]
): T[];
```

| Parameter               | Type              | Description                           |
| ----------------------- | ----------------- | ------------------------------------- | --------------------------------------- |
| `data`                  | `T                | T[]`                                  | Data to search (single object or array) |
| `query`                 | `string`          | Search query string                   |
| `debounceTimeOrFeature` | `number           | Feature`                              | Debounce time (ms) or first feature     |
| `features`              | `SearchFeature[]` | Search/filter/sort/paginate functions |

---

### **Features**

#### **`search(options: SearchOptions)`**

| Option                    | Type           | Default   | Description                              |
| ------------------------- | -------------- | --------- | ---------------------------------------- | --------------------------- |
| `match`                   | `MatchStrategy | fn`       | `"contains"`                             | Strategy or custom function |
| `fields`                  | `string        | string[]` | All keys                                 | Fields to search            |
| `caseSensitive`           | `boolean`      | `false`   | Case-sensitive matching                  |
| `objectToStringThreshold` | `number`       | `10`      | Max nested keys before string conversion |

---

#### **`filter(options: FilterOptions)`**

| Option                 | Type          | Default      | Description                                        |
| ---------------------- | ------------- | ------------ | -------------------------------------------------- | -------- | --------------------- |
| `conditions`           | `Condition[]` | **Required** | Array of conditions (`field`, `operator`, `value`) |
| `caseSensitive`        | `boolean`     | `false`      | Case-sensitive comparisons                         |
| `missingFieldBehavior` | `"skip"       | "exclude"    | "throw"`                                           | `"skip"` | Handle missing fields |

---

## **Best Practices**

### 1. **Memoize Features**

Prevent unnecessary re-renders by memoizing the features array:

```ts
const features = useMemo(() => [
  search({ fields: ['name'] }),
  filter({ conditions: [...] }),
], []);
```

### 2. **Optimize Large Datasets**

- Use `paginate()` to limit rendered results.
- Avoid expensive custom logic in `match` functions.

### 3. **Debounce Wisely**

Choose a debounce time based on your data size:

- Small datasets: `150ms`
- Large datasets: `300-500ms`

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

## **Comparison with Alternatives**

| Feature             | `useSearch` | `react-search` | `fuse.js` |
| ------------------- | ----------- | -------------- | --------- |
| Zero dependencies   | ✅          | ❌             | ❌        |
| Fuzzy search        | ✅          | ❌             | ✅        |
| Custom search logic | ✅          | ❌             | ❌        |

---

## **FAQ**

### Can I use `useSearch` with non-array data?

Yes! `useSearch` accepts both arrays and single objects.

### How do I customize the debounce time?

Pass the debounce time (in milliseconds) as the third argument to `useSearch`.

---

## **Roadmap**

- [ ] Add grouping functionality.
- [ ] Improve TypeScript type inference.
- [ ] Add support for async data sources.

---

## **Contributing**

Found a bug or want to improve the hook?  
Contribute on [GitHub](https://github.com/your-repo).

---

## **Changelog**

See the [Changelog](https://github.com/your-repo/changelog) for updates and release notes.

---

## **Community & Support**

- [GitHub Issues](https://github.com/your-repo/issues)
- [Discord Channel](https://discord.gg/your-link)

---

## **License**

MIT
