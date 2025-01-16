export function extractChangedFields<T extends Record<string, string | string[]>>(
    oldVals: T,
    newVals: T
  ): T {
    const changedFields = {} as T;
    for (const key in newVals) {
      if (newVals[key] !== oldVals[key]) {
        changedFields[key] = newVals[key];
      }
    }
    return changedFields;
  }
