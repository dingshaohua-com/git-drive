import Koa from 'koa';
import chalk from 'chalk';
import staticServer from 'koa-static';
import router from './router/index.ts';
import { bodyParser } from '@koa/bodyparser';
import reqCtxMw from './middleware/req-ctx/mw.ts';
import feRouterBack from './middleware/fe-router-back';
import path from 'path';
import redisJwt from './middleware/redis-jwt.ts';

const app = new Koa();

app.use(bodyParser());
app.use(staticServer(path.join(__dirname, 'www'))); // app.use(staticServer('./www'));
app.use(feRouterBack());
app.use(reqCtxMw()); // 创建上下文容器中间件
app.use(redisJwt);
app.use(router()); // 路由

app.listen(3000, '0.0.0.0', () => {
  console.log(`
    ${chalk.green('➜')}  ${chalk.bold('后端服务已启动:')}   ${chalk.blue('http://localhost:3000')}
    `);
});
