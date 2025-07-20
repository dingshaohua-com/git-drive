import Redis from 'ioredis';

// 创建 Redis 实例
const redis = new Redis({
  host: "66.112.211.55",
  port: 6379,
  db: 1
});

// 错误处理（可选）
redis.on('error', (err) => {
  console.error('Redis error:', err);
});

// 最简单的 Koa 中间件
const redisMiddleware = () => {
  return async (ctx, next) => {
    // 挂载到 ctx 和 app.context
    if (!ctx.app.context.redis) {
      ctx.app.context.redis = redis; // 全局可用
    }
    ctx.redis = redis; // 单次请求可用

    await next();
  };
}

export default redisMiddleware;

// 直接导出 Redis 实例（按需使用）
export { redis };