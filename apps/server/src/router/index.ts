import meRouter from './me.ts';
import rootRouter from './root.ts';
import userRouter from './user.ts';
import repoRouter from './repo.ts';
import combineRouters from 'koa-combine-routers';

const router = combineRouters(
  meRouter as any,
  rootRouter as any,
  userRouter as any,
  repoRouter as any,
);


export default router;
