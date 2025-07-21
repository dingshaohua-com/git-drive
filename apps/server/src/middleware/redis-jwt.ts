import jwt from 'jsonwebtoken';
import { redis } from './redis';
import context from './req-ctx/helper';

const redisJwt = async (ctx, next) => {
  // 跳过不需要验证的路径
  const skipPaths = [/^\/api\/login$/, /^(?!\/api).*/, /^\/api\/send-code$/, /^\/api\/user$/, /^\/api\/shelf$/];
  const shouldSkip = skipPaths.some((pattern) => pattern.test(ctx.path)) || (ctx.method === 'GET' && ctx.query.share === 'true');

  if (!shouldSkip && ctx.header?.authorization) {
    const token = ctx.header.authorization.replace('Bearer ', '');
    try {
      // 校验jwt token签名
      const info = jwt.verify(token, process.env.JWT_SECRET);

      // 检查Redis中是否存在该token
      const tokenData = await redis.get(`token:${token}`);
      if (!tokenData) {
        ctx.status = 401;
        ctx.body = { msg: 'Token已失效' };
        return;
      }

      ctx.state.userId = info.id;
      context.set('userId', ctx.state.userId);
    } catch (err) {
      ctx.status = 401;
      ctx.body = { msg: 'Token无效' };
      return;
    }
  } else if (!shouldSkip) {
    ctx.status = 401;
    ctx.body = { msg: '缺少认证信息' };
    return;
  }

  await next();
};
export default redisJwt;
