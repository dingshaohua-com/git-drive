import meRouter from './me.ts';
import fileRouter from './file.ts';
import rootRouter from './root.ts';
import userRouter from './user.ts';

import gitTokenRouter from './git-token.ts';
import combineRouters from 'koa-combine-routers';

const router = combineRouters(
  // @ts-ignore
  rootRouter,
  meRouter,
  userRouter,
  gitTokenRouter,
  fileRouter
);

export default router;
