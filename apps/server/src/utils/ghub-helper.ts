import axios from 'axios';
import reqCtx from '@/middleware/req-ctx';
import { PrismaClient } from '@prisma/client';

// 配置
const GITHUB_TOKEN = '';

// 全局 PrismaClient 单例（如有全局 utils，可迁移到 utils）
let prisma: PrismaClient | null = null;
const getPrisma = () => {
  if (!prisma) prisma = new PrismaClient();
  return prisma;
};

// 配置常量导出
export const OWNER = 'ghub-drive';
export const BRANCH = 'main';
// export const REPO = "img-host";

// axios 单例，token 变更时自动重建
let ghubApiInstance: ReturnType<typeof axios.create> | null = null;
let ghubApiToken: string | null = null;

export const getGhubApi = async () => {
  const sysConf = reqCtx.get('sysConf');
  const token = sysConf.gtoken;
  if (!token) throw new Error('GitHub Token 不存在');
  if (!ghubApiInstance || token !== ghubApiToken) {
    ghubApiInstance = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Authorization: `token ${token}`,
        'User-Agent': 'Koa-GitHub-API-Client',
      },
    });
    ghubApiToken = token;
  }
  return ghubApiInstance;
};

export const appendPrefix = (repoName: string) => {
  const user = reqCtx.get('user');
  return user.username + '-' + repoName;
};

export const removePrefix = () => {
  const user = reqCtx.get('user');
  return user.username + '-';
};

export const filterPrefix = (params: { attr?: string; val?: string; list }) => {
  const user = reqCtx.get('user');
  const preDefault = user.username + '-';
  const { attr='name', val = preDefault, list } = params;
  return list.filter((item: any) => item[attr].startsWith(val));
};

// // 拼接过滤条件
// const searchWord = user.username + '-' + keyword;
// if (searchWord) {
//   const lower = searchWord.toLowerCase();
//   result.data = result.data.filter((repo: any) => repo.name.toLowerCase().includes(lower));
// }
