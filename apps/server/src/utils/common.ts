type GetLoginType = (params: any) => 'account' | 'email' | 'phone' | undefined;
export const getLoginType: GetLoginType = (params) => {
  if (params.account) {
    return 'account';
  } else if (params.email) {
    return 'email';
  } else if (params.phone) {
    return 'phone';
  }
};

export const isQQEmailCheck = (email: string) => {
  // 基础正则：数字开头，@qq.com结尾
  const qqRegex = /^[1-9][0-9]{4,}@qq\.com$/i;
  const isQQEmail =  qqRegex.test(email);
  return {
    isQQEmail,
    QQ:email.replace('@qq.com','')||''
  }
};
