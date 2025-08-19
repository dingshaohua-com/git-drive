// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

// 导入 Orval 生成的 API 类型
import type * as MeApi from '$lib/api/endpoints/me';
import type * as RepoApi from '$lib/api/endpoints/repo';
import type * as RootApi from '$lib/api/endpoints/root';

interface Api {
  root: typeof RootApi;
  me: typeof MeApi;
  repo: typeof RepoApi;
  // 当有其他 API 模块时，可以继续添加
  // user: typeof UserApi;
  // favorite: typeof FavoriteApi;
}

declare global {
  namespace App {}
  var api: Api;
}

export {};
