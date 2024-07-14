import type { RequestOptions, Result } from '/@types/axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface CreateAxiosOptions extends AxiosRequestConfig {
  transform?: AxiosTransform;
  requestOptions?: RequestOptions;
}

export abstract class AxiosTransform {
  /*
   *@description: process before request
   */
  beforeRequestHook?: (
    config: AxiosRequestConfig,
    options: RequestOptions
  ) => AxiosRequestConfig;
  /*
   *@description: 处理响应数据
   */
  transformResponseHook?: (
    res: AxiosResponse<Result>,
    options: RequestOptions
  ) => any;
}
