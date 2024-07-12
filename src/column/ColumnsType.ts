export interface ColumnsType {
  __COLUMNS__: true;
}

export function isColumnsType(type: any): type is ColumnsType {
  return Boolean(type && type.__COLUMNS__);
}
