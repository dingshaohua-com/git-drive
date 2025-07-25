// /**
//  * 创建 GitHub 仓库
//  * @param {string} repoName 仓库名
//  * @param {string} [description] 描述
//  * @param {boolean} [isPrivate] 是否私有
//  * @returns {Promise<any>}
//  */
// export async function createGithubRepo(repoName: string, description: string = "") {
//     const api = getGithubApi(GITHUB_TOKEN);
//     const res = await api.post(`/user/repos`, {
//       name: repoName,
//       description,
//       private: false
//     });
//     return res.data;
//   }

import { getGhubApi, OWNER } from "../utils/ghub-helper";



/**
 * 获取当前账号下的仓库列表，支持名称模糊搜索
 * @param {string} [keyword] 仓库名关键字（可选）
 * @returns {Promise<any[]>}
 */
export const queryList = async (keyword: string = "") => {
    const api = await getGhubApi();
    // 获取所有仓库（默认最多100个，如需更多可做分页）
    const res = await api.get("/user/repos?per_page=100");
    let repos = res.data;
    if (keyword) {
        const lower = keyword.toLowerCase();
        repos = repos.filter((repo: any) => repo.name.toLowerCase().includes(lower));
    }
    repos.forEach((repo: any) => {
        repo.type = 'repo';
        repo.path = '/'+ repo.name;
    });
    return repos;
}


export const queryOne = async (repoName: string) => {


    const api = await getGhubApi();
    const url = `/repos/${OWNER}/${repoName}/contents`;
    console.log('queryOne执行了', url);
    try {
        const res = await api.get(url);
        return res;
    } catch (e: any) {
        if (e.response && e.response.status === 404 && e.response.data?.message === "This repository is empty.") {
            // 返回空数组或自定义提示
            return { files: [], empty: true };
        }
        throw e;

    }


    // console.log( res);


    // // 过滤出目录类型的项目
    // const directories = res.data
    //   .filter(item => item.type === 'dir')
    //   .map(item => ({
    //     name: item.name,
    //     path: item.path,
    //     url: item.url
    //   }));

    // return res;
}


