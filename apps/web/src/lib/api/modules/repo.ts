import axios from "axios";

export const list = (params: any) => {
    return axios.get('/repos', { params });
}

export const get = (params: any) => {
    return axios.get('/repo', { params });
}

export const upload = (params: any) => {
    return axios.post('/repo/upload', params);
}





