export type StringAccessor<D, C> = {
  [K in keyof D]-?: D[K] extends C ? K : never;
}[keyof D];

export type FunctionAccessor<D, C> = (data: D) => C;

export type Accessor<D, C> =
  | StringAccessor<D, C>
  | FunctionAccessor<D, C>
  | null;

export function getValue<D>(data: D, accessor: null): null;
export function getValue<D, C>(data: D, accessor: Accessor<D, C>): C;
export function getValue<D, C>(
  data: D,
  accessor: Accessor<D, C> | null,
): C | null;
export function getValue<D, C>(
  data: D,
  accessor: Accessor<D, C> | null,
): C | null {
  if (accessor === null) {
    return null;
  }
  if (typeof accessor === 'function') {
    return accessor(data);
  }
  return data[accessor] as C;
}
