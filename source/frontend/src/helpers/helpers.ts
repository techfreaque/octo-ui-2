export function objectKeys<TObject extends object>(
  object: TObject
): (keyof TObject)[] {
  return Object.keys(object) as (keyof TObject)[];
}

export function objectEntries<TObject extends object>(o: TObject) {
  return Object.entries(o) as [keyof TObject, TObject[keyof TObject]][];
}

export function isObjectEmpty(object: object) {
  for (const _element in object) {
    return false;
  }
  return true;
}


// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export const emptyValueFunction = (_value: any) => {}