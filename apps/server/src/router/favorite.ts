import _ from 'lodash';
import rootRouter from './root';
import Router from '@koa/router';
import JsonResult from '@/utils/json-result';
import { queryList, create } from '@/service/favorite';
import reqCtx from '@/middleware/req-ctx';

const router = new Router({ prefix: '/api/favorite' });

// router.get('/', (ctx) => {
//   ctx.body = 'i am me';
// });

// 获取当前用户信息
rootRouter.get('/favorites', async (ctx) => {
  const userId = reqCtx.get('userId');
  const user = await queryList({ uid: userId });
  ctx.body = JsonResult.success(user);
});

router.post('/', async (ctx) => {
  const bodyParams = _.cloneDeep(ctx.request.body);
  bodyParams.uid = reqCtx.get('userId');
  bodyParams.label = bodyParams.label;
  bodyParams.path = bodyParams.path;
  const results = await create(bodyParams);
  ctx.body = JsonResult.success(results);
});
export default router;
