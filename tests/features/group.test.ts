import { group } from "../../src";

describe("group", () => {
  const data = [
    { id: 1, category: "Fruit", name: "Apple" },
    { id: 2, category: "Fruit", name: "Banana" },
    { id: 3, category: "Vegetable", name: "Carrot" },
    { id: 4, name: "Unknown" }, // Item without a category
  ];

  it("groups data by a field", () => {
    const groupByCategory = group({ field: "category" });
    const result = groupByCategory(data, "");

    console.log(result);

    expect(result).toEqual([
      { id: 1, category: "Fruit", name: "Apple" },
      { id: 2, category: "Fruit", name: "Banana" },
      { id: 3, category: "Vegetable", name: "Carrot" },
      { id: 4, name: "Unknown" },
    ]);
  });

  it("uses a custom default group key", () => {
    const groupByCategory = group({
      field: "category",
      defaultGroupKey: "Misc",
    });
    const result = groupByCategory(data, "");

    expect(result).toEqual([
      { id: 1, category: "Fruit", name: "Apple" },
      { id: 2, category: "Fruit", name: "Banana" },
      { id: 3, category: "Vegetable", name: "Carrot" },
      { id: 4, name: "Unknown" },
    ]);
  });
});
