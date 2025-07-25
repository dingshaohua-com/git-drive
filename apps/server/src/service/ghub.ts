
import axios from "axios";

// 配置
const GITHUB_TOKEN = "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";
const OWNER = "ghub-drive";
// const REPO = "img-host";
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


/**
 * 在 GitHub 仓库中创建一个“文件夹”（通过创建 .gitkeep 文件实现）
 * @param {string} repo 仓库名
 * @param {string} path 文件夹路径（如 foo/bar）
 * @param {string} branch 分支名
 * @returns {Promise<any>}
 */
export async function createGithubFolder(repo: string, path: string) {
  const api = getGithubApi(GITHUB_TOKEN);
  const filePath = path.endsWith("/") ? path + ".gitkeep" : path + "/.gitkeep";
  const content = ""; // 空内容
  const base64Content = Buffer.from(content).toString("base64");

  // 获取分支最新 commit 的 sha
  const { data: refData } = await api.get(`/repos/${OWNER}/${repo}/git/refs/heads/${BRANCH}`);
  const latestCommitSha = refData.object.sha;

  // 获取 tree sha
  const { data: commitData } = await api.get(`/repos/${OWNER}/${repo}/git/commits/${latestCommitSha}`);
  const treeSha = commitData.tree.sha;

  // 创建 blob
  const { data: blobData } = await api.post(`/repos/${OWNER}/${repo}/git/blobs`, {
    content,
    encoding: "utf-8"
  });

  // 创建 tree
  const { data: newTree } = await api.post(`/repos/${OWNER}/${repo}/git/trees`, {
    base_tree: treeSha,
    tree: [
      {
        path: filePath,
        mode: "100644",
        type: "blob",
        sha: blobData.sha
      }
    ]
  });

  // 创建 commit
  const { data: newCommit } = await api.post(`/repos/${OWNER}/${repo}/git/commits`, {
    message: `create folder: ${path}`,
    tree: newTree.sha,
    parents: [latestCommitSha]
  });

  // 更新分支引用
  await api.patch(`/repos/${OWNER}/${repo}/git/refs/heads/${branch}`, {
    sha: newCommit.sha
  });

  return { success: true, path: filePath };
}

/**
 * 创建 GitHub 仓库
 * @param {string} repoName 仓库名
 * @param {string} [description] 描述
 * @param {boolean} [isPrivate] 是否私有
 * @returns {Promise<any>}
 */
export async function createGithubRepo(repoName: string, description: string = "") {
  const api = getGithubApi(GITHUB_TOKEN);
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
export async function listGithubRepos(keyword: string = "") {
  const api = getGithubApi(GITHUB_TOKEN);
  // 获取所有仓库（默认最多100个，如需更多可做分页）
  const res = await api.get("/user/repos?per_page=100");
  let repos = res.data;
  if (keyword) {
    const lower = keyword.toLowerCase();
    repos = repos.filter((repo: any) => repo.name.toLowerCase().includes(lower));
  }
  return repos;
}
