import { getAllKeys } from "../../src/utils/shared";

describe("getAllKeys", () => {
  const item = {
    name: "Alice",
    age: 25,
    details: {
      city: "New York",
      address: {
        phone: 123,
      },
    },
    nestedArray: [
      {
        name: "hello",
        test: {
          name: "mr",
        },
      },
      {
        name: "hello2",
      },
    ],
  };

  it("should extract keys from a flat object", () => {
    expect(getAllKeys(item, 3)).toEqual(["name", "age", "details.city"]);
  });

  it("should extract keys from deeply nested object", () => {
    const nestedItem = { user: item };
    expect(getAllKeys(nestedItem, 10)).toEqual([
      "user.name",
      "user.age",
      "user.details.city",
      "user.details.address.phone",
      "user.nestedArray[0].name",
      "user.nestedArray[0].test.name",
      "user.nestedArray[1].name",
    ]);
  });

  it("should respect the threshold", () => {
    expect(getAllKeys(item, 2)).toEqual(["name", "age"]);
  });
});
