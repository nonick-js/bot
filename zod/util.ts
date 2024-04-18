import type * as z from 'zod';
export const schemaForType =
  <T>() =>
  // biome-ignore lint/suspicious/noExplicitAny: zod safe type
  <S extends z.ZodType<T, any, any>>(arg: S) => {
    return arg;
  };

export function getDuplicateIndexes({ array }: { array: string[] }) {
  const indexMap = new Map();
  const duplicateIndexes = [];

  for (let i = 0; i < array.length; i++) {
    const propValue = array[i];

    if (indexMap.has(propValue) && propValue !== '') {
      duplicateIndexes.push(indexMap.get(propValue), i);
    } else {
      indexMap.set(propValue, i);
    }
  }

  const filteredDuplicateIndexes = duplicateIndexes.filter(
    (value, index, self) => self.indexOf(value) === index,
  );

  return filteredDuplicateIndexes;
}
