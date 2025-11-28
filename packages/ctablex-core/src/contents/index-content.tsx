import { useIndex } from '../contexts/index-context';

export interface IndexContentProps {
  start?: number;
}
/**
 * Displays the current array or object iteration index from IndexContext.
 * Optionally adds a start offset to the index.
 */
export function IndexContent(props: IndexContentProps) {
  const { start = 0 } = props;
  const index = useIndex() + start;
  return <>{index}</>;
}
