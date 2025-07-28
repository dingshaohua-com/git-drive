import Router from '@koa/router';
import { queryOne, update } from '../service/user';
import JsonResult from '../utils/json-result';
import _ from 'lodash';

const router = new Router({ prefix: '/api/user' });

// router.get('/', (ctx) => {
//   ctx.body = 'i am user';
// });

router.get('/', async (ctx) => {
  const query = ctx.query as any;
  query.id && (query.id = Number(query.id));
  const res = await queryOne(query)
  ctx.body = res ? JsonResult.success(res) : JsonResult.failed('未找到数据');
});


router.put('/', async (ctx) => {
  const bodyParams = _.cloneDeep(ctx.request.body);
  bodyParams.id = Number(bodyParams.id);
  const results = await update(bodyParams);
  ctx.body = JsonResult.success(results);
});
export default router;
