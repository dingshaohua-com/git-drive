import helper from './helper.ts';

export default function requestContextMiddleware() {
  return async (ctx, next) => {
    await new Promise((resolve, reject) => {
      helper.run(() => {
        next().then(resolve).catch(reject);
      });
    });
  };
}
