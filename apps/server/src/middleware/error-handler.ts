import type { Middleware } from 'koa';
import JsonResult from '../utils/json-result';

/**
 * 统一异常处理中间件
 * 类似于 Java 的全局异常拦截器
 */
const errorHandler = (): Middleware => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error: any) {
      // 记录错误日志
      console.error('API Error:', {
        url: ctx.url,
        method: ctx.method,
        error: error.message,
        stack: error.stack,
      });

      console.log(111222, error);
      

      // 根据错误类型设置不同的响应
      if (error.status) {
        // Koa 内置错误（如 404, 401 等）
        ctx.status = error.status;
        ctx.body = JsonResult.failed(error.message || '请求失败');
      } else if (error.name === 'ValidationError') {
        // 参数验证错误
        ctx.status = 400;
        ctx.body = JsonResult.failed(error.message || '参数验证失败');
      } else if (error.name === 'UnauthorizedError') {
        // 认证错误
        ctx.status = 401;
        ctx.body = JsonResult.failed(error.message || '认证失败');
      } else if (error.name === 'ForbiddenError') {
        // 权限错误
        ctx.status = 403;
        ctx.body = JsonResult.failed(error.message || '权限不足');
      } else {
        // 其他未知错误
        ctx.status = 500;
        ctx.body = JsonResult.failed( '服务器内部错误：' + error.message);
      }
    }
  };
};

export default errorHandler;
