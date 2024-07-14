import type { CreateAxiosOptions, AxiosTransform } from './axiosTransform';
import type { AxiosResponse } from 'axios';
import type { Result, RequestOptions } from '/@types/axios';
import { ResultEnum, ContentTypeEnum, RequestEnum } from '@/enums/httpEnum';
import { deepMerge, setObjToUrlParams } from '../index';
import { VAxios } from './axios';
// import { cloneVNode } from 'vue';
import { clone } from 'lodash-es';
import { isString } from '@/utils/is';
const transform: AxiosTransform = {
  transformResponseHook: (
    res: AxiosResponse<Result>,
    options: RequestOptions
  ) => {
    const { isTransformResponse, isReturnNativeResponse } = options;
    if (isReturnNativeResponse) {
      return res;
    }
    if (!isTransformResponse) {
      return res.data;
    }
    const resData = res.data;
    if (!resData) {
      throw new Error('请求失败');
    }
    const { code, result } = resData;
    const hasSuccess =
      resData && Reflect.has(resData, 'code') && code === ResultEnum.SUCCESS;
    if (hasSuccess) {
      return result;
    }
    // 错误处理
  },
  beforeRequestHook: (config, options) => {
    const {
      apiUrl,
      joinPrefix,
      joinParamsToUrl,
      // formatDate,
      // joinTime = true,
      urlPrefix
    } = options;
    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }
    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    //TODO: 关于日期格式化的处理
    if (config?.method?.toUpperCase() === RequestEnum.GET) {
      console.log('get');
    } else {
      // 非get请求
      if (!isString(params)) {
        // TODO: 日期处理
        if (
          Reflect.has(config, 'data') &&
          config.data &&
          Object.keys(config.data).length > 0
        ) {
          config.data = data;
          config.params = params;
        } else {
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url,
            Object.assign({}, config.params, config.data)
          );
        }
      }
    }
    return config;
  }
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        timeout: 5 * 60 * 1000,
        headers: {
          'Content-Type': ContentTypeEnum.JSON
        },
        transform: clone(transform),
        requestOptions: {
          joinPrefix: false,
          isReturnNativeResponse: false,
          isTransformResponse: true,
          joinParamToUrl: false,
          formateDate: true,
          joinTime: true,
          ignoreCancelToken: true,
          apiUrl: window.config.apiUrl,
          retryRequest: {
            isOpenRetry: true,
            count: 5,
            waitTime: 1000
          }
        }
      },
      opt || {}
    )
  );
}
export const defHttp = createAxios();
