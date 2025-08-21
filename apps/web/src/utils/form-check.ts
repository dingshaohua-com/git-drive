export const checkNormalStr = (str: string) => {
  // 验证文件夹名称格式
  const invalidChars = /[<>:"/\\|?*]/;
  if (!str.trim()) {
    return '文件夹名称不能为空';
  } else if (invalidChars.test(str)) {
    return '文件夹名称不能包含非法字符';
  }
};
