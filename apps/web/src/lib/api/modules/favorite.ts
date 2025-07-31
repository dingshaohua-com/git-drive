import axios from 'axios';

// 列表
export const list = (params: any) => {
  return axios.get('/favorites', { params });
};

// 创建
export const create = (params:any) => {
  return axios.post('/favorite', params);
};