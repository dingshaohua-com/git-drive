import { PrismaClient } from "@prisma/client";
import axios from "axios";

// 配置
const GITHUB_TOKEN = "";
const OWNER = "ghub-drive";
// const REPO = "img-host";
const BRANCH = "main";


const prisma = new PrismaClient();
const getGithubToken = async ()=>{
  if(!GITHUB_TOKEN){
    const res = await prisma.app.findFirst();
    return res?.gtoken;
  }
  return GITHUB_TOKEN;
}

let ghubApiInstance: ReturnType<typeof axios.create> | null = null;

const getGhubApi = async () => {
  if (ghubApiInstance) return ghubApiInstance;
  const token = await getGithubToken();
  ghubApiInstance = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      'Authorization': `token ${token}`,
      'User-Agent': 'Koa-GitHub-API-Client'
    }
  });
  return ghubApiInstance;
}

export default getGhubApi;
