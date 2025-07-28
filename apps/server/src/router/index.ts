import meRouter from './me.ts';
import rootRouter from './root.ts';
import userRouter from './user.ts';
import repoRouter from './repo.ts';
import combineRouters from 'koa-combine-routers';

const router = combineRouters(
  meRouter,
  rootRouter,
  userRouter,
  repoRouter,
);

export default router;
