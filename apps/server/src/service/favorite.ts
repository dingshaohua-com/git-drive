import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
/**
 * 获取当前账号下的仓库列表，支持名称模糊搜索
 * @param {string} [keyword] 仓库名关键字（可选）
 * @returns {Promise<any[]>}
 */
export const queryList = async (params) => {
  const results = prisma.favorite.findMany({ where: params });
  return results;
};

export const create = async (params) => {
  console.log(111222, params);
  
  const results = await prisma.favorite.create({data:params});
  return results;
};
