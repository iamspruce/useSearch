import { getFieldValue } from "../../src/utils";

describe("getFieldValue", () => {
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

  it("should return the value of a top-level field", () => {
    expect(getFieldValue(item, "name")).toBe("Alice");
  });

  it("should return the value of a nested field", () => {
    expect(getFieldValue(item, "details.city")).toBe("New York");
  });

  it.only("should return the value of a nested array field", () => {
    expect(getFieldValue(item, "nestedArray[0].name")).toBe("hello");
  });

  it("should return undefined for a non-existent field", () => {
    expect(getFieldValue(item, "details.phone")).toBeUndefined();
  });

  it("should return undefined for a non-existent nested field", () => {
    expect(getFieldValue(item, "details.address.zip")).toBeUndefined();
  });
});
