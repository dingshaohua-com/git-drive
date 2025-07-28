import Router from '@koa/router';
import JsonResult from '../utils/json-result.ts';
import { login, sendCode } from '../service/root';
import { queryOne } from '../service/user';
import reqCtx from '../middleware/req-ctx/helper';

const router = new Router({ prefix: '/api' });






console.log('root router');

router.get('/hi', async (ctx, next) => {
  // ctx.body = 'Hello';
  ctx.body = JsonResult.success('hello, this is server');
});

// 登录
router.post('/login', async (ctx, next) => {
  const bodyParams = ctx.request.body;
  try {
    const token = await login(bodyParams);
    const userId = reqCtx.get('userId');
    const me = await queryOne({ id: userId });
    ctx.body = JsonResult.success({token, me})
  } catch (error) {
    ctx.body = JsonResult.failed(error.message);
  }
});

// 发送邮箱验证码
router.post('/send-code', async (ctx, next) => {
  try {
    await sendCode(ctx.request.body);
  } catch (error) {
    ctx.body = JsonResult.failed(error.message);
  }
  ctx.body = JsonResult.success('发送成功');
});

export default router;
