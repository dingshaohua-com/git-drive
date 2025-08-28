import genToken from '@/utils/gen-token';
import redis from '@/utils/redis-helper';
import reqCtx from '@/middleware/req-ctx';
import pwdVerify from '@/utils/pwd-verify';
import { getLoginType } from '@/utils/common';
import { PrismaClient } from '@prisma/client';
import { sendMail } from '@/utils/email-helper';
import NormalError from '@/exception/normal-err';
import { decryptAll, toHash } from '@dingshaohua.com/hybrid-crypto';
import { user as User, sys_conf as SysConf } from '@prisma/client';

const prisma = new PrismaClient();

export const login = async (params): Promise<{token:string, me:User}> => {
  // 解密传输过来加密的密码
  const sysConf = reqCtx.get<SysConf>('sysConf');
  const loginType = getLoginType(params);
  const codeTemp = Number(params.code);
  delete params.code;

  const user = await prisma.user.findFirst({
    where: {
      email: params.account,
    },
  });
  if (loginType === 'account') {
    if (user) {
      const res = pwdVerify({ password: params.password, aseKeyEncrypt: params.aseKeyEncrypt }, user);
      if (!res) {
        throw new NormalError('密码错误！');
      }
      return {
        me: user,
        token: await genToken({ id: user.id })
      };
    } else {
      throw Error('暂未注册，请先注册！');
    }
  } else if (loginType === 'email' || loginType === 'phone') {
    // 如果不能与万能验证码，就正常流程（校验验证码）
    if (sysConf.vcode !== codeTemp) {
      const redisKey = `${loginType}:${params.email || params.phone}`;
      const code = await redis.get(redisKey);
      if (Number(code) === codeTemp) {
        // 验证成功后立即删除验证码
        await redis.del(redisKey);
      } else {
        throw new NormalError('验证码错误！');
      }
    }

    if (user) {
       return {
        me: user,
        token: await genToken({ id: user.id })
      };
    } else {
      const newUser = await prisma.user.create({
        data: params,
      });
       return {
        me: newUser,
        token: await genToken({ id: newUser.id })
      };
    }
  }
};

export const sendCode = async (params) => {
  const { email, phone, type = 'login' } = params;
  if (email) {
    // 检查上次验证码是否还在有效期内
    const existingCode = await redis.get(`email-${type}:${email}`);
    if (existingCode) {
      throw new NormalError('上次验证码还在有效期范围内！');
    }

    // 生成验证码
    const verifyCode = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    const sendRes = sendMail(email, verifyCode, type);
    // 发送验证码 // 存储邮箱验证码（1分钟过期）
    await redis.set(`email-${type}:${email}`, verifyCode, 'EX', 60 * 1);
  } else if (phone) {
    // 检查上次验证码是否还在有效期内
    const existingCode = await redis.get(`phone-${type}:${phone}`);
    if (existingCode) {
      throw new NormalError('上次验证码还在有效期范围内！');
    }
    // todo
  }
};


export const resetPwd = async (params) => {
  const { email, code, password, aseKeyEncrypt } = params;

  // 1. 验证邮箱验证码
  const redisKey = `email-resetPwd:${email}`;
  const storedCode = await redis.get(redisKey);

  if (!storedCode || Number(storedCode) !== Number(code)) {
    throw new NormalError('验证码错误或已过期！');
  }

  // 2. 查找用户
  const user = await prisma.user.findFirst({
    where: { email }
  });

  if (!user) {
    throw new NormalError('用户不存在！');
  }

  // 3. 解密新密码
  const sysConf = reqCtx.get<SysConf>('sysConf');
  const contentAndKey = {
    contentEncrypt: password,
    aseKeyEncrypt: aseKeyEncrypt,
  };
  const decryptedPassword = decryptAll(contentAndKey, sysConf.privateKey);

  // 4. 生成哈希密码
  let hashResult: { hash: string; salt?: string };
  if (user.salt) {
    // 如果用户已有 salt，使用现有的 salt
    hashResult = toHash(decryptedPassword, user.salt);
  } else {
    // 如果用户没有 salt，生成新的 salt
    hashResult = toHash(decryptedPassword);
  }

  // 5. 更新用户密码
  const updateData: any = {
    password: hashResult.hash
  };

  // 如果是新生成的 salt，也要更新
  if (!user.salt && hashResult.salt) {
    updateData.salt = hashResult.salt;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: updateData
  });

  // 6. 删除已使用的验证码
  await redis.del(redisKey);

  return { message: '密码重置成功' };
}