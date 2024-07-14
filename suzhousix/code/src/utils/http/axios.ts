import type { CreateAxiosOptions } from './axiosTransform';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from 'axios';
import type { RequestOptions, Result } from '/@types/axios';
import axios from 'axios';
import { cloneDeep } from 'lodash-es';
import { isFunction } from '../is';
// import { OPTIONS } from 'jssip/lib/Constants';
export * from './axiosTransform';
/**
 * @description axios module
 */
export class VAxios {
  private axiosInstance: AxiosInstance;
  private readonly options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
  }

  private createAxios(config: CreateAxiosOptions): void {
    this.axiosInstance = axios.create(config);
  }
  private getTranform() {
    const { transform } = this.options;
    return transform;
  }

  configAxios(config: CreateAxiosOptions) {
    if (!this.axiosInstance) return;
    this.createAxios(config);
  }
  /*
   *@description: set general header
   */
  setHeader(headers: any): void {
    if (!this.axiosInstance) return;
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }
  get<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options);
  }
  post<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options);
  }
  put<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return this.request(
      {
        ...config,
        method: 'PUT'
      },
      options
    );
  }
  delete<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options);
  }
  request<T = any>(
    config: AxiosRequestConfig,
    options?: RequestOptions
  ): Promise<T> {
    let conf: CreateAxiosOptions = cloneDeep(config);
    const transform = this.getTranform();
    const { requestOptions } = this.options;
    const opt: RequestOptions = Object.assign({}, requestOptions, options);
    const { beforeRequestHook, transformResponseHook } = transform || {};
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }
    conf.requestOptions = opt;
    // 表格支持
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          if (transformResponseHook && isFunction(transformResponseHook)) {
            try {
              const ret = transformResponseHook(res, opt);
              resolve(ret);
            } catch (error) {
              reject(error || new Error('request error!'));
            }
          }
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          reject(e);
        });
    });
  }
}
