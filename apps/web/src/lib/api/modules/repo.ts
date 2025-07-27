import axios from "axios";

export const list = (params: any) => {
    return axios.get('/repos', { params });
}

export const get = (params: any) => {
    return axios.get('/repo', { params });
}

// 上传文件
export const upload = (params: any) => {
    return axios.post('/repo/upload', params);
}



// 创建仓库
export const add = (params: any) => {
    return axios.post('/repo/repo', params);
}

// 创建文件夹
export const create = (params: any) => {
    return axios.post('/repo', params);
}

// 删除文件
export const remove = (params: {
    repo: string;
    path: string;
}) => {
    return axios.delete('/repo', {params});
}


// 创建文件
// export const createFile = (params: {
//     repoName: string;
//     filePath: string;
//     content: string;
//     message?: string;
// }) => {
//     return axios.post('/repo/create-file', params);
// }

// // 更新文件
// export const updateFile = (params: {
//     repoName: string;
//     filePath: string;
//     content: string;
//     message?: string;
//     branch?: string;
// }) => {
//     return axios.put('/repo/update-file', params);
// }






