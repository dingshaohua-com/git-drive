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
   const user = context.get('user');

   console.log(user);
   
   params.user_id = user.id;
  const results = await prisma.git_token.create(params);
  return results;
};
