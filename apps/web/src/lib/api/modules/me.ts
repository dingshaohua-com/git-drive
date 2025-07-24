import axios from "axios";

export const get = (...arg?:any) => {
  console.log(999, arg);
  
  return axios.get('/me' ,...arg);
};

export const put = (params:any) => {
  return axios.put('/me', params);
};
