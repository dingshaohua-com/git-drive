import genToken from '../utils/gen-token';
import { redis } from '../middleware/redis';
import { PrismaClient } from '@prisma/client';
import { getLoginType } from '../utils/common';
import { sendMail } from '../utils/email-helper';
import NormalError from '../exception/nomal-error';

const prisma = new PrismaClient();

export const login = async (params) => {
  const loginType = getLoginType(params);
  const codeTemp = params.code;
  delete params.code;

  const user = await prisma.user.findFirst({ where: params });
  if (loginType === 'account') {
    if (user) {
      return genToken({ id: user.id });
    } else {
      throw Error('暂未注册，请先注册！');
    }
  } else if (loginType === 'email' || loginType === 'phone') {
    const redisKey = `${loginType}:${params.email || params.phone}`;
    const code = await redis.get(redisKey);
    if (code === codeTemp) {
      // 验证成功后立即删除验证码
      await redis.del(redisKey);

      if (user) {
        return genToken({ id: user.id });
      } else {
        const newUser = await prisma.user.create({
          data: params,
        });
        return genToken({ id: newUser.id });
      }
    } else {
      throw new NormalError('验证码错误！');
    }
  }
};

export const sendCode = async (params) => {
  const { email, phone } = params;
  if (email) {
    // 检查上次验证码是否还在有效期内
    const existingCode = await redis.get(`email:${email}`);
    if (existingCode) {
      throw new NormalError('上次验证码还在有效期范围内！')
    }

    // 生成验证码
    const verifyCode = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    const sendRes = sendMail(email, verifyCode);
    // 发送验证码 // 存储邮箱验证码（1分钟过期）
    await redis.set(`email:${email}`, verifyCode, 'EX', 60 * 1);
  } else if (phone) {
    // 检查上次验证码是否还在有效期内
    const existingCode = await redis.get(`phone:${phone}`);
    if (existingCode) {
      throw new NormalError('上次验证码还在有效期范围内！')
    }
    // todo
  }
};
