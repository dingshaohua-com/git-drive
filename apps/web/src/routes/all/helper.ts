import type { RepoOrDirOrFile } from "$lib/api/model";


export const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export const getFileIcon = (item: RepoOrDirOrFile) => {
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
 * 解析自定义 URL，提取 repoName 和 path
 * @param {string} url 自定义文件/目录 URL，格式：https://file.dingshaohua.com/${repoName}/${path}
 * @returns {{repoName: string, path: string, isRoot: boolean}}
 */
export const parseCustomUrl = (url: string) => {
  // 去掉 hash、query
  const clean = url.split(/[?#]/)[0];

  // 检查是否为根目录（只有域名，没有 repoName）
  const rootMatch = clean.match(/^https:\/\/file\.dingshaohua\.com\/?$/i);
  if (rootMatch) {
    return { repo: '', path: '', isRoot: true };
  }

  // 匹配格式：https://file.dingshaohua.com/REPO_NAME[/PATH]
  const match = clean.match(/^https:\/\/file\.dingshaohua\.com\/([^/]+)(?:\/(.*))?$/i);
  if (!match) {
    return { repo: '', path: '', isRoot: false };
  }

  const [, repo, path = ''] = match;

  return {
    repo,
    path,
    isRoot: false
  };
}

// /* ===== 使用示例 ===== */
// const url1 = 'https://file.dingshaohua.com/my-repo/folder/file.txt';
// const url2 = 'https://file.dingshaohua.com/my-repo';
// console.log(parseCustomUrl(url1));
// // => { repoName: 'my-repo', path: 'folder/file.txt', isRoot: false }

// console.log(parseCustomUrl(url2));
// // => { repoName: 'my-repo', path: '', isRoot: false }

/**
 * 拼接自定义 URL
 * @param {Object} params - URL参数
 * @param {string} params.repoName - 仓库名（必填）
 * @param {string} [params.path=''] - 文件/目录路径
 * @returns {string} 自定义 URL
 */
export const buildCustomUrl = ({
  repoName,
  path = ''
}: {
  repoName: string;
  path?: string;
}) => {
  if (!repoName) return '';

  let url = `https://file.dingshaohua.com/${repoName}`;

  if (path) {
    url += `/${path}`;
  }

  console.log(11111, path);
  

  return url;
}

// /* ===== 使用示例 ===== */
// const url1 = buildCustomUrl({ repoName: 'my-repo', path: 'folder/file.txt' });
// const url2 = buildCustomUrl({ repoName: 'my-repo' });
// console.log(url1);
// // => https://file.dingshaohua.com/my-repo/folder/file.txt
// console.log(url2);
// // => https://file.dingshaohua.com/my-repo

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
 * 获取上一级自定义 URL
 * @param {string} currentUrl - 当前自定义 URL
 * @returns {string} 上一级自定义 URL
 */
export const getParentCustomUrl = (currentUrl: string) => {
  const { repo, path } = parseCustomUrl(currentUrl);

  // 如果没有路径，说明在仓库根目录，返回根目录
  if (!path) return `https://file.dingshaohua.com`;

  const parentPath = getParentPath(path);

  return `https://file.dingshaohua.com/${repo}${parentPath ? '/' + parentPath : ''}`;
}

// /* ===== 使用示例 ===== */
// const url1 = 'https://file.dingshaohua.com/my-repo/folder/file.txt';
// const url2 = 'https://file.dingshaohua.com/my-repo/folder/subfolder';
// console.log(getParentCustomUrl(url1));
// // => https://file.dingshaohua.com/my-repo/folder
// console.log(getParentCustomUrl(url2));
// // => https://file.dingshaohua.com/my-repo/folder

/**
 * 去掉仓库名中的用户名前缀，仅用于显示
 * @param {string} repoName 完整仓库名（包含用户名前缀）
 * @returns {string} 去掉用户名前缀的仓库名
 */
export const getDisplayRepoName = (repoName: string) => {
   console.log(1111, repoName)
  if (!repoName) return '';
  const firstDashIndex = repoName.indexOf('-');
  console.log(22222, repoName)
  return firstDashIndex > 0 ? repoName.substring(firstDashIndex + 1) : repoName;
}

