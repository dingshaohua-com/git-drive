import { AsyncLocalStorage } from 'async_hooks';

const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();
 const reqCtx = {
  run: (callback: (...args: any[]) => void) => {
    asyncLocalStorage.run(new Map(), callback);
  },
  set: (key: string, value: any) => {
    const store = asyncLocalStorage.getStore();
    if (store) store.set(key, value);
  },
  get: <T = any>(key: string): T | undefined => {
    const store = asyncLocalStorage.getStore();
    return store ? store.get(key) : undefined;
  },
};


export function reqCtxMiddleware() {
  return async (ctx, next) => {
    await new Promise((resolve, reject) => {
      reqCtx.run(() => {
        next().then(resolve).catch(reject);
      });
    });
  };
}

export default reqCtx;
