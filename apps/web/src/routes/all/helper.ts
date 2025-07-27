

export const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export const getFileIcon = (item: any) => {
    if (item.type === 'repo') {
        return 'ri-hard-drive-3-line text-2xl text-gray-400';
    }
    if (item.type === 'dir') {
        return 'ri-folder-fill text-2xl text-yellow-500';
    }
    if (item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return 'ri-image-fill text-2xl text-green-500';
    }
    return 'ri-file-fill text-2xl text-gray-400';
}

export const getBreadcrumbs = (currentPath: string) => {
    if (!currentPath) return [{ name: '根目录', path: '' }];
    const parts = currentPath.split('/').filter((p: string) => p);
    const breadcrumbs = [{ name: '根目录', path: '' }];
    if (parts.length > 0) {
      // 仓库名
      breadcrumbs.push({ name: parts[0], path: parts[0] });
      let currentBreadcrumbPath = parts[0];
      for (let i = 1; i < parts.length; i++) {
        currentBreadcrumbPath += '/' + parts[i];
        breadcrumbs.push({ name: parts[i], path: currentBreadcrumbPath });
      }
    }
    return breadcrumbs;
  }


  /**
 * 解析 GitHub URL，提取 repo / branch / path
 * @param {string} url GitHub 文件/目录 URL
 * @returns {{owner:string, repo:string, branch:string, path:string}}
 */
export const parseGitHubUrl = (url: string) => {
  // 去掉 hash、query
  const clean = url.split(/[?#]/)[0];

  // 先检查是否为根目录（只有 owner，没有 repo）
  const rootMatch = clean.match(/^https:\/\/github\.com\/([^/]+)\/?$/i);
  if (rootMatch) {
    return { owner: rootMatch[1], repo: '', branch: '', path: '', isRoot: true };
  }

  // 基础匹配：https://github.com/OWNER/REPO
  const baseMatch = clean.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)/i);
  if (!baseMatch) {
    return { owner: '', repo: '', branch: '', path: '', isRoot: false };
  }

  const [, owner, repo] = baseMatch;
  
  // 完整匹配：https://github.com/OWNER/REPO/(blob|tree)/BRANCH[/PATH]
  const fullMatch = clean.match(
    /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/(?:blob|tree)\/([^/]+)(?:\/(.*))?$/i
  );
  
  if (fullMatch) {
    const [, , , branch, path = ''] = fullMatch;
    return { owner, repo, branch, path, isRoot: false };
  }
  
  // 只有基础信息
  return { owner, repo, branch: '', path: '', isRoot: false };
}

// /* ===== 使用示例 ===== */
// const url1 = 'https://github.com/ghub-drive/one/blob/main/cc.gitkeep';
// const url2 = 'https://github.com/microsoft/vscode/tree/main/src/vs/editor';
// console.log(parseGitHubUrl(url1));
// // => { owner: 'ghub-drive', repo: 'one', branch: 'main', path: 'cc.gitkeep' }

// console.log(parseGitHubUrl(url2));
// // => { owner: 'microsoft', repo: 'vscode', branch: 'main', path: 'src/vs/editor' }

/**
 * 拼接 GitHub URL
 * @param {Object} params - URL参数
 * @param {string} params.repo - 仓库名（必填）
 * @param {string} [params.owner='ghub-drive'] - 用户名，默认 ghub-drive
 * @param {string} [params.branch='main'] - 分支名，默认 main
 * @param {string} [params.path=''] - 文件/目录路径
 * @param {'blob'|'tree'} [params.type='blob'] - 类型，默认 blob
 * @returns {string} GitHub URL
 */
export const buildGitHubUrl = ({
  repo,
  owner = 'ghub-drive',
  branch = 'main',
  path = '',
  type = 'blob'
}: {
  repo: string;
  owner?: string;
  branch?: string;
  path?: string;
  type?: 'blob' | 'tree';
}) => {
  if (!repo) return '';
  
  let url = `https://github.com/${owner}/${repo}`;
  
  if (branch) {
    url += `/${type}/${branch}`;
    if (path) {
      url += `/${path}`;
    }
  }
  
  return url;
}

// /* ===== 使用示例 ===== */
// const url1 = buildGitHubUrl({ repo: 'one', path: 'cc.gitkeep' });
// const url2 = buildGitHubUrl({ repo: 'vscode', path: 'src/vs/editor', type: 'tree' });
// console.log(url1);
// // => https://github.com/ghub-drive/one/blob/main/cc.gitkeep
// console.log(url2);
// // => https://github.com/ghub-drive/vscode/tree/main/src/vs/editor

/**
 * 获取上一级路径
 * @param {string} currentPath - 当前路径
 * @returns {string} 上一级路径
 */
export const getParentPath = (currentPath: string) => {
  if (!currentPath) return '';
  const parts = currentPath.split('/').filter((p: string) => p);
  parts.pop();
  return parts.join('/');
}

/**
 * 获取上一级 GitHub URL
 * @param {string} currentUrl - 当前 GitHub URL
 * @returns {string} 上一级 GitHub URL
 */
export const getParentGitHubUrl = (currentUrl: string) => {
  const { owner, repo, branch, path } = parseGitHubUrl(currentUrl);
  
  // 如果没有路径，说明在仓库根目录，返回用户主页
  if (!path) return `https://github.com/${owner}`;
  
  const parentPath = getParentPath(path);
  const type = parentPath ? 'tree' : 'blob';
  
  return buildGitHubUrl({ repo, owner, branch, path: parentPath, type });
}

// /* ===== 使用示例 ===== */
// const url1 = 'https://github.com/ghub-drive/one/blob/main/cc.gitkeep';
// const url2 = 'https://github.com/microsoft/vscode/tree/main/src/vs/editor';
// console.log(getParentGitHubUrl(url1));
// // => https://github.com/ghub-drive/one/blob/main/
// console.log(getParentGitHubUrl(url2));
// // => https://github.com/microsoft/vscode/tree/main/src/vs/

