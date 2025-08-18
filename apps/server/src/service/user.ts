import { PrismaClient } from '@prisma/client';
import { isQQEmailCheck } from '@/utils/common';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();
export const queryOne = async (user: Prisma.userWhereInput) => {
  const result = await prisma.user.findFirst({
    where: user,
  });
  const { isQQEmail, QQ } = isQQEmailCheck(result.email);
  if (isQQEmail) {
    result.avatar = `https://q1.qlogo.cn/g?b=qq&nk=${QQ}&s=640`;
  }
  result['hasPwd'] = Boolean(result.password);
  return result;
};

export const update = async (user: Prisma.userUpdateInput, userId: number) => {
  const results = await prisma.user.update({
    where: {
      id: userId,
    },
    data: user,
  });
  return results;
};
