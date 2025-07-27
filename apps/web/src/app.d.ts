// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };




interface Api {
	book: {
		get: (params: { id: number }) => Promise<Book>;
		list: (params: { shelf_id?: number }) => Promise<Book[]>;
		add: (params: Omit<Book, 'id' | 'create_time'>) => Promise<Book>;
		// 其他方法...
	};
	doc: {
		get: (params: { id: number }) => Promise<Doc>;
		list: (params: { book_id?: number; pid?: number }) => Promise<Doc[]>;
		add: (params: Omit<Doc, 'id' | 'create_time' | 'children'>) => Promise<Doc>;
		put: (params: Partial<Doc> & { id: number }) => Promise<Doc>;
		remove: (params: { id: number }) => Promise<void>;
	};
	root: {
		login: (params: { account?: string; password?: string, email?: string; phone?: string; code?: string }) => Promise<{ token: string }>;
		sendCode: (params: { email?: string; phone?: string }) => Promise<void>;
	}
	// 其他模块...
	user: {
		me: () => Promise<User>;
	},
	repo: {
		get: (params: any) => Promise<any>;
		list: (params?: any) => Promise<any>;
		add: (params: { token: string }) => Promise<any>;
		upload: (params: any) => Promise<any>;
		createFolder: (params: any) => Promise<any>;
		remove: (params: any) => Promise<void>;
	},
}
declare global {
	var api: Api;
}

