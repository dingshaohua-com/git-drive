import axios from "axios";

export const me = () => {
  return axios.get('/user/me');
};

export const get = (params) => {
  return axios.get('/user',{ params });
};

export const put = (params) => {
  return axios.put('/user', params);
};
