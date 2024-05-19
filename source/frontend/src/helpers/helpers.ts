export function objectKeys<Object extends object>(
  object: Object
): (keyof Object)[] {
  return Object.keys(object) as (keyof Object)[];
}

export function objectEntries<Object extends object>(o: Object) {
  return Object.entries(o) as [keyof Object, Object[keyof Object]][];
}

export function isObjectEmpty(object: object) {
  for (const element in object) {
    return false;
  }
  return true;
}
