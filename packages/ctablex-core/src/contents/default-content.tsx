import { useContent } from '../content-provider';

/**
 * Renders primitive values (string, number, null, undefined) directly from context.
 * Used as the default children for most content components.
 * Only works with primitives - objects and arrays of objects will cause React errors.
 */
export function DefaultContent() {
  const content = useContent<string | number | null | undefined>();
  return <>{content}</>;
}
