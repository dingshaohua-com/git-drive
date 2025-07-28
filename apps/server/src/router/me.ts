import _ from 'lodash';
import Router from '@koa/router';
import JsonResult from '../utils/json-result';
import reqCtx from '../middleware/req-ctx/helper';
import { queryOne, update } from '../service/user';

const router = new Router({ prefix: '/api/me' });

// router.get('/', (ctx) => {
//   ctx.body = 'i am me';
// });

// 获取当前用户信息
router.get('/', async (ctx) => {
  const userId = reqCtx.get('userId');
  const user = await queryOne({ id: userId });
  ctx.body = JsonResult.success(user);
});

router.put('/', async (ctx) => {
  const bodyParams = _.cloneDeep(ctx.request.body);
  bodyParams.id = reqCtx.get('userId');
  const results = await update(bodyParams);
  ctx.body = JsonResult.success(results);
});
export default router;
