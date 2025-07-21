

import axios from "axios";

export const getUserInfo = (params: any) => {
  return axios.get('/file/user-info', { params });
};
