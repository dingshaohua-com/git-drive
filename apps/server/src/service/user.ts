import { PrismaClient } from '@prisma/client';
import { isQQEmailCheck } from '@/utils/common';
import context from '@/middleware/req-ctx';

const prisma = new PrismaClient();
export const queryOne = async (params) => {
  const result = await prisma.user.findFirst({
    where: params,
  });
  const { isQQEmail, QQ } = isQQEmailCheck(result.email);
  if (isQQEmail) {
    result.avatar = `https://q1.qlogo.cn/g?b=qq&nk=${QQ}&s=640`;
  }
  result['hasPwd'] = Boolean(result.password);
  return result;
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
