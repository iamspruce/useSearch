/**
 * Retrieves the value of a nested field from an object using a dot notation path.
 * @param item The object to search within.
 * @param field The dot notation path to the field (e.g., "user.name").
 * @returns The value of the field, or `undefined` if the field does not exist.
 */
export default function getFieldValue(item: any, field: string) {
  const keys = field.split(/[\.\[\]]/).filter(Boolean); // Split the field path into keys
  let value = item;

  for (const key of keys) {
    if (value == null) return null; // If the value is null or undefined, return null
    value = value[key]; // Traverse the object
  }

  return value; // Return the final value
}
