import Router from '@koa/router';
import { queryOne } from '../service/user';
import JsonResult from '../utils/json-result';
import { login, sendCode } from '../service/root';
import reqCtx from '../middleware/req-ctx/helper';
import { redis } from '../middleware/redis';

const router = new Router({ prefix: '/api' });

router.get('/hi', async (ctx, next) => {
  // ctx.body = 'Hello';
  ctx.body = JsonResult.success('hello, this is server');
});

// 登录
router.post('/login', async (ctx) => {
  const bodyParams = ctx.request.body;
  const token = await login(bodyParams);
  const userId = reqCtx.get('userId');
  const me = await queryOne({ id: userId });
  ctx.body = JsonResult.success({ token, me });
});

// 发送邮箱验证码
router.post('/send-code', async (ctx) => {
  const res = await sendCode(ctx.request.body);
  ctx.body = res.status?JsonResult.success('发送成功'):JsonResult.failed(res.error);
});

// 退出登录
router.post('/logout', async (ctx) => {
  const token = ctx.header?.authorization?.replace('Bearer ', '');
  if (token) {
    // 删除 Redis 中的 token
    await redis.del(`token:${token}`);
  }
  ctx.body = JsonResult.success('退出成功');
});

export default router;
