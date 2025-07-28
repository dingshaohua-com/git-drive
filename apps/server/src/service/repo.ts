import fs from 'fs';
import { Buffer } from 'buffer';
import { toProxyUrl } from '../utils/proxy-ghub';
import { BRANCH, getGhubApi, OWNER } from '../utils/ghub-helper';

/**
 * 创建 GitHub 仓库
 * @param {string} repoName 仓库名
 * @param {string} [description] 描述
 * @param {boolean} [isPrivate] 是否私有
 * @returns {Promise<any>}
 */
export async function createGithubRepo(repoName: string, description: string = '') {
  const api = await getGhubApi();
  const res = await api.post(`/user/repos`, {
    name: repoName,
    description,
    private: false,
  });
  return res.data;
}

/**
 * 获取当前账号下的仓库列表，支持名称模糊搜索
 * @param {string} [keyword] 仓库名关键字（可选）
 * @returns {Promise<any[]>}
 */
export const queryList = async (keyword: string = '') => {
  const api = await getGhubApi();
  // 获取所有仓库（默认最多100个，如需更多可做分页）
  const res = await api.get('/user/repos?per_page=100');
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
};

export const queryOne = async (repo: string, path: string) => {
  const api = await getGhubApi();
  const url = `/repos/${OWNER}/${repo}/contents/${path}`;
  try {
    const res = await api.get(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'Node.js',
      },
    });

    res.data.forEach((item: any) => {
      delete item._links;
      item.down_url = toProxyUrl(item.download_url);
    });

    return res.data;
  } catch (e: any) {
    if (e.response && e.response.status === 404 && e.response.data?.message === 'This repository is empty.') {
      // 返回空数组或自定义提示
      return [];
    }
    throw e;
  }
};

export const uploadFile = async (file: any, pathTemp: string, repo: string) => {
  const { newFilename, filepath } = file;
  const api = await getGhubApi();
  const path = pathTemp ? pathTemp + '/' : pathTemp;

  // 读取文件并转 base64
  const fileBuffer = fs.readFileSync(filepath);
  const base64Content = fileBuffer.toString('base64');
  const url = `/repos/${OWNER}/${repo}/contents/${path}${newFilename}`;
  console.info('上传的地址', pathTemp, path, url);
  const params = {
    message: `upload file ${newFilename}`,
    content: base64Content,
    branch: 'main',
  };

  try {
    const res = await api.put(url, params);
    return res.data;
  } catch (error: any) {
    console.error('GitHub upload error:', error.response?.data || error.message);
    throw new Error(`上传失败: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * 在 GitHub 仓库中创建文件夹（通过创建 .gitkeep 文件实现）
 * @param {string} path 文件夹路径：/仓库名/xxx/xxx
 * @returns {Promise<any>}
 */
export const addFolder = async (path, repo) => {
  const api = await getGhubApi();

  // 确保路径以 .gitkeep 结尾
  const filePath = path + '/.gitkeep';
  const content = ''; // 空内容
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
    console.error('GitHub create folder error:', error.response?.data || error.message);
    throw new Error(`创建文件夹失败: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * 删除 GitHub 仓库中的文件或文件夹
 * @param {string} repoName 仓库名
 * @param {string} filePath 文件路径
 * @returns {Promise<any>}
 */
export const remove = async (repoName: string, filePath: string) => {
  const api = await getGhubApi();

  // 如果 filePath 为空或者是根路径，则删除整个仓库
  if (!filePath || filePath === '/' || filePath === '') {
    try {
      const url = `/repos/${OWNER}/${repoName}`;
      await api.delete(url);
      return { message: `Successfully deleted repository ${repoName}` };
    } catch (error: any) {
      console.error('删除仓库失败:', error.response?.data || error.message);
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
    if (error.response && error.response.status === 404 && error.response.data?.message === 'This repository is empty.') {
      return { message: 'Repository is empty, nothing to delete' };
    }
    console.error('删除失败:', error.response?.data || error.message);
    throw new Error(`删除失败: ${error.response?.data?.message || error.message}`);
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
    console.error('删除仓库失败:', error.response?.data || error.message);
    throw new Error(`删除仓库失败: ${error.response?.data?.message || error.message}`);
  }
};