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

import fs from "fs";
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
    repo.path = '/' + repo.name;
  });
  return repos;
}


export const queryOne = async (repoName: string) => {
  const api = await getGhubApi();
  const url = `/repos/${OWNER}/${repoName}/contents`;
  try {
    const res = await api.get(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "Node.js"
      },
    });

    res.data.forEach((item: any) => {
      delete item._links;
    });

    return res.data;
    // return res.data.map((item: any) => ({
    //   name: item.name,
    //   path: item.path,
    //   sha: item.sha,
    //   size: item.size,
    //   url: item.url,
    //   html_url: item.html_url,
    //   git_url: item.git_url,
    //   download_url: item.download_url,
    //   type: item.type
    // }));
  } catch (e: any) {
    if (e.response && e.response.status === 404 && e.response.data?.message === "This repository is empty.") {
      // 返回空数组或自定义提示
      return [];
    }
    throw e;
  }
}

export const upload = async (file: any, path: string) => {

  const pathParts = path.split('/').filter((p: string) => p);
  const repoName = pathParts.at(0);
  const directory = pathParts.slice(1).join('/');

  const { newFilename, filepath } = file;
  const api = await getGhubApi();

  // 读取文件并转 base64
  const fileBuffer = fs.readFileSync(filepath);
  const base64Content = fileBuffer.toString("base64");

  // 拼接目标路径
  const filePathInRepo = directory ? `${directory}/${newFilename}` : newFilename;

  const url = `/repos/${OWNER}/${repoName}/contents/${filePathInRepo}`;
  const params = {
    message: `upload file ${newFilename}`,
    content: base64Content,
    branch: "main",
  };

  try {
    const res = await api.put(url, params);
    return res.data;
  } catch (error: any) {
    console.error("GitHub upload error:", error.response?.data || error.message);
    throw new Error(`上传失败: ${error.response?.data?.message || error.message}`);
  }
};


