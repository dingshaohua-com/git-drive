import axios from 'axios';

// 防汛仓库列表
export const list = (params: any) => {
  return axios.get('/repos', { params });
};

// 查询单个仓库
export const get = (params: any) => {
  return axios.get('/repo', { params });
};

// 删除仓库
export const remove = (params: { repo: string; path: string }) => {
  return axios.delete('/repo', { params });
};

// 创建仓库
export const add = (params: any) => {
  return axios.post('/repo', params);
};

// 上传文件
export const uploadFile = (params: any) => {
  return axios.post('/repo/upload-file', params);
};

// 创建文件夹
export const addFolder = (params: any) => {
  return axios.post('/repo/add-folder', params);
};

