import path from "path";
import fs from "fs";
import axios from "axios";

// 配置
const GITHUB_TOKEN = "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";
const OWNER = "dingshaohua-com";
const REPO = "img-host";
const BRANCH = "main";


// 配置 Axios 实例用于 GitHub API
const getGithubApi = (GIT_TOKEN)=>{
  return axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      'Authorization': `token ${GIT_TOKEN}`,
      'User-Agent': 'Koa-GitHub-API-Client'
    }
  });
}


// 获取用户信息
export async function getGithubUserInfo(token) {
  const githubApi = getGithubApi(token);
  const res = await githubApi.get('/user');
  console.log(token, res,1111);
  
  return res.data;

  
  // const res = await fetch('https://api.github.com/user', {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     'User-Agent': 'git-drive-app'
  //   }
  // });
  // if (!res.ok) throw new Error('Failed to fetch user info');
  // return res.json();
}

// 获取用户仓库列表
export async function getGithubRepos(token) {
  const res = await fetch('https://api.github.com/user/repos?per_page=100', {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'git-drive-app'
    }
  });
  if (!res.ok) throw new Error('Failed to fetch repos');
  return res.json();
}

export const getRepDir = async () => {
  try {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;
    
    const res = await axios.get(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "Node.js"
      },
    });

    // 过滤出目录类型的项目
    const directories = res.data
      .filter(item => item.type === 'dir')
      .map(item => ({
        name: item.name,
        path: item.path,
        url: item.url
      }));

    return directories;
  } catch (error) {
    console.error("获取目录失败:", error.response?.data || error.message);
    throw new Error(`获取目录失败: ${error.response?.data?.message || error.message}`);
  }
};

export const upload = async (file, directory = '') => {
  const { newFilename, filepath } = file;

  try {
    // 读取文件并转换为 base64
    const fileBuffer = fs.readFileSync(filepath);
    const base64Content = fileBuffer.toString("base64");

    // 在仓库中的文件路径，包含目录
    const filePathInRepo = directory ? `${directory}/${newFilename}` : newFilename;

    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePathInRepo}`;
    const params = {
      message: `upload file ${newFilename}`,
      content: base64Content,
      branch: BRANCH,
    };

    console.log(111, directory, filePathInRepo, url);

    const res = await axios.put(url, params, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "Node.js"
      },
    });

    return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${filePathInRepo}`;
  } catch (error) {
    console.error("GitHub upload error:", error.response?.data || error.message);
    throw new Error(`上传失败: ${error.response?.data?.message || error.message}`);
  }
};

export const getDirectoryFiles = async (directory: string, showFiles = true, recursive = true) => {
  try {
    // 如果是根目录，直接获取仓库根目录内容
    const url = directory 
      ? `https://api.github.com/repos/${OWNER}/${REPO}/contents/${directory}`
      : `https://api.github.com/repos/${OWNER}/${REPO}/contents`;
    
    const res = await axios.get(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "Node.js"
      },
    });

    // 处理返回的数据
    const items = await Promise.all(res.data.map(async item => {
      const baseItem = {
        name: item.name,
        path: item.path,
        type: item.type,
        size: item.size || 0,
        download_url: item.download_url || null,
        html_url: item.html_url || null
      };

      // 如果是目录且需要递归获取
      if (item.type === 'dir' && recursive) {
        const children = await getDirectoryFiles(item.path, showFiles, recursive);
        return {
          ...baseItem,
          children
        };
      }
      
      // 如果是文件且需要显示文件
      if (item.type === 'file' && showFiles) {
        return baseItem;
      }
      
      // 如果是文件但不需要显示文件
      if (item.type === 'file' && !showFiles) {
        return null;
      }
      
      return baseItem;
    }));

    // 过滤掉空项
    return items.filter(item => item !== null);
  } catch (error) {
    console.error("获取文件失败:", error.response?.data || error.message);
    throw new Error(`获取文件失败: ${error.response?.data?.message || error.message}`);
  }
};

export const deleteFile = async (filePath: string) => {
  try {
    // 先获取文件信息以获取 sha
    const getUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`;
    const getRes = await axios.get(getUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "Node.js"
      },
    });

    const sha = getRes.data.sha;

    // 删除文件
    const deleteUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`;
    const deleteRes = await axios.delete(deleteUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "Node.js"
      },
      data: {
        message: `delete file ${filePath}`,
        sha: sha,
        branch: BRANCH
      }
    });

    return true;
  } catch (error) {
    console.error("删除文件失败:", error.response?.data || error.message);
    throw new Error(`删除失败: ${error.response?.data?.message || error.message}`);
  }
};

// 获取目录树结构（只获取目录，不获取文件）
export const getDirectoryTree = async (directory = '', level = 0) => {
  try {
    // 防止递归过深
    if (level > 10) return [];
    
    const url = directory 
      ? `https://api.github.com/repos/${OWNER}/${REPO}/contents/${directory}`
      : `https://api.github.com/repos/${OWNER}/${REPO}/contents`;
    
    const res = await axios.get(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "Node.js"
      },
    });

    // 只处理目录类型的项目
    const directories = res.data.filter(item => item.type === 'dir');
    
    const dirTree = await Promise.all(directories.map(async item => {
      const children = await getDirectoryTree(item.path, level + 1);
      return {
        name: item.name,
        path: item.path,
        children: children
      };
    }));

    return dirTree;
  } catch (error) {
    console.error("获取目录树失败:", error.response?.data || error.message);
    return [];
  }
};
