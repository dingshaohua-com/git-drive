import context from '../utils/reques-context.ts';

export default function requestContextMiddleware() {
  return async (ctx, next) => {
    await new Promise((resolve, reject) => {
      context.run(() => {
        next().then(resolve).catch(reject);
      });
    });
  };
}
