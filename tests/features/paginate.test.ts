import { paginate } from "../../src";

describe("paginate", () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it("paginates data correctly", () => {
    const paginateData = paginate({ pageSize: 3, page: 2 });
    const result = paginateData(data, "");

    expect(result).toEqual([4, 5, 6]);
  });

  it("returns an empty array for invalid page or pageSize", () => {
    const paginateData = paginate({ pageSize: -1, page: 2 });
    const result = paginateData(data, "");

    expect(result).toEqual([]);
  });

  it("handles pages beyond the data length", () => {
    const paginateData = paginate({ pageSize: 5, page: 3 });
    const result = paginateData(data, "");

    expect(result).toEqual([]);
  });
});
