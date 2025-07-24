import Router from '@koa/router';
import { queryOne, update } from '../service/user';
import JsonResult from '../utils/json-result';
// import _ from 'lodash';
import reqCtx from '../middleware/req-ctx/helper';

const router = new Router({ prefix: '/api/me' });

// router.get('/', (ctx) => {
//   ctx.body = 'i am me';
// });


// 获取当前用户信息
router.get('/', async (ctx) => {
    const user = reqCtx.get('user');
//   const user = await queryOne({id:ctx.state.userId})
  ctx.body = JsonResult.success(user);
});

router.put('/', async (ctx) => {
    
  const bodyParams = _.cloneDeep(ctx.request.body);
  bodyParams.id = Number(bodyParams.id);
  const results = await update(bodyParams);
  ctx.body = JsonResult.success(results);
});
export default router;
