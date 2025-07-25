import meRouter from './me.ts';
// import fileRouter from './file.ts';
import rootRouter from './root.ts';
import userRouter from './user.ts';
// import ghubRouter from './ghub.ts';
import repoRouter from './repo.ts';

import gitTokenRouter from './git-token.ts';
import combineRouters from 'koa-combine-routers';

const router = combineRouters(
  // @ts-ignore
  rootRouter,
  meRouter,
  userRouter,
  gitTokenRouter,
  repoRouter,
  // fileRouter,
  // ghubRouter
);

export default router;
