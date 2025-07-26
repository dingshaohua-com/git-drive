import genToken from '../utils/gen-token';
import { redis } from '../middleware/redis';
import { PrismaClient } from '@prisma/client';
import { getLoginType } from '../utils/common';
import { sendMail } from '../utils/email-helper';

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
    const code = await redis.get(`${loginType}:${params.email}`);
    if (code === codeTemp) {
      if (user) {
        return genToken({ id: user.id });
      } else {
        const newUser = await prisma.user.create({
          data: params,
        });
        return genToken({ id: newUser.id });
      }
    } else {
      throw Error('验证码错误！');
    }
  }
};

export const sendCode = async (params) => {
  const { email, phone } = params;
  if (email) {
    // 生成验证码
    const verifyCode = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    // 发送验证码 // 存储邮箱验证码（8 小时过期）
    const res = await redis.set(`email:${email}`, verifyCode, 'EX', 60 * 60 * 8);
    console.log(res);
    return sendMail(email, verifyCode);
  } else if (phone) {
    // todo
  }
};
