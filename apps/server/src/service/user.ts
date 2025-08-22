import { Prisma } from '@prisma/client';
import redis from '@/utils/redis-helper';
import reqCtx from '@/middleware/req-ctx';
import { PrismaClient } from '@prisma/client';
import { isQQEmailCheck } from '@/utils/common';
import NormalError from '@/exception/normal-err';

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

export const resetEmail = async (params: { email: string; code: string }) => {
  const redisKey = `email$-{resetEmail}:${params.email}`;
  const codeRedis = await redis.get(redisKey);
  if (params.code !== codeRedis) {
    throw new NormalError('验证码错误！');
  }
  const user = reqCtx.get('user');
  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      email: params.email,
    },
  });
};
