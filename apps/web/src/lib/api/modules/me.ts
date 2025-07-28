import axios from "axios";

export const get = () => {
  return axios.get('/me');
};

export const put = (params:any) => {
  return axios.put('/me', params);
};
