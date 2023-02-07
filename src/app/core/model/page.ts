export interface Page<T> {
  list: T[];
  total: number;
  pageIndex: number;
  pageSize: number;
}
