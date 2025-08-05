import Koa from 'koa';
import path from 'path';
import chalk from 'chalk';
// import router from '@/router/index';
import staticServer from 'koa-static';
import kBody from '@/utils/kbody-helper';
import info from '@/middleware/sys-conf';
import authGuard from '@/middleware/auth-guard';
import errorHandler from '@/middleware/error-handler';
import feRouterBack from '@/middleware/fe-router-back';
import { reqCtxMiddleware } from '@/middleware/req-ctx';
import { RegisterRoutes } from "@/routers/routes";
import Router from "@koa/router";

const app = new Koa();

console.log('热更新测试成功! - 修改时间:', new Date().toLocaleTimeString());


// 错误处理中间件必须最先注册
app.use(errorHandler());
app.use(kBody);
app.use(staticServer(path.join(__dirname, 'www')));
app.use(feRouterBack());
app.use(reqCtxMiddleware()); // 创建上下文容器中间件
app.use(info);
app.use(authGuard);
// app.use(router()); // 路由
const router = new Router();
RegisterRoutes(router);
app.use(router.routes());

app.listen(3003, '0.0.0.0', () => {
  const { green, blue, bold } = chalk;
  const str = `${green('➜')}  ${bold('后端服务已启动2:')}   ${blue('http://localhost:3003')}`;
  console.log(str);
});
