import axios from 'axios';

// 登录参数类型
export interface LoginParams {
  email: string;
  password: string;
}

// 发送验证码参数类型
export interface SendCodeParams {
  email: string;
}

// 登录响应类型
export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  token: string;
}

// 发送验证码响应类型
export interface SendCodeResponse {
  success: boolean;
  message: string;
}

export const login = (params: LoginParams): Promise<LoginResponse> => {
  return axios.post('/login', params);
};

export const sendCode = (params: SendCodeParams): Promise<SendCodeResponse> => {
  return axios.post('/send-code', params);
};