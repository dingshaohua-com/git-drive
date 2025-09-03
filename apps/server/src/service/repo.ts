import * as fs from 'fs';
import { File } from 'tsoa';
import { Buffer } from 'buffer';
import reqCtx from '@/middleware/req-ctx';
import { getOctokit } from '@/utils/ghub-helper';
import type { RepoOrDirOrFile } from '../types/repo.dto';
import { sys_conf as SysConf, user as User } from '@prisma/client';
import { BRANCH, filterPrefix, getGhubApi } from '@/utils/ghub-helper';
import { parse‌Url } from '@/utils/ghub-helper';


/**
 * 根据路径获取当前下的资源列表
 * @param {string} path 路径
 * @returns {Promise<any>}
 */
export const getInfo = async (pathParam: string) => {
  const octokit = getOctokit();
  const sysConf = reqCtx.get<SysConf>('sysConf');

  let result;
  if (pathParam === '/') {
    let { data: listForUser } = await octokit.rest.repos.listForUser({
      username: sysConf.git_uname,
    });
    // 过滤当前用户的仓库
    listForUser = filterPrefix({ list: listForUser });
    // 组装vo数据
    result = listForUser.map((repo: any) => ({
      type: 'repo',
      name: repo.name,
      url: `${sysConf.git_url}/${repo.name}`,
    }));
  } else {
    try {
      const { path, repo } = parse‌Url(pathParam);
      const { data } = await octokit.rest.repos.getContent({
        owner:sysConf.git_uname,
        repo,
        path,
      });

      // 处理下数据
      result = data.map((item: any) => ({
        type: item.type,
        name: item.name,
        size: item.size,
        url: `${sysConf.git_url}/${repo}/${item.path}`,
      }));
    } catch (e) {
      if (e.response && e.response.status === 404 && e.response.data?.message === 'This repository is empty.') {
        result = [];
      }
    }
  }

  return result;
};

/**
 * 创建 GitHub 仓库
 * @param {string} repoName 仓库名
 * @param {string} [description] 描述
 * @param {boolean} [isPrivate] 是否私有
 * @returns {Promise<any>}
 */
export const createGithubRepo = async (repoName: string) => {
  const octokit = getOctokit();
  const user = reqCtx.get<User>('user');
  const result = await octokit.rest.repos.createForAuthenticatedUser({
    name: user.username + '/' + repoName,
  });
  return result.data;
};



