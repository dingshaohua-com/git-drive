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
