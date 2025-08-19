export type QuickLoginType = 'password' | 'email' | 'sms' | 'wechat' | 'qq';

export type LoginFieldType = {
  account?: string;
  password?: string;
  email?: string;
  phone?: string;
  code?: string;
};

// 可以添加其他认证相关类型
export type LoginResponse = {
  token: string;
  user: {
    id: string;
    email?: string;
    phone?: string;
  };
};

export type SendCodeRequest = {
  email?: string;
  phone?: string;
};