export const uploadFile = async (file: File, pathTemp: string, repo: string) => {
  const sysConf = reqCtx.get<SysConf>('sysConf');
  const { filename: newFilename, path: filepath } = file;
  const api = await getGhubApi();
  const path = pathTemp ? pathTemp + '/' : pathTemp;

  // 读取文件并转 base64
  const fileBuffer = fs.readFileSync(filepath);
  const base64Content = fileBuffer.toString('base64');
  const url = `/repos/${sysConf.git_uname}/${repo}/contents/${path}${newFilename}`;
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
export const addFolder = async (pathParam: string, name: string) => {
  const sysConf = reqCtx.get<SysConf>('sysConf');
  const { path, repo } = parse‌Url(pathParam);
  const octokit = getOctokit();
  const filePath = `${path}/${name}/.gitkeep`.replace(/^\/+/, ''); // 移除开头的 /;
  console.log('创建文件夹', filePath);
  
  const base64Content = Buffer.from('', 'utf-8').toString('base64');

  const { data } = await octokit.rest.repos.createOrUpdateFileContents({
    owner:sysConf.git_uname,
    repo,
    path: filePath,
    message: `Create folder: ${path}`,
    content: base64Content,
  });

  return { success: true, path: filePath, data };
}
// export const addFolder = async (path, repo) => {
//   const api = await getGhubApi();

//   // 确保路径以 .gitkeep 结尾
//   const filePath = path + '/.gitkeep';
//   const content = ''; // 空内容
//   const base64Content = Buffer.from(content, 'utf-8').toString('base64');

//   const url = `/repos/${sysConf.git_uname}/${repo}/contents/${filePath}`;
//   const params = {
//     message: `Create folder: ${path}`,
//     content: base64Content,
//     branch: BRANCH,
//   };

//   try {
//     const res = await api.put(url, params);
//     return { success: true, path: filePath, data: res.data };
//   } catch (error: any) {
//     console.error('GitHub create folder error:', error.response?.data || error.message);
//     throw new Error(`创建文件夹失败: ${error.response?.data?.message || error.message}`);
//   }
// };

/**
 * 删除 GitHub 仓库中的文件或文件夹
 * @param {string} repoName 仓库名
 * @param {string} filePath 文件路径
 * @returns {Promise<any>}
 */
export const remove = async (repoName: string, filePath: string) => {
  const api = await getGhubApi();
   const sysConf = reqCtx.get<SysConf>('sysConf');

  // 如果 filePath 为空或者是根路径，则删除整个仓库
  if (!filePath || filePath === '/' || filePath === '') {
    try {
      const url = `/repos/${sysConf.git_uname}/${repoName}`;
      await api.delete(url);
      return { message: `Successfully deleted repository ${repoName}` };
    } catch (error: any) {
      console.error('删除仓库失败:', error.response?.data || error.message);
      throw new Error(`删除仓库失败: ${error.response?.data?.message || error.message}`);
    }
  }

  try {
    // 先获取路径信息
    const getUrl = `/repos/${sysConf.git_uname}/${repoName}/contents/${filePath}`;
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
          return api.delete(`/repos/${sysConf.git_uname}/${repoName}/contents/${item.path}`, { data: params });
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
   const sysConf = reqCtx.get<SysConf>('sysConf');

  try {
    const url = `/repos/${sysConf.git_uname}/${repoName}`;
    const res = await api.delete(url);
    return { message: `Successfully deleted repository ${repoName}` };
  } catch (error: any) {
    console.error('删除仓库失败:', error.response?.data || error.message);
    throw new Error(`删除仓库失败: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * 重命名 GitHub 仓库中的文件或文件夹
 */
export const rename = async (path: string, repo: string, newName: string, oldName: string) => {
  const api = await getGhubApi();
   const sysConf = reqCtx.get<SysConf>('sysConf');

  // 构建完整的原路径和新路径
  const oldPath = path ? `${path}/${oldName}` : oldName;
  const newPath = path ? `${path}/${newName}` : newName;

  try {
    // 获取原文件信息
    const getRes = await api.get(`/repos/${sysConf.git_uname}/${repo}/contents/${oldPath}`);

    if (Array.isArray(getRes.data)) {
      // 文件夹重命名：递归复制所有内容到新路径，然后删除旧文件夹
      const copyFolderContents = async (items: any[]) => {
        for (const item of items) {
          const itemNewPath = item.path.replace(oldPath, newPath);

          if (item.type === 'file') {
            // 获取文件内容并复制到新位置
            const fileRes = await api.get(`/repos/${sysConf.git_uname}/${repo}/contents/${item.path}`);
            await api.put(`/repos/${sysConf.git_uname}/${repo}/contents/${itemNewPath}`, {
              message: `重命名文件 ${item.path} 为 ${itemNewPath}`,
              content: fileRes.data.content,
              branch: BRANCH,
            });
          } else if (item.type === 'dir') {
            // 递归处理子文件夹
            const subRes = await api.get(`/repos/${sysConf.git_uname}/${repo}/contents/${item.path}`);
            await copyFolderContents(subRes.data);
          }
        }
      };

      await copyFolderContents(getRes.data);
      await remove(repo, oldPath);
      return { message: `文件夹 ${oldName} 重命名为 ${newName}` };
    } else {
      // 文件重命名：创建新文件，删除旧文件
      await api.put(`/repos/${sysConf.git_uname}/${repo}/contents/${newPath}`, {
        message: `重命名 ${oldName} 为 ${newName}`,
        content: getRes.data.content,
        branch: BRANCH,
      });

      await api.delete(`/repos/${sysConf.git_uname}/${repo}/contents/${oldPath}`, {
        data: {
          message: `删除旧文件 ${oldName}`,
          sha: getRes.data.sha,
          branch: BRANCH,
        },
      });

      return { message: `文件 ${oldName} 重命名为 ${newName}` };
    }
  } catch (error: any) {
    throw new Error(`重命名失败: ${error.response?.data?.message || error.message}`);
  }
};
