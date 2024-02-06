/* eslint-disable @typescript-eslint/no-explicit-any */

export function mapObject<T = any>(obj: Record<string, any>, mapFn: (key: string, value: any) => T): Record<string, T> {
  const result = Object.keys(obj).reduce(function (result, key) {
    result[key] = mapFn(key, obj[key]);
    return result;
  }, {} as Record<string, T>);

  return result;
}

export function arrayRange(start: number, stop: number, step = 1) {
  return Array.from({ length: (stop - start) / step + 1 }, (_value, index) => start + index * step);
}

export function enumKeys<O extends object, K extends keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

export function enumValues<O extends Record<string, string>>(obj: O): string[] {
  return Object.values(obj);
}

export function enumForEach<O extends object, K extends keyof O>(obj: O, callback: (item: O[K]) => void): void {
  for (const key of enumKeys(obj)) {
    callback(obj[key as K]);
  }
}

export function missingHandling(value: never): never {
  throw new Error(`Not handled value ${value}`);
}

export function assertDefined<T>(value: T): asserts value is Exclude<T, null | undefined> {
  if (!isDefined(value)) throw new Error(`${value} is not defined`);
}

export function isDefined<T>(value: T): boolean {
  return value !== null && value !== undefined;
}

export function prune(obj: Record<any, any>): Record<any, Exclude<any, undefined | null>> {
  return Object.keys(obj).reduce((res, key) => {
    const value = obj[key];
    if (isDefined(value)) res[key] = value;
    return res;
  }, {} as Record<any, Exclude<any, undefined | null>>);
}
