import { sort } from "../../src";

describe("sort", () => {
  const data = [
    { id: 1, name: "Banana" },
    { id: 2, name: "Apple" },
    { id: 3, name: "Carrot" },
    { id: 4, name: null }, // Item with null value
  ];

  it("sorts data in ascending order", () => {
    const sortByName = sort({ field: "name", order: "asc", nullsFirst: true });
    const result = sortByName(data, "");

    console.log(result);

    expect(result).toEqual([
      { id: 4, name: null },
      { id: 2, name: "Apple" },
      { id: 1, name: "Banana" },
      { id: 3, name: "Carrot" },
    ]);
  });

  it("sorts data in descending order", () => {
    const sortByName = sort({ field: "name", order: "desc" });
    const result = sortByName(data, "");

    expect(result).toEqual([
      { id: 3, name: "Carrot" },
      { id: 1, name: "Banana" },
      { id: 2, name: "Apple" },
      { id: 4, name: null },
    ]);
  });

  it("places null values last", () => {
    const sortByName = sort({ field: "name", order: "asc", nullsFirst: false });
    const result = sortByName(data, "");

    expect(result).toEqual([
      { id: 2, name: "Apple" },
      { id: 1, name: "Banana" },
      { id: 3, name: "Carrot" },
      { id: 4, name: null },
    ]);
  });
});
