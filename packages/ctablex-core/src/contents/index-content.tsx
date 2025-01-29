import { useIndex } from '../contexts/index-context';

export interface IndexContentProps {
  start?: number;
}
export function IndexContent(props: IndexContentProps) {
  const { start = 0 } = props;
  const index = useIndex() + start;
  return <>{index}</>;
}
