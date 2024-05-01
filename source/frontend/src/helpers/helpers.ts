export function objectKeys<Object extends object>(
  object: Object
): (keyof Object)[] {
  return Object.keys(object) as (keyof Object)[];
}
