import { GroupOptions, SearchFeature } from "../types";

/**
 * Creates a grouping function that groups data based on the provided options.
 * @template T The type of data being grouped.
 * @param options Configuration for grouping behavior.
 * @param options.field The field to group by.
 * @param options.defaultGroupKey The default group key for items with missing or null fields. Defaults to "Other".
 * @returns A function that takes data and returns a grouped array.
 */
const group = <T>(options: GroupOptions): SearchFeature<T> => {
  const { field, defaultGroupKey = "Other" } = options;

  return (data: T[], _query: string): T[] => {
    const groups = new Map<string, T[]>();

    data.forEach((item) => {
      const groupKey = (item as any)[field] || defaultGroupKey;
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(item);
    });

    console.log(groups.values());

    return Array.from(groups.values()).flat();
  };
};

export default group;
