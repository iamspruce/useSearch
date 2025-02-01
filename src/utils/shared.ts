/**
 * Normalizes a string based on case sensitivity.
 */
export function normalizeCase(value: string, caseSensitive: boolean): string {
  return caseSensitive ? value : value.toLowerCase();
}

/**
 * Converts a value to a string, handling numbers, booleans, and dates.
 */
export function convertToString(value: any): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return String(value);
}

/**
 * Recursively extracts all keys from an object (including nested keys).
 */

export function getAllKeys(
  item: any,
  threshold: number,
  prefix = ""
): string[] {
  if (item == null || typeof item !== "object") {
    return [];
  }

  const fields: string[] = [];
  const keys = Object.keys(item);

  for (let i = 0; i < keys.length && fields.length < threshold; i++) {
    const key = keys[i];
    const value = item[key];
    const fieldPath = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(value)) {
      for (let j = 0; j < value.length && fields.length < threshold; j++) {
        const arrayItem = value[j];
        if (
          typeof arrayItem === "object" &&
          arrayItem !== null &&
          !(arrayItem instanceof Date)
        ) {
          fields.push(
            ...getAllKeys(
              arrayItem,
              threshold - fields.length,
              `${fieldPath}[${j}]`
            )
          );
        } else {
          fields.push(`${fieldPath}[${j}]`);
        }
      }
    } else if (value instanceof Date) {
      // Directly add date fields
      fields.push(fieldPath);
    } else if (typeof value === "object" && value !== null) {
      fields.push(...getAllKeys(value, threshold - fields.length, fieldPath));
    } else {
      fields.push(fieldPath);
    }
  }

  return fields;
}
