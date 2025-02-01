import filter from "../../src/features/filter";

describe("filter", () => {
  const data = [
    { name: "Alice", age: 25, active: true },
    { name: "Bob", age: 30, active: false },
    { name: "Charlie", age: 20, active: true },
  ];

  it("should filter using a single condition", () => {
    const result = filter({
      conditions: [{ field: "age", operator: "greaterThan", value: 20 }],
    })(data, "");
    expect(result).toEqual([
      { name: "Alice", age: 25, active: true },
      { name: "Bob", age: 30, active: false },
    ]);
  });

  it("should filter using multiple conditions", () => {
    const result = filter({
      conditions: [
        { field: "age", operator: "greaterThan", value: 20 },
        { field: "active", operator: "equals", value: true },
      ],
    })(data, "");
    expect(result).toEqual([{ name: "Alice", age: 25, active: true }]);
  });

  /*  it("should return the original data if no conditions are provided", () => {
    expect(() => filter({ conditions: [] })(data, "")).toEqual([data]);
  }); */

  it("should skip missing fields if missingFieldBehavior is 'skip'", () => {
    const result = filter({
      conditions: [{ field: "city", operator: "equals", value: "New York" }],
      missingFieldBehavior: "skip",
    })(data, "");
    expect(result).toEqual(data); // All items are included because the condition is skipped
  });

  it("should exclude items with missing fields if missingFieldBehavior is 'exclude'", () => {
    const result = filter({
      conditions: [{ field: "city", operator: "equals", value: "New York" }],
      missingFieldBehavior: "exclude",
    })(data, "");
    expect(result).toEqual([]); // All items are excluded because the field is missing
  });

  it("should throw an error for missing fields if missingFieldBehavior is 'throw'", () => {
    expect(() =>
      filter({
        conditions: [{ field: "city", operator: "equals", value: "New York" }],
        missingFieldBehavior: "throw",
      })(data, "")
    ).toThrow('Field "city" does not exist in the data.');
  });

  it("should handle null or undefined field values with the 'isNull' operator", () => {
    const dataWithNull = [
      { name: "Alice", age: 25, city: "New York" },
      { name: "Bob", age: 30, city: null },
      { name: "Charlie", age: 20 }, // city is undefined
    ];

    const result = filter({
      conditions: [{ field: "city", operator: "isNull", value: null }],
    })(dataWithNull, "");
    expect(result).toEqual([
      { name: "Bob", age: 30, city: null },
      { name: "Charlie", age: 20 }, // city is undefined, treated as null
    ]);
  });

  it("should handle case-insensitive comparisons if caseSensitive is true", () => {
    const result = filter({
      conditions: [{ field: "name", operator: "contains", value: "alice" }],
      caseSensitive: true,
    })(data, "");

    expect(result).toEqual([]);
  });

  it("should handle case-sensitive comparisons if caseSensitive is false", () => {
    const result = filter({
      conditions: [{ field: "name", operator: "contains", value: "alice" }],
      caseSensitive: false,
    })(data, "");
    expect(result).toEqual([{ name: "Alice", age: 25, active: true }]); // No match because the comparison is case-sensitive
  });
});
