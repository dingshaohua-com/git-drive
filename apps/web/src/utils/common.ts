  // 封装一个通用方法，加载文件
export const loadFile = (filePath) => {
    const response = fetch(filePath).then((res) => res.text());
    return response;
};