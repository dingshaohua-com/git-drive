import userRouter from './user';
import repoRouter from './repo';
import favorite from './favorite'
import combineRouters from 'koa-combine-routers';


const router = combineRouters(
  userRouter as any,
  repoRouter as any,
  favorite as any
);


export default router;
