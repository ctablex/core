import { useKey } from '../contexts/key-context';

export function KeyContent() {
  const key = useKey();
  return <>{key}</>;
}
