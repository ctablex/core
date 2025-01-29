import { useContent } from '../content-provider';

export function DefaultContent() {
  const content = useContent<string | number | null | undefined>();
  return <>{content}</>;
}
