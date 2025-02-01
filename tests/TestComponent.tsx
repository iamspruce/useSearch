import React from "react";
import useSearch from "../src/hooks/useSearch";
import { SearchFeature } from "../src/types";

interface TestComponentProps<T> {
  data: T | T[];
  query: string;
  features: SearchFeature<T>[];
}

function TestComponent<T>({ data, query, features }: TestComponentProps<T>) {
  const results = useSearch(data, query, ...features);
  return (
    <div>
      {results.map((result, index) => (
        <div key={index} data-testid="result">
          {JSON.stringify(result)}
        </div>
      ))}
    </div>
  );
}

export default TestComponent;
