export interface Result<T = any> {
  code: number;
  type: 'success' | 'error' | 'warning';
  msg: string;
  data: T;
}
