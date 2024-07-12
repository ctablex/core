import { BasicTable } from './BasicTable';
import { generateData } from './data';

const data = generateData(50);

export default function App() {
  return <BasicTable data={data} />;
}
