import axios from "axios";

export const list = (params: any) => {
  return axios.get('/git-token/list', { params });
};

export const add = (params: { token: string }) => {
  return axios.post('/git-token', params);
};