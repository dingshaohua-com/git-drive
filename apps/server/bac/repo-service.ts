// // ---==以下暂时未用到===-----

// /**
//  * 删除 GitHub 仓库中的文件或文件夹（使用 Git Tree API）
//  */
// export const remove1 = async (repoName: string, filePath: string) => {
//   const api = await getGhubApi();

//   console.log('删除参数:', { repoName, filePath });

//   try {
//     // 获取当前分支的最新 commit
//     const { data: refData } = await api.get(`/repos/${OWNER}/${repoName}/git/refs/heads/${BRANCH}`);
//     const latestCommitSha = refData.object.sha;
//     console.log('最新commit SHA:', latestCommitSha);

//     // 获取当前 commit 的 tree
//     const { data: commitData } = await api.get(`/repos/${OWNER}/${repoName}/git/commits/${latestCommitSha}`);
//     const treeSha = commitData.tree.sha;

//     // 获取完整的 tree 结构
//     const { data: treeData } = await api.get(`/repos/${OWNER}/${repoName}/git/trees/${treeSha}?recursive=1`);
//     console.log('要删除的路径:', filePath);

//     // 过滤掉要删除的文件/文件夹
//     const newTree = treeData.tree.filter((item: any) => {
//       const shouldKeep = !item.path.startsWith(filePath);
//       return shouldKeep;
//     });

//     console.log('过滤后剩余文件数:', newTree.length);

//     // 创建新的 tree
//     console.log('开始创建新的 tree...');
//     const { data: newTreeData } = await api.post(`/repos/${OWNER}/${repoName}/git/trees`, {
//       tree: newTree,
//     });
//     console.log('新 tree SHA:', newTreeData.sha);

//     // 创建新的 commit
//     console.log('开始创建新的 commit...');
//     const { data: newCommit } = await api.post(`/repos/${OWNER}/${repoName}/git/commits`, {
//       message: `Delete ${filePath}`,
//       tree: newTreeData.sha,
//       parents: [latestCommitSha],
//     });
//     console.log('新 commit SHA:', newCommit.sha);

//     // 更新分支引用
//     console.log('开始更新分支引用...');
//     await api.patch(`/repos/${OWNER}/${repoName}/git/refs/heads/${BRANCH}`, {
//       sha: newCommit.sha,
//     });
//     console.log('分支引用更新成功');

//     return { message: `Successfully deleted ${filePath}` };
//   } catch (error: any) {
//     console.error('删除失败:', error.response?.data || error.message);
//     throw new Error(`删除失败: ${error.response?.data?.message || error.message}`);
//   }
// };

// /**
//  * 在 GitHub 仓库中创建文件
//  * @param {string} repoName 仓库名
//  * @param {string} filePath 文件路径（包含文件名）
//  * @param {string} content 文件内容
//  * @param {string} [message] 提交信息
//  * @param {string} [branch] 分支名，默认为 main
//  * @returns {Promise<any>}
//  */
// export const createFile = async (repoName: string, filePath: string, content: string, message?: string, branch: string = 'main') => {
//   const api = await getGhubApi();

//   // 将内容转换为 base64
//   const base64Content = Buffer.from(content, 'utf-8').toString('base64');

//   const url = `/repos/${OWNER}/${repoName}/contents/${filePath}`;
//   const params = {
//     message: message || `Create file ${filePath}`,
//     content: base64Content,
//     branch: branch,
//   };

//   try {
//     const res = await api.put(url, params);
//     return res.data;
//   } catch (error: any) {
//     console.error('GitHub create file error:', error.response?.data || error.message);
//     throw new Error(`创建文件失败: ${error.response?.data?.message || error.message}`);
//   }
// };

// /**
//  * 在 GitHub 仓库中创建文件夹（通过创建 .gitkeep 文件实现）
//  * @param {string} repoName 仓库名
//  * @param {string} folderPath 文件夹路径
//  * @param {string} [branch] 分支名，默认为 main
//  * @returns {Promise<any>}
//  */
// export const create1 = async (repoName: string, folderPath: string, branch: string = 'main') => {
//   const api = await getGhubApi();

//   // 确保路径以 .gitkeep 结尾
//   const filePath = folderPath.endsWith('/') ? folderPath + '.gitkeep' : folderPath + '/.gitkeep';
//   const content = ''; // 空内容
//   const base64Content = Buffer.from(content, 'utf-8').toString('base64');

//   const url = `/repos/${OWNER}/${repoName}/contents/${filePath}`;
//   const params = {
//     message: `Create folder: ${folderPath}`,
//     content: base64Content,
//     branch: branch,
//   };

//   try {
//     const res = await api.put(url, params);
//     return { success: true, path: filePath, data: res.data };
//   } catch (error: any) {
//     console.error('GitHub create folder error:', error.response?.data || error.message);
//     throw new Error(`创建文件夹失败: ${error.response?.data?.message || error.message}`);
//   }
// };

// // // 获取目录树结构（只获取目录，不获取文件）
// // export const getDirectoryTree = async (directory = '', level = 0) => {
// //   try {
// //     // 防止递归过深
// //     if (level > 10) return [];

// //     const url = directory
// //       ? `https://api.github.com/repos/${OWNER}/${REPO}/contents/${directory}`
// //       : `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

// //     const res = await axios.get(url, {
// //       headers: {
// //         Authorization: `token ${GITHUB_TOKEN}`,
// //         Accept: "application/vnd.github+json",
// //         "User-Agent": "Node.js"
// //       },
// //     });

// //     // 只处理目录类型的项目
// //     const directories = res.data.filter(item => item.type === 'dir');

// //     const dirTree = await Promise.all(directories.map(async item => {
// //       const children = await getDirectoryTree(item.path, level + 1);
// //       return {
// //         name: item.name,
// //         path: item.path,
// //         children: children
// //       };
// //     }));

// //     return dirTree;
// //   } catch (error) {
// //     console.error("获取目录树失败:", error.response?.data || error.message);
// //     return [];
// //   }
// // };
// /**
//  * 更新 GitHub 仓库中的文件
//  * @param {string} repoName 仓库名
//  * @param {string} filePath 文件路径
//  * @param {string} content 新的文件内容
//  * @param {string} [message] 提交信息
//  * @param {string} [branch] 分支名，默认为 main
//  * @returns {Promise<any>}
//  */
// export const updateFile = async (repoName: string, filePath: string, content: string, message?: string, branch: string = 'main') => {
//   const api = await getGhubApi();

//   try {
//     // 先获取文件信息以获取 sha
//     const getUrl = `/repos/${OWNER}/${repoName}/contents/${filePath}`;
//     const getRes = await api.get(getUrl);
//     const sha = getRes.data.sha;

//     // 将内容转换为 base64
//     const base64Content = Buffer.from(content, 'utf-8').toString('base64');

//     const params = {
//       message: message || `Update file ${filePath}`,
//       content: base64Content,
//       sha: sha,
//       branch: branch,
//     };

//     const res = await api.put(getUrl, params);
//     return res.data;
//   } catch (error: any) {
//     console.error('GitHub update file error:', error.response?.data || error.message);
//     throw new Error(`更新文件失败: ${error.response?.data?.message || error.message}`);
//   }
// };
