import { CssBaseline } from '@mui/material';
import { Fragment } from 'react';
import { BasicTable } from './BasicTable';
import { generateData } from './data';
import { MuiTableProvider } from './MuiTableProvider';

const data = generateData(50);

export default function App() {
  return (
    <Fragment>
      <CssBaseline />
      <MuiTableProvider>
        <BasicTable data={data} />
      </MuiTableProvider>
    </Fragment>
  );
}
