import { PrismaClient } from '@prisma/client';
import context from '../middleware/req-ctx/helper';

const prisma = new PrismaClient();
export const queryOne = async (params) => {
  const results: any = await prisma.user.findFirst({
    where: params,
  });
  return results;
};

export const update = async (params) => {
  const user = context.get('user');
  const results = await prisma.user.update({
    where: {
      id: params.id,
    },
    data: params,
  });
  return results;
};