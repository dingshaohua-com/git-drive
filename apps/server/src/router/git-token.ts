import Router from '@koa/router';
import { queryList } from '../service/git-token';
import JsonResult from '../utils/json-result';
// import _ from 'lodash';

const router = new Router({ prefix: '/git-token' });

// router.get('/', (ctx) => {
//   ctx.body = 'i am user';
// });


router.get('/list', async (ctx) => {
  const query = ctx.query as any;
  const res =  await queryList(query);
  ctx.body = res ? JsonResult.success(res) : JsonResult.failed('未找到数据');
});

// router.get('/', async (ctx) => {
//   const query = ctx.query as any;
//   query.id && (query.id = Number(query.id));
//   const res = await queryOne(query)
//   ctx.body = res ? JsonResult.success(res) : JsonResult.failed('未找到数据');
// });

// 获取当前用户信息
// router.get('/me', async (ctx) => {
//   console.log(ctx.state.userId);
//   const user = await queryOne({id:ctx.state.userId})
//   ctx.body = JsonResult.success(user);
// });

// router.put('/', async (ctx) => {
//   const bodyParams = _.cloneDeep(ctx.request.body);
//   bodyParams.id = Number(bodyParams.id);
//   const results = await update(bodyParams);
//   ctx.body = JsonResult.success(results);
// });
export default router;
