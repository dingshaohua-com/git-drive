import axios from "axios";

export const get = () => {
  return axios.get('/me');
};

export const put = (params:any) => {
  return axios.put('/me', params);
};

// 发送邮箱验证码
export const sendEmailCode = (params: { email: string }) => {
  return axios.post('/me/send-email-code', params);
};

// 发送手机验证码
export const sendPhoneCode = (params: { phone: string }) => {
  return axios.post('/me/send-phone-code', params);
};
