import jwt from 'jsonwebtoken';
import { redis } from '../middleware/redis';

// 生成唯一令牌
const genToken = async (payload) => {
  // 先清理该用户的所有旧token
  const userTokens = await redis.keys(`token:*`);
  for (const tokenKey of userTokens) {
    const tokenData = await redis.get(tokenKey);
    if (tokenData) {
      try {
        const tokenPayload = JSON.parse(tokenData);
        // 如果是同一个用户的token，则删除
        if (tokenPayload.id === payload.id) {
          await redis.del(tokenKey);
        }
      } catch (error) {
        // 如果解析失败，删除无效的token
        await redis.del(tokenKey);
      }
    }
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET);

  // 30分钟过期时间:只在Redis中控制过期时间
  await redis.set(`token:${token}`, JSON.stringify(payload), 'EX', 60 * 30);
  return token;
};

export default genToken;
