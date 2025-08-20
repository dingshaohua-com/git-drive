// init.ts
import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { auth } from '$/stores';
import toast from '$/utils/toast';

// ---===全局默认axios配置===---
// const whitePath = ["/login", "/sms-send"]; // 白名单
// axios.defaults.baseURL = isDev?'/api':'';
// axios.defaults.baseURL = '/api';
axios.defaults.timeout = 10000;
axios.interceptors.request.use(
  (config) => {
    // 从userStore获取token
    let token = null;
    auth.subscribe(state => {
      token = state.token;
    })();
    
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code === 1) {
      toast.error(res.msg);
      return Promise.reject(res.msg);
    } else {
      return res.data;
    }
  },
  (error) => {
    if (error.status === 401) {
      toast.error('登录失效，即将跳转至登录');
      // 清除认证状态
      auth.logout();
      setTimeout(() => {
        location.href = '/login';
      }, 2000);
    }else{
      toast.error(error.message);
      return Promise.reject(error);
    }

    
  },
);


// 类型工具：提取 API 响应中 data 字段的类型
type ExtractDataType<T> = T extends { data: infer D } ? D : T;

export const customAxiosInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<ExtractDataType<T>> => {
  // 直接返回 axios 调用的结果
  // 响应拦截器已经处理了数据解构，返回的就是最终的业务数据
  return axios({
    ...config,
    ...options,
  }) as Promise<ExtractDataType<T>>;
};
