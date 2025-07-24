import axios from "axios";

export const get = () => {
  return axios.get('/me');
};

export const put = (params) => {
  return axios.put('/me', params);
};
