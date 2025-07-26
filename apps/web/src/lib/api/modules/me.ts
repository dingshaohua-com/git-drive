import axios from "axios";

export const get = (...arg?:any) => {
  return axios.get('/me' ,...arg);
};

export const put = (params:any) => {
  return axios.put('/me', params);
};
