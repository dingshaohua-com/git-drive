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
import { BRANCH, getGhubApi, OWNER } from "../utils/ghub-helper";


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


/**
 * 在 GitHub 仓库中创建文件夹（通过创建 .gitkeep 文件实现）
 * @param {string} path 文件夹路径：/仓库名/xxx/xxx
 * @returns {Promise<any>}
 */
export const createFolder = async (
  path: string
) => {
  const api = await getGhubApi();
  const pathParts = path.split('/').filter((p: string) => p);
  const repoName = pathParts.at(0);
  const directory = pathParts.slice(1).join('/');

  // 确保路径以 .gitkeep 结尾
  const filePath = directory + ".gitkeep";
  const content = ""; // 空内容
  const base64Content = Buffer.from(content, 'utf-8').toString('base64');

  const url = `/repos/${OWNER}/${repoName}/contents/${filePath}`;
  const params = {
    message: `Create folder: ${directory}`,
    content: base64Content,
    branch: BRANCH,
  };

  try {
    const res = await api.put(url, params);
    return { success: true, path: filePath, data: res.data };
  } catch (error: any) {
    console.error("GitHub create folder error:", error.response?.data || error.message);
    throw new Error(`创建文件夹失败: ${error.response?.data?.message || error.message}`);
  }
};




// ---==以下暂时未用到===-----



/**
 * 在 GitHub 仓库中创建文件
 * @param {string} repoName 仓库名
 * @param {string} filePath 文件路径（包含文件名）
 * @param {string} content 文件内容
 * @param {string} [message] 提交信息
 * @param {string} [branch] 分支名，默认为 main
 * @returns {Promise<any>}
 */
export const createFile = async (
  repoName: string,
  filePath: string,
  content: string,
  message?: string,
  branch: string = "main"
) => {
  const api = await getGhubApi();

  // 将内容转换为 base64
  const base64Content = Buffer.from(content, 'utf-8').toString('base64');

  const url = `/repos/${OWNER}/${repoName}/contents/${filePath}`;
  const params = {
    message: message || `Create file ${filePath}`,
    content: base64Content,
    branch: branch,
  };

  try {
    const res = await api.put(url, params);
    return res.data;
  } catch (error: any) {
    console.error("GitHub create file error:", error.response?.data || error.message);
    throw new Error(`创建文件失败: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * 在 GitHub 仓库中创建文件夹（通过创建 .gitkeep 文件实现）
 * @param {string} repoName 仓库名
 * @param {string} folderPath 文件夹路径
 * @param {string} [branch] 分支名，默认为 main
 * @returns {Promise<any>}
 */
export const createFolder1 = async (
  repoName: string,
  folderPath: string,
  branch: string = "main"
) => {
  const api = await getGhubApi();

  // 确保路径以 .gitkeep 结尾
  const filePath = folderPath.endsWith("/") ? folderPath + ".gitkeep" : folderPath + "/.gitkeep";
  const content = ""; // 空内容
  const base64Content = Buffer.from(content, 'utf-8').toString('base64');

  const url = `/repos/${OWNER}/${repoName}/contents/${filePath}`;
  const params = {
    message: `Create folder: ${folderPath}`,
    content: base64Content,
    branch: branch,
  };

  try {
    const res = await api.put(url, params);
    return { success: true, path: filePath, data: res.data };
  } catch (error: any) {
    console.error("GitHub create folder error:", error.response?.data || error.message);
    throw new Error(`创建文件夹失败: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * 更新 GitHub 仓库中的文件
 * @param {string} repoName 仓库名
 * @param {string} filePath 文件路径
 * @param {string} content 新的文件内容
 * @param {string} [message] 提交信息
 * @param {string} [branch] 分支名，默认为 main
 * @returns {Promise<any>}
 */
export const updateFile = async (
  repoName: string,
  filePath: string,
  content: string,
  message?: string,
  branch: string = "main"
) => {
  const api = await getGhubApi();

  try {
    // 先获取文件信息以获取 sha
    const getUrl = `/repos/${OWNER}/${repoName}/contents/${filePath}`;
    const getRes = await api.get(getUrl);
    const sha = getRes.data.sha;

    // 将内容转换为 base64
    const base64Content = Buffer.from(content, 'utf-8').toString('base64');

    const params = {
      message: message || `Update file ${filePath}`,
      content: base64Content,
      sha: sha,
      branch: branch,
    };

    const res = await api.put(getUrl, params);
    return res.data;
  } catch (error: any) {
    console.error("GitHub update file error:", error.response?.data || error.message);
    throw new Error(`更新文件失败: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * 删除 GitHub 仓库中的文件
 * @param {string} repoName 仓库名
 * @param {string} filePath 文件路径
 * @param {string} [message] 提交信息
 * @param {string} [branch] 分支名，默认为 main
 * @returns {Promise<any>}
 */
export const deleteFile = async (
  repoName: string,
  filePath: string,
  message?: string,
  branch: string = "main"
) => {
  const api = await getGhubApi();

  try {
    // 先获取文件信息以获取 sha
    const getUrl = `/repos/${OWNER}/${repoName}/contents/${filePath}`;
    const getRes = await api.get(getUrl);
    const sha = getRes.data.sha;

    const params = {
      message: message || `Delete file ${filePath}`,
      sha: sha,
      branch: branch,
    };

    const res = await api.delete(getUrl, { data: params });
    return res.data;
  } catch (error: any) {
    console.error("GitHub delete file error:", error.response?.data || error.message);
    throw new Error(`删除文件失败: ${error.response?.data?.message || error.message}`);
  }
};
