export function extractChangedFields<T extends Record<string, string | string[]>>(
  oldVals: T,
  newVals: T
): Partial<T> {
  const changedFields = {} as Partial<T>;
  for (const key in newVals) {
    if (JSON.stringify(newVals[key]) !== JSON.stringify(oldVals[key])) {
      changedFields[key] = newVals[key];
    }
  }
  return changedFields;
}
