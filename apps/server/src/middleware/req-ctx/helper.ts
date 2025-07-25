// requestContext.ts
import { AsyncLocalStorage } from 'async_hooks';

const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

export default {
  run: (callback: (...args: any[]) => void) => {
    asyncLocalStorage.run(new Map(), callback);
  },
  set: (key: string, value: any) => {
    const store = asyncLocalStorage.getStore();
    if (store) store.set(key, value);
  },
  get: (key: string) => {
    const store = asyncLocalStorage.getStore();
    return store ? store.get(key) : undefined;
  },
};
