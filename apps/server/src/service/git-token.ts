
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const queryList = async (params) => {
    // const user = context.get('user');
   
    const results = await prisma.git_token.findMany({
      where: params
    });
    return results;
  };
  