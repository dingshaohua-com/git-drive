import fs from 'fs';
import path from 'path';
import type { Middleware } from 'koa';

const staticDir = path.join(path.dirname(__dirname), 'www');
const webIndexPath = path.join(staticDir, 'index.html');

// 非 API、非静态资源 → 返回 index.html（支持前端路由）
function feRouterBack(): Middleware {
  return async (ctx, next) => {
    await next(); // 先执行其他中间件
    if (ctx.status === 404 && ctx.method === 'GET') {
      ctx.type = 'html';
      ctx.body = fs.createReadStream(webIndexPath);
    }
  };
}

export default feRouterBack;
