// init.ts
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { auth } from '../stores';
import toast from '$lib/toast';

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

// 为 Orval 提供的自定义 axios 实例
// 这个函数告诉 Orval 我们的拦截器已经解构了 response.data
// 所以生成的类型应该直接是业务数据类型，而不是 AxiosResponse<T>
export const customAxiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  // 直接使用配置好拦截器的 axios 实例
  // 拦截器会自动处理 response.data 的解构
  return axios(config);
};
