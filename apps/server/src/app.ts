import Koa from 'koa';
import chalk from 'chalk';
import staticServer from 'koa-static';
import router from './router/index.ts';
import { bodyParser } from '@koa/bodyparser';
import contextMiddleware from './middleware/request-context';
import feRouterBack from './middleware/fe-router-back';
import path from 'path';
import redis from './middleware/redis.ts';
import redisJwt from './middleware/redis-jwt';

const app = new Koa();
app.use(bodyParser());
// app.use(staticServer('./www'));
app.use(staticServer(path.join(__dirname, 'www')));

// 挂载 Redis（最简方式）
// app.use(redis());

// 1. 使用 redis-jwt 中间件（验证 JWT）
// app.use(redisJwt);


app.use(feRouterBack());


// 2. 创建上下文容器中间件
// app.use(contextMiddleware());

// 3. 自定义中间件：解析 token 并挂载 payload 到 ctx 和 context上
// app.use(userMount);

// 4. 路由
app.use(router());

app.listen(3000, '0.0.0.0', () => {
  console.log(`
    ${chalk.green('➜')}  ${chalk.bold('后端服务已启动:')}   ${chalk.blue('http://localhost:3000')}
    `);
  // console.log("后端服务已启动：http://localhost:3000");
});
