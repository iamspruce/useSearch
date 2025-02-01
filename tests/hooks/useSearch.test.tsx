import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import TestComponent from "../TestComponent";
import search from "../../src/features/search";
import filter from "../../src/features/filter";
import { SearchFeature } from "../../src/types";

// Mock useDebounce
jest.mock("../../src/utils/", () => ({
  ...jest.requireActual("../../src/utils/"),
  useDebounce: (value: any) => value,
}));

// Mock data
const data = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 35 },
];

// Mock search feature: Search by name
const searchByName: SearchFeature<{ id: number; name: string; age: number }> =
  search({
    fields: ["name"],
    match: "contains",
    caseSensitive: false,
  });

// Mock filter feature: Filter by age
const filterByAge: SearchFeature<{ id: number; name: string; age: number }> =
  filter({
    conditions: [
      {
        field: "age",
        operator: "greaterThan",
        value: 30,
      },
    ],
  });

describe("useSearch", () => {
  it("should filter data based on the search feature", () => {
    const { getByText, queryByText } = render(
      <TestComponent data={data} query="Alice" features={[searchByName]} />
    );

    // Since useDebounce is mocked, the results should be available immediately
    expect(
      getByText(JSON.stringify({ id: 1, name: "Alice", age: 25 }))
    ).toBeInTheDocument();
    expect(
      queryByText(JSON.stringify({ id: 2, name: "Bob", age: 30 }))
    ).not.toBeInTheDocument();
    expect(
      queryByText(JSON.stringify({ id: 3, name: "Charlie", age: 35 }))
    ).not.toBeInTheDocument();
  });

  it("should filter data based on the filter feature", () => {
    const { getByText, queryByText } = render(
      <TestComponent
        data={data}
        query="" // Query is not used in filter
        features={[filterByAge]}
      />
    );

    // Since useDebounce is mocked, the results should be available immediately
    expect(
      queryByText(JSON.stringify({ id: 1, name: "Alice", age: 25 }))
    ).not.toBeInTheDocument();
    expect(
      queryByText(JSON.stringify({ id: 2, name: "Bob", age: 30 }))
    ).not.toBeInTheDocument();
    expect(
      getByText(JSON.stringify({ id: 3, name: "Charlie", age: 35 }))
    ).toBeInTheDocument();
  });

  it("should combine search and filter features", () => {
    const { getByText, queryByText } = render(
      <TestComponent
        data={data}
        query="Charlie"
        features={[searchByName, filterByAge]}
      />
    );

    // Since useDebounce is mocked, the results should be available immediately
    expect(
      queryByText(JSON.stringify({ id: 1, name: "Alice", age: 25 }))
    ).not.toBeInTheDocument();
    expect(
      queryByText(JSON.stringify({ id: 2, name: "Bob", age: 30 }))
    ).not.toBeInTheDocument();
    expect(
      getByText(JSON.stringify({ id: 3, name: "Charlie", age: 35 }))
    ).toBeInTheDocument();
  });

  it("should return all data if the query is empty and no filters are applied", () => {
    const { getByText } = render(
      <TestComponent data={data} query="" features={[]} />
    );

    // Since useDebounce is mocked, the results should be available immediately
    expect(
      getByText(JSON.stringify({ id: 1, name: "Alice", age: 25 }))
    ).toBeInTheDocument();
    expect(
      getByText(JSON.stringify({ id: 2, name: "Bob", age: 30 }))
    ).toBeInTheDocument();
    expect(
      getByText(JSON.stringify({ id: 3, name: "Charlie", age: 35 }))
    ).toBeInTheDocument();
  });

  it("should throw an error if the query is not a string", () => {
    // Suppress console error for this test
    const consoleError = console.error;
    console.error = jest.fn();

    // Render with an invalid query (not a string)
    expect(() => {
      render(
        <TestComponent
          data={data}
          query={123 as any} // Invalid query (not a string)
          features={[searchByName]}
        />
      );
    }).toThrow("`query` must be a string.");

    // Restore console error
    console.error = consoleError;
  });
});
