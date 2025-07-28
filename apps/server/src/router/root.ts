import Router from '@koa/router';
import { queryOne } from '../service/user';
import JsonResult from '../utils/json-result';
import { login, sendCode } from '../service/root';
import reqCtx from '../middleware/req-ctx/helper';

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
  await sendCode(ctx.request.body);
  ctx.body = JsonResult.success('发送成功');
});

export default router;
