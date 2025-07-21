import userRouter from "./user.ts";
import fileRouter from "./file.ts";
import rootRouter from "./root.ts";
import gitTokenRouter from "./git-token.ts";
import combineRouters from "koa-combine-routers";


const router = combineRouters(
  // @ts-ignore
  rootRouter,
  userRouter,
  gitTokenRouter,
  fileRouter,
);

export default router;
