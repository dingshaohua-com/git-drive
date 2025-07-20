import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// 用户信息类型
export interface User {
	id: string;
	name: string;
	email?: string;
	avatar?: string;
}

// 认证状态类型
export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

// 创建认证状态store
function createAuthStore() {
	// 从localStorage获取初始状态
	const getInitialState = (): AuthState => {
		if (browser) {
			const stored = localStorage.getItem('auth');
			if (stored) {
				try {
					const parsed = JSON.parse(stored);
					return {
						user: parsed.user,
						isAuthenticated: !!parsed.user,
						isLoading: false
					};
				} catch (e) {
					console.error('Failed to parse auth from localStorage:', e);
				}
			}
		}
		return {
			user: null,
			isAuthenticated: false,
			isLoading: false
		};
	};

	const { subscribe, set, update } = writable<AuthState>(getInitialState());

	return {
		subscribe,
		
		// 登录
		login: (user: User) => {
			const authState: AuthState = {
				user,
				isAuthenticated: true,
				isLoading: false
			};
			
			if (browser) {
				localStorage.setItem('auth', JSON.stringify({ user }));
			}
			
			set(authState);
		},
		
		// 登出
		logout: () => {
			if (browser) {
				localStorage.removeItem('auth');
			}
			
			set({
				user: null,
				isAuthenticated: false,
				isLoading: false
			});
		},
		
		// 更新用户信息
		updateUser: (userData: Partial<User>) => {
			update(state => {
				if (state.user) {
					const updatedUser = { ...state.user, ...userData };
					const authState = { ...state, user: updatedUser };
					
					if (browser) {
						localStorage.setItem('auth', JSON.stringify({ user: updatedUser }));
					}
					
					return authState;
				}
				return state;
			});
		},
		
		// 设置加载状态
		setLoading: (isLoading: boolean) => {
			update(state => ({ ...state, isLoading }));
		}
	};
}

export const auth = createAuthStore(); 