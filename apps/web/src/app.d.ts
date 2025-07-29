// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

interface Api {
  root: {
    login: (params: any) => Promise<any>;
    sendCode: (params: { email?: string; phone?: string }) => Promise<void>;
    logout: () => Promise<void>;
  };
  user: {
    me: () => Promise<User>;
  };
  repo: {
    list: (params?: any) => Promise<any>;
    get: (params: any) => Promise<any>;
    add: (params: any) => Promise<any>;
    remove: (params: any) => Promise<void>;
    uploadFile: (params: any) => Promise<any>;
    addFolder: (params: any) => Promise<any>;
  };
}
declare global {
  namespace App {}
  var api: Api;
}

export {};
