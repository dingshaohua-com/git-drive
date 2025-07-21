import axios from "axios";

export const list = (params: any) => {
  return axios.get('/git-token/list', { params });
};