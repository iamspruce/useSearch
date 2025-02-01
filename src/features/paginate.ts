import { PaginationOptions, SearchFeature } from "../types";

/**
 * Creates a pagination function that paginates data based on the provided options.
 * @template T The type of data being paginated.
 * @param options Configuration for pagination behavior.
 * @param options.pageSize The number of items per page. Defaults to 10.
 * @param options.page The current page number. Defaults to 1.
 * @returns A function that takes data and returns a paginated array.
 */
const paginate = <T>(options: PaginationOptions): SearchFeature<T> => {
  const { pageSize = 10, page = 1 } = options;

  return (data: T[], _query: string): T[] => {
    if (pageSize <= 0 || page <= 0) {
      console.warn(
        "pageSize and page must be positive numbers. Returning empty array."
      );
      return [];
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };
};

export default paginate;
