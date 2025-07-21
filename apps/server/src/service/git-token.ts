import { PrismaClient } from '@prisma/client';
import context from '../middleware/req-ctx/helper';

const prisma = new PrismaClient();

export const queryList = async (params) => {
  const results = await prisma.git_token.findMany({
    where: params,
  });
  return results;
};

export const create = async (params) => {
   const userId = context.get('userId');
   params.data.uid = userId;
  const results = await prisma.git_token.create(params);
  return results;
};
