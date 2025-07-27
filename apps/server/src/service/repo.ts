

import fs from "fs";
import { Buffer } from "buffer";
import { BRANCH, getGhubApi, OWNER } from "../utils/ghub-helper";


/**
 * 创建 GitHub 仓库
 * @param {string} repoName 仓库名
 * @param {string} [description] 描述
 * @param {boolean} [isPrivate] 是否私有
 * @returns {Promise<any>}
 */
export async function createGithubRepo(repoName: string, description: string = "") {
    const api = await getGhubApi();
    const res = await api.post(`/user/repos`, {
      name: repoName,
      description,
      private: false
    });
    return res.data;
  }

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


export const queryOne = async (repo: string, path: string) => {
  const api = await getGhubApi();
  const url = `/repos/${OWNER}/${repo}/contents/${path}`;
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

export const upload = async (file: any, pathTemp: string, repo: string) => {

  const { newFilename, filepath } = file;
  const api = await getGhubApi();
  const path = pathTemp ? pathTemp + '/':pathTemp;

  // 读取文件并转 base64
  const fileBuffer = fs.readFileSync(filepath);
  const base64Content = fileBuffer.toString("base64");
  const url = `/repos/${OWNER}/${repo}/contents/${path}${newFilename}`;
  console.info('上传的地址', pathTemp, path, url);
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
export const create = async (
  path, repo
) => {
  const api = await getGhubApi();

  // 确保路径以 .gitkeep 结尾
  const filePath = path + "/.gitkeep";
  const content = ""; // 空内容
  const base64Content = Buffer.from(content, 'utf-8').toString('base64');

  const url = `/repos/${OWNER}/${repo}/contents/${filePath}`;
  const params = {
    message: `Create folder: ${path}`,
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


/**
 * 删除 GitHub 仓库中的文件或文件夹
 * @param {string} repoName 仓库名
 * @param {string} filePath 文件路径
 * @returns {Promise<any>}
 */
export const remove = async (
  repoName: string,
  filePath: string,
) => {
  const api = await getGhubApi();

  // 如果 filePath 为空或者是根路径，则删除整个仓库
  if (!filePath || filePath === '/' || filePath === '') {
    try {
      const url = `/repos/${OWNER}/${repoName}`;
      await api.delete(url);
      return { message: `Successfully deleted repository ${repoName}` };
    } catch (error: any) {
      console.error("删除仓库失败:", error.response?.data || error.message);
      throw new Error(`删除仓库失败: ${error.response?.data?.message || error.message}`);
    }
  }

  try {
    // 先获取路径信息
    const getUrl = `/repos/${OWNER}/${repoName}/contents/${filePath}`;
    const getRes = await api.get(getUrl);
    
    // 如果是文件夹（数组），递归删除所有文件
    if (Array.isArray(getRes.data)) {
      const deletePromises = getRes.data.map(async (item: any) => {
        if (item.type === 'file') {
          const params = {
            message: `Delete file ${item.path}`,
            sha: item.sha,
            branch: BRANCH,
          };
          return api.delete(`/repos/${OWNER}/${repoName}/contents/${item.path}`, { data: params });
        } else if (item.type === 'dir') {
          // 递归删除子文件夹
          return remove(repoName, item.path);
        }
      });
      
      await Promise.all(deletePromises);
      return { message: `Successfully deleted folder ${filePath}` };
    } else {
      // 删除单个文件
      const sha = getRes.data.sha;
      const params = {
        message: `Delete file ${filePath}`,
        sha: sha,
        branch: BRANCH,
      };
      const res = await api.delete(getUrl, { data: params });
      return res.data;
    }
  } catch (error: any) {
    if (error.response && error.response.status === 404 && error.response.data?.message === "This repository is empty.") {
      return { message: "Repository is empty, nothing to delete" };
    }
    console.error("删除失败:", error.response?.data || error.message);
    throw new Error(`删除失败: ${error.response?.data?.message || error.message}`);
  }
};




// ---==以下暂时未用到===-----


/**
 * 删除 GitHub 仓库中的文件或文件夹（使用 Git Tree API）
 */
export const remove1 = async (
  repoName: string,
  filePath: string,
) => {
  const api = await getGhubApi();
  
  console.log('删除参数:', { repoName, filePath });

  try {
    // 获取当前分支的最新 commit
    const { data: refData } = await api.get(`/repos/${OWNER}/${repoName}/git/refs/heads/${BRANCH}`);
    const latestCommitSha = refData.object.sha;
    console.log('最新commit SHA:', latestCommitSha);

    // 获取当前 commit 的 tree
    const { data: commitData } = await api.get(`/repos/${OWNER}/${repoName}/git/commits/${latestCommitSha}`);
    const treeSha = commitData.tree.sha;

    // 获取完整的 tree 结构
    const { data: treeData } = await api.get(`/repos/${OWNER}/${repoName}/git/trees/${treeSha}?recursive=1`);
    console.log('要删除的路径:', filePath);
    
    // 过滤掉要删除的文件/文件夹
    const newTree = treeData.tree.filter((item: any) => {
      const shouldKeep = !item.path.startsWith(filePath);
      return shouldKeep;
    });
    
    console.log('过滤后剩余文件数:', newTree.length);

    // 创建新的 tree
    console.log('开始创建新的 tree...');
    const { data: newTreeData } = await api.post(`/repos/${OWNER}/${repoName}/git/trees`, {
      tree: newTree
    });
    console.log('新 tree SHA:', newTreeData.sha);

    // 创建新的 commit
    console.log('开始创建新的 commit...');
    const { data: newCommit } = await api.post(`/repos/${OWNER}/${repoName}/git/commits`, {
      message: `Delete ${filePath}`,
      tree: newTreeData.sha,
      parents: [latestCommitSha]
    });
    console.log('新 commit SHA:', newCommit.sha);

    // 更新分支引用
    console.log('开始更新分支引用...');
    await api.patch(`/repos/${OWNER}/${repoName}/git/refs/heads/${BRANCH}`, {
      sha: newCommit.sha
    });
    console.log('分支引用更新成功');

    return { message: `Successfully deleted ${filePath}` };
  } catch (error: any) {
    console.error("删除失败:", error.response?.data || error.message);
    throw new Error(`删除失败: ${error.response?.data?.message || error.message}`);
  }
};


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
export const create1 = async (
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
 * 删除整个 GitHub 仓库
 * @param {string} repoName 仓库名
 * @returns {Promise<any>}
 */
export const deleteRepo = async (repoName: string) => {
  const api = await getGhubApi();
  
  try {
    const url = `/repos/${OWNER}/${repoName}`;
    const res = await api.delete(url);
    return { message: `Successfully deleted repository ${repoName}` };
  } catch (error: any) {
    console.error("删除仓库失败:", error.response?.data || error.message);
    throw new Error(`删除仓库失败: ${error.response?.data?.message || error.message}`);
  }
};

// // 获取目录树结构（只获取目录，不获取文件）
// export const getDirectoryTree = async (directory = '', level = 0) => {
//   try {
//     // 防止递归过深
//     if (level > 10) return [];
    
//     const url = directory 
//       ? `https://api.github.com/repos/${OWNER}/${REPO}/contents/${directory}`
//       : `https://api.github.com/repos/${OWNER}/${REPO}/contents`;
    
//     const res = await axios.get(url, {
//       headers: {
//         Authorization: `token ${GITHUB_TOKEN}`,
//         Accept: "application/vnd.github+json",
//         "User-Agent": "Node.js"
//       },
//     });

//     // 只处理目录类型的项目
//     const directories = res.data.filter(item => item.type === 'dir');
    
//     const dirTree = await Promise.all(directories.map(async item => {
//       const children = await getDirectoryTree(item.path, level + 1);
//       return {
//         name: item.name,
//         path: item.path,
//         children: children
//       };
//     }));

//     return dirTree;
//   } catch (error) {
//     console.error("获取目录树失败:", error.response?.data || error.message);
//     return [];
//   }
// };
