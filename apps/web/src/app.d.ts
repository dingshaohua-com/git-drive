// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

// 导入 Orval 生成的 API 类型
import type * as MeApi from '$/api/endpoints/me';
import type * as RepoApi from '$/api/endpoints/repo';
import type * as RootApi from '$/api/endpoints/root';
import type * as favoriteApi from '$/api/endpoints/favorite';

interface Api {
  root: typeof RootApi;
  me: typeof MeApi;
  repo: typeof RepoApi;
  favorite: typeof favoriteApi;
}

declare global {
  namespace App {}
  var api: Api;
}

export {};
