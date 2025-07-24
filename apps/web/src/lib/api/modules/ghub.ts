

import axios from "axios";


export const repo = {
    list: (params: any) => {
        return axios.get('/ghub/repos', { params });
    },
    add: (params: any) => {
        return axios.post('/ghub/repo', params);
    }
}

