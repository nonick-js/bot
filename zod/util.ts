import type * as z from 'zod';
export const schemaForType =
  <T>() =>
  // biome-ignore lint/suspicious/noExplicitAny: zod safe type
  <S extends z.ZodType<T, any, any>>(arg: S) => {
    return arg;
  };
