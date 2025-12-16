import { useKey } from '../contexts/key-context';

/**
 * Displays the current object property key from KeyContext.
 */
export function KeyContent() {
  const key = useKey();
  return <>{key}</>;
}
